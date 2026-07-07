const fallbackDeveloper = {
  username: "saransh",
  displayName: "Saransh",
  avatarUrl: "assets/dev-avatar.svg",
  bio: "Prototype developer profile",
  metrics: {
    publicRepos: 42,
    totalStars: 1280,
    totalForks: 210,
    followers: 340,
    languageCount: 8,
    recentRepos: 16,
    contributionEvents: 38,
    contributedRepos: 9,
    pushes: 18,
    pullRequests: 7,
    issues: 3,
    codeReviews: 4,
    releases: 1,
  },
  fields: {
    spark: { label: "Spark", score: 78 },
    tide: { label: "Tide", score: 86 },
    forge: { label: "Forge", score: 82 },
    mind: { label: "Mind", score: 98 },
  },
};

const fieldDefinitions = {
  spark: {
    label: "Spark",
    theme: "frontend",
    type: "Spark Type",
    className: "Interface Alchemist",
    stage: "Stage 2 Builder",
    languages: ["JavaScript", "TypeScript", "HTML", "CSS", "SCSS", "Vue", "Svelte", "Astro", "Dart"],
    keywords: ["frontend", "front-end", "ui", "ux", "react", "next", "vue", "svelte", "css", "design-system", "web"],
    attacks: [
      ["Pixel Perfect Push", "Deals bonus damage when UI polish and fast commits line up."],
      ["Component Chain", "Stacks power for every reusable pattern in the repo."],
    ],
    weakness: "Legacy CSS",
    resist: "Debugging",
    ability: ["Hot Reload Aura", "Preview speed increases whenever the codebase stays modular."],
    flavor: "Turns rough ideas into tiny, shining interfaces.",
  },
  tide: {
    label: "Tide",
    theme: "python",
    type: "Tide Type",
    className: "Data Channeler",
    stage: "Stage 1 Analyst",
    languages: ["Python", "Jupyter Notebook", "R", "Julia", "MATLAB", "SQL", "PLpgSQL", "PowerShell"],
    keywords: ["data", "etl", "notebook", "analytics", "pipeline", "automation", "scraper", "pandas", "numpy"],
    attacks: [
      ["Notebook Surge", "Draws insight from messy data and doubles clarity on repeat runs."],
      ["Automation Wave", "Reduces manual effort for each script maintained this turn."],
    ],
    weakness: "Cold Starts",
    resist: "APIs",
    ability: ["Clean Room Logic", "Transforms repeated tasks into calm, reliable routines."],
    flavor: "Quiet near dashboards, dangerous near CSV files, calm when pipelines turn green.",
  },
  forge: {
    label: "Forge",
    theme: "systems",
    type: "Forge Type",
    className: "Systems Smith",
    stage: "Stage 3 Engineer",
    languages: ["Go", "Rust", "C", "C++", "C#", "Java", "Kotlin", "Scala", "Shell", "Dockerfile", "HCL"],
    keywords: ["backend", "server", "api", "database", "infra", "docker", "kubernetes", "compiler", "runtime", "performance"],
    attacks: [
      ["Zero Cost Strike", "Hits harder when performance budgets stay untouched."],
      ["Kernel Guard", "Blocks regressions with tests, types, and stubborn patience."],
    ],
    weakness: "Scope Creep",
    resist: "Latency",
    ability: ["Memory Safe Mantle", "Structural bugs lose power whenever constraints are made explicit."],
    flavor: "Forges simple tools by solving the hard edges underneath.",
  },
  mind: {
    label: "Mind",
    theme: "ai",
    type: "Mind Type",
    className: "Model Tactician",
    stage: "Stage 2 Researcher",
    languages: ["Python", "Jupyter Notebook", "C++", "CUDA", "Julia", "R"],
    keywords: [
      "ai",
      "ml",
      "machine-learning",
      "deep-learning",
      "neural",
      "llm",
      "gpt",
      "transformer",
      "pytorch",
      "tensorflow",
      "model",
      "research",
      "vision",
      "nlp",
    ],
    attacks: [
      ["Vector Dream", "Searches hidden patterns and adds precision for every clean dataset."],
      ["Prompt Prism", "Splits vague intent into structured actions with surprising accuracy."],
    ],
    weakness: "Noisy Labels",
    resist: "Refactors",
    ability: ["Context Window", "Keeps long chains of reasoning intact under pressure."],
    flavor: "Maps blurry problems until the next move becomes obvious.",
  },
};

const rarityModes = {
  standard: {
    className: "rarity-standard",
    hpBonus: 0,
    overallBonus: 0,
    damageBonus: 0,
    edition: "Public Scan",
    set: "DEV-001",
    collector: "DEV-001/151",
    symbol: "★",
    stamp: "Holo Candidate",
    abilityPrefix: "",
    flavorPrefix: "",
  },
  legendary: {
    className: "rarity-legendary",
    hpBonus: 56,
    overallBonus: 4,
    damageBonus: 12,
    edition: "Black Gold Proof",
    set: "DEV-999",
    collector: "DEV-999/151",
    symbol: "✦",
    stamp: "Legendary Contributor",
    abilityPrefix: "Elite ",
    flavorPrefix: "Secret pull. ",
  },
};

const card = document.querySelector("#dev-card");
const appShell = document.querySelector("#app-shell");
const homePage = document.querySelector("#home-page");
const studioPage = document.querySelector("#studio-page");
const binderPage = document.querySelector("#binder-page");
const form = document.querySelector("#trainer-form");
const usernameInput = document.querySelector("#username");
const statList = document.querySelector("#stat-list");
const fieldChips = [...document.querySelectorAll(".theme-chip")];
const statusEl = document.querySelector("#fetch-status");
const avatarImage = document.querySelector("#avatar-image");
const saveCardButton = document.querySelector("#save-card");
const copySummaryButton = document.querySelector("#copy-summary");
const copyLinkButton = document.querySelector("#copy-link");
const downloadCardButton = document.querySelector("#download-card");
const openProfileButton = document.querySelector("#open-profile");
const studioTriggers = [...document.querySelectorAll("[data-studio-trigger]")];
const homeTriggers = [...document.querySelectorAll("[data-home-trigger]")];
const binderTriggers = [...document.querySelectorAll("[data-binder-trigger]")];
const termButtons = [...document.querySelectorAll("[data-term]")];
const revealSections = [...document.querySelectorAll(".reveal-on-scroll")];
const termKicker = document.querySelector("#term-kicker");
const termTitle = document.querySelector("#term-title");
const termCopy = document.querySelector("#term-copy");
const termImpact = document.querySelector("#term-impact");
const termMeter = document.querySelector(".term-meter");
const binderGrid = document.querySelector("#binder-grid");
const binderEmpty = document.querySelector("#binder-empty");
const binderCount = document.querySelector("#binder-count");
const binderLegendaryCount = document.querySelector("#binder-legendary-count");
const binderUpdated = document.querySelector("#binder-updated");
const binderStatus = document.querySelector("#binder-status");
const exportBinderButton = document.querySelector("#export-binder");
const importBinderInput = document.querySelector("#import-binder");
const clearBinderButton = document.querySelector("#clear-binder");

const CACHE_PREFIX = "devdex:v4:github:";
const BINDER_KEY = "devdex:v1:binder";
const BINDER_LIMIT = 36;
const CACHE_TTL_MS = 1000 * 60 * 60 * 6;
let routedUsername = "";
let activeViewName = "home";
let viewSwitchTimer;

const termGlossary = {
  spark: {
    kicker: "Spark Field",
    title: "Interface energy",
    copy: "Spark reads frontend languages, UI repositories, design-system work, web apps, and visible product polish.",
    impact: "High Spark developers get interface specialties, visual polish moves, and themes with bright electric borders.",
    meter: "76%",
  },
  tide: {
    kicker: "Tide Field",
    title: "Data flow",
    copy: "Tide tracks notebooks, analytics, automation, scripts, pipelines, and calm control over messy information.",
    impact: "High Tide cards lean into data-channeler roles, clean-room abilities, and smooth blue-green treatments.",
    meter: "70%",
  },
  forge: {
    kicker: "Forge Field",
    title: "Systems craft",
    copy: "Forge looks for backend, infrastructure, runtime, performance, systems languages, and durable engineering work.",
    impact: "High Forge developers receive heavier attacks, sturdier resist labels, and warmer metal-edged card frames.",
    meter: "82%",
  },
  mind: {
    kicker: "Mind Field",
    title: "AI and research",
    copy: "Mind responds to machine learning, research repos, notebooks, model work, deep learning terms, and AI-heavy languages.",
    impact: "High Mind developers get model tactician identities, vector-flavored moves, and luminous rare-card styling.",
    meter: "88%",
  },
  rarity: {
    kicker: "Rarity System",
    title: "How elite pulls happen",
    copy: "Rarity combines the best field, second-best field, average strength, weakest field, and total DevDex score.",
    impact: "Legendary appears only for exceptional specialists, multi-domain elites, or genuinely strong all-rounders.",
    meter: "94%",
  },
  moves: {
    kicker: "Personalization",
    title: "Special moves",
    copy: "Moves are not generic labels. DevDex names them from the strongest domain plus repo names, languages, and profile evidence.",
    impact: "The same score can produce different moves if the public GitHub trail tells a different story.",
    meter: "86%",
  },
};

