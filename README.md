# DevDex Card Studio

Phase 0 through Phase 12 prototype for a nostalgic developer trading-card generator.

## Current scope

- Static app foundation
- Polished DevDex card component
- Four automatic developer domains: Spark, Tide, Forge, and Mind
- Automatic Binder and Legendary Contributor rarity treatments
- Client-side GitHub public profile scanner
- Node backend for GitHub fetching, API caching, and static file serving
- Public repo and top-repo language aggregation
- Six-hour browser cache for repeated profile scans
- Responsive studio layout
- Interactive card tilt and foil shine
- Real scoring model with fallback prototype data
- Rarity Recipe panel that explains why a profile did or did not become Legendary
- Field-specific nostalgic card frames for Spark, Tide, Forge, and Mind
- Personalized specialty, moves, weakness, resist, ability, and flavor from public GitHub evidence
- Nostalgic Field Guide home page with interactive term explanations
- Public activity/event scan for recent pushes, pull requests, issues, reviews, releases, and contributed repos
- Stable share links with `?u=username#studio`
- Downloadable SVG card export for the current generated card
- Premium motion layer: route transitions, scanner loading pulse, card refresh animation, stat-meter boot, hover polish, and scroll reveals
- Optional GitHub GraphQL enrichment for yearly contribution totals when `GITHUB_TOKEN` is available
- Local Collector Binder route for saved developer pulls, rarity counts, quick reopen links, and share links
- Binder export, import, and clear tools for moving local collections between browsers or devices
- GitHub-ready project hygiene with `.gitignore` and `.env.example`
- Deployment-ready Render Blueprint and Docker configuration
- Baseline security hardening for static serving, response headers, and future OAuth rules
- In-memory rate limits for public traffic and GitHub scan requests

## Rarity direction

The prototype uses original DevDex rarity language instead of copying official trading-card branding. Rarity is not manually selected; it is derived from the developer's field score.

- Binder cards: warm paper, gold frame, pixel avatar, compact move blocks.
- Legendary Contributor cards: unlocked only through the strict specialist, multi-domain, all-rounder, or DevDex elite gates below.
- Each field has a distinct original DevDex frame treatment:
  - Spark: warm yellow/orange interface energy.
  - Tide: blue data-flow and automation styling.
  - Forge: steel/copper systems styling.
  - Mind: violet/psychic research styling.
- Phase 2 replaced mock values with real GitHub-derived scoring.
- Phase 3 added an in-app Rarity Recipe receipt so the user can see which gate passed or which Legendary route is closest.
- Phase 4 added a personalization engine that uses dominant languages, signature repositories, topics, bio text, impact, and activity to write card traits.
- Phase 5 added a backend scanner with in-memory server cache and optional GitHub token support.
- Phase 6 added the Field Guide home page and routes users into the Card Studio.
- Phase 7 added recent public GitHub activity scanning so card moves, resistances, abilities, and stat bars can respond to collaboration and contribution signals.
- Phase 8 added copyable profile share links and a dependency-free SVG card export.
- Phase 9 added a Stitch-aligned motion layer for sleeve shine, scanner feedback, card dealing, stat fills, and premium page transitions.
- Phase 10 added optional GitHub GraphQL contribution totals for commits, PRs, issues, reviews, contributed repositories, and private contribution count.
- Phase 11 added a local Collector Binder that saves scanned cards in the browser, de-duplicates by username, and displays them as nostalgic sleeve cards.
- Phase 12 added binder export/import/clear tools plus repo-readiness files for a cleaner GitHub push.
- Phase 13 added deployment configuration for Render-style Node hosting and Docker-based hosts.
- Phase 14 added baseline server hardening and a security policy for OAuth/cloud-account work.
- Phase 15 added lightweight in-memory rate limiting for scan abuse protection.
- The current prototype combines Spark, Tide, Forge, and Mind into one developer profile.
- DevDex score is weighted so elite specialists can shine without making every good profile Legendary:

