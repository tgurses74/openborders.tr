// POST /api/signin — magic-link sign-in for already-registered (confirmed) users.
// Body: { email, lang }. Sends a one-time sign-in link via Resend.
// Does not reveal whether an email exists (anti-enumeration): always 200.

interface Env {
  DB: D1Database;
  RESEND_API_KEY: string;
  SITE_URL: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: Record<string, string>;
  try { body = await request.json(); } catch { return json({ error: "invalid_json" }, 400); }

  const email = (body.email || "").trim().toLowerCase();
  const lang = body.lang === "en" ? "en" : "tr";
  if (!EMAIL_RE.test(email)) return json({ error: "bad_email" }, 400);

  const user = await env.DB
    .prepare("SELECT id, status FROM users WHERE email = ?")
    .bind(email).first<{ id: number; status: string }>();

  // Only confirmed users get a link; respond 200 either way (no enumeration).
  if (user?.status === "confirmed") {
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    await env.DB
      .prepare("INSERT INTO signin_tokens (token, email, expires_at) VALUES (?, ?, ?)")
      .bind(token, email, expires).run();

    const link = `${env.SITE_URL}/api/verify-signin?token=${token}`;
    const subject = lang === "tr" ? "MaiA'ya giriş bağlantınız" : "Your MaiA sign-in link";
    const html = lang === "tr"
      ? `<p>Merhaba,</p><p>MaiA'ya giriş yapmak için aşağıdaki bağlantıya tıklayın:</p>
         <p><a href="${link}">MaiA'ya Giriş Yap</a></p>
         <p>Bu bağlantı 30 dakika geçerlidir. Talep etmediyseniz görmezden gelin.</p>`
      : `<p>Hello,</p><p>Click below to sign in to MaiA:</p>
         <p><a href="${link}">Sign in to MaiA</a></p>
         <p>This link is valid for 30 minutes. If you didn't request it, ignore this email.</p>`;

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "Openborders <no-reply@openborders.tr>", to: [email], subject, html }),
    });
    if (!r.ok) console.error("signin_email_failed", r.status, await r.text());
  }

  return json({ ok: true });
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}
