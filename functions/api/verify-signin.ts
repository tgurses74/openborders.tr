// GET /api/verify-signin?token=… — consumes a magic-link token, sets the
// session cookie, and redirects to the MaiA page.

import { createSession, sessionCookie } from "../_shared/session";

interface Env {
  DB: D1Database;
  SESSION_SECRET: string;
  SITE_URL: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const token = new URL(request.url).searchParams.get("token") || "";
  const fail = (reason: string) =>
    Response.redirect(`${env.SITE_URL}/giris/?err=${reason}`, 302);

  if (!token) return fail("missing");

  const row = await env.DB
    .prepare("SELECT email, expires_at, used FROM signin_tokens WHERE token = ?")
    .bind(token).first<{ email: string; expires_at: string; used: number }>();

  if (!row || row.used) return fail("invalid");
  if (new Date(row.expires_at) < new Date()) return fail("expired");

  await env.DB.prepare("UPDATE signin_tokens SET used = 1 WHERE token = ?").bind(token).run();

  const session = await createSession(row.email, env.SESSION_SECRET);
  return new Response(null, {
    status: 302,
    headers: { Location: `${env.SITE_URL}/maia/`, "Set-Cookie": sessionCookie(session) },
  });
};
