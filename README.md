# DevDex Card Studio

Turn any public GitHub profile into a nostalgic developer trading card.

[Live Demo](https://devdex-card-studio.onrender.com) · [Health Check](https://devdex-card-studio.onrender.com/api/health)

DevDex scans public GitHub signals, scores a developer across four original fields, and generates a collectible card with rarity, specialty, moves, weakness, resist, ability, flavor text, and a local collector binder.

This project uses original DevDex naming and visual language. It is inspired by old-school collectible cards, but it is not affiliated with or endorsed by any official trading-card franchise.

## Preview

Try it live:

```text
https://devdex-card-studio.onrender.com
```

Suggested profiles to test:

```text
octocat
torvalds
karpathy
gaearon
```

## Features

- GitHub username scanner with a Node backend proxy
- Personalized DevDex cards from public GitHub data
- Four developer fields: Spark, Tide, Forge, and Mind
- Automatic rarity logic with strict Legendary Contributor gates
- Field-specific card themes and legendary rare-card treatment
- Personalized class, special moves, weakness, resist, ability, and flavor text
- Rarity Recipe panel explaining why a profile did or did not become Legendary
- Recent public activity scanning for pushes, pull requests, issues, reviews, releases, and contributed repos
- Optional GitHub GraphQL contribution enrichment with `GITHUB_TOKEN`
- Share links with `?u=username#studio`
- Downloadable SVG card export
- Local Collector Binder with save, export, import, and clear tools
- Premium motion layer: card tilt, foil shine, scan pulse, route transitions, and scroll reveals
- Deployment-ready Render Blueprint and Dockerfile
- Security hardening for static serving, response headers, method restrictions, and rate limiting

## How It Works

DevDex reads a public GitHub profile and builds a score across four fields:

| Field | Meaning | Typical Signals |
|---|---|---|
| Spark | Interface energy | Frontend languages, UI repos, design-system keywords |
| Tide | Data flow | Python, notebooks, data work, automation, scripts |
| Forge | Systems craft | Backend, infra, runtimes, performance, systems languages |
| Mind | AI and research | ML, LLMs, notebooks, model work, research-heavy repos |

The overall DevDex score is weighted so both specialists and all-rounders can stand out:

```text
DevDex Score =
  45% best field
  20% second-best field
  25% average of all fields
  10% weakest field
```

Legendary Contributor is intentionally rare. It unlocks only through strict specialist, multi-domain, all-rounder, or elite overall gates.

## Tech Stack

- HTML, CSS, and vanilla JavaScript frontend
- Dependency-free Node.js HTTP server
- GitHub REST API for profile, repositories, languages, and public events
- Optional GitHub GraphQL API for richer contribution totals
- Browser `localStorage` for guest Binder collections
- Render / Docker deployment support

## Project Structure

```text
.
├── assets/
│   └── dev-avatar.svg
├── index.html
├── styles.css
├── script.js
├── server.js
├── package.json
├── render.yaml
├── Dockerfile
├── SECURITY.md
├── .env.example
├── .gitignore
└── .dockerignore
```

## Run Locally

Requires Node.js 20 or newer.

```powershell
git clone https://github.com/Saraid10/devdex-card-studio.git
cd devdex-card-studio
npm install
npm start
```

Open:

```text
http://127.0.0.1:4173
```

Health check:

```text
http://127.0.0.1:4173/api/health
```

## Environment Variables

The app works without a token, but a GitHub token improves rate limits and enables GraphQL contribution totals.

| Variable | Required | Default | Purpose |
|---|---:|---|---|
| `NODE_ENV` | No | unset | Use `production` on hosted deploys |
| `HOST` | No | `127.0.0.1` locally, `0.0.0.0` in production | Server bind host |
| `PORT` | No | `4173` | Server port |
| `GITHUB_TOKEN` | No | empty | Higher GitHub API limits and GraphQL contribution data |
| `CACHE_TTL_MS` | No | `3600000` | Server cache duration |
| `RATE_LIMIT_WINDOW_MS` | No | `60000` | Global rate-limit window |
| `RATE_LIMIT_MAX` | No | `300` | Global max requests per window |
| `GITHUB_SCAN_WINDOW_MS` | No | `600000` | GitHub scan rate-limit window |
| `GITHUB_SCAN_MAX` | No | `40` | GitHub scan max requests per window |

PowerShell example:

```powershell
$env:GITHUB_TOKEN="your_token_here"
npm start
```

## Deploy

The live app is deployed here:

```text
https://devdex-card-studio.onrender.com
```

Recommended first deploy: Render Web Service.

Render settings:

```text
Runtime: Docker
Branch: main
Root Directory: leave empty
Docker Build Context Directory: .
Dockerfile Path: ./Dockerfile
Health Check Path: /api/health
Auto-Deploy: On Commit
```

Environment variables:

```text
NODE_ENV=production
CACHE_TTL_MS=3600000
RATE_LIMIT_MAX=300
GITHUB_SCAN_MAX=40
```

Optional:

```text
GITHUB_TOKEN=your_github_token_here
```

Docker locally:

```powershell
docker build -t devdex-card-studio .
docker run -p 4173:4173 -e NODE_ENV=production -e HOST=0.0.0.0 devdex-card-studio
```

## Push Commands

First-time push after creating an empty GitHub repo:

```powershell
cd "D:\PROJECTS\Dev Pokedex"
git remote add origin https://github.com/Saraid10/devdex-card-studio.git
git branch -M main
git push -u origin main
```

Push future changes:

```powershell
cd "D:\PROJECTS\Dev Pokedex"
git status
git add .
git commit -m "Describe your change"
git push
```

If the remote already exists and you only need to push:

```powershell
git push
```

## Security

DevDex currently uses public GitHub data and optional server-side `GITHUB_TOKEN` enrichment.

Security posture:

- `GITHUB_TOKEN` stays server-side and is never sent to frontend JavaScript
- Static serving is restricted to `index.html`, `styles.css`, `script.js`, and `assets/`
- Backend source, package metadata, env examples, and deployment files are blocked from HTTP static serving
- Responses include baseline security headers, including CSP, `nosniff`, frame denial, referrer policy, and permissions policy
- Unsupported HTTP methods are rejected
- Public traffic and GitHub scan requests are rate-limited
- Binder imports are normalized before storage

Read [SECURITY.md](SECURITY.md) before adding GitHub OAuth, cloud accounts, or persistent collections.

## Roadmap

- GitHub OAuth login
- Cloud-synced user Binder
- Public collection galleries
- Server-rendered social preview images
- Better card image export formats
- Optional database-backed scan history

## License

No license has been selected yet. Until a license is added, all rights are reserved by the repository owner.
