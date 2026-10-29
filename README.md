# AI Incident Watch — public channel for MY-AISafe

Public live channel of the Malaysia AI Safety Institute (MY-AISafe) delivering initiative **E12: AI Trust Function** of the National AI Action Plan 2026–2030: *a rapid and reliable national capability to detect, assess and contain critical AI-related incidents.*

Two post-release streams from the MY-AISafe overview:
- **Incident management** — receive, assess and contain AI incidents and near-misses, then share what was learned.
- **Threat intelligence** — track emerging AI risks and misuse patterns, give early warning before they spread.

## System architecture

```
                       ┌──────────────────────────────┐
  public sources ───►  │ Scanner agent (every 3 h)    │ ──► push notification to officers
                       │ search · dedupe · classify   │
                       └──────────────┬───────────────┘
                                      │ writes
                                      ▼
                       ┌──────────────────────────────┐
                       │ Officer console (claude.ai)  │  Receive → Assess → Contain → Share
                       │ shared database, forensics   │  root cause · containment · lessons
                       └──────────────┬───────────────┘
                                      │ export + merge (scripts/)
                                      ▼
   public ──view──►    ┌──────────────────────────────┐
                       │ Public site (this repo)      │  Netlify ◄── GitHub (auto-deploy)
   public ──report─►   │ index.html · report.html     │  reports → Netlify Forms → officer email
                       └──────────────────────────────┘
```

Officer-only fields (`owner`, `root_cause`, `containment`, `reported_by`) are stripped on export. Set `"public": false` on a record to keep it off the public site.

## Deploy (one time)

1. Push this folder to a GitHub repository (e.g. `ai-malaysia/ai-incident-watch`).
2. In Netlify: *Add new site → Import from Git* → pick the repo. Build command and publish directory are read from `netlify.toml`.
3. Netlify → *Forms*: enable form detection (on by default). Then *Forms → incident-report → Notifications → Email* and add the officer inbox. Every public report arrives there within seconds.
4. Optional: *Domain management* → add `incidents.ai.gov.my` (or similar) and point a CNAME at the Netlify site.

Fallback with no GitHub: drag this folder onto https://app.netlify.com/drop. Forms still work; only automatic data refresh is lost.

## Operations runbook

| When | Who | Action |
|---|---|---|
| Every 3 h | Scanner agent | Searches sources, writes new items to the officer console, pushes an early warning on Critical/High, then runs `scripts/sync_and_publish.sh` so the public site updates |
| Public report arrives | Duty officer | Read the Netlify Forms email, open the officer console, use *Receive a report* to enter it (kind, severity, initiative) |
| Critical item | Duty officer | Assess within 3 h (one scan cycle), set owner, record root cause, move to Contained, notify sector lead |
| High item | Duty officer | Assess within 24 h |
| Item closed | Officer | Write *Lessons learned*, tick *Shared with*, move to Shared. The public site shows the lessons on that card |
| Weekly | PMO | Review pipeline KPIs (time to assess / contain), AIGE principle distribution, scanner health |

## Files

| Path | Purpose |
|---|---|
| `index.html`, `assets/app.js`, `assets/site.css` | Public dashboard. EN / BM toggle, dark mode, keyboard-accessible, phone-width layout |
| `report.html` → `thanks.html` | Public intake form (Netlify Forms, honeypot spam filter, no backend code) |
| `assets/i18n.js` | Bahasa Malaysia strings |
| `data/incidents.json` | Incidents, near-misses, threats (fields below) |
| `data/scans.json`, `data/initiatives.json`, `data/config.json` | Scanner log, AI Malaysia initiative knowledge, trigger rules and severity levels |
| `scripts/merge_export.py` | Merge an officer-console export into `data/` and strip officer-only fields |
| `scripts/validate.py` | Schema check; Netlify build fails if data is bad |
| `scripts/sync_and_publish.sh` | merge → validate → commit → push (used by the scanner) |
| `.github/workflows/validate.yml` | Same check on every push / PR |
| `netlify.toml` | Publish dir, security headers, `/api/incidents` JSON endpoint for other agencies |

## Record schema (`data/incidents.json`)

| Field | Values |
|---|---|
| `kind` | `incident` · `near-miss` · `threat` |
| `status` | `Received` → `Assessed` → `Contained` → `Shared` |
| `severity` | `Critical` · `High` · `Medium` · `Low` (draft MY-AISafe classification in `config.json`) |
| `initiative` | `AI Governance` · `AI Cities` · `AI Safety` · `Both` |
| `principles` | AIGE 2024 principles affected |
| `lifecycle` | ISO/IEC 5338:2023 stage of the affected system |
| `event_date`, `detected_at`, `assessed_at`, `contained_at`, `shared_at` | Timestamps |
| `source_url`, `source_name` | Mandatory for scanner items |
| `lessons`, `shared_with` | Published when stage is Shared |
| `public` | `false` hides the record from the public site |

## Open data

`/api/incidents` returns `data/incidents.json` with CORS enabled, so sector regulators and researchers can consume the feed directly.