const fieldPersonalizers = {
  spark: {
    role: "Interface Crafter",
    moveWord: "Rally",
    secondMoveWord: "Component Chain",
    defaultWeakness: "Hydration Drift",
    defaultResist: "Design Systems",
    signals: [
      {
        keywords: ["react", "next", "jsx", "component"],
        specialty: "React Interface Shaper",
        moveWord: "Component Rally",
        weakness: "Hydration Drift",
        resist: "Reusable UI",
      },
      {
        keywords: ["css", "design", "theme", "style"],
        specialty: "Design System Crafter",
        moveWord: "Pixel Polish",
        weakness: "Visual Drift",
        resist: "Layout Bugs",
      },
      {
        keywords: ["web", "frontend", "ui", "ux"],
        specialty: "Web Experience Builder",
        moveWord: "Viewport Sweep",
        weakness: "Browser Quirks",
        resist: "Fast Feedback",
      },
    ],
  },
  tide: {
    role: "Pipeline Channeler",
    moveWord: "Data Surge",
    secondMoveWord: "Notebook Chain",
    defaultWeakness: "Cold Starts",
    defaultResist: "APIs",
    signals: [
      {
        keywords: ["data", "dataset", "analytics", "pandas", "numpy"],
        specialty: "Data Pipeline Diver",
        moveWord: "Dataset Current",
        weakness: "Schema Drift",
        resist: "Clean Data",
      },
      {
        keywords: ["scraper", "crawler", "automation", "bot"],
        specialty: "Automation Tidecaller",
        moveWord: "Scripted Sweep",
        weakness: "Rate Limits",
        resist: "Repeat Work",
      },
      {
        keywords: ["notebook", "jupyter", "analysis"],
        specialty: "Notebook Cartographer",
        moveWord: "Cell Cascade",
        weakness: "Messy Runs",
        resist: "Exploration",
      },
    ],
  },
  forge: {
    role: "Systems Smith",
    moveWord: "Core Strike",
    secondMoveWord: "Runtime Guard",
    defaultWeakness: "Scope Creep",
    defaultResist: "Latency",
    signals: [
      {
        keywords: ["kernel", "runtime", "compiler", "engine"],
        specialty: "Runtime Forgekeeper",
        moveWord: "Kernel Guard",
        weakness: "Undefined Edges",
        resist: "Low Latency",
      },
      {
        keywords: ["api", "server", "backend", "database"],
        specialty: "Backend Foundry Smith",
        moveWord: "Service Hammer",
        weakness: "Contract Drift",
        resist: "Load Spikes",
      },
      {
        keywords: ["docker", "kubernetes", "infra", "cloud"],
        specialty: "Infra Anvil Keeper",
        moveWord: "Deploy Mantle",
        weakness: "Config Sprawl",
        resist: "Outages",
      },
    ],
  },
  mind: {
    role: "Research Tactician",
    moveWord: "Vector Dream",
    secondMoveWord: "Prompt Prism",
    defaultWeakness: "Noisy Labels",
    defaultResist: "Refactors",
    signals: [
      {
        keywords: ["transformer", "gpt", "llm", "language-model"],
        specialty: "Transformer Architect",
        moveWord: "Attention Burst",
        weakness: "Context Loss",
        resist: "Long Reasoning",
      },
      {
        keywords: ["neural", "deep-learning", "pytorch", "tensorflow"],
        specialty: "Neural Systems Mapper",
        moveWord: "Gradient Pulse",
        weakness: "Noisy Labels",
        resist: "Benchmarks",
      },
      {
        keywords: ["vision", "nlp", "model", "research"],
        specialty: "Model Research Tactician",
        moveWord: "Research Prism",
        weakness: "Benchmark Drift",
        resist: "Paper Cuts",
      },
    ],
  },
};

let currentDeveloper = fallbackDeveloper;

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function titleCase(value) {
  return value
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatCompact(value) {
  return Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function formatFlavorText(text, fallback) {
  const source = (text || fallback || "").replace(/\s+/g, " ").trim();
  if (source.length <= 96) return source;
  return `${source.slice(0, 93).trim()}...`;
}

function logScore(value, reference) {
  if (!value) return 0;
  return clamp(Math.round((Math.log10(value + 1) / Math.log10(reference + 1)) * 100));
}

function setStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = `fetch-status ${type}`.trim();
}

function setLoading(isLoading) {
  const button = form.querySelector("button");
  appShell?.classList.toggle("is-loading", isLoading);
  button.disabled = isLoading;
  button.textContent = isLoading ? "Scanning" : "Preview";
}

function getCacheKey(username) {
  return `${CACHE_PREFIX}${username.toLowerCase()}`;
}

function readCachedDeveloper(username) {
  try {
    const cached = localStorage.getItem(getCacheKey(username));
    if (!cached) return null;

    const payload = JSON.parse(cached);
    if (!payload?.developer || Date.now() - payload.savedAt > CACHE_TTL_MS) {
      localStorage.removeItem(getCacheKey(username));
      return null;
    }

    return payload.developer;
  } catch {
    return null;
  }
}

function writeCachedDeveloper(username, developer) {
  try {
    localStorage.setItem(
      getCacheKey(username),
      JSON.stringify({
        savedAt: Date.now(),
        developer,
      }),
    );
  } catch {
    // Private browsing or storage quotas should not block card generation.
  }
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    if (response.status === 404) throw new Error("GitHub user not found.");
    if (response.status === 403) throw new Error("GitHub rate limit reached. Try again later.");
    throw new Error(`GitHub request failed (${response.status}).`);
  }

  return response.json();
}

