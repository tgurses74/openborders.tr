// GET /program/:id — on-demand program detail page.
// Rendered fresh from D1 on every request (nothing is stored on disk).
// Linked from MaiA's program cards. ?lang=tr|en controls language (default tr).

interface Env {
  DB: D1Database;
}

const COUNTRY: Record<string, { tr: string; en: string }> = {
  US: { tr: "ABD", en: "United States" }, GB: { tr: "Birleşik Krallık", en: "United Kingdom" },
  DE: { tr: "Almanya", en: "Germany" }, NL: { tr: "Hollanda", en: "Netherlands" },
  FR: { tr: "Fransa", en: "France" }, IT: { tr: "İtalya", en: "Italy" },
  ES: { tr: "İspanya", en: "Spain" }, SE: { tr: "İsveç", en: "Sweden" },
  FI: { tr: "Finlandiya", en: "Finland" }, DK: { tr: "Danimarka", en: "Denmark" },
  CH: { tr: "İsviçre", en: "Switzerland" }, AT: { tr: "Avusturya", en: "Austria" },
  BE: { tr: "Belçika", en: "Belgium" }, IE: { tr: "İrlanda", en: "Ireland" },
  PT: { tr: "Portekiz", en: "Portugal" }, PL: { tr: "Polonya", en: "Poland" },
  CZ: { tr: "Çekya", en: "Czechia" }, HU: { tr: "Macaristan", en: "Hungary" },
  MT: { tr: "Malta", en: "Malta" }, RS: { tr: "Sırbistan", en: "Serbia" },
  NO: { tr: "Norveç", en: "Norway" }, GR: { tr: "Yunanistan", en: "Greece" },
};
const LEVEL: Record<string, { tr: string; en: string }> = {
  undergraduate: { tr: "Lisans", en: "Undergraduate" },
  masters: { tr: "Yüksek Lisans", en: "Master's" },
  phd: { tr: "Doktora", en: "PhD" },
  highschool: { tr: "Lise", en: "High School" },
};

export const onRequestGet: PagesFunction<Env> = async ({ params, request, env }) => {
  const id = Number(Array.isArray(params.id) ? params.id[0] : params.id);
  const url = new URL(request.url);
  const lang = url.searchParams.get("lang") === "en" ? "en" : "tr";
  if (!Number.isFinite(id)) return new Response("Not found", { status: 404 });

  const row = await env.DB.prepare(`
    SELECT p.id, p.name, p.level, p.field, p.duration_years, p.language,
           p.tuition_intl, p.tuition_currency, p.description_en, p.description_tr,
           p.url, p.start_dates, p.requirements,
           u.name AS u_name, u.country_code, u.city, u.website, u.logo_url,
           u.languages AS u_languages, u.description_en AS u_desc_en, u.description_tr AS u_desc_tr,
           CASE WHEN p.tuition_intl IS NOT NULL AND fx.rate_per_eur IS NOT NULL
                THEN ROUND(p.tuition_intl / fx.rate_per_eur) END AS tuition_eur
    FROM programs p
    JOIN universities u ON u.id = p.university_id
    LEFT JOIN fx_rates fx ON fx.currency = p.tuition_currency
    WHERE p.id = ?`).bind(id).first<any>();

  if (!row) return new Response(page404(lang), { status: 404, headers: htmlHeaders() });

  return new Response(renderPage(row, lang), { headers: htmlHeaders() });
};

