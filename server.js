const http = require("http");
const fs = require("fs/promises");
const path = require("path");

const HOST = process.env.HOST || (process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1");
const PORT = Number(process.env.PORT || 4173);
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS || 1000 * 60 * 60);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 1000 * 60);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 300);
const GITHUB_SCAN_WINDOW_MS = Number(process.env.GITHUB_SCAN_WINDOW_MS || 1000 * 60 * 10);
const GITHUB_SCAN_MAX = Number(process.env.GITHUB_SCAN_MAX || 40);
const ROOT = __dirname;

const cache = new Map();
const rateLimitBuckets = new Map();

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
};

const publicRootFiles = new Set(["/", "/index.html", "/styles.css", "/script.js"]);
const publicAssetExtensions = new Set([".ico", ".jpeg", ".jpg", ".png", ".svg", ".webp"]);

function getSecurityHeaders() {
  const headers = {
    "Content-Security-Policy": [
      "default-src 'self'",
      "base-uri 'none'",
      "connect-src 'self' https://api.github.com",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "img-src 'self' data: https://avatars.githubusercontent.com https://*.githubusercontent.com",
      "object-src 'none'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
    ].join("; "),
    "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    "Permissions-Policy": "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  };

  if (process.env.NODE_ENV === "production") {
    headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
  }

  return headers;
}

function sendJson(response, statusCode, payload, extraHeaders = {}) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...getSecurityHeaders(),
    ...extraHeaders,
  });
  response.end(JSON.stringify(payload));
}

function sendNoBody(response, statusCode, extraHeaders = {}) {
  response.writeHead(statusCode, {
    "Cache-Control": "no-store",
    ...getSecurityHeaders(),
    ...extraHeaders,
  });
  response.end();
}

function sendError(response, statusCode, message, extra = {}) {
  sendJson(response, statusCode, { error: message, ...extra });
}

function getClientKey(request) {
  return request.headers["x-forwarded-for"]?.split(",")[0]?.trim() || request.socket.remoteAddress || "unknown";
}

function checkRateLimit(request, bucketName, maxRequests, windowMs) {
  const now = Date.now();
  const key = `${bucketName}:${getClientKey(request)}`;
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: Math.max(maxRequests - 1, 0), resetAt: now + windowMs };
  }

  bucket.count += 1;
  return {
    allowed: bucket.count <= maxRequests,
    remaining: Math.max(maxRequests - bucket.count, 0),
    resetAt: bucket.resetAt,
  };
}

function enforceRateLimit(request, response, bucketName, maxRequests, windowMs) {
  const result = checkRateLimit(request, bucketName, maxRequests, windowMs);
  if (result.allowed) {
    response.setHeader("X-RateLimit-Bucket", bucketName);
    response.setHeader("X-RateLimit-Limit", String(maxRequests));
    response.setHeader("X-RateLimit-Remaining", String(result.remaining));
    response.setHeader("X-RateLimit-Reset", String(Math.ceil(result.resetAt / 1000)));
    return true;
  }

  const retryAfterSeconds = Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000));
  sendJson(
    response,
    429,
    { error: "Too many requests. Please wait before trying again." },
    {
      "Retry-After": String(retryAfterSeconds),
      "X-RateLimit-Limit": String(maxRequests),
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
    },
  );
  return false;
}

function pruneRateLimitBuckets() {
  const now = Date.now();
  for (const [key, bucket] of rateLimitBuckets.entries()) {
    if (bucket.resetAt < now) rateLimitBuckets.delete(key);
  }
}

function validateUsername(username) {
  const clean = username.trim().replace(/^@/, "");
  const valid = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(clean);
  if (!valid) throw new Error("Enter a valid GitHub username.");
  return clean;
}

function getCacheKey(username) {
  return username.toLowerCase();
}

function getFreshCache(username) {
  const cached = cache.get(getCacheKey(username));
  if (!cached) return null;
  if (Date.now() - cached.savedAt > CACHE_TTL_MS) return null;
  return cached;
}

function getAnyCache(username) {
  return cache.get(getCacheKey(username)) || null;
}

async function fetchGitHubJson(url) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "DevDex-Card-Studio",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  const response = await fetch(url, { headers });
  const remaining = response.headers.get("x-ratelimit-remaining");
  const reset = response.headers.get("x-ratelimit-reset");

  if (!response.ok) {
    const message =
      response.status === 404
        ? "GitHub user not found."
        : response.status === 403
          ? "GitHub rate limit reached. Try again later or set GITHUB_TOKEN."
          : `GitHub request failed (${response.status}).`;
    const error = new Error(message);
    error.status = response.status;
    error.rateLimit = { remaining, reset };
    throw error;
  }

  return {
    data: await response.json(),
    rateLimit: { remaining, reset },
  };
}

