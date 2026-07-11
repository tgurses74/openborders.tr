# CLAUDE.md — Openborders Website Project

## Project Overview

**openborders.tr** — static site for Openborders, an international education
and athletic-scholarship consultancy. Deployed via **Cloudflare Pages** from
the GitHub repo `tgurses74/openborders.tr` (branch `main` = production; the
redesign work lives on branch `redesign`).

**Phase 1 (current): static redesign.** Editorial layout inspired by
acquired.fm, implemented from scratch (original code, open-source fonts:
Geist, Oswald, Fraunces):

- `index.html` — homepage: header (ask-MaiA pill, Register / EN-TR / Menu
  pills), 18-tile university hero grid with hover photo-reveal and student
  story modal, "Every Student Has a Story" section, placements, programs,
  newsletter, footer.
- `register/` — generic registration page (placeholder until MaiA phase).
- `hakkimizda/` — About page (content to be supplied by Tolga).
- `assets/css/site.css`, `assets/js/site.js` — all styling, student data,
  EN/TR i18n (default TR, persisted in `localStorage["ob-lang"]`), modals.
- `assets/img/universities/*-logo.jpg`, `assets/img/students/*-student.jpg`
  — 19 university/student pairs; the first 18 entries of `STUDENTS` in
  `site.js` render in the grid (reorder there to swap tiles).
- `index-old-wp.html` + `wp-content/…` — the legacy WordPress export; old
  inner pages (iletisim, appointment-page, cerez-politikasi, privacy-policy,
  referans-listesi-formu, sporcu_tanima_formu, …) are still linked from the
  new menu until they are redesigned.

**Phase 2 (do NOT start until Phase 1 is approved and live):** MaiA — AI
client representative for registration + conversational university search.
Prior effort used Firecrawl on Tolga's Oracle VPS to build a university
database; that work will be resumed then.

## The WAT Architecture (Workflows, Agents, Tools)

This project follows the WAT framework: probabilistic AI handles reasoning,
deterministic code handles execution.

**Layer 1 — Workflows (the instructions):** markdown SOPs in `workflows/`.
Each defines objective, required inputs, tools to use, expected outputs and
edge-case handling, written in plain language.

**Layer 2 — Agents (the decision-maker):** your role. Read the relevant
workflow, run tools in the correct sequence, handle failures gracefully, ask
clarifying questions when needed. If a task needs data from a website, don't
attempt it directly — read the workflow, then execute the matching tool
script.

**Layer 3 — Tools (the execution):** Python scripts in `tools/` — API calls,
data transformations, file operations, database queries. Credentials live in
`.env` only. Scripts are consistent, testable and fast.

Why: if each hand-done step is 90% accurate, five steps compound to ~59%.
Offloading execution to deterministic scripts keeps the agent focused on
orchestration.

### How to operate

1. **Look for existing tools first.** Check `tools/` before building anything
   new.
2. **Learn and adapt on failure.** Read the full error, fix the script,
   retest (check with Tolga before re-running anything that costs credits),
   and document what you learned in the workflow.
3. **Keep workflows current** — but don't create or overwrite workflows
   without asking.

### Self-improvement loop

Identify what broke → fix the tool → verify → update the workflow → move on.

### File structure

```
.tmp/           # disposable intermediates
tools/          # deterministic Python scripts        (Phase 2)
workflows/      # markdown SOPs                       (Phase 2)
.env            # secrets — NEVER store them anywhere else
assets/         # site CSS/JS/images                  (Phase 1)
```

Deliverables go where Tolga can access them (the deployed site, cloud docs);
local files are just for processing.

## Karpathy Coding Principles

Adapted from [andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills)
— four behavioral rules for every coding task in this repo:

1. **Think Before Coding** — state assumptions explicitly; if uncertain, ask.
   Surface confusion and trade-offs instead of proceeding on silent guesses.
2. **Simplicity First** — write the minimum code that solves the problem.
   No speculative features, premature abstractions or unasked-for additions.
3. **Surgical Changes** — touch only what the task requires; match the
   existing style of the file; clean up only messes your own change created.
4. **Goal-Driven Execution** — turn every task into verifiable success
   criteria and loop (implement → check → fix) until verified, not until it
   merely "looks done".

These apply to both phases: for Phase 1 that means minimal diffs to the
static pages; for Phase 2 it means each workflow/tool defines its success
criteria before code is written.

## Project conventions

- Site language default is **Turkish**; every visible string must exist in
  both `tr` and `en` in the `I18N` dictionary in `assets/js/site.js`.
- Keep the site fully static — no build step, no framework. Plain HTML/CSS/JS.
- New pages copy the header/footer/menu-overlay pattern from
  `hakkimizda/index.html` and set `<body data-root="..">` accordingly.
- Do not edit the legacy WordPress export except to keep links working.
- Never commit `.env`, credentials or personal student data beyond what is
  already published on the site.
