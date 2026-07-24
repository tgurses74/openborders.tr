// POST /api/maia/finish — ends a MaiA session.
// Body: { intake, messages, enquiry_id, lang }. Requires session.
// 1) Generates a summary from the transcript (DeepSeek).
// 2) Emails it to okareefl@gmail.com and to the client (Resend).
// 3) Logs a note + creates a "call in 3 business days" task in HubSpot.
// Each side-effect is best-effort; failures are logged, not fatal.

import { readSession } from "../../_shared/session";

interface Env {
  DB: D1Database;
  DEEPSEEK_API_KEY: string;
  RESEND_API_KEY: string;
  HUBSPOT_TOKEN: string;
  SESSION_SECRET: string;
}
const ALERT_TO = "okareefl@gmail.com";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const sess = await readSession(request, env.SESSION_SECRET);
  if (!sess) return json({ error: "unauthorized" }, 401);
  let body: any;
  try { body = await request.json(); } catch { return json({ error: "invalid_json" }, 400); }
  const lang = body.lang === "en" ? "en" : "tr";
  const intake = body.intake || {};
  const messages = Array.isArray(body.messages) ? body.messages : [];

  const user = await env.DB.prepare("SELECT id, first_name, last_name, phone FROM users WHERE email = ?")
    .bind(sess.email).first<any>();
  const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || sess.email;

  // 1) Summary via DeepSeek.
  const summary = await makeSummary(env, lang, name, intake, messages);

  await env.DB.prepare(
    `UPDATE enquiries SET transcript = ?, summary = ?, completed_at = datetime('now')
     WHERE id = ?`
  ).bind(JSON.stringify(messages).slice(0, 90000), summary, body.enquiry_id ?? -1).run().catch(() => {});

  const intakeLine = `${intake.level || "?"} · ${intake.location || "any"} · ${intake.field || "n/a"} · ` +
    (intake.budget_amount ? `${intake.budget_amount} ${intake.budget_currency}` : "budget n/a") +
    (intake.is_athlete ? " · 🏅 sports scholarship" : "");

  // 2) Emails (best-effort, in parallel).
  const clientHtml = `<p>${lang === "tr" ? "Merhaba" : "Hello"} ${escape(name)},</p>
    <p>${lang === "tr" ? "MaiA ile görüşmenizin özeti aşağıdadır. Danışmanlarımız kısa süre içinde sizinle iletişime geçecektir." : "Here is a summary of your MaiA session. Our consultants will be in touch shortly."}</p>
    <hr>${toHtml(summary)}<hr>
    <p>Openborders</p>`;
  const internalHtml = `<h3>MaiA enquiry — ${escape(name)}</h3>
    <p>${escape(sess.email)}${user?.phone ? " · " + escape(user.phone) : ""}</p>
    <p><b>${escape(intakeLine)}</b></p><hr>${toHtml(summary)}`;

  const sends = await Promise.allSettled([
    sendEmail(env, ALERT_TO, `MaiA enquiry — ${name}`, internalHtml),
    sendEmail(env, sess.email, lang === "tr" ? "Openborders — Görüşme özetiniz" : "Openborders — Your session summary", clientHtml),
  ]);
  const emailsOk = sends.every((s) => s.status === "fulfilled" && s.value);
  if (emailsOk) await env.DB.prepare("UPDATE enquiries SET summary_sent = 1 WHERE id = ?").bind(body.enquiry_id ?? -1).run().catch(() => {});

  // 3) HubSpot: note (log) + task (call in 3 business days).
  const hs = await logToHubspot(env, sess.email, name, intakeLine, summary);
  if (hs.note && hs.task) await env.DB.prepare("UPDATE enquiries SET hubspot_logged = 1 WHERE id = ?").bind(body.enquiry_id ?? -1).run().catch(() => {});

  return json({ ok: true, summary, delivered: { emails: emailsOk, hubspot: hs } });
};