async function fetchAppJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Request failed (${response.status}).`);
  }

  return payload;
}

function validateUsername(username) {
  const clean = username.trim().replace(/^@/, "");
  const valid = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(clean);
  if (!valid) throw new Error("Enter a valid GitHub username.");
  return clean;
}

function repoText(repo) {
  return [repo.name, repo.description, ...(repo.topics || [])].filter(Boolean).join(" ").toLowerCase();
}

function hasKeyword(repo, keywords) {
  const text = repoText(repo);
  return keywords.some((keyword) => text.includes(keyword));
}

function languageMatches(language, acceptedLanguages) {
  return acceptedLanguages.includes(language);
}

function getFieldRepoWeight(repo, definition) {
  let weight = 0;
  if (repo.language && languageMatches(repo.language, definition.languages)) weight += 2;
  if (hasKeyword(repo, definition.keywords)) weight += 3;
  return weight;
}

function normalizeLanguageTotals(languageResults, repos) {
  const totals = {};

  for (const result of languageResults) {
    if (result.status !== "fulfilled") continue;
    for (const [language, bytes] of Object.entries(result.value)) {
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

function summarizeActivity(events = []) {
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

function normalizeContributionStats(contributionStats = {}, activity = {}) {
  const fallback = getEmptyContributionStats();
  const normalized = { ...fallback, ...contributionStats };

  if (!normalized.hasGraphQL) {
    normalized.codeReviews = normalized.codeReviews || activity.codeReviews || 0;
    normalized.contributedRepositories = normalized.contributedRepositories || activity.contributedRepos || 0;
    normalized.issues = normalized.issues || activity.issues || 0;
    normalized.pullRequests = normalized.pullRequests || activity.pullRequests || 0;
    normalized.totalCommits = normalized.totalCommits || activity.pushes || 0;
    normalized.totalContributions = normalized.totalContributions || activity.contributionEvents || 0;
  }

  return normalized;
}

function getFieldLanguageShare(languageTotals, definition) {
  const totalBytes = Object.values(languageTotals).reduce((total, bytes) => total + bytes, 0);
  if (!totalBytes) return 0;

  const fieldBytes = Object.entries(languageTotals).reduce((total, [language, bytes]) => {
    return total + (languageMatches(language, definition.languages) ? bytes : 0);
  }, 0);

  return (fieldBytes / totalBytes) * 100;
}

function getRepoImpact(repo) {
  return repo.stargazers_count + repo.forks_count * 2;
}

function getDominantLanguages(languageTotals, repos) {
  const entries = Object.entries(languageTotals);
  if (entries.length > 0) {
    return entries
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([language]) => language);
  }

  const counts = {};
  repos.forEach((repo) => {
    if (!repo.language) return;
    counts[repo.language] = (counts[repo.language] || 0) + 1;
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([language]) => language);
}

function compactName(value, fallback = "Signature") {
  const clean = (value || fallback)
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const titled = titleCase(clean);
  return titled.length > 22 ? `${titled.slice(0, 19).trim()}...` : titled;
}

function getPrimaryFieldFromFields(fields) {
  return Object.entries(fields).reduce((best, current) => (current[1].score > best[1].score ? current : best));
}

function findPersonalSignal(primaryKey, repos, user) {
  const text = [user.bio, ...repos.map((repo) => repoText(repo))].filter(Boolean).join(" ").toLowerCase();
  const personalizer = fieldPersonalizers[primaryKey];
  return personalizer.signals.find((signal) => signal.keywords.some((keyword) => text.includes(keyword))) || null;
}

function getStageLabel(user, metrics, primaryDefinition) {
  if (metrics.accountAgeYears >= 10 || metrics.totalStars >= 50000) return "Stage 3 Veteran";
  if (metrics.accountAgeYears >= 5 || metrics.publicRepos >= 40) return primaryDefinition.stage;
  return "Stage 1 Builder";
}

function getWeakness(metrics, topRepo, dominantLanguage, signal, personalizer) {
  if (metrics.recentRepos === 0) return "Dormant Branches";
  if (metrics.totalContributions === 0 && metrics.contributionEvents === 0 && metrics.recentRepos <= 1) return "Quiet Feed";
  if (!topRepo?.description && metrics.totalStars < 1000) return "Sparse Signals";
  if (metrics.publicRepos >= 120) return "Repo Sprawl";
  if (dominantLanguage === "Jupyter Notebook") return "Messy Runs";
  return signal?.weakness || personalizer.defaultWeakness;
}

function getResistance(metrics, dominantLanguage, signal, personalizer) {
  if (metrics.totalStars >= 10000) return "Public Pressure";
  if ((metrics.pullRequests || 0) + (metrics.issues || 0) + (metrics.codeReviews || 0) >= 12) return "Collaboration";
  if ((metrics.totalCommits || 0) >= 250 || metrics.pushes >= 24) return "Commit Bursts";
  if ((metrics.contributedRepositories || 0) >= 20) return "Cross-Repo Work";
  if (metrics.languageCount >= 8) return "Context Switches";
  if (dominantLanguage) return `${dominantLanguage} Tooling`;
  return signal?.resist || personalizer.defaultResist;
}

function getActivityLine(metrics) {
  const collaborationCount = (metrics.pullRequests || 0) + (metrics.issues || 0) + (metrics.codeReviews || 0);
  if (metrics.totalContributions >= 1000) {
    return `Channels ${formatCompact(metrics.totalContributions)} yearly contribution signals into the card scan.`;
  }
  if (collaborationCount >= 10) {
    return `Adds ${collaborationCount} collaboration signals across pull requests, issues, and reviews.`;
  }
  if (metrics.totalCommits >= 250) return `Builds pressure from ${formatCompact(metrics.totalCommits)} commit contributions.`;
  if (metrics.pushes >= 12) return `Adds ${metrics.pushes} recent push pulses across public activity.`;
  if (metrics.contributedRepositories >= 6 || metrics.contributedRepos >= 6) {
    return `Touches ${metrics.contributedRepositories || metrics.contributedRepos} public repos in the contribution trail.`;
  }
  if (metrics.contributionEvents > 0) return `Adds ${metrics.contributionEvents} public activity signals to the scan.`;
  return `Stacks ${metrics.languageCount} language signals with ${metrics.recentRepos} recent repo pulses.`;
}

function buildProfileEvidence(user, repos, languageTotals, fields, metrics) {
  const [primaryKey] = getPrimaryFieldFromFields(fields);
  const primaryDefinition = fieldDefinitions[primaryKey];
  const sourceRepos = repos.filter((repo) => !repo.fork);
  const fieldRepos = sourceRepos
    .map((repo) => ({ repo, weight: getFieldRepoWeight(repo, primaryDefinition), impact: getRepoImpact(repo) }))
    .filter((entry) => entry.weight > 0)
    .sort((a, b) => b.impact * b.weight - a.impact * a.weight)
    .map((entry) => entry.repo);
  const topRepos = sourceRepos.sort((a, b) => getRepoImpact(b) - getRepoImpact(a)).slice(0, 5);
  const signatureRepo = fieldRepos[0] || topRepos[0] || null;
  const dominantLanguages = getDominantLanguages(languageTotals, repos);
  const signal = findPersonalSignal(primaryKey, fieldRepos.length ? fieldRepos : sourceRepos, user);
  const personalizer = fieldPersonalizers[primaryKey];
  const dominantLanguage = dominantLanguages[0] || signatureRepo?.language || "";
  const repoName = compactName(signatureRepo?.name, primaryDefinition.label);
  const repoImpact = signatureRepo ? getRepoImpact(signatureRepo) : 0;

  const specialty =
    signal?.specialty ||
    `${dominantLanguage && dominantLanguage !== primaryDefinition.label ? compactName(dominantLanguage) : primaryDefinition.label} ${
      personalizer.role
    }`;
  const attackOneName = signatureRepo ? `${repoName} ${signal?.moveWord || personalizer.moveWord}` : personalizer.moveWord;
  const attackOneCopy = signatureRepo
    ? `Channels ${formatCompact(repoImpact)} impact from ${signatureRepo.name} into ${primaryDefinition.label} pressure.`
    : `Builds around ${dominantLanguage || primaryDefinition.label} signals and turns them into field pressure.`;
  const attackTwoName = dominantLanguage ? `${compactName(dominantLanguage)} ${personalizer.secondMoveWord}` : personalizer.secondMoveWord;
  const attackTwoCopy = getActivityLine(metrics);
  const collaborationCount = (metrics.pullRequests || 0) + (metrics.issues || 0) + (metrics.codeReviews || 0);
  let abilityName = `${specialty} Focus`;
  let abilityCopy = `Turns ${dominantLanguage || primaryDefinition.label} work into a clear ${primaryDefinition.label} profile.`;

  if (metrics.totalContributions >= 1000) {
    abilityName = "Contribution Engine";
    abilityCopy = `A full-year scan finds ${formatCompact(metrics.totalContributions)} contributions with ${formatCompact(
      metrics.totalCommits || metrics.pushes || 0,
    )} commit signals.`;
  } else if (metrics.contributedRepositories >= 20) {
    abilityName = "Cross-Repo Compass";
    abilityCopy = `Contribution history touches ${formatCompact(metrics.contributedRepositories)} repositories without losing the ${primaryDefinition.label} signal.`;
  } else if (collaborationCount >= 10) {
    abilityName = "Maintainer Radar";
    abilityCopy = `Tracks ${formatCompact(collaborationCount)} public collaboration actions while keeping the ${primaryDefinition.label} identity visible.`;
  } else if (metrics.pushes >= 24) {
    abilityName = "Commit Pulse";
    abilityCopy = `Recent public activity shows ${formatCompact(metrics.pushes)} push bursts across the developer feed.`;
  } else if (signatureRepo && repoImpact >= 1000) {
    abilityName = `${repoName} Aura`;
    abilityCopy = `Signature repo ${signatureRepo.name} anchors the card with ${formatCompact(signatureRepo.stargazers_count)} stars and ${formatCompact(
      signatureRepo.forks_count,
    )} forks.`;
  } else if (metrics.languageCount >= 8) {
    abilityName = "Polyglot Mantle";
    abilityCopy = `Keeps ${metrics.languageCount} languages in play without losing the primary ${primaryDefinition.label} identity.`;
  }
  const flavorSource = user.bio || signatureRepo?.description;
  const flavor = flavorSource
    ? `${signatureRepo ? `Signature pull: ${signatureRepo.name}. ` : ""}${flavorSource}`
    : `Known for ${primaryDefinition.label.toLowerCase()} work led by ${dominantLanguage || "public repos"}.`;

  return {
    ability: [abilityName, abilityCopy],
    attacks: [
      [attackOneName, attackOneCopy],
      [attackTwoName, attackTwoCopy],
    ],
    dominantLanguages,
    flavor,
    signatureRepo: signatureRepo
      ? {
          name: signatureRepo.name,
          description: signatureRepo.description || "",
          language: signatureRepo.language || "",
          stars: signatureRepo.stargazers_count,
          forks: signatureRepo.forks_count,
          impact: repoImpact,
        }
      : null,
    specialty,
    stage: getStageLabel(user, metrics, primaryDefinition),
    weakness: getWeakness(metrics, signatureRepo, dominantLanguage, signal, personalizer),
    resist: getResistance(metrics, dominantLanguage, signal, personalizer),
  };
}

function calculateFieldScore(fieldKey, repos, languageTotals) {
  const definition = fieldDefinitions[fieldKey];
  const sourceRepos = repos.filter((repo) => !repo.fork);
  const repoCount = Math.max(sourceRepos.length, 1);
  const weightedRepos = sourceRepos
    .map((repo) => ({ repo, weight: getFieldRepoWeight(repo, definition) }))
    .filter((entry) => entry.weight > 0);

  const languageShare = getFieldLanguageShare(languageTotals, definition);
  const languageScore = clamp(languageShare * 1.45);
  const repoCoverageScore = clamp((weightedRepos.length / repoCount) * 140);
  const keywordScore = clamp(
    (sourceRepos.filter((repo) => hasKeyword(repo, definition.keywords)).length / repoCount) * 220,
  );
  const fieldStars = weightedRepos.reduce((total, entry) => total + entry.repo.stargazers_count * entry.weight, 0);
  const fieldForks = weightedRepos.reduce((total, entry) => total + entry.repo.forks_count * entry.weight, 0);
  const impactScore = logScore(fieldStars + fieldForks * 2, 200000);
  const signatureRepoImpact = weightedRepos.reduce((max, entry) => Math.max(max, getRepoImpact(entry.repo)), 0);
  const signatureScore = logScore(signatureRepoImpact, 50000);
  const recentCutoff = Date.now() - 1000 * 60 * 60 * 24 * 365;
  const recentScore = clamp(
    (weightedRepos.filter((entry) => new Date(entry.repo.pushed_at).getTime() >= recentCutoff).length /
      Math.max(weightedRepos.length, 1)) *
      100,
  );

  let score = Math.round(
    languageScore * 0.26 +
      repoCoverageScore * 0.15 +
      keywordScore * 0.14 +
      impactScore * 0.22 +
      signatureScore * 0.18 +
      recentScore * 0.05,
  );

  if (fieldKey === "mind" && signatureScore >= 96 && (keywordScore >= 35 || languageScore >= 70)) score += 16;
  if (signatureScore >= 94 && impactScore >= 76) score += 7;
  if (impactScore >= 90 && repoCoverageScore >= 45) score += 5;

  return clamp(score);
}

function getLanguageCount(languageTotals, repos) {
  const languageSet = new Set(Object.keys(languageTotals));
  repos.forEach((repo) => {
    if (repo.language) languageSet.add(repo.language);
  });
  return languageSet.size;
}

function buildDeveloperFromGitHub(user, repos, languageTotals, activity = {}, contributionStats = {}) {
  const publicRepos = user.public_repos || repos.length;
  const totalStars = repos.reduce((total, repo) => total + repo.stargazers_count, 0);
  const totalForks = repos.reduce((total, repo) => total + repo.forks_count, 0);
  const recentCutoff = Date.now() - 1000 * 60 * 60 * 24 * 180;
  const recentRepos = repos.filter((repo) => new Date(repo.pushed_at).getTime() >= recentCutoff).length;
  const languageCount = getLanguageCount(languageTotals, repos);
  const normalizedContributions = normalizeContributionStats(contributionStats, activity);
  const activityMetrics = {
    codeReviews: activity.codeReviews || 0,
    contributionEvents: activity.contributionEvents || 0,
    contributedRepos: activity.contributedRepos || 0,
    createEvents: activity.createEvents || 0,
    issues: activity.issues || 0,
    lastActiveAt: activity.lastActiveAt || "",
    pullRequests: activity.pullRequests || 0,
    pushes: activity.pushes || 0,
    releases: activity.releases || 0,
  };
  const metrics = {
    publicRepos,
    totalStars,
    totalForks,
    followers: user.followers || 0,
    following: user.following || 0,
    accountAgeYears: Math.max(1, new Date().getFullYear() - new Date(user.created_at).getFullYear()),
    languageCount,
    recentRepos,
    ...activityMetrics,
    contributedRepositories: normalizedContributions.contributedRepositories,
    hasContributionGraph: normalizedContributions.hasGraphQL,
    privateContributions: normalizedContributions.privateContributions,
    totalCommits: normalizedContributions.totalCommits,
    totalContributions: normalizedContributions.totalContributions,
    totalContributionIssues: normalizedContributions.issues,
    totalContributionPullRequests: normalizedContributions.pullRequests,
    totalContributionReviews: normalizedContributions.codeReviews,
    totalContributionRepositories: normalizedContributions.repositories,
  };

  const fields = Object.fromEntries(
    Object.keys(fieldDefinitions).map((key) => [
      key,
      {
        label: fieldDefinitions[key].label,
        score: calculateFieldScore(key, repos, languageTotals),
      },
    ]),
  );
  const profile = buildProfileEvidence(user, repos, languageTotals, fields, metrics);

  return {
    username: user.login,
    displayName: user.name || user.login,
    avatarUrl: user.avatar_url,
    bio: user.bio || "",
    profileUrl: user.html_url,
    metrics,
    fields,
    profile,
  };
}

async function fetchGitHubDeveloper(username) {
  const cleanUsername = validateUsername(username);
  const cachedDeveloper = readCachedDeveloper(cleanUsername);
  if (cachedDeveloper) return { developer: cachedDeveloper, cached: true };

  if (location.protocol !== "file:") {
    try {
      const payload = await fetchAppJson(`/api/github/${cleanUsername}`);
      const developer = buildDeveloperFromGitHub(
        payload.user,
        payload.repos,
        payload.languageTotals,
        payload.activity,
        payload.contributionStats,
      );
      writeCachedDeveloper(cleanUsername, developer);
      return {
        developer,
        cached: Boolean(payload.cache?.hit),
        source: payload.cache?.stale ? "server-stale" : "server",
      };
    } catch (error) {
      if (!error.message.includes("Not found") && !error.message.includes("Cannot GET")) {
        throw error;
      }
    }
  }

  const user = await fetchJson(`https://api.github.com/users/${cleanUsername}`);
  const repos = await fetchJson(
    `https://api.github.com/users/${cleanUsername}/repos?per_page=100&sort=updated&type=owner`,
  );
  const languageRepos = repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => b.stargazers_count + b.forks_count - (a.stargazers_count + a.forks_count))
    .slice(0, 12);
  const languageResults = await Promise.allSettled(languageRepos.map((repo) => fetchJson(repo.languages_url)));
  const languageTotals = normalizeLanguageTotals(languageResults, repos);
  const events = await fetchJson(`https://api.github.com/users/${cleanUsername}/events/public?per_page=100`).catch(() => []);
  const developer = buildDeveloperFromGitHub(user, repos, languageTotals, summarizeActivity(events));

  writeCachedDeveloper(cleanUsername, developer);
  return { developer, cached: false, source: "browser" };
}

