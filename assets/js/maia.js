/* MaiA client: gate → intake → conversation → finish. */
(function () {
  const T = (k) => (window.OB_T ? window.OB_T(k) : k);
  const LANG = () => (window.OB_LANG ? window.OB_LANG() : "tr");

  const intakeForm = document.getElementById("intakeForm");
  const chat = document.getElementById("chat");
  const chatBar = document.getElementById("chatBar");
  const chatActions = document.getElementById("chatActions");
  const chatInput = document.getElementById("chatInput");

  let intake = null;
  let enquiryId = null;
  let messages = [];      // conversation history (user/assistant)
  let busy = false;

  /* ---- gate: must be signed in ---- */
  fetch("/api/maia/me").then((r) => {
    if (!r.ok) location.href = "../giris/";
  }).catch(() => { location.href = "../giris/"; });

  /* ---- option pills single-select visual ---- */
  function syncGroup(group) {
    group.querySelectorAll(".opt").forEach((o) =>
      o.classList.toggle("sel", o.querySelector("input").checked));
  }
  document.querySelectorAll(".opts[data-single]").forEach((group) => {
    syncGroup(group);                       // reflect the default selection on load
    group.addEventListener("change", () => syncGroup(group));
    // allow re-clicking the already-checked option (no change event) to still register
    group.querySelectorAll(".opt").forEach((o) =>
      o.addEventListener("click", () => { o.querySelector("input").checked = true; syncGroup(group); }));
  });

  /* ---- helpers ---- */
  function bubble(cls, text) {
    const el = document.createElement("div");
    el.className = "msg " + cls;
    if (cls.indexOf("maia") !== -1 && window.OB_brandify) {
      el.appendChild(window.OB_brandify(text));   // bold the "ai" in MaiA
    } else {
      el.textContent = text;
    }
    chat.appendChild(el);
    chat.scrollIntoView(false);
    window.scrollTo(0, document.body.scrollHeight);
    return el;
  }

  function renderPrograms(programs) {
    if (!programs || !programs.length) return;
    const wrap = document.createElement("div");
    wrap.className = "prog-cards";
    const seen = new Set();
    programs.forEach((p) => {
      const key = (p.university || "") + "|" + (p.name || "");
      if (seen.has(key)) return;
      seen.add(key);
      // Each card is a link to an on-demand detail page (rendered from D1).
      const card = p.id
        ? document.createElement("a")
        : document.createElement("div");
      card.className = "prog-card";
      if (p.id) {
        card.href = "../program/" + encodeURIComponent(p.id) + "?lang=" + LANG();
        card.target = "_blank";
        card.rel = "noopener";
      }
      const uni = document.createElement("div"); uni.className = "uni";
      uni.textContent = [p.university, p.country_code].filter(Boolean).join(" · ");
      const h4 = document.createElement("h4"); h4.textContent = p.name || "";
      const meta = document.createElement("div"); meta.className = "meta";
      const bits = [];
      if (p.duration_years) bits.push(p.duration_years + (LANG() === "tr" ? " yıl" : " yr"));
      if (p.language) bits.push(p.language);
      if (p.tuition_eur) bits.push("~€" + Number(p.tuition_eur).toLocaleString() + "/yr");
      else if (p.tuition_intl) bits.push(p.tuition_intl + " " + (p.tuition_currency || ""));
      meta.textContent = bits.join(" · ");
      card.appendChild(uni); card.appendChild(h4); card.appendChild(meta);
      if (p.id) {
        const cue = document.createElement("span"); cue.className = "prog-more";
        cue.textContent = (LANG() === "tr" ? "Detayları gör →" : "View details →");
        card.appendChild(cue);
      }
      wrap.appendChild(card);
    });
    chat.appendChild(wrap);
    window.scrollTo(0, document.body.scrollHeight);
  }

  async function sendTurn(userText) {
    if (busy) return;
    busy = true;
    if (userText) { messages.push({ role: "user", content: userText }); bubble("user", userText); }
    const typing = bubble("maia typing", T("maiaTyping"));
    try {
      const res = await fetch("/api/maia/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, intake, lang: LANG() }),
      });
      typing.remove();
      if (res.status === 401) { location.href = "../giris/"; return; }
      const data = await res.json();
      const reply = data.reply || "…";
      messages.push({ role: "assistant", content: reply });
      bubble("maia", reply);
      renderPrograms(data.programs);
    } catch (_) {
      typing.remove();
      bubble("maia", LANG() === "tr" ? "Bir bağlantı sorunu oldu, tekrar dener misiniz?" : "There was a connection problem — please try again.");
    } finally { busy = false; }
  }

  /* ---- intake submit ---- */
  intakeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const level = intakeForm.querySelector('input[name="level"]:checked').value;
    intake = {
      level: level,
      location: document.getElementById("fLocation").value.trim(),
      field: level === "highschool" ? "" : document.getElementById("fField").value.trim(),
      is_athlete: intakeForm.querySelector('input[name="athlete"]:checked').value === "1",
      budget_amount: Number(document.getElementById("fBudget").value) || null,
      budget_currency: document.getElementById("fCurrency").value,
    };
    intakeForm.querySelector("button").disabled = true;
    try {
      const r = await fetch("/api/maia/start", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake }),
      });
      if (r.status === 401) { location.href = "../giris/"; return; }
      enquiryId = (await r.json()).enquiry_id;
    } catch (_) { /* proceed anyway */ }

    intakeForm.hidden = true;
    chat.hidden = false; chatBar.hidden = false; chatActions.hidden = false;
    bubble("maia", T("maiaWelcome"));
    // kick off the first search from the intake
    const kickoff = LANG() === "tr"
      ? "Verdiğim bilgilere göre bana uygun programları önerir misin?"
      : "Based on my intake, please suggest programs that fit me.";
    sendTurn(kickoff);
  });

  /* ---- chat send ---- */
  chatBar.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = "";
    sendTurn(text);
  });

  /* ---- finish ---- */
  document.getElementById("finishBtn").addEventListener("click", async () => {
    if (busy) return;
    busy = true;
    const btn = document.getElementById("finishBtn");
    btn.disabled = true;
    const typing = bubble("maia typing", T("maiaTyping"));
    try {
      await fetch("/api/maia/finish", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake, messages, enquiry_id: enquiryId, lang: LANG() }),
      });
    } catch (_) { /* ignore */ }
    typing.remove();
    bubble("maia", T("maiaDone"));
    chatBar.hidden = true; chatActions.hidden = true;
    busy = false;
  });

  /* ---- sign out ---- */
  document.getElementById("signoutBtn").addEventListener("click", () => {
    document.cookie = "ob_session=; Path=/; Max-Age=0";
    location.href = "../";
  });
})();