async function fetchOptionalGitHubJson(url, fallbackData) {
  try {
    return await fetchGitHubJson(url);
  } catch (error) {
    return {
      data: fallbackData,
      optionalError: error.message,
      rateLimit: error.rateLimit,
    };
  }
}

function getEmptyContributionStats() {
  return {
    codeReviews: 0,
    contributedRepositories: 0,
    hasGraphQL: false,
    issues: 0,
    privateContributions: 0,
    pullRequests: 0,
    repositories: 0,
    totalCommits: 0,
    totalContributions: 0,
  };
}

async function fetchGitHubGraphQL(query, variables) {
  if (!GITHUB_TOKEN) {
    return {
      data: null,
      optionalError: "GITHUB_TOKEN not set; GraphQL contribution totals skipped.",
      rateLimit: null,
    };
  }

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "DevDex-Card-Studio",
    },
    body: JSON.stringify({ query, variables }),
  });
  const remaining = response.headers.get("x-ratelimit-remaining");
  const reset = response.headers.get("x-ratelimit-reset");
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.errors?.length) {
    const message = payload.errors?.[0]?.message || `GitHub GraphQL request failed (${response.status}).`;
    const error = new Error(message);
    error.status = response.status;
    error.rateLimit = { remaining, reset };
    throw error;
  }

  return {
    data: payload.data,
    rateLimit: { remaining, reset },
  };
}

async function fetchOptionalContributionStats(username) {
  const query = `
    query DevDexContributionStats($login: String!) {
      user(login: $login) {
        contributionsCollection {
          restrictedContributionsCount
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          totalRepositoriesWithContributedCommits
          totalRepositoryContributions
          contributionCalendar {
            totalContributions
          }
        }
        repositoriesContributedTo(
          first: 1
          contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, PULL_REQUEST_REVIEW, REPOSITORY]
          includeUserRepositories: true
        ) {
          totalCount
        }
      }
    }
  `;

  try {
    const result = await fetchGitHubGraphQL(query, { login: username });
    const collection = result.data?.user?.contributionsCollection;
    const contributedTo = result.data?.user?.repositoriesContributedTo?.totalCount || 0;

    return {
      data: {
        codeReviews: collection?.totalPullRequestReviewContributions || 0,
        contributedRepositories: contributedTo,
        hasGraphQL: Boolean(collection),
        issues: collection?.totalIssueContributions || 0,
        privateContributions: collection?.restrictedContributionsCount || 0,
        pullRequests: collection?.totalPullRequestContributions || 0,
        repositories: collection?.totalRepositoryContributions || 0,
        totalCommits: collection?.totalCommitContributions || 0,
        totalContributions: collection?.contributionCalendar?.totalContributions || 0,
      },
      rateLimit: result.rateLimit,
    };
  } catch (error) {
    return {
      data: getEmptyContributionStats(),
      optionalError: error.message,
      rateLimit: error.rateLimit,
    };
  }
}

function normalizeLanguageTotals(languageResults, repos) {
  const totals = {};

  for (const result of languageResults) {
    if (result.status !== "fulfilled") continue;
    for (const [language, bytes] of Object.entries(result.value.data)) {
      totals[language] = (totals[language] || 0) + bytes;
    }
  }

  if (Object.keys(totals).length === 0) {
    for (const repo of repos) {
      if (!repo.language) continue;
      totals[repo.language] = (totals[repo.language] || 0) + 1000;
    }
  }

  return totals;
}

function summarizeActivity(events) {
  const summary = {
    codeReviews: 0,
    contributionEvents: events.length,
    contributedRepos: 0,
    createEvents: 0,
    issues: 0,
    lastActiveAt: "",
    pullRequests: 0,
    pushes: 0,
    releases: 0,
  };
  const repoNames = new Set();

  for (const event of events) {
    if (event.repo?.name) repoNames.add(event.repo.name);
    if (!summary.lastActiveAt || new Date(event.created_at) > new Date(summary.lastActiveAt)) {
      summary.lastActiveAt = event.created_at;
    }

    if (event.type === "PushEvent") summary.pushes += 1;
    if (event.type === "PullRequestEvent") summary.pullRequests += 1;
    if (event.type === "PullRequestReviewEvent") summary.codeReviews += 1;
    if (event.type === "IssuesEvent") summary.issues += 1;
    if (event.type === "CreateEvent") summary.createEvents += 1;
    if (event.type === "ReleaseEvent") summary.releases += 1;
  }

  summary.contributedRepos = repoNames.size;
  return summary;
}