```text
DevDex Score =
  45% best field
  20% second-best field
  25% average of all fields
  10% weakest field
```

- Legendary Contributor is intentionally rare and unlocks through strict gates:
  - Exceptional specialist: best field is `98+` and DevDex score is `84+`.
  - Multi-domain elite: best field is `96+`, second-best is `94+`, and DevDex score is `91+`.
  - All-rounder: average is `92+`, weakest field is `88+`, and best field is `94+`.
  - DevDex elite: DevDex score is `95+` and best field is `94+`.

- Non-Legendary rarity still exists:
  - Ultra Rare: DevDex score `86+` or best field `92+`.
  - Holo Rare: DevDex score `78+` or best field `84+`.
  - Rare: DevDex score `68+`.

Field scores use language share, repository coverage, keywords/topics, total field impact, recent activity, and signature-repository impact. This lets a developer with one extremely influential AI/backend/frontend/data repository score as an exceptional specialist without needing every public repo to match the same domain.

## Open locally

Run the DevDex server from this folder, then open the local URL:

```powershell
node server.js
```

Then visit `http://127.0.0.1:4173`.

For higher GitHub API limits, start the server with a token:

```powershell
$env:GITHUB_TOKEN="your_token_here"; node server.js
```

With a token, DevDex also enriches cards with GitHub GraphQL contribution totals. Without a token, the app still works using public REST profile, repo, language, and recent event data.

You can copy `.env.example` to `.env` for your own local notes, but the current dependency-free server reads environment variables directly from the shell.

## GitHub scanning

The app first asks the local backend for GitHub data:

- `GET /api/health`
- `GET /api/github/:username`

The backend fetches:

- `GET /users/:username`
- `GET /users/:username/repos`
- `GET /repos/:owner/:repo/languages` for the top repositories
- `GET /users/:username/events/public` for recent public activity signals
- `POST /graphql` for contribution totals when `GITHUB_TOKEN` is configured

The server keeps an in-memory cache and can use `GITHUB_TOKEN` from the environment. If someone opens the app without the backend, the browser still has a direct GitHub fallback.

## Binder portability

The Collector Binder stores cards in browser `localStorage`, so it is private to the current browser profile.

- `Save Card` sleeves the current card into the local binder.
- `Export Binder` downloads a JSON backup.
- `Import Binder` merges a JSON backup and de-duplicates cards by GitHub username.
- `Clear Binder` removes the local collection from the current browser.

## Deploy

Recommended first deploy: Render Web Service. DevDex has a Node backend, so use a web-service host instead of a static-only host.

1. Push this folder to GitHub.
2. In Render, create a new Web Service from the GitHub repo.
3. Use:
   - Build command: `npm install`
   - Start command: `npm start`
   - Health check path: `/api/health`
4. Add environment variables:
   - `NODE_ENV=production`
   - `GITHUB_TOKEN=your_github_token` for higher rate limits and GraphQL contribution totals
   - `CACHE_TTL_MS=3600000`
   - `RATE_LIMIT_MAX=300`
   - `GITHUB_SCAN_MAX=40`

The included `render.yaml` can also be used as a Render Blueprint. The server binds to `0.0.0.0` automatically when `NODE_ENV=production`.

Docker hosts can use the included `Dockerfile`:

```powershell
docker build -t devdex-card-studio .
docker run -p 4173:4173 -e NODE_ENV=production -e HOST=0.0.0.0 devdex-card-studio
```

## Security

DevDex currently uses public GitHub data and optional server-side `GITHUB_TOKEN` enrichment. The token must stay server-side and should never be exposed to frontend JavaScript.

The server now restricts static serving to the public app files and `assets/`, adds security headers, rejects unsupported HTTP methods, and rate-limits public traffic plus scan requests. See `SECURITY.md` before adding GitHub OAuth, cloud collections, or user accounts.

## Next phase

Future hosted versions can add persistent accounts, public collection galleries, and server-rendered social preview images.
