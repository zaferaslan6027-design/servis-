/* Yönetici ve şoför uygulamasının ortak hesapları (İstanbul saati, UTC+3) */
window.SV = (function () {
  const OFFSET = 3 * 3600 * 1000;
  const pad = n => String(n).padStart(2, "0");
  const today = () => new Date(Date.now() + OFFSET).toISOString().slice(0, 10);
  const addDays = (d, n) => { const x = new Date(d + "T12:00:00Z"); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
  const dow = d => (new Date(d + "T12:00:00Z").getUTCDay() + 6) % 7; // Pazartesi=0
  const weekStart = d => addDays(d, -dow(d));
  const slotMs = (date, t) => Date.parse(date + "T" + t + ":00+03:00");
  const hhmm = ms => { const d = new Date(ms + OFFSET); return pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()); };

  function profFor(pub, date) {
    const ps = (pub && pub.profiles) || [];
    return ps.find(p => p.from && p.from <= date && date <= (p.to || p.from)) || ps[pub && pub.cur || 0] || null;
  }
  function inRange(pub, date) {
    const ps = (pub && pub.profiles) || [];
    return ps.some(p => p.from && p.from <= date && date <= (p.to || p.from));
  }
  function slotsFor(pub, date) {
    const p = profFor(pub, date), out = [];
    if (!p) return out;
    [0, 1].forEach(dir => ((p.dirs && p.dirs[dir]) || []).forEach(x => out.push({ dir, t: x.t, n: x.n || "", note: x.note || "" })));
    out.sort((a, b) => (a.t < b.t ? -1 : a.t > b.t ? 1 : a.dir - b.dir));
    return out;
  }
  // ok: zamanında, late: geç, missed: yapılmadı, soon: yaklaşıyor, wait: bekliyor
  function status(date, t, trip, now, grace) {
    const s = slotMs(date, t), g = (grace == null ? 10 : grace) * 60000;
    if (trip) return trip.at > s + g ? "late" : "ok";
    return now > s + g ? "missed" : now >= s - 5 * 60000 ? "soon" : "wait";
  }
  function fmtDate(d, lang, opt) {
    return new Date(d + "T12:00:00Z").toLocaleDateString(lang === "en" ? "en-GB" : "tr-TR", Object.assign({ timeZone: "UTC" }, opt || { day: "numeric", month: "long", year: "numeric" }));
  }
  function dateLines(p, lang) {
    if (!p) return [];
    const ct = ((p.dateCustom && p.dateCustom[lang]) || "").trim();
    if (ct) return ct.split(/\s*\/\s*|\n/).filter(Boolean);
    if (!p.from) return [];
    const two = p.to && p.to !== p.from;
    const f = d => fmtDate(d, lang, { day: "numeric", month: "short" }).replace(/\./g, "").toLocaleUpperCase(lang === "en" ? "en-GB" : "tr-TR");
    const out = [two ? f(p.from) + " - " + f(p.to) : f(p.from)];
    const y1 = p.from.slice(0, 4), y2 = (p.to || p.from).slice(0, 4);
    out.push(y1 === y2 ? y1 : y1 + " - " + y2);
    if (p.weeks && two) {
      const days = Math.round((Date.parse(p.to + "T12:00:00Z") - Date.parse(p.from + "T12:00:00Z")) / 864e5) + 1, w = Math.max(1, Math.ceil(days / 7));
      out.push(lang === "tr" ? w + " HAFTA" : w + (w === 1 ? " WEEK" : " WEEKS"));
    }
    return out;
  }
  // Rota: harita görselinin piksel koordinatları (otelden spor tesisine)
  const ROUTE = [[372,578],[372,552],[480,553],[590,550],[600,538],[588,500],[574,440],[559,380],[553,320],[556,260],[563,200],[571,152],[577,140],[547,152],[490,158],[447,148],[441,110],[437,72],[395,75]];
  return { today, addDays, dow, weekStart, slotMs, hhmm, profFor, inRange, slotsFor, status, fmtDate, dateLines, pad, ROUTE };
})();
