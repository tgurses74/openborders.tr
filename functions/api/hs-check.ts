// TEMPORARY diagnostic — reports HubSpot token scopes, engagement access,
// and custom objects. Remove after we've configured MaiA's HubSpot logging.

interface Env { HUBSPOT_TOKEN: string; }

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const H = { Authorization: `Bearer ${env.HUBSPOT_TOKEN}` };
  const out: Record<string, unknown> = {};

  // 1) token scopes (works for private-app tokens)
  try {
    const r = await fetch(`https://api.hubapi.com/oauth/v1/access-tokens/${env.HUBSPOT_TOKEN}`);
    if (r.ok) { const d = await r.json<any>(); out.scopes = d.scopes; out.hub_id = d.hub_id; }
    else out.token_info = `status ${r.status}`;
  } catch (e) { out.token_info_err = String(e); }

  // 2) empirical access checks (status codes)
  async function probe(name: string, url: string) {
    try { const r = await fetch(url, { headers: H }); out[name] = r.status; }
    catch (e) { out[name] = `err ${String(e)}`; }
  }
  await probe("notes_read", "https://api.hubapi.com/crm/v3/objects/notes?limit=1");
  await probe("tasks_read", "https://api.hubapi.com/crm/v3/objects/tasks?limit=1");
  await probe("contacts_read", "https://api.hubapi.com/crm/v3/objects/contacts?limit=1");

  // 3) custom object schemas
  try {
    const r = await fetch("https://api.hubapi.com/crm/v3/schemas", { headers: H });
    if (r.ok) {
      const d = await r.json<any>();
      out.custom_objects = (d.results || []).map((s: any) => ({
        name: s.name, objectTypeId: s.objectTypeId, labels: s.labels,
      }));
    } else out.schemas = `status ${r.status}`;
  } catch (e) { out.schemas_err = String(e); }

  return new Response(JSON.stringify(out, null, 2), { headers: { "Content-Type": "application/json" } });
};
