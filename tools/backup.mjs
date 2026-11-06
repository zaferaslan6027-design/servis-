// Cloudflare'deki tüm veriyi bu bilgisayardaki bir klasöre yedekler.
// Kullanım (Node.js 18+):
//   Windows:  set SERVIS_PASS=sifreniz && node tools/backup.mjs https://servis-saatleri.KULLANICI.workers.dev admin C:\ServisYedek
//   Mac/Linux: SERVIS_PASS=sifreniz node tools/backup.mjs https://... admin ~/ServisYedek
// Windows "Görev Zamanlayıcı" ile günde bir kez çalıştırabilirsiniz.
import fs from "node:fs";
import path from "node:path";

const [, , base, user, dir] = process.argv;
const pass = process.env.SERVIS_PASS;
if (!base || !user || !dir || !pass) {
  console.error("Kullanım: SERVIS_PASS=sifre node tools/backup.mjs <adres> <kullanici> <klasor>");
  process.exit(1);
}
const res = await fetch(base.replace(/\/$/, "") + "/api/export", {
  headers: { Authorization: "Basic " + Buffer.from(user + ":" + pass).toString("base64") },
});
if (!res.ok) { console.error("Yedek alınamadı: HTTP " + res.status); process.exit(1); }
const txt = await res.text();
JSON.parse(txt); // bozuk veri kaydetme
fs.mkdirSync(dir, { recursive: true });
const day = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(dir, "servis-yedek-" + day + ".json"), txt);
fs.writeFileSync(path.join(dir, "servis-yedek-son.json"), txt);
console.log("Yedek yazıldı:", path.join(dir, "servis-yedek-" + day + ".json"), "(" + Math.round(txt.length / 1024) + " KB)");
