// POST /api/maia/start — called once after the intake form is submitted.
// Creates an enquiry row and, if the client is an athlete seeking a sports
// scholarship, emails okareefl@gmail.com immediately.
// Body: { intake }. Requires session. Returns { enquiry_id }.

import { readSession } from "../../_shared/session";

interface Env { DB: D1Database; RESEND_API_KEY: string; SESSION_SECRET: string; }
const ALERT_TO = "okareefl@gmail.com";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const sess = await readSession(request, env.SESSION_SECRET);
  if (!sess) return json({ error: "unauthorized" }, 401);
  let body: any;
  try { body = await request.json(); } catch { return json({ error: "invalid_json" }, 400); }
  const k = body.intake || {};

  const user = await env.DB.prepare("SELECT id, first_name, last_name, phone FROM users WHERE email = ?")
    .bind(sess.email).first<any>();

  const ins = await env.DB.prepare(
    `INSERT INTO enquiries (user_id, email, level, location, field, is_athlete, budget_amount, budget_currency)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(user?.id ?? null, sess.email, k.level ?? null, k.location ?? null, k.field ?? null,
         k.is_athlete ? 1 : 0, k.budget_amount ?? null, (k.budget_currency ?? null)).run();
  const enquiryId = ins.meta.last_row_id;

  if (k.is_athlete) {
    const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || sess.email;
    const html = `<h3>🏅 Sports scholarship request</h3>
      <p><b>${escape(name)}</b> (${escape(sess.email)}${user?.phone ? ", " + escape(user.phone) : ""})
      has indicated they are an elite athlete seeking a <b>sports scholarship</b>.</p>
      <p>Level: ${escape(k.level || "?")} · Location: ${escape(k.location || "any")} ·
         Field: ${escape(k.field || "n/a")} ·
         Budget: ${k.budget_amount ? escape(k.budget_amount + " " + k.budget_currency) : "n/a"}</p>
      <p>Follow up with athletic scholarship options.</p>`;
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "MaiA <no-reply@openborders.tr>", to: [ALERT_TO],
        subject: `🏅 Sports scholarship request — ${name}`, html }),
    });
    if (r.ok) await env.DB.prepare("UPDATE enquiries SET athlete_notified = 1 WHERE id = ?").bind(enquiryId).run();
    else console.error("athlete_alert_failed", r.status, await r.text());
  }

  return json({ ok: true, enquiry_id: enquiryId });
}

function escape(s: any): string {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}
