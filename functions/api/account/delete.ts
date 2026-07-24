// POST /api/account/delete — the signed-in client erases their own account
// and all data we hold in D1 (KVKK right to erasure). Clears the session.
// Requires a valid session cookie. The HubSpot CRM record is intentionally
// NOT touched here — that retention/erasure is a separate business decision.

import { readSession } from "../../_shared/session";

// Expire the session cookie immediately (Max-Age=0), mirroring its flags.
const EXPIRE_COOKIE = "ob_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0";

interface Env {
  DB: D1Database;
  SESSION_SECRET: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const sess = await readSession(request, env.SESSION_SECRET);
  if (!sess) return json({ error: "unauthorized" }, 401);

  const email = sess.email;
  // Remove all local data tied to this account.
  await env.DB.batch([
    env.DB.prepare("DELETE FROM saved_programs WHERE user_email = ?").bind(email),
    env.DB.prepare("DELETE FROM signin_tokens WHERE email = ?").bind(email),
    env.DB.prepare("DELETE FROM enquiries WHERE email = ?").bind(email),
    env.DB.prepare("DELETE FROM users WHERE email = ?").bind(email),
  ]);

  // Invalidate the session cookie on the way out.
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Set-Cookie": EXPIRE_COOKIE,
    },
  });
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