async function buildGitHubPayload(username) {
  const userResult = await fetchGitHubJson(`https://api.github.com/users/${username}`);
  const reposResult = await fetchGitHubJson(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=owner`,
  );
  const eventsResult = await fetchOptionalGitHubJson(
    `https://api.github.com/users/${username}/events/public?per_page=100`,
    [],
  );
  const contributionResult = await fetchOptionalContributionStats(username);
  const repos = reposResult.data;
  const languageRepos = repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => b.stargazers_count + b.forks_count - (a.stargazers_count + a.forks_count))
    .slice(0, 12);
  const languageResults = await Promise.allSettled(
    languageRepos.map((repo) => fetchGitHubJson(repo.languages_url)),
  );
  const languageTotals = normalizeLanguageTotals(languageResults, repos);

  return {
    activity: summarizeActivity(eventsResult.data),
    activityWarning: eventsResult.optionalError || "",
    contributionStats: contributionResult.data || getEmptyContributionStats(),
    contributionWarning: contributionResult.optionalError || "",
    fetchedAt: new Date().toISOString(),
    languageTotals,
    rateLimit: contributionResult.rateLimit || reposResult.rateLimit || userResult.rateLimit || eventsResult.rateLimit,
    repos,
    user: userResult.data,
  };
}

async function handleGitHubRequest(request, response, username) {
  let cleanUsername;
  try {
    cleanUsername = validateUsername(username);
  } catch (error) {
    sendError(response, 400, error.message);
    return;
  }

  const freshCache = getFreshCache(cleanUsername);
  if (freshCache) {
    sendJson(response, 200, {
      ...freshCache.payload,
      cache: {
        hit: true,
        stale: false,
        savedAt: freshCache.savedAt,
        ttlMs: CACHE_TTL_MS,
      },
    });
    return;
  }

  try {
    const payload = await buildGitHubPayload(cleanUsername);
    cache.set(getCacheKey(cleanUsername), { payload, savedAt: Date.now() });
    sendJson(response, 200, {
      ...payload,
      cache: {
        hit: false,
        stale: false,
        savedAt: Date.now(),
        ttlMs: CACHE_TTL_MS,
      },
    });
  } catch (error) {
    const staleCache = getAnyCache(cleanUsername);
    if (staleCache) {
      sendJson(response, 200, {
        ...staleCache.payload,
        cache: {
          hit: true,
          stale: true,
          savedAt: staleCache.savedAt,
          ttlMs: CACHE_TTL_MS,
          warning: error.message,
        },
      });
      return;
    }

    sendError(response, error.status || 502, error.message || "Could not fetch GitHub profile.", {
      rateLimit: error.rateLimit,
    });
  }
}

function getSafeStaticPath(urlPath) {
  let cleanPath;
  try {
    cleanPath = decodeURIComponent(urlPath.split("?")[0]);
  } catch {
    return null;
  }

  if (cleanPath.includes("\0")) return null;
  if (!publicRootFiles.has(cleanPath) && !cleanPath.startsWith("/assets/")) return null;
  if (cleanPath.startsWith("/assets/") && !publicAssetExtensions.has(path.extname(cleanPath).toLowerCase())) return null;

  const filePath = cleanPath === "/" ? "/index.html" : cleanPath;
  const resolved = path.resolve(ROOT, `.${filePath}`);
  const relative = path.relative(ROOT, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return null;
  return resolved;
}

async function serveStatic(request, response) {
  const filePath = getSafeStaticPath(request.url);
  if (!filePath) {
    sendError(response, 403, "Forbidden.");
    return;
  }

  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes[ext] || "application/octet-stream",
      "Cache-Control": "no-cache",
      ...getSecurityHeaders(),
    });
    response.end(request.method === "HEAD" ? undefined : file);
  } catch {
    sendError(response, 404, "Not found.");
  }
}

async function handleRequest(request, response) {
  if (!["GET", "HEAD"].includes(request.method)) {
    sendNoBody(response, 405, { Allow: "GET, HEAD" });
    return;
  }

  if (!enforceRateLimit(request, response, "global", RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) return;
  pruneRateLimitBuckets();

  let url;
  try {
    url = new URL(request.url, `http://${request.headers.host || HOST}`);
  } catch {
    sendError(response, 400, "Invalid request URL.");
    return;
  }

  if (url.pathname === "/api/health") {
    sendJson(response, 200, {
      cacheEntries: cache.size,
      hasGitHubToken: Boolean(GITHUB_TOKEN),
      hasGraphQL: Boolean(GITHUB_TOKEN),
      ok: true,
      uptimeSeconds: Math.round(process.uptime()),
    });
    return;
  }

  const githubMatch = url.pathname.match(/^\/api\/github\/([^/]+)$/);
  if (githubMatch) {
    if (!enforceRateLimit(request, response, "github-scan", GITHUB_SCAN_MAX, GITHUB_SCAN_WINDOW_MS)) return;
    await handleGitHubRequest(request, response, githubMatch[1]);
    return;
  }

  await serveStatic(request, response);
}

const server = http.createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    sendError(response, 500, error.message || "Internal server error.");
  });
});

server.listen(PORT, HOST, () => {
  console.log(`DevDex server running at http://${HOST}:${PORT}`);
  console.log(`GitHub token: ${GITHUB_TOKEN ? "enabled" : "not set"}`);
});
