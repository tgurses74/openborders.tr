// POST /api/maia/chat — one conversational turn with MaiA.
// Body: { messages: [{role, content}], intake: {level, countries, field,
//         budget_amount, budget_currency, is_athlete}, lang }
// Requires a valid session cookie. Runs DeepSeek with a search_programs tool
// backed by D1; returns the assistant's reply (+ any programs shown).

import { readSession } from "../../_shared/session";

interface Env {
  DB: D1Database;
  DEEPSEEK_API_KEY: string;
  SESSION_SECRET: string;
}

const DS_URL = "https://api.deepseek.com/chat/completions";

const LEVEL_MAP: Record<string, string[]> = {
  highschool: ["highschool"],
  university: ["undergraduate"],
  undergraduate: ["undergraduate"],
  postgraduate: ["masters", "phd"],
};

const TOOLS = [{
  type: "function",
  function: {
    name: "search_programs",
    description: "Search the Openborders database of university/school programs. Returns matching programs with tuition converted to EUR for comparison against the client's budget.",
    parameters: {
      type: "object",
      properties: {
        countries: { type: "array", items: { type: "string" }, description: "ISO 3166-1 alpha-2 country codes to include, e.g. ['DE','NL']. Expand regions yourself: 'Europe' -> EU codes, 'US' -> ['US']." },
        field: { type: "string", description: "Keyword for the field/major, e.g. 'computer', 'business', 'medicine'. Omit for high school." },
        max_results: { type: "integer", description: "How many to return (default 8, max 15)." },
      },
    },
  },
}];

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const sess = await readSession(request, env.SESSION_SECRET);
  if (!sess) return json({ error: "unauthorized" }, 401);

  let body: any;
  try { body = await request.json(); } catch { return json({ error: "invalid_json" }, 400); }
  const intake = body.intake || {};
  const lang = body.lang === "en" ? "en" : "tr";

  // Budget → EUR (once), using the cached fx_rates table.
  let budgetEur: number | null = null;
  if (intake.budget_amount && intake.budget_currency) {
    const fx = await env.DB.prepare("SELECT rate_per_eur FROM fx_rates WHERE currency = ?")
      .bind(String(intake.budget_currency).toUpperCase()).first<{ rate_per_eur: number }>();
    if (fx?.rate_per_eur) budgetEur = Number(intake.budget_amount) / fx.rate_per_eur;
  }

  const levels = LEVEL_MAP[String(intake.level || "university").toLowerCase()] || ["undergraduate"];
  const sys = systemPrompt(lang, intake, budgetEur);
  const messages = [{ role: "system", content: sys }, ...(body.messages || [])];

  let shownPrograms: any[] = [];

  // Tool loop (max 3 rounds to stay cheap).
  for (let round = 0; round < 3; round++) {
    const res = await fetch(DS_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "deepseek-chat", temperature: 0.4, messages, tools: TOOLS }),
    });
    if (!res.ok) { console.error("deepseek", res.status, await res.text()); return json({ error: "ai_unavailable" }, 502); }
    const data = await res.json<any>();
    const msg = data.choices?.[0]?.message;
    if (!msg) return json({ error: "ai_empty" }, 502);

    if (msg.tool_calls?.length) {
      messages.push(msg);
      for (const call of msg.tool_calls) {
        let args: any = {};
        try { args = JSON.parse(call.function.arguments || "{}"); } catch { /* ignore */ }
        const rows = await searchPrograms(env.DB, levels, args, budgetEur);
        shownPrograms = shownPrograms.concat(rows);
        messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(rows) });
      }
      continue; // let the model read tool output
    }

    return json({ reply: msg.content || "", programs: shownPrograms.slice(0, 15) });
  }
  return json({ reply: lang === "tr" ? "Biraz daha detay verebilir misiniz?" : "Could you give me a little more detail?", programs: shownPrograms.slice(0, 15) });
};

async function searchPrograms(DB: D1Database, levels: string[], args: any, budgetEur: number | null) {
  const where: string[] = ["p.status IN ('extracted','published')"];
  const binds: any[] = [];
  where.push(`p.level IN (${levels.map(() => "?").join(",")})`);
  binds.push(...levels);

  const countries = Array.isArray(args.countries) ? args.countries.map((c: string) => c.toUpperCase()).slice(0, 30) : [];
  if (countries.length) { where.push(`u.country_code IN (${countries.map(() => "?").join(",")})`); binds.push(...countries); }
  if (args.field) { where.push("(p.field LIKE ? OR p.name LIKE ?)"); binds.push(`%${args.field}%`, `%${args.field}%`); }

  const limit = Math.min(Math.max(Number(args.max_results) || 8, 1), 15);
  const sql = `
    SELECT p.id, p.name, p.level, p.field, p.duration_years, p.language,
           p.tuition_intl, p.tuition_currency,
           CASE WHEN p.tuition_intl IS NOT NULL AND fx.rate_per_eur IS NOT NULL
                THEN ROUND(p.tuition_intl / fx.rate_per_eur) END AS tuition_eur,
           u.name AS university, u.country_code, u.city, u.website, p.url
    FROM programs p
    JOIN universities u ON u.id = p.university_id
    LEFT JOIN fx_rates fx ON fx.currency = p.tuition_currency
    WHERE ${where.join(" AND ")}
      ${budgetEur ? "AND (p.tuition_intl IS NULL OR (fx.rate_per_eur IS NOT NULL AND p.tuition_intl / fx.rate_per_eur <= ?))" : ""}
    ORDER BY (tuition_eur IS NULL), tuition_eur ASC
    LIMIT ?`;
  if (budgetEur) binds.push(budgetEur * 1.05); // small tolerance
  binds.push(limit);

  const { results } = await DB.prepare(sql).bind(...binds).all();
  return results || [];
}

function systemPrompt(lang: string, intake: any, budgetEur: number | null): string {
  const langLine = lang === "tr"
    ? "Yanıtlarını her zaman Türkçe ver."
    : "Always reply in English.";
  return `You are MaiA, Openborders' warm, concise AI education consultant.
${langLine}
The client has completed an intake form:
- Level: ${intake.level || "?"}
- Location preference: ${intake.location || "any"}
- Field/major: ${intake.field || "n/a"}
- Athlete / sports scholarship: ${intake.is_athlete ? "yes" : "no"}
- Budget: ${intake.budget_amount ? `${intake.budget_amount} ${intake.budget_currency} (~€${budgetEur ? Math.round(budgetEur) : "?"}/year)` : "not specified"}

Use the search_programs tool to find real matches from our database before recommending anything — never invent programs. When you show results, group them clearly, give university, country, duration, teaching language and tuition (state the original currency and the EUR equivalent). If a program has no tuition listed, say tuition will be confirmed during consultation. Compare options against the client's budget honestly. Invite the client to refine (different country, cheaper options, another field) and search again. Keep replies focused and friendly; we always pursue academic scholarships, and note that. When the client seems satisfied, suggest they click "Finish & get my summary".`;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}
