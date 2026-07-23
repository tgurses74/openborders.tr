// GET /api/maia/me — returns the signed-in user's email, or 401.
import { readSession } from "../../_shared/session";

interface Env { SESSION_SECRET: string; }

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const sess = await readSession(request, env.SESSION_SECRET);
  if (!sess) return new Response(JSON.stringify({ ok: false }), {
    status: 401, headers: { "Content-Type": "application/json" } });
  return new Response(JSON.stringify({ ok: true, email: sess.email }), {
    headers: { "Content-Type": "application/json" } });
};
