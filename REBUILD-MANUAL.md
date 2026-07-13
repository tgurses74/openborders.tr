# OPENBORDERS.TR — Static Site Rebuild & Recovery Manual

**Last updated:** 2026-07-13 · **Covers:** Phase 1 static site (redesign branch)
**Audience:** Tolga (or any developer / AI assistant starting from zero after a
computer crash or on a new machine).

---

## 0. The one-minute version

Everything that matters is in Git on GitHub. Recovery is:

```bash
git clone https://github.com/tgurses74/openborders.tr
cd openborders.tr
git checkout redesign
npx -y serve -l 8737 .        # open http://localhost:8737
```

That is the entire site — static HTML/CSS/JS, no build step, no framework,
no dependencies. If GitHub still exists, nothing is lost.

---

## 1. Where everything lives

| Thing | Location | Survives a crash? |
|---|---|---|
| Site code (all pages, CSS, JS, images) | GitHub `tgurses74/openborders.tr`, branch **`redesign`** | ✅ YES |
| Old WordPress site (currently live) | Same repo, branch **`main`** (also preserved as `index-old-wp.html` on redesign) | ✅ YES |
| Hosting | Cloudflare Pages project `openborders-tr` (account: Okarekampus), auto-deploys from the GitHub repo. Production = `main` → openborders.tr; previews = other branches | ✅ YES (cloud) |
| Local working copy | `/Users/tolga_mac/Desktop/AI APPLICATIONS/openborders.tr` | ❌ no — but disposable, re-clone it |
| **Phase 2 pipeline repo** (PRD, DB schema, crawl tools) | `/Users/tolga_mac/Desktop/AI APPLICATIONS/openborders-pipeline` — **LOCAL ONLY, not on GitHub yet** | ⚠️ **NO — push it to a private GitHub repo!** |
| **Original source assets** (logos, screenshots, student photos+stories zip) | `/Users/tolga_mac/Desktop/AI APPLICATIONS/OPENBORDERS WEBSITE/` | ⚠️ **NO — back up to Google Drive!** (web-ready copies ARE in git under `assets/img/`, but originals incl. the STUDENTS zip with .docx stories are local-only) |
| API keys / .env files | Never in git, by design | ❌ no — re-issue from each provider's dashboard |

### Accounts inventory (no secrets here — where to log in)
- **GitHub** `tgurses74` — code. Git auth on a new Mac: `brew install gh && gh auth login`.
- **Cloudflare** (Okarekampus account) — Pages hosting, DNS for openborders.tr, D1 database (Phase 2).
- **Resend** — transactional email (Phase 2 double opt-in). Domain `openborders.tr` must be verified there.
- **HubSpot** — CRM sync of confirmed registrations (Phase 2).
- **DeepSeek** (platform.deepseek.com) — LLM extraction (Phase 2) and later MaiA.
- **Firecrawl** — crawling (Phase 2).
- **Oracle Cloud VPS** — crawl workhorse; holds older crawl data. SSH key: see `oracle-vps-ssh-recovery` note (key was `~/.ssh/id_ed25519`; if lost, recover via OCI Bastion managed SSH session).

---

## 2. Full recovery on a fresh Mac — step by step

1. **Install command-line tools** (git comes with it): run `git` in Terminal once, accept the Xcode CLT install prompt.
2. **Install Homebrew** (if missing): instructions at https://brew.sh
3. **Install Node.js and GitHub CLI:** `brew install node gh`
4. **Log into GitHub:** `gh auth login` → GitHub.com → HTTPS → login with web browser (one-time code flow).
5. **Clone and open the site:**
   ```bash
   mkdir -p ~/Desktop/"AI APPLICATIONS" && cd ~/Desktop/"AI APPLICATIONS"
   git clone https://github.com/tgurses74/openborders.tr
   cd openborders.tr && git checkout redesign
   npx -y serve -l 8737 .
   ```
   Open http://localhost:8737 — the full site runs locally.
6. **Restore source assets** from Google Drive backup into
   `~/Desktop/AI APPLICATIONS/OPENBORDERS WEBSITE/` (only needed for future
   asset work — the site itself doesn't need them).
7. **Clone the pipeline repo** (Phase 2): `git clone <private pipeline repo URL>`,
   copy `.env.example` → `.env`, re-enter API keys from provider dashboards.
8. Nothing else. There is no npm install, no build, no database for Phase 1.

---

## 3. Site architecture — what every file does

Design: original implementation *inspired by* acquired.fm's layout (we do not
copy their code/assets/fonts — see §7). Cream editorial theme, fixed hero
stage, content scrolls over it.

