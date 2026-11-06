// Servis Saatleri: tek merkez (Durable Object). Tüm veri burada kalıcı saklanır,
// yönetici ve şoför uygulamaları WebSocket ile anlık bağlanır.
import { DurableObject } from "cloudflare:workers";

const J = JSON.stringify, P = JSON.parse;
const hex = b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
const hash = async (pw, salt) => hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(salt + ":" + pw)));
const todayTR = () => new Date(Date.now() + 10800000).toISOString().slice(0, 10);
const addDays = (d, n) => { const x = new Date(d + "T12:00:00Z"); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
const digits = s => String(s || "").replace(/\D/g, "");
const phoneKey = s => digits(s).slice(-10);
const str = (s, n) => String(s == null ? "" : s).trim().slice(0, n);
const TABLES = ["drivers", "admins", "assign", "trips", "msgs"];
const DATED = { assign: 1, trips: 1 };
const KV_SET = ["pub", "brand", "adminState", "settings"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/, TIME_RE = /^\d{2}:\d{2}$/;

export default {
  async fetch(req, env) {
    const p = new URL(req.url).pathname;
    if (p === "/api/ping") return Response.json({ ok: true, t: Date.now() });
    if (p === "/ws" || p === "/api/export" || p === "/api/import") {
      return env.HUB.get(env.HUB.idFromName("main")).fetch(req);
    }
    return env.ASSETS.fetch(req);
  },
};

export class Hub extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.fails = new Map();
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair("ping", "pong"));
    ctx.blockConcurrencyWhile(async () => {
      const q = s => this.sql.exec(s);
      q("CREATE TABLE IF NOT EXISTS kv(k TEXT PRIMARY KEY, v TEXT)");
      q("CREATE TABLE IF NOT EXISTS drivers(id TEXT PRIMARY KEY, j TEXT)");
      q("CREATE TABLE IF NOT EXISTS admins(id TEXT PRIMARY KEY, j TEXT)");
      q("CREATE TABLE IF NOT EXISTS assign(id TEXT PRIMARY KEY, d TEXT, j TEXT)");
      q("CREATE TABLE IF NOT EXISTS trips(id TEXT PRIMARY KEY, d TEXT, j TEXT)");
      q("CREATE TABLE IF NOT EXISTS msgs(id TEXT PRIMARY KEY, ts INTEGER, j TEXT)");
      q("CREATE INDEX IF NOT EXISTS trips_d ON trips(d)");
      q("CREATE INDEX IF NOT EXISTS assign_d ON assign(d)");
      q("CREATE INDEX IF NOT EXISTS msgs_ts ON msgs(ts)");
      if (this.all("admins").length === 0) {
        const salt = crypto.randomUUID();
        this.put("admins", { id: crypto.randomUUID(), user: "admin", salt, hash: await hash(env.ADMIN_PASSWORD || "admin123", salt), created: Date.now() });
      }
      // ADMIN_PASSWORD gizli değeri değiştirilirse "admin" kullanıcısının şifresi buna ayarlanır.
      // Değer aynı kaldıkça uygulamada yapılan şifre değişiklikleri korunur.
      if (env.ADMIN_PASSWORD) {
        const fp = await hash(String(env.ADMIN_PASSWORD), "seed");
        if (this.kvGet("seedFp") !== fp) {
          const list = this.all("admins");
          const a = list.find(x => x.user.toLowerCase() === "admin") || list[0];
          a.salt = crypto.randomUUID();
          a.hash = await hash(String(env.ADMIN_PASSWORD), a.salt);
          this.put("admins", a);
          this.kvSet("seedFp", fp);
        }
      }
    });
  }

  /* ---------- depolama ---------- */
  kvGet(k) { const r = this.sql.exec("SELECT v FROM kv WHERE k=?", k).toArray(); return r.length ? P(r[0].v) : null; }
  kvSet(k, v) { this.sql.exec("INSERT OR REPLACE INTO kv(k,v) VALUES(?,?)", k, J(v)); }
  all(c) { return this.sql.exec(`SELECT j FROM ${c}`).toArray().map(r => P(r.j)); }
  get(c, id) { const r = this.sql.exec(`SELECT j FROM ${c} WHERE id=?`, id).toArray(); return r.length ? P(r[0].j) : null; }
  put(c, o) {
    if (DATED[c]) this.sql.exec(`INSERT OR REPLACE INTO ${c}(id,d,j) VALUES(?,?,?)`, o.id, o.date, J(o));
    else if (c === "msgs") this.sql.exec("INSERT OR REPLACE INTO msgs(id,ts,j) VALUES(?,?,?)", o.id, o.ts, J(o));
    else this.sql.exec(`INSERT OR REPLACE INTO ${c}(id,j) VALUES(?,?)`, o.id, J(o));
  }
  del(c, id) { this.sql.exec(`DELETE FROM ${c} WHERE id=?`, id); }
  range(c, a, b) { return this.sql.exec(`SELECT j FROM ${c} WHERE d>=? AND d<=? ORDER BY d`, a, b).toArray().map(r => P(r.j)); }
  msgs() { return this.sql.exec("SELECT j FROM msgs ORDER BY ts DESC LIMIT 300").toArray().map(r => P(r.j)).reverse(); }

  /* ---------- HTTP ---------- */
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/ws") {
      if (req.headers.get("Upgrade") !== "websocket") return new Response("WebSocket gerekli", { status: 426 });
      const pair = new WebSocketPair();
      this.ctx.acceptWebSocket(pair[1]);
      pair[1].serializeAttachment({});
      return new Response(null, { status: 101, webSocket: pair[0] });
    }
    if (!(await this.basic(req))) {
      return new Response("Yetkisiz", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="admin"' } });
    }
    if (url.pathname === "/api/export") {
      const out = { version: 1, at: new Date().toISOString(), kv: {} };
      for (const k of ["pub", "brand", "adminState", "settings"]) out.kv[k] = this.kvGet(k);
      for (const c of TABLES) out[c] = this.all(c);
      return new Response(J(out), { headers: { "Content-Type": "application/json; charset=utf-8", "Content-Disposition": 'attachment; filename="servis-yedek.json"' } });
    }
    if (url.pathname === "/api/import" && req.method === "POST") {
      let d; try { d = await req.json(); } catch (e) { return new Response("Geçersiz yedek", { status: 400 }); }
      if (!d || !Array.isArray(d.drivers) || !Array.isArray(d.admins) || !d.admins.length) return new Response("Geçersiz yedek", { status: 400 });
      for (const c of TABLES) { this.sql.exec(`DELETE FROM ${c}`); for (const o of d[c] || []) this.put(c, o); }
      for (const k of KV_SET) if (d.kv && d.kv[k] != null) this.kvSet(k, d.kv[k]);
      for (const w of this.ctx.getWebSockets()) { try { w.close(4002, "yenilendi"); } catch (e) {} }
      return new Response("ok");
    }
    return new Response("Bulunamadı", { status: 404 });
  }
  async basic(req) {
    const h = req.headers.get("Authorization") || "";
    if (!h.startsWith("Basic ")) return false;
    let u, p;
    try { [u, ...p] = atob(h.slice(6)).split(":"); p = p.join(":"); } catch (e) { return false; }
    const a = this.all("admins").find(x => x.user.toLowerCase() === String(u).toLowerCase());
    return !!a && (await hash(p, a.salt)) === a.hash;
  }

  /* ---------- giriş ---------- */
  locked(key) { const f = this.fails.get(key); return f && f.n >= 6 && Date.now() - f.t < 600000; }
  fail(key) { const f = this.fails.get(key) || { n: 0, t: 0 }; if (Date.now() - f.t > 600000) f.n = 0; f.n++; f.t = Date.now(); this.fails.set(key, f); }

  async auth(ws, m) {
    let att = null, key = "";
    if (m.role === "admin") {
      key = "a:" + String(m.user || "").toLowerCase();
      if (!this.locked(key)) {
        const a = this.all("admins").find(x => x.user.toLowerCase() === String(m.user || "").toLowerCase());
        if (a && (await hash(String(m.pass || ""), a.salt)) === a.hash) att = { role: "admin", id: a.id, name: a.user };
      }
    } else if (m.role === "driver") {
      const k = phoneKey(m.phone); key = "d:" + k;
      if (k.length >= 7 && !this.locked(key)) {
        const d = this.all("drivers").find(x => phoneKey(x.phone) === k && x.active !== false && String(x.pin) === String(m.pin || "").trim());
        if (d) att = { role: "driver", id: d.id, name: d.name };
      }
    }
    if (!att) { this.fail(key); ws.send(J({ t: "authfail", locked: this.locked(key) })); return; }
    this.fails.delete(key);
    ws.serializeAttachment(att);
    ws.send(J({ t: "ready", role: att.role, me: att.id, name: att.name }));
    ws.send(J({ t: "snap", data: this.snap(att) }));
    this.sendPres();
  }

  snap(att) {
    const today = todayTR(), k = { pub: this.kvGet("pub"), brand: this.kvGet("brand"), settings: this.kvGet("settings") || {} };
    if (att.role === "admin") {
      k.adminState = this.kvGet("adminState");
      return {
        kv: k, drivers: this.all("drivers"), admins: this.all("admins").map(a => ({ id: a.id, user: a.user, created: a.created })),
        assign: this.range("assign", addDays(today, -70), "9999"), trips: this.range("trips", addDays(today, -62), "9999"),
        msgs: this.msgs(), pres: this.presIds(),
      };
    }
    return {
      kv: k, drivers: this.all("drivers").map(pubDriver),
      assign: this.range("assign", addDays(today, -1), "9999").filter(x => x.driverId === att.id),
      trips: this.range("trips", addDays(today, -62), "9999").filter(x => x.driverId === att.id), msgs: this.msgs(),
    };
  }

  presIds(except) {
    const s = new Set();
    for (const w of this.ctx.getWebSockets()) { if (w === except) continue; const a = w.deserializeAttachment(); if (a && a.role === "driver") s.add(a.id); }
    return [...s];
  }
  sendPres(except) { this.bc([{ t: "set", k: "pres", v: this.presIds(except) }]); }

  /* ---------- yayın ---------- */
  view(op, att) {
    if (att.role === "admin") return op;
    if (op.t === "set") return op.k === "pres" || op.k === "adminState" ? null : op;
    if (op.c === "admins") return null;
    if (op.c === "drivers") return op.t === "put" ? { ...op, v: pubDriver(op.v) } : op;
    if ((op.c === "assign" || op.c === "trips") && op.t === "put") return op.v.driverId === att.id ? op : null;
    return op;
  }
  bc(ops) {
    for (const w of this.ctx.getWebSockets()) {
      const att = w.deserializeAttachment(); if (!att || !att.role) continue;
      const out = ops.map(o => this.view(o, att)).filter(Boolean);
      if (out.length) { try { w.send(J({ t: "ops", ops: out })); } catch (e) {} }
    }
  }

  async webSocketMessage(ws, raw) {
    if (typeof raw !== "string") return;
    let m; try { m = P(raw); } catch (e) { return; }
    const att = ws.deserializeAttachment() || {};
    if (m.t === "auth") return this.auth(ws, m);
    if (!att.role) { ws.send(J({ t: "authfail" })); return; }
    if (m.t !== "act") return;
    try {
      const data = await this.act(att, m.a, m.d || {}, ws);
      ws.send(J({ t: "ack", id: m.id, ok: true, data: data === undefined ? null : data }));
    } catch (e) {
      ws.send(J({ t: "ack", id: m.id, ok: false, e: String(e && e.message || e) }));
    }
  }
  async webSocketClose(ws) { this.sendPres(ws); }
  async webSocketError(ws) { this.sendPres(ws); }

  /* ---------- işlemler ---------- */
  async act(att, a, d, ws) {
    const admin = att.role === "admin", ops = [];
    const need = () => { if (!admin) throw new Error("Yetkisiz"); };
    const flush = () => { if (ops.length) this.bc(ops); };

    switch (a) {
      case "say": {
        const text = str(d.text, 1000); if (!text) throw new Error("Boş mesaj");
        let name = att.name;
        if (!admin) { const dr = this.get("drivers", att.id); if (dr) name = (dr.name + " " + (dr.surname || "")).trim(); }
        const o = { id: crypto.randomUUID(), ts: Date.now(), from: { role: att.role, id: att.id, name }, text };
        this.put("msgs", o); ops.push({ t: "put", c: "msgs", v: o });
        const n = this.sql.exec("SELECT COUNT(*) AS n FROM msgs").one().n;
        if (n > 3000) this.sql.exec("DELETE FROM msgs WHERE id IN (SELECT id FROM msgs ORDER BY ts LIMIT 500)");
        break;
      }
      case "trip_add": {
        if (admin) throw new Error("Şoför işlemi");
        const date = String(d.date || ""), today = todayTR();
        if (!DATE_RE.test(date) || date < addDays(today, -1) || date > addDays(today, 1)) throw new Error("Geçersiz tarih");
        const dir = d.dir === 1 ? 1 : 0, slot = d.slot == null ? null : String(d.slot);
        if (slot !== null && !TIME_RE.test(slot)) throw new Error("Geçersiz saat");
        const same = this.range("trips", date, date).find(x => x.driverId === att.id && x.dir === dir && x.slot === slot && slot !== null);
        if (same) return same;
        const dr = this.get("drivers", att.id);
        const o = { id: crypto.randomUUID(), date, dir, slot, driverId: att.id, driverName: dr ? (dr.name + " " + (dr.surname || "")).trim() : att.name, at: Date.now(), src: "driver" };
        this.put("trips", o); ops.push({ t: "put", c: "trips", v: o }); flush(); return o;
      }
      case "trip_undo": {
        const o = this.get("trips", String(d.id));
        if (!o || o.driverId !== att.id || Date.now() - o.at > 600000) throw new Error("Geri alınamaz");
        this.del("trips", o.id); ops.push({ t: "del", c: "trips", id: o.id }); break;
      }
      case "trip_put": {
        need();
        const date = String(d.date || ""); if (!DATE_RE.test(date)) throw new Error("Geçersiz tarih");
        const slot = d.slot ? String(d.slot) : null; if (slot && !TIME_RE.test(slot)) throw new Error("Geçersiz saat");
        const prev = d.id ? this.get("trips", String(d.id)) : null;
        const dr = this.get("drivers", String(d.driverId || ""));
        if (!dr && !(prev && prev.driverId === d.driverId)) throw new Error("Şoför bulunamadı");
        const o = { ...(prev || {}), id: prev ? prev.id : crypto.randomUUID(), date, dir: d.dir === 1 ? 1 : 0, slot, driverId: String(d.driverId),
          driverName: dr ? (dr.name + " " + (dr.surname || "")).trim() : prev.driverName, at: Number(d.at) || (prev ? prev.at : Date.now()), src: prev ? prev.src : "admin", edited: prev ? Date.now() : undefined };
        this.put("trips", o); ops.push({ t: "put", c: "trips", v: o }); break;
      }
      case "trip_del": { need(); this.del("trips", String(d.id)); ops.push({ t: "del", c: "trips", id: String(d.id) }); break; }
      case "assign_bulk": {
        need();
        for (const id of d.del || []) { this.del("assign", String(id)); ops.push({ t: "del", c: "assign", id: String(id) }); }
        for (const x of d.put || []) {
          if (!DATE_RE.test(x.date) || !TIME_RE.test(x.slot)) continue;
          const dir = x.dir === 1 ? 1 : 0, id = `${x.date}|${dir}|${x.slot}|${x.driverId}`;
          if (!this.get("drivers", String(x.driverId))) continue;
          const o = { id, date: x.date, dir, slot: x.slot, driverId: String(x.driverId) };
          this.put("assign", o); ops.push({ t: "put", c: "assign", v: o });
        }
        break;
      }
      case "range": {
        const from = String(d.from || ""), to = String(d.to || "");
        if (!DATE_RE.test(from) || !DATE_RE.test(to) || to < from || addDays(from, 400) < to) throw new Error("Geçersiz aralık");
        let t = this.range("trips", from, to), s = this.range("assign", from, to);
        if (!admin) { t = t.filter(x => x.driverId === att.id); s = s.filter(x => x.driverId === att.id); }
        return { trips: t, assign: s };
      }
      case "driver_put": {
        need();
        const prev = d.id ? this.get("drivers", String(d.id)) : null;
        const name = str(d.name, 60), phone = str(d.phone, 30);
        if (!name || phoneKey(phone).length < 7) throw new Error("Ad ve geçerli telefon gerekli");
        if (this.all("drivers").some(x => x.id !== (prev && prev.id) && phoneKey(x.phone) === phoneKey(phone))) throw new Error("Bu telefon başka şoförde kayıtlı");
        let pin = digits(d.pin).slice(0, 6); if (pin.length < 4) pin = prev && prev.pin ? prev.pin : String(1000 + Math.floor(Math.random() * 9000));
        const photo = d.photo !== undefined ? String(d.photo).slice(0, 200000) : (prev ? prev.photo : "");
        const o = { id: prev ? prev.id : crypto.randomUUID(), name, surname: str(d.surname, 60), phone, pin, photo: photo || "", active: d.active !== false, note: str(d.note, 300), created: prev ? prev.created : Date.now() };
        this.put("drivers", o); ops.push({ t: "put", c: "drivers", v: o });
        if (!o.active) this.kick(o.id);
        flush(); return o;
      }
      case "driver_del": {
        need(); const id = String(d.id);
        this.del("drivers", id); ops.push({ t: "del", c: "drivers", id });
        for (const x of this.all("assign").filter(x => x.driverId === id)) { this.del("assign", x.id); ops.push({ t: "del", c: "assign", id: x.id }); }
        this.kick(id); break;
      }
      case "admin_put": {
        need();
        const user = str(d.user, 40); if (!user) throw new Error("Kullanıcı adı gerekli");
        const prev = d.id ? this.get("admins", String(d.id)) : null;
        if (this.all("admins").some(x => x.id !== (prev && prev.id) && x.user.toLowerCase() === user.toLowerCase())) throw new Error("Bu kullanıcı adı var");
        const o = prev ? { ...prev, user } : { id: crypto.randomUUID(), user, created: Date.now() };
        if (d.pass) { if (String(d.pass).length < 6) throw new Error("Şifre en az 6 karakter"); o.salt = crypto.randomUUID(); o.hash = await hash(String(d.pass), o.salt); }
        else if (!prev) throw new Error("Şifre gerekli");
        this.put("admins", o); ops.push({ t: "put", c: "admins", v: { id: o.id, user: o.user, created: o.created } }); break;
      }
      case "admin_del": {
        need(); const id = String(d.id);
        if (id === att.id) throw new Error("Kendinizi silemezsiniz");
        if (this.all("admins").length < 2) throw new Error("Son yönetici silinemez");
        this.del("admins", id); ops.push({ t: "del", c: "admins", id }); this.kick(id); break;
      }
      case "msg_del": { need(); this.del("msgs", String(d.id)); ops.push({ t: "del", c: "msgs", id: String(d.id) }); break; }
      case "set": {
        need();
        if (!KV_SET.includes(d.k)) throw new Error("Geçersiz anahtar");
        const s = J(d.v); if (s.length > 1900000) throw new Error("Veri çok büyük (görselleri küçültün)");
        this.kvSet(d.k, d.v); ops.push({ t: "set", k: d.k, v: d.v });
        // gönderene geri yayın yok: aynı veriyi alıp işi karıştırmasın
        this.bcExcept(ws, ops); return null;
      }
      default: throw new Error("Bilinmeyen işlem");
    }
    flush(); return null;
  }
  bcExcept(skip, ops) {
    for (const w of this.ctx.getWebSockets()) {
      if (w === skip) continue;
      const att = w.deserializeAttachment(); if (!att || !att.role) continue;
      const out = ops.map(o => this.view(o, att)).filter(Boolean);
      if (out.length) { try { w.send(J({ t: "ops", ops: out })); } catch (e) {} }
    }
  }
  kick(id) {
    for (const w of this.ctx.getWebSockets()) { const a = w.deserializeAttachment(); if (a && a.id === id) { try { w.close(4001, "kapatıldı"); } catch (e) {} } }
  }
}

function pubDriver(d) { return { id: d.id, name: d.name, surname: d.surname, photo: d.photo, active: d.active }; }
