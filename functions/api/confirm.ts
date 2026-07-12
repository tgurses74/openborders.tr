// GET /api/confirm?token=… — step 2 of double opt-in.
// Confirms the user, then best-effort syncs the contact to HubSpot.
// Bindings: DB (D1), HUBSPOT_TOKEN (private app token), SITE_URL.

interface Env {
  DB: D1Database;
  HUBSPOT_TOKEN: string;
  SITE_URL: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  const token = new URL(request.url).searchParams.get("token") || "";
  const fail = (reason: string) =>
    Response.redirect(`${env.SITE_URL}/kayit-onay/?err=${reason}`, 302);

  if (!token) return fail("missing");

  const user = await env.DB
    .prepare(
      `SELECT id, email, first_name, last_name, phone, interest, status, token_expires_at
       FROM users WHERE confirm_token = ?`
    )
    .bind(token)
    .first<Record<string, string>>();

  if (!user) return fail("invalid");
  if (user.status !== "confirmed" && new Date(user.token_expires_at) < new Date()) {
    return fail("expired");
  }

  if (user.status !== "confirmed") {
    await env.DB
      .prepare(
        `UPDATE users SET status='confirmed', confirmed_at=datetime('now'),
                          confirm_token=NULL WHERE id = ?`
      )
      .bind(user.id)
      .run();
    // Sync to HubSpot without blocking the redirect; retried nightly if it fails.
    waitUntil(syncHubspot(env, user));
  }

  return Response.redirect(`${env.SITE_URL}/kayit-onay/?ok=1`, 302);
};

async function syncHubspot(env: Env, user: Record<string, string>): Promise<void> {
  try {
    const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.HUBSPOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          email: user.email,
          firstname: user.first_name,
          lastname: user.last_name,
          phone: user.phone,
          openborders_interest: user.interest,
          lifecyclestage: "lead",
        },
      }),
    });
    // 409 = contact already exists — treat as synced.
    if (res.ok || res.status === 409) {
      const id = res.ok ? (await res.json<{ id: string }>()).id : null;
      await env.DB
        .prepare("UPDATE users SET hubspot_synced=1, hubspot_contact_id=? WHERE id=?")
        .bind(id, user.id)
        .run();
    } else {
      console.error("hubspot_failed", res.status, await res.text());
    }
  } catch (e) {
    console.error("hubspot_error", e);
  }
}
