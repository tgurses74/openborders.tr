// POST /api/register — step 1 of double opt-in.
// Bindings needed on the Pages project: DB (D1), RESEND_API_KEY, SITE_URL.

interface Env {
  DB: D1Database;
  RESEND_API_KEY: string;
  SITE_URL: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const email = (body.email || "").trim().toLowerCase();
  const firstName = (body.name || "").trim().slice(0, 80);
  const lastName = (body.surname || "").trim().slice(0, 80);
  const phone = (body.phone || "").trim().slice(0, 40);
  const interest = (body.interest || "").trim().slice(0, 120);
  const lang = body.lang === "en" ? "en" : "tr";

  if (!EMAIL_RE.test(email) || !firstName || !lastName) {
    return json({ error: "missing_fields" }, 400);
  }

  const existing = await env.DB
    .prepare("SELECT id, status FROM users WHERE email = ?")
    .bind(email)
    .first<{ id: number; status: string }>();

  if (existing?.status === "confirmed") {
    // Already opted in — nothing to do, don't leak more than necessary.
    return json({ ok: true, state: "already_confirmed" });
  }

  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 48 * 3600 * 1000).toISOString();

  await env.DB
    .prepare(
      `INSERT INTO users (email, first_name, last_name, phone, interest, lang,
                          status, confirm_token, token_expires_at, consent_text)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, 'KVKK consent checkbox v1')
       ON CONFLICT(email) DO UPDATE SET
         first_name = excluded.first_name,
         last_name  = excluded.last_name,
         phone      = excluded.phone,
         interest   = excluded.interest,
         lang       = excluded.lang,
         confirm_token = excluded.confirm_token,
         token_expires_at = excluded.token_expires_at`
    )
    .bind(email, firstName, lastName, phone, interest, lang, token, expires)
    .run();

  const confirmUrl = `${env.SITE_URL}/api/confirm?token=${token}`;
  const subject =
    lang === "tr"
      ? "Openborders kaydınızı onaylayın"
      : "Confirm your Openborders registration";
  const html =
    lang === "tr"
      ? `<p>Merhaba ${escapeHtml(firstName)},</p>
         <p>Openborders kaydınızı tamamlamak için lütfen aşağıdaki bağlantıya tıklayın:</p>
         <p><a href="${confirmUrl}">Kaydımı Onayla</a></p>
         <p>Bu kaydı siz başlatmadıysanız bu e-postayı yok sayabilirsiniz. Bağlantı 48 saat geçerlidir.</p>`
      : `<p>Hello ${escapeHtml(firstName)},</p>
         <p>Please confirm your Openborders registration by clicking the link below:</p>
         <p><a href="${confirmUrl}">Confirm my registration</a></p>
         <p>If you didn't request this, just ignore this email. The link is valid for 48 hours.</p>`;

  const resend = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Openborders <no-reply@openborders.tr>",
      to: [email],
      subject,
      html,
    }),
  });

  if (!resend.ok) {
    console.error("resend_failed", resend.status, await resend.text());
    return json({ error: "email_send_failed" }, 502);
  }

  return json({ ok: true, state: "confirmation_sent" });
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );
}
