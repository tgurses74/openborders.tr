// POST /api/account/save — add or remove a program from the client's
// shortlist. Body: { program_id: number, action: "save" | "remove" }.
// Requires a valid session cookie. Returns { ok, saved: boolean, count }.

import { readSession } from "../../_shared/session";

interface Env {
  DB: D1Database;
  SESSION_SECRET: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const sess = await readSession(request, env.SESSION_SECRET);
  if (!sess) return json({ error: "unauthorized" }, 401);

  let body: any;
  try { body = await request.json(); } catch { return json({ error: "invalid_json" }, 400); }
  const programId = Number(body.program_id);
  const action = body.action === "remove" ? "remove" : "save";
  if (!Number.isFinite(programId)) return json({ error: "bad_program_id" }, 400);

  if (action === "save") {
    // only allow saving a program that actually exists
    const exists = await env.DB.prepare("SELECT 1 FROM programs WHERE id = ?").bind(programId).first();
    if (!exists) return json({ error: "no_such_program" }, 404);
    await env.DB.prepare(
      "INSERT OR IGNORE INTO saved_programs (user_email, program_id) VALUES (?, ?)"
    ).bind(sess.email, programId).run();
  } else {
    await env.DB.prepare(
      "DELETE FROM saved_programs WHERE user_email = ? AND program_id = ?"
    ).bind(sess.email, programId).run();
  }

  const count = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM saved_programs WHERE user_email = ?"
  ).bind(sess.email).first<{ n: number }>();

  return json({ ok: true, saved: action === "save", count: count?.n ?? 0 });
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