function renderPage(r: any, lang: "tr" | "en"): string {
  const t = (tr: string, en: string) => (lang === "tr" ? tr : en);
  const country = COUNTRY[r.country_code]?.[lang] || r.country_code || "";
  const level = LEVEL[r.level]?.[lang] || r.level || "";
  const place = [r.city, country].filter(Boolean).join(", ");
  const progDesc = lang === "tr" ? (r.description_tr || r.description_en) : (r.description_en || r.description_tr);
  const uniDesc = lang === "tr" ? (r.u_desc_tr || r.u_desc_en) : (r.u_desc_en || r.u_desc_tr);

  // Facts
  const facts: Array<[string, string]> = [];
  facts.push([t("Seviye", "Level"), level]);
  if (r.field) facts.push([t("Alan", "Field"), r.field]);
  if (r.duration_years) facts.push([t("Süre", "Duration"), `${r.duration_years} ${t("yıl", "years")}`]);
  if (r.language) facts.push([t("Eğitim Dili", "Language of study"), r.language]);
  if (r.tuition_intl) {
    const eur = r.tuition_eur ? ` · ~€${Number(r.tuition_eur).toLocaleString()}` : "";
    facts.push([t("Yıllık Öğrenim Ücreti", "Annual Tuition"),
      `${Number(r.tuition_intl).toLocaleString()} ${r.tuition_currency || ""}${eur}/${t("yıl", "yr")}`]);
  } else {
    facts.push([t("Öğrenim Ücreti", "Tuition"),
      t("Danışmanlık sırasında teyit edilecektir.", "To be confirmed during consultation.")]);
  }
  const startDates = parseList(r.start_dates);
  if (startDates.length) facts.push([t("Başlangıç Dönemleri", "Start dates"), startDates.join(", ")]);

  const reqRows = parseObj(r.requirements);

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(r.name)} — ${esc(r.u_name)} | Openborders</title>
<link rel="icon" type="image/png" href="/assets/img/openborders-logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Geist:wght@400;500;700&family=Oswald:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root{ --navy:#1f2a63; --cream:#f7efe7; --ink:#1c1c1c; --muted:#6a6a6a; --line:#e6ddd2; --card:#fff; }
  *{box-sizing:border-box}
  body{margin:0;font-family:Geist,system-ui,sans-serif;color:var(--ink);background:var(--cream);line-height:1.55}
  a{color:var(--navy)}
  .wrap{max-width:860px;margin:0 auto;padding:28px 22px 80px}
  .top{display:flex;align-items:center;justify-content:space-between;margin-bottom:34px}
  .top img{height:34px}
  .back{font-size:14px;text-decoration:none;border:1px solid var(--line);padding:8px 16px;border-radius:999px;background:#fff}
  .eyebrow{font-family:Oswald,sans-serif;letter-spacing:.12em;text-transform:uppercase;font-size:13px;color:var(--navy);font-weight:600}
  h1{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:clamp(28px,5vw,44px);line-height:1.1;margin:10px 0 6px}
  .uni{font-size:17px;color:var(--muted);margin:0 0 26px}
  .facts{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden;margin-bottom:26px}
  .facts div{display:flex;justify-content:space-between;gap:18px;padding:14px 20px;border-bottom:1px solid var(--line);font-size:15px}
  .facts div:last-child{border-bottom:0}
  .facts .k{color:var(--muted)}
  .facts .v{font-weight:600;text-align:right}
  h2{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:22px;margin:34px 0 10px}
  p.body{font-size:16px;color:#333;margin:0 0 14px;white-space:pre-line}
  .req{list-style:none;padding:0;margin:0}
  .req li{padding:8px 0;border-bottom:1px solid var(--line);font-size:15px}
  .req li b{color:var(--navy)}
  .links{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px}
  .links a{display:inline-block;background:var(--navy);color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:15px}
  .links a.ghost{background:#fff;color:var(--navy);border:1px solid var(--navy)}
  .note{font-size:13px;color:var(--muted);margin-top:30px}
</style>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <a href="/"><img src="/assets/img/openborders-logo-text.png" alt="Openborders"></a>
      <a class="back" href="/maia/">← ${t("MaiA'ya dön", "Back to MaiA")}</a>
    </div>

    <div class="eyebrow">${esc([r.u_name, country].filter(Boolean).join(" · "))}</div>
    <h1>${esc(r.name)}</h1>
    <p class="uni">${esc(place)}</p>

    <div class="facts">
      ${facts.map(([k, v]) => `<div><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>`).join("")}
    </div>

    ${progDesc ? `<h2>${t("Program Hakkında", "About this program")}</h2><p class="body">${esc(progDesc)}</p>` : ""}

    ${reqRows.length ? `<h2>${t("Başvuru Koşulları", "Requirements")}</h2>
      <ul class="req">${reqRows.map(([k, v]) => `<li><b>${esc(k)}:</b> ${esc(v)}</li>`).join("")}</ul>` : ""}

    ${uniDesc ? `<h2>${t("Üniversite Hakkında", "About the university")}</h2><p class="body">${esc(uniDesc)}</p>` : ""}

    <div class="links">
      ${r.website ? `<a href="${esc(r.website)}" target="_blank" rel="noopener nofollow">${t("Üniversite web sitesi", "University website")} ↗</a>` : ""}
      ${r.url ? `<a class="ghost" href="${esc(r.url)}" target="_blank" rel="noopener nofollow">${t("Program sayfası", "Program page")} ↗</a>` : ""}
    </div>

    <p class="note">${t(
      "Bilgiler kaynaklardan otomatik derlenmiştir; başvuru öncesi danışmanınızla teyit edin.",
      "Details are compiled automatically from public sources; confirm with your consultant before applying.")}</p>
  </div>
</body>
</html>`;
}

function page404(lang: "tr" | "en"): string {
  const msg = lang === "tr" ? "Program bulunamadı." : "Program not found.";
  return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>${msg}</title>
<style>body{font-family:system-ui,sans-serif;background:#f7efe7;color:#1c1c1c;display:grid;place-items:center;height:100vh;margin:0}
a{color:#1f2a63}</style></head><body><div style="text-align:center">
<p style="font-size:20px">${msg}</p><a href="/maia/">← MaiA</a></div></body></html>`;
}

function parseList(s: any): string[] {
  if (!s) return [];
  try { const a = JSON.parse(s); return Array.isArray(a) ? a.map(String).filter(Boolean) : []; }
  catch { return String(s).split(/[;,]/).map((x) => x.trim()).filter(Boolean); }
}
function parseObj(s: any): Array<[string, string]> {
  if (!s) return [];
  try {
    const o = JSON.parse(s);
    if (o && typeof o === "object" && !Array.isArray(o)) {
      return Object.entries(o).filter(([, v]) => v != null && v !== "").map(([k, v]) => [k, String(v)]);
    }
  } catch { /* ignore */ }
  return [];
}
function htmlHeaders(): HeadersInit {
  return { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=300" };
}
function esc(s: any): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
