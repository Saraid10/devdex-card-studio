# Security Policy

DevDex is designed to scan public GitHub profile signals and generate collectible developer cards. Treat all GitHub data, imported binder files, query parameters, and profile metadata as untrusted input.

## Current Security Posture

- The server only exposes intended public files: `index.html`, `styles.css`, `script.js`, and files under `assets/`.
- Backend source, env files, deployment config, and project metadata are not served as static assets.
- The GitHub token is read only on the server through `GITHUB_TOKEN`.
- Browser code never receives `GITHUB_TOKEN`.
- GitHub usernames are validated before API requests.
- Static and API responses include baseline security headers, including CSP, `nosniff`, frame denial, referrer policy, and a restricted permissions policy.
- Binder imports are normalized and de-duplicated before storage.

## OAuth And Account Rules

When GitHub login is added:

- Request the minimum useful scope first. Prefer basic identity only for login.
- Do not request private repository access unless the product explicitly needs it and the UI explains why.
- Never expose GitHub OAuth access tokens to frontend JavaScript.
- Store session cookies as `HttpOnly`, `Secure`, and `SameSite=Lax` or stricter.
- Use OAuth `state` verification to prevent CSRF.
- Store cloud cards by authenticated user id, not by a client-supplied username.
- Validate ownership on every card read, write, delete, and collection update.
- Save card snapshots as JSON so old cards remain stable, but continue treating that JSON as untrusted data when rendering.
- Add rate limits to login, scan, save, import, and public collection endpoints.
- Keep guest local binder mode available without login.

## Data Rules

- Public GitHub profile data can be cached.
- Private contribution counts or private repository signals must only be used when the signed-in user clearly granted permission.
- Do not log OAuth tokens, cookies, authorization headers, or imported binder contents.
- Do not put secrets in `.env.example`, README examples, screenshots, or client-side code.

## Reporting Security Issues

If this becomes a public repository, add a private reporting contact or GitHub Security Advisory policy before launch.