async function makeSummary(env: Env, lang: string, name: string, intake: any, messages: any[]): Promise<string> {
  const sys = lang === "tr"
    ? "Bir eğitim danışmanlığı görüşmesini özetle. Kısa ve net ol. Şunları içer: öğrencinin hedefleri (seviye, ülke, bölüm, bütçe, sporcu bursu durumu), MaiA'nın önerdiği başlıca programlar ve bir sonraki adımlar. Düz metin, madde işaretleri kullanabilirsin."
    : "Summarise an education-consulting conversation. Be concise. Include: the student's goals (level, country, field, budget, sports-scholarship status), the main programs MaiA suggested, and next steps. Plain text; bullet points are fine.";
  const convo = messages.map((m: any) => `${m.role}: ${typeof m.content === "string" ? m.content : ""}`).join("\n").slice(0, 12000);
  try {
    const r = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "deepseek-chat", temperature: 0.2, messages: [
        { role: "system", content: sys },
        { role: "user", content: `Client: ${name}\nIntake: ${JSON.stringify(intake)}\n\nTranscript:\n${convo}` },
      ] }),
    });
    if (r.ok) return (await r.json<any>()).choices?.[0]?.message?.content || "(summary unavailable)";
  } catch (e) { console.error("summary", e); }
  return "(summary unavailable)";
}

async function sendEmail(env: Env, to: string, subject: string, html: string): Promise<boolean> {
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "MaiA <no-reply@openborders.tr>", to: [to], subject, html }),
    });
    if (!r.ok) console.error("resend", to, r.status, await r.text());
    return r.ok;
  } catch (e) { console.error("resend_err", e); return false; }
}

// HUBSPOT_DEFINED association type IDs (engagement → contact).
const ASSOC_NOTE_TO_CONTACT = 202;
const ASSOC_TASK_TO_CONTACT = 204;

async function logToHubspot(env: Env, email: string, name: string, intakeLine: string, summary: string): Promise<{ note: boolean; task: boolean; detail?: string }> {
  const H = { Authorization: `Bearer ${env.HUBSPOT_TOKEN}`, "Content-Type": "application/json" };
  try {
    // find the contact id by email
    const search = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/search", {
      method: "POST", headers: H,
      body: JSON.stringify({ filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: email }] }], properties: ["email"], limit: 1 }),
    });
    if (!search.ok) { const d = await search.text(); console.error("hs_search", search.status, d); return { note: false, task: false, detail: `search ${search.status}` }; }
    const contactId = (await search.json<any>()).results?.[0]?.id;
    if (!contactId) { console.error("hs_no_contact", email); return { note: false, task: false, detail: "no_contact" }; }

    const now = Date.now();

    // Create each engagement AND link it to the contact in a single call, using
    // HubSpot's inline `associations` with the documented HUBSPOT_DEFINED type
    // IDs. Atomic — no fragile second "associate" request to fail on its own.
    async function createAssociated(objType: string, properties: any, typeId: number): Promise<{ ok: boolean; detail: string }> {
      const r = await fetch(`https://api.hubapi.com/crm/v3/objects/${objType}`, {
        method: "POST", headers: H,
        body: JSON.stringify({
          properties,
          associations: [{
            to: { id: contactId },
            types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: typeId }],
          }],
        }),
      });
      if (r.ok) return { ok: true, detail: `${objType} 201` };
      const d = await r.text();
      console.error(`hs_${objType}`, r.status, d);
      return { ok: false, detail: `${objType} ${r.status}: ${d.slice(0, 300)}` };
    }

    const noteRes = await createAssociated("notes", {
      hs_note_body: `<b>MaiA enquiry</b><br>${escape(intakeLine)}<br><br>${toHtml(summary)}`,
      hs_timestamp: now,
    }, ASSOC_NOTE_TO_CONTACT);

    const taskRes = await createAssociated("tasks", {
      hs_task_subject: `Call ${name} — MaiA enquiry follow-up`,
      hs_task_body: intakeLine,
      hs_task_status: "NOT_STARTED",
      hs_task_priority: "HIGH",
      hs_task_type: "CALL",
      hs_timestamp: businessDaysFromNow(3),
    }, ASSOC_TASK_TO_CONTACT);

    return { note: noteRes.ok, task: taskRes.ok, detail: `${noteRes.detail} | ${taskRes.detail}` };
  } catch (e) { console.error("hs_err", e); return { note: false, task: false, detail: String(e) }; }
}

function businessDaysFromNow(n: number): number {
  const d = new Date();
  let added = 0;
  while (added < n) { d.setDate(d.getDate() + 1); const day = d.getDay(); if (day !== 0 && day !== 6) added++; }
  d.setHours(9, 0, 0, 0);
  return d.getTime();
}
function toHtml(s: string): string { return escape(s).replace(/\n/g, "<br>"); }
function escape(s: any): string {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}
