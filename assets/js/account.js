/* Client account page: gate → render profile + saved schools → manage. */
(function () {
  const T = (k) => (window.OB_T ? window.OB_T(k) : k);
  const LANG = () => (window.OB_LANG ? window.OB_LANG() : "tr");
  const main = document.getElementById("accountMain");

  function progCard(p) {
    const card = document.createElement("div");
    card.className = "prog-card";

    const body = document.createElement("a");
    body.className = "prog-card-body";
    body.href = "../program/" + encodeURIComponent(p.id) + "?lang=" + LANG();
    body.target = "_blank";
    body.rel = "noopener";
    const uni = document.createElement("div");
    uni.className = "uni";
    uni.textContent = [p.university, p.country_code].filter(Boolean).join(" · ");
    const h4 = document.createElement("h4");
    h4.textContent = p.name || "";
    const meta = document.createElement("div");
    meta.className = "meta";
    const bits = [];
    if (p.duration_years) bits.push(p.duration_years + (LANG() === "tr" ? " yıl" : " yr"));
    if (p.language) bits.push(p.language);
    if (p.tuition_eur) bits.push("~€" + Number(p.tuition_eur).toLocaleString() + "/yr");
    else if (p.tuition_intl) bits.push(p.tuition_intl + " " + (p.tuition_currency || ""));
    meta.textContent = bits.join(" · ");
    body.appendChild(uni);
    body.appendChild(h4);
    body.appendChild(meta);

    const rm = document.createElement("button");
    rm.type = "button";
    rm.className = "card-remove";
    rm.textContent = T("accountRemove");
    rm.addEventListener("click", async () => {
      rm.disabled = true;
      try {
        const r = await fetch("/api/account/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ program_id: p.id, action: "remove" }),
        });
        if (r.ok) {
          card.remove();
          if (!document.querySelectorAll("#savedList .prog-card").length) renderSaved([]);
        } else { rm.disabled = false; }
      } catch (_) { rm.disabled = false; }
    });

    card.appendChild(body);
    card.appendChild(rm);
    return card;
  }

  function renderSaved(list) {
    const wrap = document.getElementById("savedList");
    const empty = document.getElementById("savedEmpty");
    wrap.textContent = "";
    if (!list || !list.length) { empty.hidden = false; wrap.hidden = true; return; }
    empty.hidden = true;
    wrap.hidden = false;
    list.forEach((p) => wrap.appendChild(progCard(p)));
  }

  async function load() {
    let data;
    try {
      const r = await fetch("/api/account/me", { headers: { Accept: "application/json" } });
      if (r.status === 401) { location.href = "../giris/"; return; }
      if (!r.ok) throw new Error("bad");
      data = await r.json();
    } catch (_) { location.href = "../giris/"; return; }

    document.getElementById("acctName").textContent = data.name || data.email;
    const tier = data.subscription_tier || "free";
    document.getElementById("acctTier").textContent = tier === "free" ? T("accountFree") : tier;
    if (data.member_since) {
      const d = new Date(String(data.member_since).replace(" ", "T") + "Z");
      const s = isNaN(d.getTime())
        ? data.member_since
        : d.toLocaleDateString(LANG() === "tr" ? "tr-TR" : "en-GB", { year: "numeric", month: "long", day: "numeric" });
      document.getElementById("acctSince").textContent = T("accountMemberSince") + ": " + s;
    }
    renderSaved(data.saved);
    main.hidden = false;
  }

  document.getElementById("deleteBtn").addEventListener("click", async () => {
    if (!window.confirm(T("accountDeleteConfirm"))) return;
    try {
      const r = await fetch("/api/account/delete", { method: "POST" });
      if (r.ok) {
        document.cookie = "ob_session=; Path=/; Max-Age=0";
        window.alert(T("accountDeleted"));
        location.href = "../";
      } else { window.alert(T("accountErr")); }
    } catch (_) { window.alert(T("accountErr")); }
  });

  document.getElementById("signoutBtn").addEventListener("click", () => {
    document.cookie = "ob_session=; Path=/; Max-Age=0";
    location.href = "../";
  });

  load();
})();
