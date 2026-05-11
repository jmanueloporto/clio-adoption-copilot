# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run lint      # ESLint (flat config, v9+)
```

There are no tests configured.

## Deployment

Deployed to Azure Static Web Apps via GitHub Actions on push to `main`. The workflow file is at [.github/workflows/azure-static-web-apps-happy-tree-03d814d1e.yml](.github/workflows/azure-static-web-apps-happy-tree-03d814d1e.yml). App root is `/`, build output is `dist/`.

## Architecture

**Clio Adoption Copilot** is a static React SPA (no backend) that assesses law firm adoption maturity for the Clio legal practice management platform. All data is seeded from JSON files under [src/data/](src/data/) — there are no API calls.

### Provider / Context hierarchy

`main.jsx` wraps the app in three nested React Context providers before the router:

1. **RoleContext** — toggles between `customer` and `consultant` views globally
2. **DemoGuideContext** — tracks which interactive guide hints have been dismissed
3. **FindingsContext** — holds the findings array and exposes `updateFinding` for consultant layer-3 annotations

### Routing & role gating

[src/App.jsx](src/App.jsx) defines 8 routes. A `<ConsultantRoute>` wrapper restricts `/interview`, `/engagement`, and `/expansion` to the consultant role — it reads from `RoleContext` and redirects customers to the dashboard.

### Three-layer finding system

Every finding in [src/data/findings.json](src/data/findings.json) has three data layers:

- **Layer 1 (baseline)** — automated signals derived from Clio usage data
- **Layer 2 (context)** — additional signals surfaced by the questionnaire
- **Layer 3 (consultant)** — consultant annotations and score overrides, editable in `FindingDetailPage`

[src/pages/FindingDetailPage.jsx](src/pages/FindingDetailPage.jsx) is the most complex page (667 lines) and renders all three layers with role-conditional display.

### Assessment domains

Six weighted domains (defined in [src/data/domains.json](src/data/domains.json)) each contain 4–6 findings:

| Domain | Baseline weight | Context weight |
|---|---|---|
| Platform Configuration & Security | 10% | 10% |
| Matter & Contact Management | 18% | 16% |
| Time Tracking, Billing & Payments | 25% | 20% |
| Document Management & Workflow Automation | 15% | 16% |
| Team Adoption & Capability | 12% | 14% |
| Benchmarking & Growth | 20% | 24% |

### Key data files

| File | Purpose |
|---|---|
| [src/data/findings.json](src/data/findings.json) | Core findings (1,401 lines) — primary source of truth for all assessment content |
| [src/data/questionnaire.json](src/data/questionnaire.json) | Questions and answers for layer-2 context |
| [src/data/company.json](src/data/company.json) | Demo firm details ("Brennan & Clark LLP") |
| [src/data/engagement.json](src/data/engagement.json) | Engagement metadata shown on consultant-only Engagement page |
| [src/data/demoGuide.json](src/data/demoGuide.json) | Content for the interactive guided tour |

### Styling

Tailwind CSS v4 via the `@tailwindcss/vite` plugin. Custom design tokens (colors, fonts) are in [tailwind.config.js](tailwind.config.js). The palette includes domain-specific colors (`clio-blue`, `teal`, `navy`) and score-level colors (`score-1` through `score-5`). Fonts are DM Sans (body), Source Serif 4 (headings), and JetBrains Mono (code/metrics), loaded from Google Fonts in [index.html](index.html).

### Shared components

[src/components/shared/](src/components/shared/) contains ~16 reusable components. The most referenced:

- `ScoreBadge`, `ConfidenceBadge`, `SignalStrengthBadge` — score/signal display
- `MetricCard`, `RecommendationCard`, `AnnotationCard` — content cards
- `LayerSection` — wraps layer-1/2/3 content blocks consistently
- `DemoTooltip`, `ConsultantValueIndicator` — consultant-specific overlays
