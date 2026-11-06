/* Yönetici: canlı takip, vardiya, şoförler, rapor, sohbet, ayarlar ve sunucu ile eşitleme.
   admin.html içindeki mevcut çizelge uygulamasına eklenir (S, save, renderAll, times vb. onun değişkenleridir). */
(function () {
  "use strict";
  const J = JSON.stringify;
  const T = {
    tr: {
      tLive: "Canlı", tAssign: "Vardiya", tDrivers: "Şoförler", tReport: "Rapor", tChat: "Sohbet", tSet: "Ayarlar",
      lgTitle: "Yönetici Girişi", user: "Kullanıcı adı", pass: "Şifre", remember: "Bu bilgisayarda hatırla", login: "Giriş yap", skip: "Giriş yapmadan kullan (eşitleme yok)",
      bad: "Kullanıcı adı veya şifre hatalı.", noconn: "Sunucuya bağlanılamadı. Tekrar deneniyor… (kod ", slow: "Sunucu yanıt vermiyor. İnternet veya şirket ağı (WebSocket) engelliyor olabilir. Mobil internetle deneyin.", locked: "Çok fazla deneme. 10 dakika sonra tekrar deneyin.", on: "Bağlı", off: "Bağlantı yok", wait: "Bağlanıyor…",
      today: "Bugün", date: "Tarih", slots: "Servis", ok: "Zamanında", late: "Geç", missed: "Yapılmadı", soon: "Yaklaşıyor", waiting: "Bekliyor",
      time: "Saat", dir: "Yön", veh: "Araç", drv: "Şoförler", none: "Bu gün için saat yok.", noAsg: "atanmamış", extraT: "Ekstra seferler", feed: "Son hareketler", online: "Şu an bağlı şoförler", nobody: "Kimse bağlı değil",
      mark: "Yapıldı say", markT: "Elle zamanında işaretle", edit: "Düzenle", del: "Sil", cancel: "Vazgeç", save: "Kaydet", add: "Ekle", addTrip: "+ Elle sefer ekle", confirm: "Emin misiniz? Tekrar basın",
      tripEd: "Sefer", slot: "Servis saati", actual: "Gerçek saat", driver: "Şoför", noSlot: "Ekstra (saatsiz)", dir0: "Otelden Tesise", dir1: "Tesisten Otele",
      asgHint: "Her servis saatine şoför atayın. Atanan şoför seferi bildirmezse Canlı sekmesinde \"Yapılmadı\" görünür.", addDrv: "+ şoför", copyTo: "Bu günü kopyala:", days: "gün ileri", clear: "Günü temizle", noDrv: "Önce Şoförler sekmesinden şoför ekleyin.",
      newDrv: "Yeni şoför", editDrv: "Şoförü düzenle", name: "Ad", surname: "Soyad", phone: "Telefon", pin: "PIN (4-6 hane)", note: "Not", active: "Aktif", photo: "Fotoğraf", pinHint: "Boş bırakırsanız otomatik PIN verilir.",
      drvList: "Şoför listesi", noDrvList: "Henüz şoför yok.", offline: "çevrimdışı", admins: "Yönetici hesapları", newAdmin: "Yeni yönetici", newPass: "Yeni şifre (en az 6)", setPass: "Şifreyi değiştir", you: "(siz)",
      period: "Dönem", pDay: "Günlük", pWeek: "Haftalık", pMonth: "Aylık", calc: "Hesapla", h2f: "Otel → Tesis", f2h: "Tesis → Otel", total: "Toplam", planned: "Planlanan", lateN: "Geç", missedN: "Yapılmadı", csv: "CSV indir", repEmpty: "Bu dönemde kayıt yok.",
      typeMsg: "Mesaj yaz…", send: "Gönder", noMsgs: "Henüz mesaj yok.", allDrv: "Tüm şoförlerle ortak grup",
      brand: "Marka ve logolar", appTitle: "Uygulama başlığı", co1: "1. şirket", co2: "2. şirket", coName: "Şirket adı", logo: "Logo", appLogo: "Uygulama logosu (her iki uygulamada)", remove: "Kaldır",
      rules: "Kurallar", grace: "Gecikme toleransı (dk)", remind: "Hatırlatma (dk önce)", backup: "Yedek", dl: "Yedeği indir", pick: "Yedek klasörü seç", now: "Şimdi yedekle", restore: "Yedekten geri yükle",
      bkHint: "Klasör seçerseniz bu sayfa açıkken her 5 dakikada bir yedek yazılır (Chrome/Edge). Veriler ayrıca Cloudflare'de kalıcıdır.", lastBk: "Son yedek", never: "henüz yok", folder: "Klasör", folderNone: "seçilmedi", restoreAsk: "Mevcut tüm veri yedekle DEĞİŞTİRİLECEK. Devam?", saved: "Kaydedildi", sync: "Sunucudaki çizelge yüklendi.",
    },
    en: {
      tLive: "Live", tAssign: "Shifts", tDrivers: "Drivers", tReport: "Report", tChat: "Chat", tSet: "Settings",
      lgTitle: "Admin Login", user: "Username", pass: "Password", remember: "Remember on this computer", login: "Log in", skip: "Use without login (no sync)",
      bad: "Wrong username or password.", noconn: "Could not reach the server. Retrying… (code ", slow: "The server is not answering. Your network may block WebSocket. Try mobile data.", locked: "Too many attempts. Try again in 10 minutes.", on: "Connected", off: "Offline", wait: "Connecting…",
      today: "Today", date: "Date", slots: "Trips", ok: "On time", late: "Late", missed: "Not done", soon: "Soon", waiting: "Waiting",
      time: "Time", dir: "Direction", veh: "Vehicles", drv: "Drivers", none: "No times for this day.", noAsg: "unassigned", extraT: "Extra trips", feed: "Latest activity", online: "Drivers online now", nobody: "Nobody online",
      mark: "Mark done", markT: "Mark as done on time", edit: "Edit", del: "Delete", cancel: "Cancel", save: "Save", add: "Add", addTrip: "+ Add trip by hand", confirm: "Sure? Press again",
      tripEd: "Trip", slot: "Scheduled time", actual: "Actual time", driver: "Driver", noSlot: "Extra (no time)", dir0: "Hotel to Facility", dir1: "Facility to Hotel",
      asgHint: "Assign drivers to each time. If an assigned driver does not report the trip, Live shows \"Not done\".", addDrv: "+ driver", copyTo: "Copy this day:", days: "days ahead", clear: "Clear day", noDrv: "Add drivers in the Drivers tab first.",
      newDrv: "New driver", editDrv: "Edit driver", name: "First name", surname: "Last name", phone: "Phone", pin: "PIN (4-6 digits)", note: "Note", active: "Active", photo: "Photo", pinHint: "Leave empty to generate a PIN.",
      drvList: "Driver list", noDrvList: "No drivers yet.", offline: "offline", admins: "Admin accounts", newAdmin: "New admin", newPass: "New password (min 6)", setPass: "Change password", you: "(you)",
      period: "Period", pDay: "Daily", pWeek: "Weekly", pMonth: "Monthly", calc: "Calculate", h2f: "Hotel → Facility", f2h: "Facility → Hotel", total: "Total", planned: "Planned", lateN: "Late", missedN: "Not done", csv: "Download CSV", repEmpty: "No records in this period.",
      typeMsg: "Write a message…", send: "Send", noMsgs: "No messages yet.", allDrv: "Group with all drivers",
      brand: "Brand and logos", appTitle: "App title", co1: "Company 1", co2: "Company 2", coName: "Company name", logo: "Logo", appLogo: "App logo (both apps)", remove: "Remove",
      rules: "Rules", grace: "Lateness tolerance (min)", remind: "Reminder (min before)", backup: "Backup", dl: "Download backup", pick: "Choose backup folder", now: "Back up now", restore: "Restore from backup",
      bkHint: "If you choose a folder, a backup is written every 5 minutes while this page is open (Chrome/Edge). Data also stays permanently on Cloudflare.", lastBk: "Last backup", never: "none yet", folder: "Folder", folderNone: "not chosen", restoreAsk: "ALL current data will be REPLACED by the backup. Continue?", saved: "Saved", sync: "Schedule loaded from the server.",
    },
  };
  const lang = () => (typeof S !== "undefined" && S.lang) || "tr";
  const L = k => (T[lang()] && T[lang()][k]) || T.tr[k] || k;
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const st = { drivers: {}, admins: {}, assign: {}, trips: {}, msgs: [], kv: {}, pres: new Set() };
  let gotReady = false, slowT = null, ws = null, authed = false, creds = null, seq = 0, retry = 0, lastPong = 0, stopped = false, myId = null;
  const pending = new Map();
  const TABS = [["x-live", "tLive"], ["x-assign", "tAssign"], ["x-drivers", "tDrivers"], ["x-report", "tReport"], ["x-chat", "tChat"], ["x-set", "tSet"]];

  /* ---------- stil ---------- */
  const css = document.createElement("style");
  css.textContent = `
[hidden]{display:none!important}
:root{--ok:#1b7a43;--ok-bg:#dcf1e3;--late:#a8620d;--late-bg:#f9e8c9;--bad:#b3261e;--bad-bg:#f9dcd9;--soon:#1a5fb4;--soon-bg:#dce8fa}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--ok:#6fd49a;--ok-bg:#173627;--late:#f0b95c;--late-bg:#3b2d14;--bad:#ff8a80;--bad-bg:#432220;--soon:#8ab8ff;--soon-bg:#17294a}}
.xview{display:none;flex:1;min-height:0;overflow:auto;padding:16px}
${TABS.map(t => `body[data-tab="${t[0]}"] #${t[0]}{display:block}`).join("\n")}
body[data-tab^="x-"] .shell{display:none}
.xwrap{max-width:1100px;margin:0 auto}
.lvbar{display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap;margin-bottom:14px}
.lvbar>div{min-width:150px}
.stats{display:flex;gap:8px;flex-wrap:wrap}
.stat{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:8px 14px;text-align:center;min-width:84px}
.stat b{display:block;font-size:24px;font-variant-numeric:tabular-nums}.stat span{font-size:12px;color:var(--muted)}
.lvgrid{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr);gap:14px;align-items:start}
@media (max-width:900px){.lvgrid{grid-template-columns:1fr}}
.xt{width:100%;border-collapse:collapse}
.xt th{text-align:left;font-size:12px;color:var(--muted);padding:6px;border-bottom:1px solid var(--line)}
.xt td{padding:7px 6px;border-top:1px solid var(--line);vertical-align:top}
.xt td.tm{font:700 16px ui-monospace,Consolas,monospace;white-space:nowrap}
.pill{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:4px 10px;font-size:13px;font-weight:700;margin:2px 4px 2px 0}
.pill button{border:0;background:none;cursor:pointer;font-weight:700;padding:0 2px;color:inherit}
.p-ok{background:var(--ok-bg);color:var(--ok)}.p-late{background:var(--late-bg);color:var(--late)}.p-missed{background:var(--bad-bg);color:var(--bad)}.p-soon{background:var(--soon-bg);color:var(--soon)}.p-wait{background:var(--field);color:var(--muted);border:1px solid var(--line)}
.feed div{padding:6px 0;border-top:1px solid var(--line);font-size:13px}.feed div:first-child{border-top:0}
.dcard{display:flex;gap:12px;align-items:center;padding:10px 0;border-top:1px solid var(--line)}
.dcard:first-child{border-top:0}
.av{width:52px;height:52px;border-radius:50%;background:var(--soft);display:grid;place-items:center;font-weight:700;color:var(--primary);overflow:hidden;flex:none;position:relative}
.av img{width:100%;height:100%;object-fit:cover}
.dcard .inf{flex:1;min-width:0}.dcard .inf small{display:block;color:var(--muted)}
.dot2{display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--line);margin-right:6px}.dot2.on{background:var(--ok)}
.lvdot{width:12px;height:12px;border-radius:50%;background:var(--bad);flex:none;margin-right:2px}.lvdot.on{background:var(--ok)}
#lv-login{position:fixed;inset:0;z-index:100;background:var(--bg);display:grid;place-items:center;padding:20px}
#lv-login .box{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:22px;width:100%;max-width:380px;display:flex;flex-direction:column;gap:12px}
#lv-login h2{margin:0;text-align:center}
.lverr{color:var(--bad);font-weight:600;min-height:1.3em;text-align:center}
#chatBox{display:flex;flex-direction:column;gap:8px;max-height:60vh;overflow:auto;padding:4px}
.cm{max-width:80%;padding:8px 12px;border-radius:14px;background:var(--field);border:1px solid var(--line);overflow-wrap:anywhere;white-space:pre-wrap}
.cm.me{align-self:flex-end;background:var(--primary);color:var(--primary-ink);border-color:var(--primary)}
.cm small{display:block;font-size:11px;opacity:.75;margin-bottom:2px}
.cm button{border:0;background:none;cursor:pointer;opacity:.6;margin-left:6px;color:inherit}
.modal{position:fixed;inset:0;z-index:90;background:rgba(0,0,0,.5);display:grid;place-items:center;padding:16px}
.modal .box{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:18px;width:100%;max-width:420px;display:flex;flex-direction:column;gap:10px}
.tbadge{background:var(--bad);color:#fff;border-radius:999px;font-size:11px;padding:1px 6px;margin-left:5px}
.brandrow{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.brandrow img{height:44px;max-width:140px;object-fit:contain;background:#fff;border:1px solid var(--line);border-radius:6px;padding:3px}
#coLogos{display:flex;gap:8px;align-items:center}#coLogos img{height:34px;max-width:110px;object-fit:contain}
`;
  document.head.appendChild(css);

  /* ---------- iskelet ---------- */
  const mk = (tag, attrs, html) => { const e = document.createElement(tag); Object.assign(e, attrs || {}); if (html != null) e.innerHTML = html; return e; };
  const tabs = $("#tabs");
  TABS.forEach(t => tabs.appendChild(mk("button", { type: "button", role: "tab" }, "")).setAttribute("data-tab", t[0]));
  TABS.forEach(t => { const s = mk("section", { id: t[0], className: "xview" }); s.innerHTML = '<div class="xwrap"></div>'; document.body.insertBefore(s, $(".shell")); });
  const top = $(".top");
  top.insertBefore(mk("div", { id: "coLogos" }), top.querySelector(".seg"));
  top.insertBefore(mk("span", { id: "lvConn", className: "lvdot" }), top.querySelector(".seg"));
  const wrap = id => $("#" + id + " .xwrap");

  function buildStatic() {
    TABS.forEach(t => { const b = tabs.querySelector(`[data-tab="${t[0]}"]`); const bd = b.querySelector(".tbadge"); b.textContent = L(t[1]); if (bd) b.appendChild(bd); });
    wrap("x-live").innerHTML = `<div class="lvbar"><div><label for="lvDate">${L("date")}</label><input type="date" id="lvDate"></div><button class="btn" type="button" id="lvToday">${L("today")}</button><button class="btn" type="button" id="lvAddTrip">${L("addTrip")}</button><div class="stats" id="lvStats"></div></div>
      <div class="lvgrid"><div class="card" id="lvTable" style="overflow-x:auto"></div><div><div class="card" id="lvOnline"></div><div class="card feed" id="lvFeed"></div></div></div>`;
    wrap("x-assign").innerHTML = `<p class="meta" style="margin-top:0">${L("asgHint")}</p><div class="lvbar"><div><label for="asDate">${L("date")}</label><input type="date" id="asDate"></div><button class="btn" type="button" id="asPrev">◀</button><button class="btn" type="button" id="asToday">${L("today")}</button><button class="btn" type="button" id="asNext">▶</button>
      <div style="min-width:90px;max-width:120px"><label for="asN">${L("copyTo")}</label><input type="number" id="asN" min="1" max="60" value="6"></div><button class="btn" type="button" id="asCopy">${L("days")}</button><button class="btn danger" type="button" id="asClear">${L("clear")}</button></div><div class="card" id="asTable" style="overflow-x:auto"></div>`;
    wrap("x-drivers").innerHTML = `<div class="lvgrid"><div><div class="card" id="drvList"></div><div class="card" id="admList"></div></div><div class="card" id="drvForm"><h3 id="dfTitle">${L("newDrv")}</h3><div class="stack">
      <input type="hidden" id="dfId"><div class="grid2"><div><label for="dfName">${L("name")}</label><input type="text" id="dfName"></div><div><label for="dfSur">${L("surname")}</label><input type="text" id="dfSur"></div></div>
      <div class="grid2"><div><label for="dfPhone">${L("phone")}</label><input type="tel" id="dfPhone"></div><div><label for="dfPin">${L("pin")}</label><input type="text" id="dfPin" inputmode="numeric" maxlength="6"></div></div>
      <p class="hint" style="margin:0">${L("pinHint")}</p><div><label for="dfNote">${L("note")}</label><input type="text" id="dfNote"></div>
      <label class="toggle"><input type="checkbox" id="dfActive" checked><span>${L("active")}</span></label>
      <div class="row"><button class="btn" type="button" id="dfPhoto">${L("photo")}</button><button class="btn danger small" type="button" id="dfPhotoX">${L("remove")}</button><input type="file" id="dfFile" accept="image/*" hidden><span class="av" id="dfPrev"></span></div>
      <div class="row"><button class="btn primary" type="button" id="dfSave">${L("save")}</button><button class="btn" type="button" id="dfReset">${L("cancel")}</button></div><div class="lverr" id="dfErr"></div></div></div></div>`;
    wrap("x-report").innerHTML = `<div class="lvbar"><div><label for="rpP">${L("period")}</label><select id="rpP"><option value="day">${L("pDay")}</option><option value="week" selected>${L("pWeek")}</option><option value="month">${L("pMonth")}</option></select></div><div><label for="rpD">${L("date")}</label><input type="date" id="rpD"></div><button class="btn primary" type="button" id="rpGo">${L("calc")}</button><button class="btn" type="button" id="rpCsv">${L("csv")}</button></div><div class="card" id="rpOut" style="overflow-x:auto"></div>`;
    wrap("x-chat").innerHTML = `<div class="card"><h3>${L("allDrv")}</h3><div id="chatBox"></div><form id="chatF" class="row" style="margin-top:10px"><div style="flex:1;min-width:160px"><input type="text" id="chatI" maxlength="1000" autocomplete="off" placeholder="${esc(L("typeMsg"))}"></div><button class="btn primary" type="submit">${L("send")}</button></form></div>`;
    wrap("x-set").innerHTML = `<div class="lvgrid"><div>
      <div class="card"><h3>${L("brand")}</h3><div class="stack">
        <div><label for="bTitle">${L("appTitle")}</label><input type="text" id="bTitle"></div>
        ${[1, 2].map(i => `<div class="brandrow"><div style="flex:1;min-width:140px"><label for="bN${i}">${L("co" + i)} · ${L("coName")}</label><input type="text" id="bN${i}"></div><img id="bI${i}" alt="" hidden><button class="btn small" type="button" data-logo="c${i}">${L("logo")}</button><button class="btn small danger" type="button" data-logox="c${i}">${L("remove")}</button></div>`).join("")}
        <div class="brandrow"><span style="flex:1">${L("appLogo")}</span><img id="bIa" alt="" hidden><button class="btn small" type="button" data-logo="app">${L("logo")}</button><button class="btn small danger" type="button" data-logox="app">${L("remove")}</button></div>
        <input type="file" id="bFile" accept="image/*" hidden><button class="btn primary" type="button" id="bSave">${L("save")}</button></div></div>
      <div class="card"><h3>${L("rules")}</h3><div class="grid2"><div><label for="rGrace">${L("grace")}</label><input type="number" id="rGrace" min="0" max="120"></div><div><label for="rRem">${L("remind")}</label><input type="number" id="rRem" min="1" max="60"></div></div><div class="row" style="margin-top:10px"><button class="btn primary" type="button" id="rSave">${L("save")}</button></div></div></div>
      <div class="card"><h3>${L("backup")}</h3><div class="stack"><div class="row"><button class="btn" type="button" id="bkDl">${L("dl")}</button><button class="btn" type="button" id="bkPick">${L("pick")}</button><button class="btn" type="button" id="bkNow">${L("now")}</button></div>
        <p class="meta" id="bkInfo"></p><p class="hint" style="margin:0">${L("bkHint")}</p><div class="row"><button class="btn danger" type="button" id="bkRestore">${L("restore")}</button><input type="file" id="bkFile" accept="application/json,.json" hidden></div></div></div></div>`;
    $("#lvDate").value = $("#asDate").value = $("#rpD").value = SV.today();
    fillSettings(); renderAll2();
  }

  /* ---------- bağlantı ---------- */
  function setConn() { const on = authed && ws && ws.readyState === 1; $("#lvConn").classList.toggle("on", on); $("#lvConn").title = on ? L("on") : (creds ? L("wait") : L("off")); }
  function connect() {
    if (!creds || stopped) return;
    setConn(); gotReady = false; clearTimeout(slowT);
    slowT = setTimeout(() => { if (!gotReady && creds) $("#lvErr").textContent = L("slow"); }, 9000);
    ws = new WebSocket((location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/ws");
    ws.onopen = () => ws.send(J({ t: "auth", role: "admin", user: creds.user, pass: creds.pass }));
    ws.onmessage = e => { if (e.data === "pong") { lastPong = Date.now(); return; } let m; try { m = JSON.parse(e.data); } catch (x) { return; } onMsg(m); };
    ws.onclose = ev => {
      authed = false; setConn(); pending.forEach(p => p.rej(new Error(L("off")))); pending.clear();
      if (!gotReady && creds && ev.code !== 4001) $("#lvErr").textContent = L("noconn") + ev.code + ")";
      if (ev.code === 4001) { logout(); return; }
      if (ev.code === 4002) { location.reload(); return; }
      if (creds && !stopped) setTimeout(connect, Math.min(5000, 800 * (++retry)));
    };
  }
  function act(a, d) {
    return new Promise((res, rej) => {
      if (!ws || ws.readyState !== 1 || !authed) { rej(new Error(L("off"))); return; }
      const id = ++seq; pending.set(id, { res, rej }); ws.send(J({ t: "act", id, a, d }));
      setTimeout(() => { if (pending.has(id)) { pending.delete(id); rej(new Error(L("off"))); } }, 15000);
    });
  }
  setInterval(() => { if (ws && ws.readyState === 1) { ws.send("ping"); if (authed && lastPong && Date.now() - lastPong > 70000) ws.close(); } }, 25000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && creds && (!ws || ws.readyState > 1)) { retry = 0; connect(); } });
  const map = a => { const o = {}; (a || []).forEach(x => o[x.id] = x); return o; };

  function onMsg(m) {
    if (m.t === "authfail") { $("#lvErr").textContent = m.locked ? L("locked") : L("bad"); creds = null; stopped = true; try { ws.close(); } catch (e) {} try { localStorage.removeItem("sv-admin"); } catch (e) {} $("#lv-login").hidden = false; return; }
    if (m.t === "ready") { gotReady = true; clearTimeout(slowT); $("#lvErr").textContent = ""; authed = true; retry = 0; lastPong = Date.now(); myId = m.me; $("#lv-login").hidden = true; setConn(); return; }
    if (m.t === "snap") {
      const d = m.data; st.drivers = map(d.drivers); st.admins = map(d.admins); st.assign = map(d.assign); st.trips = map(d.trips); st.msgs = d.msgs || []; st.kv = d.kv || {}; st.pres = new Set(d.pres || []);
      adoptServer(); fillSettings(); renderAll2(); return;
    }
    if (m.t === "ops") { m.ops.forEach(applyOp); renderAll2(); return; }
    if (m.t === "ack") { const p = pending.get(m.id); if (p) { pending.delete(m.id); m.ok ? p.res(m.data) : p.rej(new Error(m.e || "Hata")); } }
  }
  function applyOp(o) {
    if (o.t === "set") {
      if (o.k === "pres") { st.pres = new Set(o.v); return; }
      st.kv[o.k] = o.v;
      if (o.k === "adminState") adoptServer(); else if (o.k === "brand" || o.k === "settings") fillSettings();
      return;
    }
    if (o.c === "msgs") { if (o.t === "put") { if (!st.msgs.some(x => x.id === o.v.id)) st.msgs.push(o.v); } else st.msgs = st.msgs.filter(x => x.id !== o.id); return; }
    const col = st[o.c]; if (!col) return;
    if (o.t === "put") col[o.v.id] = o.v; else delete col[o.id];
  }

  /* ---------- çizelge ↔ sunucu eşitleme ---------- */
  const origSave = window.save;
  window.save = function () { S._ts = Date.now(); origSave(); schedulePush(); };
  let pushT = null;
  function schedulePush() { clearTimeout(pushT); pushT = setTimeout(pushNow, 1200); }
  function buildPub() {
    return {
      profiles: S.profiles.map(p => ({
        name: p.name, title: p.title, event: p.event, from: p.from, to: p.to, weeks: p.weeks, dateCustom: p.dateCustom || {}, lastOn: p.lastOn, last: p.last, extra: p.extra,
        dirs: [0, 1].map(i => { const d = p.dirs[i], inf = d.info || {}; return times(d).map(x => { const v = inf[x] || {}; return { t: x, n: String(v.n || ""), note: String(v.note || "") }; }); }),
      })),
      cur: S.cur, names: S.names, at: Date.now(),
    };
  }
  function pushNow() {
    if (!authed) return;
    let v = S;
    if (J(S).length > 1800000) { v = JSON.parse(J(S)); if (v.bg) v.bg.img = null; if (J(v).length > 1800000) v.logos = []; }
    act("set", { k: "adminState", v }).catch(() => {});
    const pb = buildPub(); st.kv.pub = pb; st.kv.adminState = v;
    act("set", { k: "pub", v: pb }).catch(() => {});
  }
  function adoptServer() {
    const a = st.kv.adminState;
    if (a && (a._ts || 0) > (S._ts || 0)) { S = Object.assign(def(), a); origSave(); renderAll(); toast(L("sync")); }
    else if (a && (a._ts || 0) === (S._ts || 0)) { /* aynı */ if (!st.kv.pub) pushNow(); }
    else pushNow();
  }

  /* ---------- giriş penceresi ---------- */
  const lv = mk("div", { id: "lv-login" }, `<div class="box"><h2>${L("lgTitle")}</h2><div><label for="lvU">${L("user")}</label><input type="text" id="lvU" autocomplete="username" value="admin"></div><div><label for="lvP">${L("pass")}</label><input type="password" id="lvP" autocomplete="current-password"></div><label class="toggle"><input type="checkbox" id="lvR" checked><span>${L("remember")}</span></label><div class="lverr" id="lvErr"></div><button class="btn primary" type="button" id="lvGo">${L("login")}</button><button class="btn" type="button" id="lvSkip">${L("skip")}</button></div>`);
  document.body.appendChild(lv);
  function doLogin() {
    const user = $("#lvU").value.trim(), pass = $("#lvP").value; if (!user || !pass) { $("#lvErr").textContent = L("bad"); return; }
    creds = { user, pass }; stopped = false; $("#lvErr").textContent = "";
    try { if ($("#lvR").checked) localStorage.setItem("sv-admin", J(creds)); else localStorage.removeItem("sv-admin"); } catch (e) {}
    if (ws) { try { ws.onclose = null; ws.close(); } catch (e) {} }
    connect();
  }
  function logout() { stopped = true; creds = null; authed = false; try { localStorage.removeItem("sv-admin"); } catch (e) {} if (ws) { try { ws.onclose = null; ws.close(); } catch (e) {} } $("#lvP").value = ""; $("#lv-login").hidden = false; setConn(); }
  $("#lvGo").addEventListener("click", doLogin);
  $("#lvP").addEventListener("keydown", e => { if (e.key === "Enter") doLogin(); });
  $("#lvSkip").addEventListener("click", () => { $("#lv-login").hidden = true; });
  try { const c = JSON.parse(localStorage.getItem("sv-admin") || "null"); if (c && c.user) { creds = c; $("#lvU").value = c.user; $("#lvP").value = c.pass; connect(); } } catch (e) {}

  /* ---------- yardımcılar ---------- */
  const dn = id => { const d = st.drivers[id]; return d ? (d.name + " " + (d.surname || "")).trim() : null; };
  const tripName = tr => dn(tr.driverId) || tr.driverName || "?";
  const grace = () => (st.kv.settings && st.kv.settings.grace) ?? 10;
  const dirN = d => L("dir" + d);
  const act2 = (a, d, okMsg) => act(a, d).then(r => { if (okMsg) toast(okMsg); return r; }).catch(e => { toast(e.message); throw e; });
  function resize(file, size, cover) {
    return new Promise((ok, no) => {
      const fr = new FileReader(); fr.onerror = no;
      fr.onload = () => { const im = new Image(); im.onerror = no; im.onload = () => {
        const c = document.createElement("canvas"), x = c.getContext("2d");
        if (cover) { c.width = c.height = size; const k = Math.max(size / im.width, size / im.height), w = im.width * k, h = im.height * k; x.fillStyle = "#fff"; x.fillRect(0, 0, size, size); x.drawImage(im, (size - w) / 2, (size - h) / 2, w, h); ok(c.toDataURL("image/jpeg", 0.8)); }
        else { const k = Math.min(1, size / Math.max(im.width, im.height)); c.width = Math.max(1, Math.round(im.width * k)); c.height = Math.max(1, Math.round(im.height * k)); x.drawImage(im, 0, 0, c.width, c.height); ok(c.toDataURL("image/png")); }
      }; im.src = fr.result; };
      fr.readAsDataURL(file);
    });
  }
  const initials = d => ((d.name || "?")[0] + ((d.surname || "")[0] || "")).toUpperCase();
  const avatar = d => `<span class="av">${d.photo ? `<img src="${d.photo}" alt="">` : esc(initials(d))}</span>`;
  const hh = SV.hhmm;
  const activeDrivers = () => Object.values(st.drivers).filter(d => d.active !== false).sort((a, b) => a.name.localeCompare(b.name, "tr"));

  /* ---------- CANLI ---------- */
  function renderLive() {
    const date = $("#lvDate").value || SV.today(), pub = buildPub(), slots = SV.slotsFor(pub, date), now = Date.now(), g = grace();
    const as = Object.values(st.assign).filter(a => a.date === date), trs = Object.values(st.trips).filter(x => x.date === date);
    const c = { total: slots.length, ok: 0, late: 0, missed: 0, wait: 0 };
    const rows = slots.map(s => {
      const asg = as.filter(a => a.dir === s.dir && a.slot === s.t), done = trs.filter(x => x.dir === s.dir && x.slot === s.t);
      let cells = asg.map(a => {
        const tr = done.find(x => x.driverId === a.driverId), stt = SV.status(date, s.t, tr, now, g); c[stt === "soon" ? "wait" : stt]++;
        const name = dn(a.driverId) || "?";
        return `<span class="pill p-${stt}">${esc(name)} · ${L(stt)}${tr ? " " + hh(tr.at) : ""}${tr ? `<button data-lv="edit" data-id="${tr.id}" title="${L("edit")}">✎</button>` : `<button data-lv="mark" data-d="${a.driverId}" data-dir="${s.dir}" data-t="${s.t}" title="${L("markT")}">✓</button>`}</span>`;
      }).join("");
      cells += done.filter(x => !asg.some(a => a.driverId === x.driverId)).map(tr => `<span class="pill p-ok">${esc(tripName(tr))} ✓ ${hh(tr.at)}<button data-lv="edit" data-id="${tr.id}">✎</button></span>`).join("");
      if (!cells) cells = `<span class="meta">${L("noAsg")}</span>`;
      return `<tr><td class="tm">${s.t}</td><td>${esc(dirN(s.dir))}</td><td>${esc(s.n)}</td><td>${cells}${s.note ? `<div class="meta">${esc(s.note)}</div>` : ""}</td></tr>`;
    }).join("");
    const extras = trs.filter(x => !x.slot).sort((a, b) => a.at - b.at);
    $("#lvTable").innerHTML = slots.length ? `<table class="xt"><thead><tr><th>${L("time")}</th><th>${L("dir")}</th><th>${L("veh")}</th><th>${L("drv")}</th></tr></thead><tbody>${rows}</tbody></table>` : `<p class="meta">${L("none")}</p>`;
    if (extras.length) $("#lvTable").innerHTML += `<h4 style="margin:14px 0 6px">${L("extraT")}</h4>` + extras.map(tr => `<span class="pill p-ok">${esc(tripName(tr))} · ${esc(dirN(tr.dir))} ${hh(tr.at)}<button data-lv="edit" data-id="${tr.id}">✎</button></span>`).join("");
    $("#lvStats").innerHTML = [["total", L("slots")], ["ok", L("ok")], ["late", L("late")], ["missed", L("missed")], ["wait", L("waiting")]].map(k => `<div class="stat"><b>${c[k[0]]}</b><span>${k[1]}</span></div>`).join("");
    const on = [...st.pres].map(id => st.drivers[id]).filter(Boolean);
    $("#lvOnline").innerHTML = `<h3>${L("online")}</h3>` + (on.length ? on.map(d => `<div class="dcard">${avatar(d)}<div class="inf"><b>${esc(d.name + " " + (d.surname || ""))}</b></div><span class="dot2 on"></span></div>`).join("") : `<p class="meta">${L("nobody")}</p>`);
    const feed = Object.values(st.trips).sort((a, b) => b.at - a.at).slice(0, 15);
    $("#lvFeed").innerHTML = `<h3>${L("feed")}</h3>` + feed.map(tr => {
      const stt = tr.slot ? SV.status(tr.date, tr.slot, tr, now, g) : "ok";
      return `<div><span class="pill p-${stt}">${hh(tr.at)}</span> <b>${esc(tripName(tr))}</b> · ${esc(dirN(tr.dir))}${tr.slot ? " · " + tr.slot : ""}${tr.src === "admin" ? " ✎" : ""} <span class="meta">${tr.date.slice(5)}</span></div>`;
    }).join("");
  }
  function tripModal(tr, pre) {
    const t = tr || pre || { date: $("#lvDate").value || SV.today(), dir: 0, slot: "", driverId: "", at: Date.now() };
    const m = mk("div", { className: "modal" }, `<div class="box"><h3 style="margin:0">${L("tripEd")}</h3>
      <div class="grid2"><div><label>${L("date")}</label><input type="date" id="teD" value="${t.date}"></div><div><label>${L("slot")}</label><input type="time" id="teS" value="${t.slot || ""}"></div></div>
      <div class="grid2"><div><label>${L("dir")}</label><select id="teDir"><option value="0"${t.dir === 0 ? " selected" : ""}>${L("dir0")}</option><option value="1"${t.dir === 1 ? " selected" : ""}>${L("dir1")}</option></select></div><div><label>${L("actual")}</label><input type="time" id="teA" value="${hh(t.at)}"></div></div>
      <div><label>${L("driver")}</label><select id="teDr">${activeDrivers().concat(t.driverId && !st.drivers[t.driverId] ? [] : []).map(d => `<option value="${d.id}"${d.id === t.driverId ? " selected" : ""}>${esc(d.name + " " + (d.surname || ""))}</option>`).join("")}</select></div>
      <div class="row"><button class="btn primary" type="button" id="teOk">${L("save")}</button>${tr ? `<button class="btn danger" type="button" id="teDel">${L("del")}</button>` : ""}<button class="btn" type="button" id="teNo">${L("cancel")}</button></div><div class="lverr" id="teE"></div></div>`);
    document.body.appendChild(m);
    const close = () => m.remove(); m.querySelector("#teNo").onclick = close;
    m.querySelector("#teOk").onclick = async () => {
      const date = m.querySelector("#teD").value, a = m.querySelector("#teA").value || hh(Date.now());
      const at = Date.parse(date + "T" + a + ":00+03:00");
      try { await act("trip_put", { id: tr && tr.id, date, slot: m.querySelector("#teS").value || null, dir: +m.querySelector("#teDir").value, driverId: m.querySelector("#teDr").value, at }); close(); } catch (e) { m.querySelector("#teE").textContent = e.message; }
    };
    if (tr) { let armed = false; m.querySelector("#teDel").onclick = async e => { if (!armed) { armed = true; e.target.textContent = L("confirm"); return; } try { await act("trip_del", { id: tr.id }); close(); } catch (er) { m.querySelector("#teE").textContent = er.message; } }; }
  }

  /* ---------- VARDİYA ---------- */
  function renderAssign() {
    const date = $("#asDate").value || SV.today(), slots = SV.slotsFor(buildPub(), date), drv = activeDrivers();
    if (!drv.length) { $("#asTable").innerHTML = `<p class="meta">${L("noDrv")}</p>`; return; }
    const as = Object.values(st.assign).filter(a => a.date === date);
    $("#asTable").innerHTML = slots.length ? `<table class="xt"><thead><tr><th>${L("time")}</th><th>${L("dir")}</th><th>${L("veh")}</th><th>${L("drv")}</th></tr></thead><tbody>${slots.map(s => {
      const asg = as.filter(a => a.dir === s.dir && a.slot === s.t), have = new Set(asg.map(a => a.driverId));
      const opts = drv.filter(d => !have.has(d.id));
      return `<tr><td class="tm">${s.t}</td><td>${esc(dirN(s.dir))}</td><td>${esc(s.n)}</td><td>${asg.map(a => `<span class="pill p-wait">${esc(dn(a.driverId) || "?")}<button data-as="del" data-id="${esc(a.id)}">✕</button></span>`).join("")}${opts.length ? `<select data-as="add" data-dir="${s.dir}" data-t="${s.t}" style="width:auto;min-height:32px;padding:2px 6px"><option value="">${L("addDrv")}</option>${opts.map(d => `<option value="${d.id}">${esc(d.name + " " + (d.surname || ""))}</option>`).join("")}</select>` : ""}</td></tr>`;
    }).join("")}</tbody></table>` : `<p class="meta">${L("none")}</p>`;
  }

  /* ---------- ŞOFÖRLER ---------- */
  let dfPhoto;
  function renderDrivers() {
    const list = Object.values(st.drivers).sort((a, b) => a.name.localeCompare(b.name, "tr"));
    $("#drvList").innerHTML = `<h3>${L("drvList")} (${list.length})</h3>` + (list.length ? list.map(d => `<div class="dcard">${avatar(d)}<div class="inf"><b>${esc(d.name + " " + (d.surname || ""))}</b>${d.active === false ? ' <span class="meta">(–)</span>' : ""}<small>${esc(d.phone)} · PIN ${esc(d.pin)}</small>${d.note ? `<small>${esc(d.note)}</small>` : ""}</div><span class="dot2${st.pres.has(d.id) ? " on" : ""}" title="${st.pres.has(d.id) ? L("on") : L("offline")}"></span><button class="btn small" data-dr="edit" data-id="${d.id}">${L("edit")}</button><button class="btn small danger" data-dr="del" data-id="${d.id}">${L("del")}</button></div>`).join("") : `<p class="meta">${L("noDrvList")}</p>`);
    const ad = Object.values(st.admins);
    $("#admList").innerHTML = `<h3>${L("admins")}</h3>` + ad.map(a => `<div class="dcard"><div class="inf"><b>${esc(a.user)}</b> ${a.id === myId ? `<span class="meta">${L("you")}</span>` : ""}</div><input type="password" placeholder="${esc(L("newPass"))}" data-ap="${a.id}" style="max-width:170px"><button class="btn small" data-ad="pass" data-id="${a.id}">${L("setPass")}</button>${a.id !== myId ? `<button class="btn small danger" data-ad="del" data-id="${a.id}">${L("del")}</button>` : ""}</div>`).join("") +
      `<div class="dcard"><input type="text" id="naU" placeholder="${esc(L("newAdmin"))}" style="max-width:150px"><input type="password" id="naP" placeholder="${esc(L("newPass"))}" style="max-width:170px"><button class="btn small primary" id="naGo">${L("add")}</button></div><div class="lverr" id="naE"></div>`;
  }
  function dfClear() { $("#dfId").value = ""; ["dfName", "dfSur", "dfPhone", "dfPin", "dfNote"].forEach(i => $("#" + i).value = ""); $("#dfActive").checked = true; dfPhoto = undefined; $("#dfPrev").innerHTML = ""; $("#dfTitle").textContent = L("newDrv"); $("#dfErr").textContent = ""; }
  const armed = new Set();
  function twice(key, el, fn) { if (!armed.has(key)) { armed.add(key); const o = el.textContent; el.textContent = L("confirm"); setTimeout(() => { armed.delete(key); el.textContent = o; }, 3500); return; } armed.delete(key); fn(); }

  /* ---------- RAPOR ---------- */
  let repRows = [];
  async function runReport() {
    const p = $("#rpP").value, d = $("#rpD").value || SV.today(); let from = d, to = d;
    if (p === "week") { from = SV.weekStart(d); to = SV.addDays(from, 6); } else if (p === "month") { from = d.slice(0, 8) + "01"; const x = new Date(from + "T12:00:00Z"); x.setUTCMonth(x.getUTCMonth() + 1); x.setUTCDate(0); to = x.toISOString().slice(0, 10); }
    let r; try { r = await act("range", { from, to }); } catch (e) { toast(e.message); return; }
    const per = {}, ensure = id => per[id] || (per[id] = { id, name: dn(id) || "?", h2f: 0, f2h: 0, late: 0, missed: 0, planned: 0 });
    const g = grace(), now = Date.now();
    r.trips.forEach(t => { const x = ensure(t.driverId); if (!dn(t.driverId) && t.driverName) x.name = t.driverName; t.dir ? x.f2h++ : x.h2f++; if (t.slot && SV.status(t.date, t.slot, t, now, g) === "late") x.late++; });
    r.assign.forEach(a => { const x = ensure(a.driverId); x.planned++; const tr = r.trips.find(t => t.driverId === a.driverId && t.date === a.date && t.dir === a.dir && t.slot === a.slot); if (!tr && SV.slotMs(a.date, a.slot) + g * 60000 < now) x.missed++; });
    repRows = Object.values(per).sort((a, b) => a.name.localeCompare(b.name, "tr")); repRows.range = [from, to];
    const tot = repRows.reduce((s, x) => ({ h2f: s.h2f + x.h2f, f2h: s.f2h + x.f2h, late: s.late + x.late, missed: s.missed + x.missed, planned: s.planned + x.planned }), { h2f: 0, f2h: 0, late: 0, missed: 0, planned: 0 });
    $("#rpOut").innerHTML = `<p class="meta" style="margin-top:0">${from} → ${to}</p>` + (repRows.length ? `<table class="xt"><thead><tr><th>${L("driver")}</th><th>${L("h2f")}</th><th>${L("f2h")}</th><th>${L("total")}</th><th>${L("planned")}</th><th>${L("lateN")}</th><th>${L("missedN")}</th></tr></thead><tbody>${repRows.map(x => `<tr><td>${esc(x.name)}</td><td>${x.h2f}</td><td>${x.f2h}</td><td><b>${x.h2f + x.f2h}</b></td><td>${x.planned}</td><td>${x.late}</td><td>${x.missed}</td></tr>`).join("")}<tr><td><b>${L("total")}</b></td><td><b>${tot.h2f}</b></td><td><b>${tot.f2h}</b></td><td><b>${tot.h2f + tot.f2h}</b></td><td><b>${tot.planned}</b></td><td><b>${tot.late}</b></td><td><b>${tot.missed}</b></td></tr></tbody></table>` : `<p class="meta">${L("repEmpty")}</p>`);
  }

  /* ---------- SOHBET ---------- */
  function renderChat() {
    const box = $("#chatBox"), end = box.scrollHeight - box.scrollTop - box.clientHeight < 80 || !box.children.length;
    box.innerHTML = st.msgs.length ? st.msgs.map(m => { const me = m.from.role === "admin"; return `<div class="cm${me ? " me" : ""}"><small>${esc(m.from.name)} · ${hh(m.ts)}<button data-cm="${m.id}" title="${L("del")}">✕</button></small>${esc(m.text)}</div>`; }).join("") : `<p class="meta">${L("noMsgs")}</p>`;
    const vis = document.body.dataset.tab === "x-chat"; if (vis) { localStorage.setItem("sv-adm-seen", String(st.msgs.length ? st.msgs[st.msgs.length - 1].ts : 0)); if (end) box.scrollTop = box.scrollHeight; }
    const seen = +localStorage.getItem("sv-adm-seen") || 0, n = vis ? 0 : st.msgs.filter(m => m.ts > seen && m.from.role === "driver").length;
    const b = tabs.querySelector('[data-tab="x-chat"]'); let e = b.querySelector(".tbadge");
    if (n) { if (!e) { e = mk("span", { className: "tbadge" }); b.appendChild(e); } e.textContent = n > 9 ? "9+" : n; } else if (e) e.remove();
  }

  /* ---------- AYARLAR ve YEDEK ---------- */
  let logoTarget = null;
  function fillSettings() {
    if (!$("#bTitle")) return;
    const b = st.kv.brand || {}, s = st.kv.settings || {};
    if (document.activeElement !== $("#bTitle")) $("#bTitle").value = b.title || "";
    [1, 2].forEach(i => { const c = b["c" + i] || {}; if (document.activeElement !== $("#bN" + i)) $("#bN" + i).value = c.name || ""; const im = $("#bI" + i); im.hidden = !c.logo; if (c.logo) im.src = c.logo; });
    const ia = $("#bIa"); ia.hidden = !b.app; if (b.app) ia.src = b.app;
    $("#rGrace").value = s.grace ?? 10; $("#rRem").value = s.remind ?? 5;
    const lg = $("#coLogos"); lg.innerHTML = [b.c1 && b.c1.logo, b.c2 && b.c2.logo].filter(Boolean).map(x => `<img src="${x}" alt="">`).join("");
    bkInfo();
  }
  function curBrand() { const b = JSON.parse(J(st.kv.brand || {})); b.c1 = b.c1 || {}; b.c2 = b.c2 || {}; return b; }
  let bkHandle = null, lastBk = null;
  const idb = () => new Promise((ok, no) => { const r = indexedDB.open("sv-admin", 1); r.onupgradeneeded = () => r.result.createObjectStore("k"); r.onsuccess = () => ok(r.result); r.onerror = no; });
  async function idbGet(k) { const d = await idb(); return new Promise(ok => { const q = d.transaction("k").objectStore("k").get(k); q.onsuccess = () => ok(q.result); q.onerror = () => ok(null); }); }
  async function idbSet(k, v) { const d = await idb(); return new Promise(ok => { const q = d.transaction("k", "readwrite").objectStore("k").put(v, k); q.onsuccess = q.onerror = () => ok(); }); }
  idbGet("bk").then(h => { bkHandle = h || null; bkInfo(); }).catch(() => {});
  function bkInfo() { const e = $("#bkInfo"); if (e) e.textContent = L("folder") + ": " + (bkHandle ? bkHandle.name : L("folderNone")) + " · " + L("lastBk") + ": " + (lastBk ? new Date(lastBk).toLocaleString(lang() === "en" ? "en-GB" : "tr-TR") : L("never")); }
  async function fetchBackup() {
    if (!creds) throw new Error(L("off"));
    const r = await fetch("/api/export", { headers: { Authorization: "Basic " + btoa(unescape(encodeURIComponent(creds.user + ":" + creds.pass))) } });
    if (!r.ok) throw new Error("HTTP " + r.status); return r.text();
  }
  async function writeBackup(manualDl) {
    const txt = await fetchBackup(), d = new Date(), p = SV.pad, day = d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
    if (manualDl) { const a = mk("a", { href: URL.createObjectURL(new Blob([txt], { type: "application/json" })), download: `servis-yedek-${day}-${p(d.getHours())}${p(d.getMinutes())}.json` }); document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000); lastBk = Date.now(); bkInfo(); return; }
    if (!bkHandle) throw new Error(L("folderNone"));
    if ((await bkHandle.queryPermission({ mode: "readwrite" })) !== "granted" && (await bkHandle.requestPermission({ mode: "readwrite" })) !== "granted") throw new Error("izin yok");
    for (const name of ["servis-yedek-son.json", `servis-yedek-${day}.json`]) { const f = await bkHandle.getFileHandle(name, { create: true }), w = await f.createWritable(); await w.write(txt); await w.close(); }
    lastBk = Date.now(); bkInfo();
  }
  setInterval(() => { if (bkHandle && authed) writeBackup(false).catch(() => {}); }, 300000);

  /* ---------- olaylar ---------- */
  document.addEventListener("click", async e => {
    const b = e.target.closest("button,[data-lv]"); if (!b) return;
    if (b.id === "lvToday") { $("#lvDate").value = SV.today(); renderLive(); }
    if (b.id === "lvAddTrip") tripModal(null);
    const lvA = b.dataset.lv;
    if (lvA === "edit") tripModal(st.trips[b.dataset.id]);
    if (lvA === "mark") { const date = $("#lvDate").value; act2("trip_put", { date, dir: +b.dataset.dir, slot: b.dataset.t, driverId: b.dataset.d, at: SV.slotMs(date, b.dataset.t) }); }
    if (b.id === "asToday") { $("#asDate").value = SV.today(); renderAssign(); }
    if (b.id === "asPrev" || b.id === "asNext") { $("#asDate").value = SV.addDays($("#asDate").value || SV.today(), b.id === "asPrev" ? -1 : 1); renderAssign(); }
    if (b.dataset.as === "del") act2("assign_bulk", { del: [b.dataset.id] });
    if (b.id === "asCopy") {
      const date = $("#asDate").value, n = Math.min(60, Math.max(1, +$("#asN").value || 1)), src = Object.values(st.assign).filter(a => a.date === date), put = [];
      for (let i = 1; i <= n; i++) src.forEach(a => put.push({ date: SV.addDays(date, i), dir: a.dir, slot: a.slot, driverId: a.driverId }));
      act2("assign_bulk", { put }, L("saved"));
    }
    if (b.id === "asClear") twice("asClear", b, () => act2("assign_bulk", { del: Object.values(st.assign).filter(a => a.date === $("#asDate").value).map(a => a.id) }));
    if (b.id === "dfPhoto") $("#dfFile").click();
    if (b.id === "dfPhotoX") { dfPhoto = ""; $("#dfPrev").innerHTML = ""; }
    if (b.id === "dfReset") dfClear();
    if (b.id === "dfSave") {
      $("#dfErr").textContent = "";
      try { await act("driver_put", { id: $("#dfId").value || undefined, name: $("#dfName").value, surname: $("#dfSur").value, phone: $("#dfPhone").value, pin: $("#dfPin").value, note: $("#dfNote").value, active: $("#dfActive").checked, photo: dfPhoto }); dfClear(); toast(L("saved")); } catch (er) { $("#dfErr").textContent = er.message; }
    }
    if (b.dataset.dr === "edit") {
      const d = st.drivers[b.dataset.id]; if (!d) return;
      $("#dfId").value = d.id; $("#dfName").value = d.name; $("#dfSur").value = d.surname || ""; $("#dfPhone").value = d.phone; $("#dfPin").value = d.pin; $("#dfNote").value = d.note || ""; $("#dfActive").checked = d.active !== false; dfPhoto = undefined;
      $("#dfPrev").innerHTML = d.photo ? `<img src="${d.photo}" alt="">` : ""; $("#dfTitle").textContent = L("editDrv"); $("#dfName").focus();
    }
    if (b.dataset.dr === "del") twice("dr" + b.dataset.id, b, () => act2("driver_del", { id: b.dataset.id }));
    if (b.id === "naGo") { try { await act("admin_put", { user: $("#naU").value, pass: $("#naP").value }); $("#naE").textContent = ""; toast(L("saved")); } catch (er) { $("#naE").textContent = er.message; } }
    if (b.dataset.ad === "pass") { const v = document.querySelector(`[data-ap="${b.dataset.id}"]`).value, a = st.admins[b.dataset.id]; if (v) act2("admin_put", { id: a.id, user: a.user, pass: v }, L("saved")); }
    if (b.dataset.ad === "del") twice("ad" + b.dataset.id, b, () => act2("admin_del", { id: b.dataset.id }));
    if (b.id === "rpGo") runReport();
    if (b.id === "rpCsv" && repRows.length) {
      const rows = [["Sürücü", "Otel>Tesis", "Tesis>Otel", "Toplam", "Planlanan", "Geç", "Yapılmadı"]].concat(repRows.map(x => [x.name, x.h2f, x.f2h, x.h2f + x.f2h, x.planned, x.late, x.missed]));
      const csv = "﻿" + rows.map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(";")).join("\r\n");
      const a = mk("a", { href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })), download: `servis-rapor-${repRows.range[0]}_${repRows.range[1]}.csv` }); document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
    }
    if (b.dataset.cm) act2("msg_del", { id: b.dataset.cm });
    if (b.dataset.logo) { logoTarget = b.dataset.logo; $("#bFile").click(); }
    if (b.dataset.logox) { const br = curBrand(); if (b.dataset.logox === "app") br.app = ""; else br[b.dataset.logox].logo = ""; act2("set", { k: "brand", v: br }).then(() => { st.kv.brand = br; fillSettings(); if (b.dataset.logox === "app") { S.appLogo = null; renderAppLogo(); save(); } }); }
    if (b.id === "bSave") { const br = curBrand(); br.title = $("#bTitle").value; br.c1.name = $("#bN1").value; br.c2.name = $("#bN2").value; act2("set", { k: "brand", v: br }, L("saved")).then(() => { st.kv.brand = br; fillSettings(); }); }
    if (b.id === "rSave") { const v = { grace: Math.max(0, +$("#rGrace").value || 0), remind: Math.max(1, +$("#rRem").value || 5) }; act2("set", { k: "settings", v }, L("saved")).then(() => { st.kv.settings = v; }); }
    if (b.id === "bkDl") writeBackup(true).catch(er => toast(er.message));
    if (b.id === "bkNow") writeBackup(false).then(() => toast(L("saved"))).catch(er => toast(er.message));
    if (b.id === "bkPick") { try { bkHandle = await window.showDirectoryPicker({ mode: "readwrite" }); await idbSet("bk", bkHandle); await writeBackup(false); toast(L("saved")); } catch (er) { if (er.name !== "AbortError") toast("Chrome/Edge gerekli: " + er.message); } bkInfo(); }
    if (b.id === "bkRestore") $("#bkFile").click();
  });
  document.addEventListener("change", async e => {
    const el = e.target;
    if (el.id === "lvDate") renderLive();
    if (el.id === "asDate") renderAssign();
    if (el.dataset && el.dataset.as === "add" && el.value) { act2("assign_bulk", { put: [{ date: $("#asDate").value, dir: +el.dataset.dir, slot: el.dataset.t, driverId: el.value }] }); }
    if (el.id === "dfFile" && el.files[0]) { try { dfPhoto = await resize(el.files[0], 160, true); $("#dfPrev").innerHTML = `<img src="${dfPhoto}" alt="">`; } catch (er) {} el.value = ""; }
    if (el.id === "bFile" && el.files[0] && logoTarget) {
      try {
        const img = await resize(el.files[0], logoTarget === "app" ? 256 : 400, false), br = curBrand();
        if (logoTarget === "app") { br.app = img; S.appLogo = { src: img }; renderAppLogo(); save(); } else br[logoTarget].logo = img;
        await act("set", { k: "brand", v: br }); st.kv.brand = br; fillSettings(); toast(L("saved"));
      } catch (er) { toast(er.message); }
      el.value = "";
    }
    if (el.id === "bkFile" && el.files[0]) {
      const f = el.files[0]; el.value = ""; if (!confirm(L("restoreAsk"))) return;
      try { const txt = await f.text(); const r = await fetch("/api/import", { method: "POST", headers: { Authorization: "Basic " + btoa(unescape(encodeURIComponent(creds.user + ":" + creds.pass))), "Content-Type": "application/json" }, body: txt }); if (!r.ok) throw new Error(await r.text()); toast(L("saved")); setTimeout(() => location.reload(), 800); } catch (er) { toast(er.message); }
    }
  });
  document.addEventListener("submit", async e => {
    if (e.target.id !== "chatF") return; e.preventDefault();
    const v = $("#chatI").value.trim(); if (!v) return; try { await act("say", { text: v }); $("#chatI").value = ""; } catch (er) { toast(er.message); }
  });
  document.addEventListener("click", e => { if (e.target.closest("[data-lang]")) setTimeout(() => { lv.querySelector("h2").textContent = L("lgTitle"); buildStatic(); fillSettings(); }, 0); });
  document.addEventListener("click", e => { if (e.target.closest("#tabs button")) setTimeout(renderAll2, 0); });

  function renderAll2() { if (!$("#lvTable")) return; renderLive(); renderAssign(); renderDrivers(); renderChat(); setConn(); }
  setInterval(() => { if (document.body.dataset.tab === "x-live") renderLive(); }, 15000);

  buildStatic();
  window.__live = { st, act };
})();