function getFieldEntries(developer = currentDeveloper) {
  return Object.entries(developer.fields);
}

function getAverageScore(developer = currentDeveloper) {
  const scores = getFieldEntries(developer).map(([, field]) => field.score);
  return Math.round(scores.reduce((total, score) => total + score, 0) / scores.length);
}

function getDevDexScore(developer = currentDeveloper) {
  const scores = getFieldEntries(developer)
    .map(([, field]) => field.score)
    .sort((a, b) => b - a);
  const [best, secondBest, , weakest] = scores;
  const average = scores.reduce((total, score) => total + score, 0) / scores.length;

  return Math.round(best * 0.45 + secondBest * 0.2 + average * 0.25 + weakest * 0.1);
}

function getPrimaryField(developer = currentDeveloper) {
  return getFieldEntries(developer).reduce((best, current) => {
    return current[1].score > best[1].score ? current : best;
  });
}

function getRarityDecision(developer = currentDeveloper) {
  const entries = getFieldEntries(developer);
  const scores = entries.map(([, field]) => field.score);
  const averageScore = getAverageScore(developer);
  const devDexScore = getDevDexScore(developer);
  const [primaryKey, primaryField] = getPrimaryField(developer);
  const sortedScores = [...scores].sort((a, b) => b - a);
  const secondBest = sortedScores[1];
  const lowestScore = Math.min(...scores);

  if (primaryField.score >= 98 && devDexScore >= 84) {
    return {
      key: "legendary",
      path: `${primaryField.label} Specialist`,
      rarityLabel: "Legendary Contributor",
      primaryKey,
    };
  }

  if (primaryField.score >= 96 && secondBest >= 94 && devDexScore >= 91) {
    return {
      key: "legendary",
      path: "Multi-Domain Elite",
      rarityLabel: "Legendary Contributor",
      primaryKey,
    };
  }

  if (averageScore >= 92 && lowestScore >= 88 && primaryField.score >= 94) {
    return {
      key: "legendary",
      path: "All-Rounder",
      rarityLabel: "Legendary Contributor",
      primaryKey,
    };
  }

  if (devDexScore >= 95 && primaryField.score >= 94) {
    return {
      key: "legendary",
      path: "DevDex Elite",
      rarityLabel: "Legendary Contributor",
      primaryKey,
    };
  }

  if (devDexScore >= 86 || primaryField.score >= 92) {
    return {
      key: "standard",
      path: `${primaryField.label} Ace`,
      rarityLabel: "Ultra Rare",
      primaryKey,
    };
  }

  if (devDexScore >= 78 || primaryField.score >= 84) {
    return {
      key: "standard",
      path: "Skilled Builder",
      rarityLabel: "Holo Rare",
      primaryKey,
    };
  }

  if (devDexScore >= 68) {
    return {
      key: "standard",
      path: "Rising Builder",
      rarityLabel: "Rare",
      primaryKey,
    };
  }

  return {
    key: "standard",
    path: "Starter Builder",
    rarityLabel: "Binder Card",
    primaryKey,
  };
}

