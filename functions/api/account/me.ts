// GET /api/account/me — the signed-in client's profile, subscription tier,
// and their saved (shortlisted) programs. Requires a valid session cookie.

import { readSession } from "../../_shared/session";

interface Env {
  DB: D1Database;
  SESSION_SECRET: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const sess = await readSession(request, env.SESSION_SECRET);
  if (!sess) return json({ error: "unauthorized" }, 401);

  const user = await env.DB.prepare(
    "SELECT email, first_name, last_name, subscription_tier, created_at FROM users WHERE email = ?"
  ).bind(sess.email).first<any>();
  if (!user) return json({ error: "not_found" }, 404);

  const { results } = await env.DB.prepare(`
    SELECT p.id, p.name, p.level, p.duration_years, p.language,
           p.tuition_intl, p.tuition_currency,
           CASE WHEN p.tuition_intl IS NOT NULL AND fx.rate_per_eur IS NOT NULL
                THEN ROUND(p.tuition_intl / fx.rate_per_eur) END AS tuition_eur,
           u.name AS university, u.country_code, u.city, sp.created_at AS saved_at
    FROM saved_programs sp
    JOIN programs p ON p.id = sp.program_id
    JOIN universities u ON u.id = p.university_id
    LEFT JOIN fx_rates fx ON fx.currency = p.tuition_currency
    WHERE sp.user_email = ?
    ORDER BY sp.created_at DESC`).bind(sess.email).all();

  return json({
    ok: true,
    email: user.email,
    name: [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email,
    subscription_tier: user.subscription_tier || "free",
    member_since: user.created_at,
    saved: results || [],
  });
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