```
openborders.tr/
├── index.html            Homepage (structure below)
├── ogrenciler/           "Our Students" page — all 19 students, story modal
├── register/             Registration page (form posts to /api/register)
├── hakkimizda/           About page (placeholder — content pending)
├── kayit-onay/           Email-confirmation landing page (Phase 2)
├── index-old-wp.html     Preserved old WordPress homepage
├── <legacy WP folders>   iletisim/, appointment-page/, cerez-politikasi/,
│                         privacy-policy/, referans-listesi-formu/,
│                         sporcu_tanima_formu/, wp-content/ … (untouched,
│                         still linked from the menu)
├── assets/
│   ├── css/site.css      ALL styling (design tokens at top)
│   ├── js/site.js        ALL behavior + ALL content data (see §4)
│   └── img/
│       ├── universities/<slug>-logo.jpg    19 square logos (640px)
│       ├── students/<slug>-student.jpg     19 student photos (1000px)
│       ├── openborders-logo(-text).png     brand logos
│       └── story-bg.jpg                    story section background
├── functions/api/        Phase 2: register.ts + confirm.ts (Pages Functions)
├── CLAUDE.md             AI-assistant instructions (WAT + Karpathy rules)
└── REBUILD-MANUAL.md     this file
```

### Homepage (`index.html`) layer structure — important!
```
<header class="site-header">     FIXED, z-40, transparent, always on top
<div class="hero-stage">         FIXED backdrop, z-1: 18-tile grid + EXPLORE pill
<div class="scroll-content">     z-2, starts one viewport down, scrolls OVER stage
    story → marquee → placements → programs → signup → footer
+ two overlays: #storyOverlay (student modal), #menuOverlay (menu)
```
As the user scrolls, JS fades/shrinks `.hero-stage` (opacity 1→0, scale
1→0.94 over 0.7×viewport). Below 1100px viewport width everything falls back
to normal document flow (fixed stage doesn't fit phones).

### Design tokens (top of `site.css`)
| Token | Value | Used for |
|---|---|---|
| `--bg` | `#f7f3eb` | cream page background |
| `--ink` | `#1c1b1a` | text |
| `--navy` / `--red` | `#2b3990` / `#c8342b` | brand colors (from logo) |
| `--header-h` | `76px` (148px ≤720px) | fixed-header offset |
| Fonts | **Geist** (body), **Oswald** (condensed caps/pills), **Fraunces** (display serif) — all free Google Fonts loaded in each page's `<head>` |

---

## 4. Content editing — the rules

**ALL text and student data live in `assets/js/site.js`.** HTML files contain
only structure; visible strings carry `data-i18n="key"` attributes.

### 4a. Language system (TR default, EN toggle)
- Dictionary: `I18N = { tr: {...}, en: {...} }` in site.js.
- **Rule: every visible string must exist in BOTH `tr` and `en`.**
- To change any text: edit the value under both languages. Never hardcode
  text in HTML (the dictionary overwrites it on load).
- Choice persists in `localStorage["ob-lang"]`.

### 4b. Students (the core content)
- Array: `STUDENTS = [...]` in site.js — 19 entries, each:
  `{ slug, university, name, en: "story…", tr: "hikaye…" }`
  (paragraphs separated by `\n\n`).
- **Grid shows the first 18** entries → reorder the array to change the grid.
- **Featured placement = entry [0]**; small cards = entries [1..4].
- Images looked up by slug convention:
  `assets/img/universities/<slug>-logo.jpg` (square!) and
  `assets/img/students/<slug>-student.jpg`.

**To add a student:** ① save a square logo (≈640px) and a portrait photo
(≈1000px) with the slug names above; ② add an entry to `STUDENTS` with both
language stories; ③ done — grid, marquee, students page all render from the
array automatically.

### 4c. Menu items (11, in `#menuOverlay` of every page)
Anasayfa `/` · Kamplarımız `camps.okareistanbul.com` · Öğrencilerimiz
`/ogrenciler/` · Referans Listemiz `/referans-listesi-formu/` · Yardımcı
Videolar `youtube.com/@okareistanbul2816` · Sporcu Tanıma Formu
`/sporcu_tanima_formu/` · Randevu Alın `/appointment-page/` · Hakkımızda
`/hakkimizda/` · İletişim `/iletisim/` · Çerez Politikamız
`/cerez-politikasi/` · KVKK Politikamız `/privacy-policy/`
(edit in each page's HTML — menu markup is duplicated per page).

### 4d. Adding a new page
Copy `hakkimizda/index.html` as the template. It has the header, footer, menu
overlay and script wiring. Set `<body data-root="..">` (or `"."` at repo
root) — JS uses it to resolve asset paths. Add new strings to I18N (both
languages).

---

## 5. Deployment — Cloudflare Pages

- **Wiring:** Pages project `openborders-tr` watches the GitHub repo.
  Build command: none (static). Output dir: repo root.
- **Preview:** any push to `redesign` auto-deploys to
  `https://redesign.openborders-tr.pages.dev` (+ a per-commit URL).
  ⚠️ **Turkish ISPs block `*.pages.dev` at DNS level.** To view previews from
  Turkey: set Mac DNS to `1.1.1.1` and `8.8.8.8` (System Settings → Wi-Fi →
  Details → DNS), or use mobile data. Do NOT try a CNAME on your own domain
  to a branch preview — Pages only routes custom domains to production
  (returns error 522).
- **Go live:** merge `redesign` into `main` and push:
  ```bash
  git checkout main && git merge redesign && git push origin main
  ```
  Cloudflare deploys to https://openborders.tr automatically (~1 min).
- **Rollback:** Cloudflare dash → Workers & Pages → openborders-tr →
  Deployments → pick an older Production deployment → "Rollback". Or revert
  the merge commit in git and push.

### Daily workflow
```bash
# edit files … then:
npx -y serve -l 8737 .        # check locally
git add -A && git commit -m "what changed"
git push                       # updates the preview URL
```

---

## 6. Post-rebuild verification checklist

Open http://localhost:8737 (desktop-width window) and confirm:
- [ ] Header transparent, on top at all times; 3 pills: KAYIT OL / 🌐 TR-EN / MENÜ
- [ ] 18 square university tiles, 6×3; hover slides logo left and reveals the
      student photo to the right (vinyl effect); click opens story modal
      (name, university, story, photo); ESC / ✕ / outside click closes
- [ ] Scrolling: grid fades away, content slides over it; EXPLORE pill was
      visible at viewport bottom before scrolling
- [ ] Story section: full screen height, text bottom-left, photo background
- [ ] Logo marquee scrolls continuously, grayscale, pauses on hover
- [ ] Placements: 1 big featured + 4 small cards; "Tümünü görün" →
      /ogrenciler/ with all 19 students
- [ ] Language pill flips every string TR↔EN (menu, stories, forms) and
      persists on reload
- [ ] /register/ form present; /hakkimizda/ renders; legacy pages open
      (/iletisim/, /appointment-page/ …)
- [ ] Browser console: zero errors

---

## 7. Design provenance & content licensing notes

- The design is an **original implementation inspired by** acquired.fm's
  layout concepts. We deliberately do **not** copy their code, images, or
  licensed fonts (Reckless / Founders Grotesk are commercial). If recreating
  from scratch: keep using free fonts (Geist, Oswald, Fraunces) and original
  CSS/JS.
- Student stories/photos and university logos: supplied by Openborders
  (STUDENTS zip). University logos are used nominatively to describe real
  placements.
- Phase 2 note: the THE ranking list is proprietary — internal selection
  filter only; never publish ranks/scores on the site.

---

## 8. Status snapshot (2026-07-13)

- `redesign` branch: complete Phase 1 + Phase 2 scaffolding (registration
  API in `functions/api/`, needs Cloudflare D1 + secrets before it works —
  form falls back to "coming soon" until then). **Pushed to GitHub. Not yet
  merged to main** — production still shows the old WordPress site.
- Pending decisions/actions: Hakkımızda content; merge to main; Phase 2
  setup (wrangler login, D1 create, Resend domain, keys); push
  `openborders-pipeline` to a private GitHub repo; back up
  `OPENBORDERS WEBSITE/` folder to Google Drive.