function getRarityDiagnostics(developer = currentDeveloper) {
  const entries = getFieldEntries(developer);
  const scores = entries.map(([, field]) => field.score);
  const sortedScores = [...scores].sort((a, b) => b - a);
  const averageScore = getAverageScore(developer);
  const devDexScore = getDevDexScore(developer);
  const [, primaryField] = getPrimaryField(developer);
  const bestScore = sortedScores[0];
  const secondBest = sortedScores[1];
  const weakestScore = sortedScores[sortedScores.length - 1];
  const gap = (value, target) => Math.max(0, target - value);

  const gates = [
    {
      label: `${primaryField.label} Specialist`,
      passed: bestScore >= 98 && devDexScore >= 84,
      missing: gap(bestScore, 98) + gap(devDexScore, 84),
      detail: `${primaryField.label} ${bestScore}/98 plus DevDex ${devDexScore}/84`,
    },
    {
      label: "Multi-Domain Elite",
      passed: bestScore >= 96 && secondBest >= 94 && devDexScore >= 91,
      missing: gap(bestScore, 96) + gap(secondBest, 94) + gap(devDexScore, 91),
      detail: `best ${bestScore}/96, second ${secondBest}/94, DevDex ${devDexScore}/91`,
    },
    {
      label: "All-Rounder",
      passed: averageScore >= 92 && weakestScore >= 88 && bestScore >= 94,
      missing: gap(averageScore, 92) + gap(weakestScore, 88) + gap(bestScore, 94),
      detail: `average ${averageScore}/92, weakest ${weakestScore}/88, best ${bestScore}/94`,
    },
    {
      label: "DevDex Elite",
      passed: devDexScore >= 95 && bestScore >= 94,
      missing: gap(devDexScore, 95) + gap(bestScore, 94),
      detail: `DevDex ${devDexScore}/95 plus best ${bestScore}/94`,
    },
  ];

  const passedGate = gates.find((gate) => gate.passed);
  const closestGate = passedGate || gates.reduce((closest, gate) => (gate.missing < closest.missing ? gate : closest));

  return {
    averageScore,
    bestScore,
    closestGate,
    devDexScore,
    passedGate,
    secondBest,
    weakestScore,
  };
}

function updateRarityRecipe(developer, rarityDecision) {
  const recipe = document.querySelector(".rarity-recipe");
  if (!recipe) return;

  const diagnostics = getRarityDiagnostics(developer);
  const gate = diagnostics.passedGate || diagnostics.closestGate;
  const passedLegendary = Boolean(diagnostics.passedGate);

  recipe.dataset.passed = String(passedLegendary);
  document.querySelector("#recipe-result").textContent = passedLegendary ? gate.label : `Next: ${gate.label}`;
  document.querySelector("#recipe-best").textContent = diagnostics.bestScore;
  document.querySelector("#recipe-second").textContent = diagnostics.secondBest;
  document.querySelector("#recipe-average").textContent = diagnostics.averageScore;
  document.querySelector("#recipe-weakest").textContent = diagnostics.weakestScore;
  document.querySelector("#recipe-devdex").textContent = diagnostics.devDexScore;
  document.querySelector("#recipe-copy").textContent = passedLegendary
    ? `Legendary triggered by ${gate.label}: ${gate.detail}.`
    : `${rarityDecision.rarityLabel} pull. Closest Legendary route is ${gate.label}: ${gate.detail}.`;
}

function getGeneratedStats(developer, primaryKey, rarityMode) {
  const { metrics } = developer;
  const fieldScore = developer.fields[primaryKey].score;
  const activityScore = logScore(metrics.totalContributions || metrics.contributionEvents || metrics.recentRepos, 5000);
  const collaborationSignals =
    metrics.totalForks +
    metrics.following +
    (metrics.totalContributionPullRequests || metrics.pullRequests || 0) * 18 +
    (metrics.totalContributionIssues || metrics.issues || 0) * 11 +
    (metrics.totalContributionReviews || metrics.codeReviews || 0) * 16 +
    (metrics.contributedRepositories || 0) * 9;
  const stats = [
    ["COD", "Code Activity", clamp(Math.round(fieldScore * 0.45 + activityScore * 0.35 + logScore(metrics.recentRepos, 30) * 0.2))],
    ["REP", "Repo Power", clamp(Math.round(logScore(metrics.publicRepos, 250) * 0.75 + fieldScore * 0.25))],
    ["STR", "Star Impact", logScore(metrics.totalStars, 200000)],
    ["COM", "Collaboration", clamp(Math.round(logScore(collaborationSignals, 15000) * 0.7 + 22))],
    ["LAN", "Language Range", clamp(Math.round(logScore(metrics.languageCount, 18) * 0.75 + fieldScore * 0.25))],
    ["INF", "Influence", clamp(Math.round(logScore(metrics.followers + metrics.totalStars, 250000) * 0.9 + 8))],
  ];

  return stats.map(([code, label, value]) => [code, label, clamp(value + rarityMode.overallBonus)]);
}

function updateFieldScoreboard(developer, primaryKey) {
  fieldChips.forEach((chip) => {
    const key = chip.dataset.field;
    const field = developer.fields[key];
    chip.classList.toggle("active", key === primaryKey);
    chip.style.setProperty("--score", field.score);
    chip.querySelector("span").textContent = field.label;
    chip.querySelector("strong").textContent = field.score;
  });
}

function getRenderedTraits(developer, primaryKey, primaryDefinition) {
  const profile = developer.profile || {};
  return {
    ability: profile.ability || primaryDefinition.ability,
    attacks: profile.attacks || primaryDefinition.attacks,
    className: profile.specialty || primaryDefinition.className,
    flavor: profile.flavor || developer.bio || primaryDefinition.flavor,
    resist: profile.resist || primaryDefinition.resist,
    stage: profile.stage || primaryDefinition.stage,
    weakness: profile.weakness || primaryDefinition.weakness,
  };
}

function updateCard(developer = currentDeveloper) {
  const devDexScore = getDevDexScore(developer);
  const [primaryKey] = getPrimaryField(developer);
  const primaryDefinition = fieldDefinitions[primaryKey];
  const rarityDecision = getRarityDecision(developer);
  const rarityMode = getRarityMode(rarityDecision);
  const overall = Math.min(99, devDexScore + rarityMode.overallBonus);
  const hp = 70 + overall + Math.round(logScore(developer.metrics.totalStars + developer.metrics.followers, 250000) * 0.35) + rarityMode.hpBonus;
  const traits = getRenderedTraits(developer, primaryKey, primaryDefinition);
  const attacks = traits.attacks;
  const generatedStats = getGeneratedStats(developer, primaryKey, rarityMode);

  updateFieldScoreboard(developer, primaryKey);
  updateRarityRecipe(developer, rarityDecision);

  card.className = `dev-card theme-${primaryDefinition.theme} ${rarityMode.className}`;
  card.classList.remove("card-updated");
  window.requestAnimationFrame(() => {
    card.classList.add("card-updated");
  });
  avatarImage.src = developer.avatarUrl || "assets/dev-avatar.svg";
  avatarImage.alt = `${developer.displayName} avatar`;
  document.querySelector("#card-name").textContent = developer.displayName;
  document.querySelector("#stage-label").textContent = traits.stage;
  document.querySelector("#card-hp").textContent = hp;
  document.querySelector("#type-badge").textContent = primaryDefinition.type;
  document.querySelector("#class-label").textContent = traits.className;
  document.querySelector("#overall-label").textContent = `${overall} OVR`;
  document.querySelector("#rarity-label").textContent = rarityDecision.rarityLabel;
  document.querySelector("#field-score-label").textContent = `${devDexScore} / 100`;
  document.querySelector("#rarity-path-label").textContent = rarityDecision.path;
  document.querySelector("#set-label").textContent = rarityMode.set;
  document.querySelector("#edition-label").textContent = rarityMode.edition;
  document.querySelector("#elite-stamp").textContent = rarityMode.stamp;
  document.querySelector("#attack-one-name").textContent = attacks[0][0];
  document.querySelector("#attack-one-copy").textContent = attacks[0][1];
  document.querySelector("#attack-one-damage").textContent = clamp(
    (primaryDefinition === fieldDefinitions.mind ? overall + 7 : overall - 2) + rarityMode.damageBonus,
    25,
    110,
  );
  document.querySelector("#attack-two-name").textContent = attacks[1][0];
  document.querySelector("#attack-two-copy").textContent = attacks[1][1];
  document.querySelector("#attack-two-damage").textContent = clamp(overall - 8 + rarityMode.damageBonus, 20, 105);
  document.querySelector("#weakness-label").textContent = traits.weakness;
  document.querySelector("#resist-label").textContent = traits.resist;
  document.querySelector("#retreat-label").textContent = `${clamp(Math.ceil(developer.metrics.publicRepos / 45), 1, 4)} tabs`;
  document.querySelector("#flavor-text").textContent = `${rarityMode.flavorPrefix}${formatFlavorText(
    traits.flavor,
    primaryDefinition.flavor,
  )}`;
  document.querySelector("#scan-title").textContent = `${primaryDefinition.label} profile`;
  document.querySelector("#ability-name").textContent = `${rarityMode.abilityPrefix}${traits.ability[0]}`;
  document.querySelector("#ability-copy").textContent = traits.ability[1];
  document.querySelector("#collector-number").textContent = rarityMode.collector;
  document.querySelector("#rarity-symbol").textContent = rarityMode.symbol;
  if (openProfileButton) {
    openProfileButton.disabled = !developer.profileUrl;
  }

  statList.innerHTML = generatedStats
    .map(
      ([code, label, value], index) => `
        <div class="stat-row" style="--stat-index: ${index}">
          <div class="stat-meta">
            <span>${code} ${label}</span>
            <strong>${value}</strong>
          </div>
          <div class="stat-meter" style="--value: ${value}%"><span></span></div>
        </div>
      `,
    )
    .join("");
}

function getCardSummary(developer = currentDeveloper) {
  const rarityDecision = getRarityDecision(developer);
  const [primaryKey, primaryField] = getPrimaryField(developer);
  const traits = getRenderedTraits(developer, primaryKey, fieldDefinitions[primaryKey]);
  const fieldList = getFieldEntries(developer)
    .map(([, field]) => `${field.label} ${field.score}`)
    .join(" | ");

  return [
    `${developer.displayName} (@${developer.username})`,
    `${rarityDecision.rarityLabel} - ${rarityDecision.path}`,
    `Type: ${fieldDefinitions[primaryKey].type}`,
    `Specialty: ${traits.className}`,
    `DevDex Score: ${getDevDexScore(developer)}/100`,
    `Primary Field: ${primaryField.label} ${primaryField.score}/100`,
    `Fields: ${fieldList}`,
    `Ability: ${traits.ability[0]}`,
    `Weakness: ${traits.weakness} | Resist: ${traits.resist}`,
    developer.profile?.signatureRepo ? `Signature Repo: ${developer.profile.signatureRepo.name}` : "",
    `Repos: ${formatCompact(developer.metrics.publicRepos)} | Stars: ${formatCompact(
      developer.metrics.totalStars,
    )} | Followers: ${formatCompact(developer.metrics.followers)}`,
    developer.metrics.totalContributions
      ? `Contribution Scan: ${formatCompact(developer.metrics.totalContributions)} total contributions`
      : `Activity Signals: ${formatCompact(developer.metrics.contributionEvents || 0)}`,
    developer.profileUrl || "",
  ]
    .filter(Boolean)
    .join("\n");
}

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeHtml(value) {
  return escapeXml(value).replace(/'/g, "&#39;");
}

function slugify(value) {
  return String(value || "devdex-card")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function wrapSvgText(value, maxChars = 54, maxLines = 2) {
  const words = String(value || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines = [];
  let line = "";

  for (const word of words) {
    const nextLine = line ? `${line} ${word}` : word;
    if (nextLine.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = nextLine;
    }

    if (lines.length === maxLines) break;
  }

  if (line && lines.length < maxLines) lines.push(line);
  if (words.length && lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/\.*$/, "")}...`;
  }

  return lines;
}

async function copyText(value, successMessage, blockedMessage = "Clipboard blocked by the browser, but the card is ready.") {
  try {
    await navigator.clipboard.writeText(value);
    setStatus(successMessage, "success");
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.append(textarea);
    textarea.select();

    const didCopy = document.execCommand("copy");
    textarea.remove();
    setStatus(didCopy ? successMessage : blockedMessage, didCopy ? "success" : "error");
  }
}

function getShareUrl(developer = currentDeveloper) {
  const url = new URL(window.location.href);
  url.searchParams.set("u", developer.username);
  url.hash = "studio";
  return url.toString();
}

function getShareUrlForUsername(username) {
  const url = new URL(window.location.href);
  url.searchParams.set("u", username);
  url.hash = "studio";
  return url.toString();
}

function readBinderCards() {
  try {
    const parsed = JSON.parse(localStorage.getItem(BINDER_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((entry) => entry && entry.username).slice(0, BINDER_LIMIT) : [];
  } catch {
    return [];
  }
}

function writeBinderCards(cards) {
  try {
    localStorage.setItem(BINDER_KEY, JSON.stringify(cards.slice(0, BINDER_LIMIT)));
  } catch {
    setStatus("Binder storage is full or blocked in this browser.", "error");
  }
}

function setBinderStatus(message, type = "") {
  if (!binderStatus) return;
  binderStatus.textContent = message;
  binderStatus.dataset.status = type;
}

function createBinderEntry(developer = currentDeveloper) {
  const rarityDecision = getRarityDecision(developer);
  const [primaryKey, primaryField] = getPrimaryField(developer);
  const primaryDefinition = fieldDefinitions[primaryKey];
  const traits = getRenderedTraits(developer, primaryKey, primaryDefinition);

  return {
    username: developer.username,
    displayName: developer.displayName,
    avatarUrl: developer.avatarUrl || "assets/dev-avatar.svg",
    profileUrl: developer.profileUrl || "",
    rarityLabel: rarityDecision.rarityLabel,
    isLegendary: rarityDecision.isLegendary,
    route: rarityDecision.route,
    type: primaryDefinition.type,
    fieldKey: primaryKey,
    themeClass: primaryDefinition.theme,
    fieldLabel: primaryField.label,
    className: traits.className,
    moveName: traits.attacks?.[0]?.[0] || primaryDefinition.attacks[0][0],
    score: getDevDexScore(developer),
    updatedAt: new Date().toISOString(),
  };
}

function normalizeBinderEntry(entry) {
  if (!entry?.username || !entry?.displayName) return null;
  const username = String(entry.username).trim().replace(/^@/, "");
  if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(username)) return null;

  const fieldKey = ["spark", "tide", "forge", "mind"].includes(entry.fieldKey) ? entry.fieldKey : "spark";
  const themeByField = {
    forge: "systems",
    mind: "ai",
    spark: "frontend",
    tide: "python",
  };

  return {
    username,
    displayName: String(entry.displayName).slice(0, 80),
    avatarUrl: String(entry.avatarUrl || "assets/dev-avatar.svg"),
    profileUrl: String(entry.profileUrl || `https://github.com/${username}`),
    rarityLabel: String(entry.rarityLabel || "Rare").slice(0, 40),
    isLegendary: Boolean(entry.isLegendary),
    route: String(entry.route || "").slice(0, 80),
    type: String(entry.type || `${fieldDefinitions[fieldKey].label} Type`).slice(0, 40),
    fieldKey,
    themeClass: String(entry.themeClass || themeByField[fieldKey]),
    fieldLabel: String(entry.fieldLabel || fieldDefinitions[fieldKey].label).slice(0, 40),
    className: String(entry.className || fieldDefinitions[fieldKey].className).slice(0, 80),
    moveName: String(entry.moveName || fieldDefinitions[fieldKey].attacks[0][0]).slice(0, 80),
    score: clamp(Number(entry.score) || 0, 0, 100),
    updatedAt: entry.updatedAt || new Date().toISOString(),
  };
}

function formatBinderDate(value) {
  if (!value) return "None";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "None";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function renderBinder() {
  if (!binderGrid) return;

  const cards = readBinderCards();
  const legendaryCards = cards.filter((entry) => entry.isLegendary);
  binderGrid.innerHTML = cards
    .map(
      (entry, index) => `
        <article class="binder-card theme-${escapeHtml(entry.themeClass || entry.fieldKey)} ${
          entry.isLegendary ? "binder-card-legendary" : ""
        }" style="--binder-index: ${index}">
          <div class="binder-sleeve-shine"></div>
          <div class="binder-card-topline">
            <span>${escapeHtml(entry.rarityLabel)}</span>
            <strong>${escapeHtml(entry.score)} OVR</strong>
          </div>
          <div class="binder-card-portrait">
            <img src="${escapeHtml(entry.avatarUrl)}" alt="${escapeHtml(entry.displayName)} avatar" loading="lazy" />
          </div>
          <div class="binder-card-body">
            <span>${escapeHtml(entry.type)}</span>
            <h3>${escapeHtml(entry.displayName)}</h3>
            <p>${escapeHtml(entry.className)} · ${escapeHtml(entry.moveName)}</p>
          </div>
          <div class="binder-card-actions">
            <button type="button" data-open-binder-username="${escapeHtml(entry.username)}">Open</button>
            <button type="button" data-copy-binder-link="${escapeHtml(entry.username)}">Link</button>
          </div>
        </article>
      `,
    )
    .join("");

  binderEmpty?.classList.toggle("is-hidden", cards.length > 0);
  binderGrid.classList.toggle("is-empty", cards.length === 0);
  if (binderCount) binderCount.textContent = String(cards.length);
  if (binderLegendaryCount) binderLegendaryCount.textContent = String(legendaryCards.length);
  if (binderUpdated) binderUpdated.textContent = formatBinderDate(cards[0]?.updatedAt);
  if (cards.length === 0) {
    setBinderStatus("Binder saves locally in this browser. Export it before switching devices.");
  }
}

function saveCardToBinder(developer = currentDeveloper, options = {}) {
  if (!developer?.username) {
    if (!options.silent) setStatus("Scan a GitHub profile before saving a card.", "error");
    return false;
  }

  const entry = createBinderEntry(developer);
  const cards = readBinderCards();
  const nextCards = [
    entry,
    ...cards.filter((cardEntry) => cardEntry.username.toLowerCase() !== entry.username.toLowerCase()),
  ].slice(0, BINDER_LIMIT);

  writeBinderCards(nextCards);
  renderBinder();
  if (!options.silent) {
    setStatus(`${entry.displayName} saved to your local DevDex binder.`, "success");
  }
  return true;
}

function openBinderEntry(username) {
  const url = new URL(window.location.href);
  url.searchParams.set("u", username);
  url.hash = "studio";
  window.history.pushState({}, "", url);
  routeFromHash();
}

function exportBinder() {
  const cards = readBinderCards();
  const payload = {
    app: "DevDex",
    exportedAt: new Date().toISOString(),
    version: 1,
    cards,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `devdex-binder-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setBinderStatus(`Exported ${cards.length} saved card${cards.length === 1 ? "" : "s"}.`, "success");
}

function importBinderFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const payload = JSON.parse(String(reader.result || "{}"));
      const importedCards = Array.isArray(payload) ? payload : payload.cards;
      if (!Array.isArray(importedCards)) throw new Error("Binder file does not contain cards.");

      const existingCards = readBinderCards();
      const merged = [...importedCards.map(normalizeBinderEntry).filter(Boolean), ...existingCards];
      const seen = new Set();
      const nextCards = [];

      for (const entry of merged) {
        const key = entry.username.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        nextCards.push(entry);
      }

      writeBinderCards(nextCards.slice(0, BINDER_LIMIT));
      renderBinder();
      setBinderStatus(`Imported ${Math.min(nextCards.length, BINDER_LIMIT)} card${nextCards.length === 1 ? "" : "s"}.`, "success");
    } catch (error) {
      setBinderStatus(error.message || "Could not import this binder file.", "error");
    } finally {
      if (importBinderInput) importBinderInput.value = "";
    }
  });
  reader.addEventListener("error", () => {
    setBinderStatus("Could not read this binder file.", "error");
    if (importBinderInput) importBinderInput.value = "";
  });
  reader.readAsText(file);
}

function clearBinder() {
  const cards = readBinderCards();
  if (cards.length === 0) {
    setBinderStatus("Binder is already empty.");
    return;
  }

  localStorage.removeItem(BINDER_KEY);
  renderBinder();
  setBinderStatus("Binder cleared from this browser.", "success");
}

function getExportTheme(primaryKey, rarityDecision) {
  const standardThemes = {
    spark: { a: "#fff1a8", b: "#f59f35", c: "#5ec77d", ink: "#2b1706" },
    tide: { a: "#dff7ff", b: "#47d7ff", c: "#3ddc97", ink: "#072637" },
    forge: { a: "#ffe0b5", b: "#b46c32", c: "#7e8b92", ink: "#231a14" },
    mind: { a: "#f2e4ff", b: "#8f6cff", c: "#47d7ff", ink: "#211535" },
  };

  if (rarityDecision.isLegendary) {
    return { a: "#fff4b8", b: "#d4af37", c: "#17120f", ink: "#fff4d0" };
  }

  return standardThemes[primaryKey] || standardThemes.spark;
}

function getRarityMode(rarityDecision) {
  return rarityModes[rarityDecision.key] || rarityModes.standard;
}

function createCardSvg(developer = currentDeveloper) {
  const rarityDecision = getRarityDecision(developer);
  const [primaryKey, primaryField] = getPrimaryField(developer);
  const primaryDefinition = fieldDefinitions[primaryKey];
  const traits = getRenderedTraits(developer, primaryKey, primaryDefinition);
  const rarityMode = getRarityMode(rarityDecision);
  const theme = getExportTheme(primaryKey, rarityDecision);
  const devDexScore = getDevDexScore(developer);
  const hp = clamp(90 + devDexScore + Math.round((developer.metrics.followers || 0) / 90) + rarityMode.hpBonus, 80, 320);
  const attacks = traits.attacks || primaryDefinition.attacks;
  const flavorLines = wrapSvgText(formatFlavorText(traits.flavor, primaryDefinition.flavor), 68, 2);
  const attackOneLines = wrapSvgText(attacks[0][1], 56, 2);
  const attackTwoLines = wrapSvgText(attacks[1][1], 56, 2);
  const avatar = escapeXml(developer.avatarUrl || "assets/dev-avatar.svg");
  const exportDate = new Date().toISOString().slice(0, 10);

  const textLines = (lines, x, y, size, color, gap = 18, style = "") =>
    lines
      .map((line, index) => `<text x="${x}" y="${y + index * gap}" font-size="${size}" fill="${color}" ${style}>${escapeXml(line)}</text>`)
      .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1000" viewBox="0 0 720 1000" role="img" aria-label="${escapeXml(
    developer.displayName,
  )} DevDex card">
  <defs>
    <linearGradient id="frame" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="${theme.a}" />
      <stop offset="0.48" stop-color="${theme.b}" />
      <stop offset="1" stop-color="${theme.c}" />
    </linearGradient>
    <linearGradient id="foil" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.72" />
      <stop offset="0.45" stop-color="${theme.b}" stop-opacity="0.22" />
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.08" />
    </linearGradient>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="${rarityDecision.isLegendary ? "#fff4d0" : "#5d4522"}" stroke-opacity="0.14" />
    </pattern>
    <clipPath id="portraitClip"><rect x="150" y="210" width="420" height="250" rx="28" /></clipPath>
  </defs>
  <rect width="720" height="1000" rx="46" fill="#17120f" />
  <rect x="34" y="30" width="652" height="940" rx="42" fill="url(#frame)" />
  <rect x="54" y="52" width="612" height="896" rx="34" fill="${rarityDecision.isLegendary ? "#201811" : "#fff4d0"}" />
  <rect x="54" y="52" width="612" height="896" rx="34" fill="url(#grid)" />
  <path d="M90 84 H590" stroke="url(#foil)" stroke-width="10" stroke-linecap="round" opacity="0.52" />
  <text x="88" y="118" font-family="Consolas, monospace" font-size="20" font-weight="700" letter-spacing="3" fill="${theme.ink}" opacity="0.78">${escapeXml(
    traits.stage,
  ).toUpperCase()}</text>
  <text x="88" y="174" font-family="Trebuchet MS, Arial, sans-serif" font-size="46" font-weight="900" fill="${theme.ink}">${escapeXml(
    developer.displayName,
  ).toUpperCase()}</text>
  <text x="574" y="112" font-family="Trebuchet MS, Arial, sans-serif" font-size="20" font-weight="900" text-anchor="end" fill="#e84f3d">HP</text>
  <text x="632" y="168" font-family="Trebuchet MS, Arial, sans-serif" font-size="64" font-weight="900" text-anchor="end" fill="${theme.ink}">${hp}</text>
  <rect x="104" y="192" width="512" height="292" rx="30" fill="url(#frame)" stroke="${theme.ink}" stroke-opacity="0.52" stroke-width="6" />
  <rect x="126" y="212" width="468" height="252" rx="24" fill="#ffffff" opacity="0.36" />
  <image href="${avatar}" x="150" y="210" width="420" height="250" preserveAspectRatio="xMidYMid slice" clip-path="url(#portraitClip)" />
  <rect x="424" y="418" width="158" height="48" rx="24" fill="${rarityDecision.isLegendary ? "#2c2117" : "#fff6d8"}" stroke="${theme.ink}" stroke-opacity="0.24" />
  <text x="503" y="448" font-family="Consolas, monospace" font-size="17" font-weight="900" text-anchor="middle" fill="${theme.ink}">${escapeXml(
    primaryDefinition.type,
  ).toUpperCase()}</text>
  <rect x="88" y="514" width="544" height="58" rx="10" fill="${rarityDecision.isLegendary ? theme.b : "#6b3d08"}" />
  <text x="110" y="552" font-family="Trebuchet MS, Arial, sans-serif" font-size="27" font-weight="900" fill="${
    rarityDecision.isLegendary ? "#211608" : "#fff4d0"
  }">${escapeXml(traits.className).toUpperCase()}</text>
  <text x="606" y="552" font-family="Trebuchet MS, Arial, sans-serif" font-size="27" font-weight="900" text-anchor="end" fill="${
    rarityDecision.isLegendary ? "#211608" : "#fff4d0"
  }">${devDexScore} OVR</text>
  <text x="92" y="624" font-family="Trebuchet MS, Arial, sans-serif" font-size="31" font-weight="900" fill="${theme.ink}">${escapeXml(
    attacks[0][0],
  )}</text>
  ${textLines(attackOneLines, 92, 652, 18, theme.ink, 20, 'opacity="0.78"')}
  <text x="612" y="652" font-family="Trebuchet MS, Arial, sans-serif" font-size="42" font-weight="900" text-anchor="end" fill="${theme.ink}">${clamp(
    primaryField.score + rarityMode.damageBonus,
    10,
    130,
  )}</text>
  <path d="M88 704 H632" stroke="${theme.ink}" stroke-opacity="0.18" stroke-width="3" />
  <text x="92" y="752" font-family="Trebuchet MS, Arial, sans-serif" font-size="31" font-weight="900" fill="${theme.ink}">${escapeXml(
    attacks[1][0],
  )}</text>
  ${textLines(attackTwoLines, 92, 780, 18, theme.ink, 20, 'opacity="0.78"')}
  <text x="612" y="780" font-family="Trebuchet MS, Arial, sans-serif" font-size="42" font-weight="900" text-anchor="end" fill="${theme.ink}">${clamp(
    devDexScore - 8 + rarityMode.damageBonus,
    20,
    130,
  )}</text>
  <rect x="88" y="826" width="544" height="72" rx="12" fill="${rarityDecision.isLegendary ? "#14100f" : "#fff2bd"}" stroke="${theme.ink}" stroke-opacity="0.22" />
  <text x="118" y="854" font-family="Consolas, monospace" font-size="17" font-weight="900" fill="${theme.ink}" opacity="0.62">WEAKNESS</text>
  <text x="118" y="880" font-family="Trebuchet MS, Arial, sans-serif" font-size="19" font-weight="900" fill="${theme.ink}">${escapeXml(traits.weakness)}</text>
  <text x="308" y="854" font-family="Consolas, monospace" font-size="17" font-weight="900" fill="${theme.ink}" opacity="0.62">RESIST</text>
  <text x="308" y="880" font-family="Trebuchet MS, Arial, sans-serif" font-size="19" font-weight="900" fill="${theme.ink}">${escapeXml(traits.resist)}</text>
  <text x="500" y="854" font-family="Consolas, monospace" font-size="17" font-weight="900" fill="${theme.ink}" opacity="0.62">RARITY</text>
  <text x="500" y="880" font-family="Trebuchet MS, Arial, sans-serif" font-size="19" font-weight="900" fill="${theme.ink}">${escapeXml(
    rarityDecision.rarityLabel,
  )}</text>
  ${textLines(flavorLines, 88, 922, 17, theme.ink, 20, 'font-style="italic" opacity="0.78"')}
  <text x="88" y="958" font-family="Consolas, monospace" font-size="16" fill="${theme.ink}" opacity="0.72">@${escapeXml(
    developer.username,
  )} - ${escapeXml(rarityMode.collector)} - ${exportDate}</text>
  <text x="632" y="958" font-family="Trebuchet MS, Arial, sans-serif" font-size="24" font-weight="900" text-anchor="end" fill="${theme.ink}">${escapeXml(
    rarityMode.symbol,
  )}</text>
</svg>`;
}

function downloadCardSvg() {
  const svg = createCardSvg(currentDeveloper);
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slugify(currentDeveloper.username)}-devdex-card.svg`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setStatus("DevDex SVG card downloaded.", "success");
}

async function copyCardSummary() {
  const summary = getCardSummary(currentDeveloper);
  await copyText(summary, "Card summary copied to clipboard.");
}

async function copyShareLink() {
  const shareUrl = getShareUrl(currentDeveloper);
  await copyText(shareUrl, "Share link copied to clipboard.", `Clipboard blocked. Share URL: ${shareUrl}`);
}

function openGitHubProfile() {
  if (!currentDeveloper.profileUrl) {
    setStatus("Scan a real GitHub profile before opening it.", "error");
    return;
  }

  window.open(currentDeveloper.profileUrl, "_blank", "noopener,noreferrer");
}

function setView(view) {
  const activeView = view === "studio" || view === "binder" ? view : "home";
  if (activeView !== activeViewName) {
    activeViewName = activeView;
    appShell?.classList.add("is-view-switching");
    window.clearTimeout(viewSwitchTimer);
    viewSwitchTimer = window.setTimeout(() => {
      appShell?.classList.remove("is-view-switching");
    }, 360);
  }

  appShell?.classList.toggle("home-active", activeView === "home");
  appShell?.classList.toggle("studio-active", activeView === "studio");
  appShell?.classList.toggle("binder-active", activeView === "binder");
  homePage?.setAttribute("aria-hidden", activeView === "home" ? "false" : "true");
  studioPage?.setAttribute("aria-hidden", activeView === "studio" ? "false" : "true");
  binderPage?.setAttribute("aria-hidden", activeView === "binder" ? "false" : "true");

  if (activeView === "studio") {
    window.requestAnimationFrame(() => usernameInput?.focus());
  }

  if (activeView === "binder") {
    renderBinder();
  }
}

function getRouteUsername() {
  const params = new URLSearchParams(window.location.search);
  const username = params.get("u") || params.get("username");
  return username ? username.trim() : "";
}

function routeFromHash() {
  const routeUsername = getRouteUsername();
  const binderRequested = window.location.hash === "#binder";
  const homeRequested = window.location.hash === "#home";
  const studioRequested = window.location.hash === "#studio" || Boolean(routeUsername);
  setView(homeRequested ? "home" : binderRequested ? "binder" : studioRequested ? "studio" : "home");

  if (!homeRequested && routeUsername && routeUsername.toLowerCase() !== routedUsername.toLowerCase()) {
    routedUsername = routeUsername;
    usernameInput.value = routeUsername;
    scanUsername(routeUsername);
  }
}

function selectTerm(termKey) {
  const term = termGlossary[termKey] || termGlossary.spark;
  termButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.term === termKey);
  });

  if (termKicker) termKicker.textContent = term.kicker;
  if (termTitle) termTitle.textContent = term.title;
  if (termCopy) termCopy.textContent = term.copy;
  if (termImpact) termImpact.textContent = term.impact;
  termMeter?.style.setProperty("--term-meter", term.meter);
}

function setupMotionDetails() {
  termButtons.forEach((button, index) => {
    button.style.setProperty("--reveal-index", index);
  });

  document.querySelectorAll(".rarity-track span").forEach((item, index) => {
    item.style.setProperty("--reveal-index", index);
  });

  if (!("IntersectionObserver" in window)) {
    revealSections.forEach((section) => section.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16 },
  );

  revealSections.forEach((section) => observer.observe(section));
}

async function scanUsername(username) {
  setLoading(true);
  setStatus("Scanning public GitHub profile...");

  try {
    const { developer, cached, source } = await fetchGitHubDeveloper(username);
    currentDeveloper = developer;
    updateCard(currentDeveloper);
    saveCardToBinder(currentDeveloper, { silent: true });
    const sourceLabel = source === "server-stale" ? "Loaded stale server cache" : cached ? "Loaded cached scan" : "Scanned";
    const contributionLabel = developer.metrics.hasContributionGraph
      ? `${formatCompact(developer.metrics.totalContributions)} contribution signals`
      : `${formatCompact(developer.metrics.contributionEvents || 0)} activity signals`;
    setStatus(
      `${sourceLabel} @${developer.username}: ${formatCompact(developer.metrics.publicRepos)} repos, ${formatCompact(
        developer.metrics.totalStars,
      )} stars, ${contributionLabel}.`,
      "success",
    );
  } catch (error) {
    const message =
      error instanceof TypeError && error.message === "Failed to fetch"
        ? "Could not reach GitHub from this browser session."
        : error.message || "Could not scan this profile.";
    setStatus(message, "error");
  } finally {
    setLoading(false);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await scanUsername(usernameInput.value);
});

studioTriggers.forEach((button) => {
  button.addEventListener("click", () => {
    window.location.hash = "studio";
  });
});

homeTriggers.forEach((button) => {
  button.addEventListener("click", () => {
    window.location.hash = "home";
  });
});

binderTriggers.forEach((button) => {
  button.addEventListener("click", () => {
    window.location.hash = "binder";
  });
});

termButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectTerm(button.dataset.term);
  });
});

homePage?.addEventListener("pointermove", (event) => {
  const rect = homePage.getBoundingClientRect();
  const x = (event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
  const y = (event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
  homePage.style.setProperty("--hero-x", x.toFixed(3));
  homePage.style.setProperty("--hero-y", y.toFixed(3));
});

window.addEventListener("hashchange", routeFromHash);

copySummaryButton?.addEventListener("click", copyCardSummary);
copyLinkButton?.addEventListener("click", copyShareLink);
saveCardButton?.addEventListener("click", () => saveCardToBinder(currentDeveloper));
downloadCardButton?.addEventListener("click", downloadCardSvg);
openProfileButton?.addEventListener("click", openGitHubProfile);
exportBinderButton?.addEventListener("click", exportBinder);
importBinderInput?.addEventListener("change", () => importBinderFile(importBinderInput.files?.[0]));
clearBinderButton?.addEventListener("click", clearBinder);

binderGrid?.addEventListener("click", async (event) => {
  const target = event.target.closest("button");
  if (!target) return;

  const openUsername = target.dataset.openBinderUsername;
  const copyUsername = target.dataset.copyBinderLink;

  if (openUsername) {
    openBinderEntry(openUsername);
    return;
  }

  if (copyUsername) {
    const shareUrl = getShareUrlForUsername(copyUsername);
    await copyText(shareUrl, "Binder card link copied.", `Clipboard blocked. Share URL: ${shareUrl}`);
  }
});

card.addEventListener("pointermove", (event) => {
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  const rotateX = (0.5 - y) * 8;
  const rotateY = (x - 0.5) * 10;
  card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  card.style.setProperty("--shine-x", `${x * 100}%`);
  card.style.setProperty("--shine-y", `${y * 100}%`);
});

card.addEventListener("pointerleave", () => {
  card.style.transform = "";
  card.style.setProperty("--shine-x", "30%");
  card.style.setProperty("--shine-y", "20%");
});

setupMotionDetails();
selectTerm("spark");
routeFromHash();
updateCard(currentDeveloper);
renderBinder();

window.devdex = {
  createCardSvg,
  getCardSummary,
  getRarityDiagnostics,
  getRarityDecision,
  getShareUrl,
  renderBinder,
  exportBinder,
  clearBinder,
  saveCardToBinder,
  scanUsername,
  updateCard,
};
