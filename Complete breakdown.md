Here's the complete architecture breakdown with every file's role:

---

## 🏗️ Project Architecture — DevSight

---

### Root Level

```
devsight/
├── README.md              # Project overview, quick-start, tech stack table, all commands
├── .env.example           # Template for all required env vars with descriptions
├── .gitignore             # Excludes node_modules, dist, .env.local, docker volumes
└── .prettierrc            # Code formatting rules (single quotes, 2 spaces, trailing commas)
```

---

### `docker/` — Container Configuration

```
docker/
├── Dockerfile.client      # Multi-stage: development (Vite HMR) → builder → nginx production
├── Dockerfile.server      # Multi-stage: development (tsx watch) → builder → Node production
├── docker-compose.yml     # Local dev: wires frontend + api with volume mounts and HMR
└── docker-compose.prod.yml # Production simulation: built images + nginx reverse proxy
```

The client Dockerfile uses **nginx** to serve the Vite static build in production. Both Dockerfiles use layered caching (dependencies installed before source copy) so rebuilds are fast.

---

### `docs/` — Documentation

```
docs/
├── architecture/
│   └── system-overview.md  # Full topology diagram, data flow, state management layers
└── workflows/
    └── local-development.md # Step-by-step: OAuth app creation, env setup, auth flow diagram, troubleshooting
```

---

### `server/` — Express API (Node.js + TypeScript)

```
server/
├── package.json            # Dependencies: express, express-session, cors, helmet, morgan, node-fetch
├── tsconfig.json           # CommonJS output, strict mode, outputs to dist/
└── src/
    ├── index.ts            # App entry: registers middleware stack (helmet → cors → session → morgan → routes)
    ├── config/
    │   └── index.ts        # Validates + exports all env vars; throws on missing required vars
    ├── types/
    │   └── session.d.ts    # Extends express-session SessionData with accessToken + user fields
    └── api/
        ├── middleware/
        │   └── auth.middleware.ts    # requireAuth guard: blocks requests without a session token
        ├── services/
        │   └── github.service.ts    # Low-level fetch wrappers: githubFetch() (REST) + githubGraphQL()
        ├── controllers/
        │   ├── auth.controller.ts   # OAuth handlers: initiateAuth → handleCallback → getAuthStatus → logout
        │   └── github.controller.ts # Proxy handlers: forwards client requests to GitHub with session token
        └── routes/
            ├── auth.routes.ts       # GET /api/auth/github, /callback, /status  POST /api/auth/logout
            ├── github.routes.ts     # All /api/github/* routes, all guarded by requireAuth middleware
            └── health.routes.ts     # GET /api/health — returns status + timestamp for uptime checks
```

**Key design:** The GitHub access token is stored **only in the server-side session cookie** — never sent to the browser. The client calls `/api/github/*` and the server injects the token transparently.

---

### `client/` — React Frontend (Vite + TypeScript + Tailwind)

#### Config Files

```
client/
├── package.json            # Dependencies: react, react-router-dom, @tanstack/react-query, recharts, lucide-react, date-fns, clsx
├── vite.config.ts          # Path alias (@/ → src/), dev proxy to API, manual chunk splitting for optimal bundles
├── tailwind.config.ts      # Extended theme: brand colors, surface palette, font stacks, animation keyframes, custom shadows
├── tsconfig.json           # Strict TS, path aliases, bundler module resolution
├── tsconfig.node.json      # Separate config for vite.config.ts itself
├── postcss.config.js       # Tailwind + autoprefixer pipeline
├── index.html              # Shell HTML: Inter + JetBrains Mono fonts, OG meta tags, root div
└── nginx.conf              # SPA fallback (try_files → index.html), gzip, 1-year asset caching
```

#### `src/` — Application Source

**Entry Points**

```
src/
├── main.tsx                # createRoot + StrictMode render
└── App.tsx                 # Provider tree: BrowserRouter → QueryClient → ThemeProvider → AuthProvider → AppRouter
```

**Router**

```
src/router/
└── AppRouter.tsx           # All routes: public (PublicLayout), auth (no layout), protected (AppShell + ProtectedRoute), nested settings, 404 fallback. All pages are lazy-loaded.
```

**Contexts**

```
src/contexts/
├── AuthContext.tsx          # Fetches /api/auth/status on mount; exposes isAuthenticated, user, login(), logout()
└── ThemeContext.tsx         # Manages dark/light/system preference; syncs .dark class on <html>; persists to localStorage
```

**Types**

```
src/types/
├── github.types.ts          # GitHubUser, GitHubRepository, ContributionCalendar, ContributionWeek, ContributionDay
├── dashboard.types.ts       # KPIStats, LanguageStat, StreakData, RepoWithStats, FilterState, TimeRange
├── insights.types.ts        # Insight, InsightCategory, InsightSentiment, InsightPriority, ProductivityScore
└── api.types.ts             # ApiResponse<T>, ApiError, AuthStatus, OAuthInitResponse
```

**Config**

```
src/config/
├── constants.ts             # APP_NAME, API_URL, LANGUAGE_COLORS map (40+ languages), SCORE_GRADES, feature flags
├── routes.ts                # ROUTES object — all path strings as typed constants
└── queryKeys.ts             # Stable query key factories for TanStack Query + CACHE_TTL values per data type
```

**Services**

```
src/services/
├── github/
│   ├── rest.ts              # Typed fetch wrappers: getUser(), getRepositories(), getRepoLanguages(), getCommitActivity()
│   ├── graphql.ts           # graphqlFetch() → POST /api/github/graphql; getContributions() entry point
│   └── queries.ts           # CONTRIBUTIONS_QUERY GraphQL string (ContributionCalendar + totals)
└── analytics/
    ├── insights.ts          # Rule engine: generateInsights() — produces Insight[] from streak/repos/trend/language data
    ├── scoring.ts           # calculateProductivityScore() — 4-axis breakdown (consistency/volume/diversity/momentum) → 0–100 + grade
    └── nanoid.ts            # Tiny crypto.getRandomValues ID generator (no external dep)
```

**Hooks**

```
src/hooks/
├── useGitHubProfile.ts      # useQuery wrappers for REST user profile
├── useRepositories.ts       # useQuery for repo list, repo languages, commit activity
├── useContributions.ts      # useQuery → GraphQL contributions; selects contributionsCollection directly
├── useInsights.ts           # Derived hook: composes contributions + repos → runs analytics engine → returns insights + score
└── useUtils.ts              # useDebounce, useLocalStorage, useIsDark, useClickOutside, useMediaQuery, useIsMobile
```

**Utils (pure functions)**

```
src/utils/
├── date.utils.ts            # formatDate, formatRelativeDate, getLast52Weeks, groupByMonth (wraps date-fns)
├── format.utils.ts          # formatNumber (1k/1M), formatBytes, formatPercentage, truncateString, pluralize
├── color.utils.ts           # getLanguageColor, hexToRgba, getContrastColor, getHeatmapColor (dark/light aware)
└── analytics.utils.ts       # calculateStreaks, getContributionLevel, computeLanguageStats, getWeeklyCommitTrend, getDayOfWeekDistribution
```

**Atoms** — smallest indivisible UI primitives

```
src/components/atoms/
├── Button/Button.tsx        # Polymorphic button: variant (primary/secondary/ghost/danger), size, loading spinner, icons
├── Avatar/Avatar.tsx        # Circular image with ring, 5 sizes (xs → xl), lazy loading
├── Badge/Badge.tsx          # Pill label: 6 color variants, optional language dot
├── Spinner/Spinner.tsx      # Animated border-based spinner, 3 sizes, aria-label
└── KPINumber/KPINumber.tsx  # Animated count-up number using requestAnimationFrame with ease-out-cubic
```

**Molecules** — composed from atoms

```
src/components/molecules/
├── StatCard/StatCard.tsx    # KPI card: icon + animated value + trend badge (↑↓ with color)
├── RepoCard/RepoCard.tsx    # Repository tile: name, description, stars/forks/language, relative update time
├── InsightCard/InsightCard.tsx  # Left-border insight: sentiment icon + title + description + metric + trend
├── SearchInput/SearchInput.tsx  # Input with search icon prefix and clear (×) button suffix
└── StreakBadge/StreakBadge.tsx  # Flame icon + count, fills flame on active streak, 3 sizes
```

**Layout** — structural shells and guards

```
src/components/layout/
├── AppShell/AppShell.tsx    # Authenticated shell: Sidebar + TopBar + <Outlet /> main content area
├── Sidebar/Sidebar.tsx      # Collapsible nav (240px ↔ 64px): logo, nav links with active state, user info
├── TopBar/TopBar.tsx        # Sticky header: page title, public profile link, theme toggle, sign out
├── PublicLayout/PublicLayout.tsx  # Marketing shell: sticky nav, footer, Connect GitHub CTA
└── ProtectedRoute.tsx       # Auth guard: shows spinner while loading, redirects to /auth/login if unauthed
```

**Charts** — Recharts wrappers with dark mode awareness

```
src/charts/
├── ContributionCalendar/    # GitHub-style contribution heatmap: 52 weeks × 7 days, month labels, legend, tooltips
├── CommitActivityChart/     # Area chart of weekly commits with gradient fill and custom tooltips
├── LanguagePieChart/        # Donut chart with inline percentage labels and custom legend
└── MiniSparkline/           # Minimal line chart for embedding in cards, no axes
```

**Pages**

```
src/pages/
├── Home/
│   ├── HomePage.tsx          # Assembles the three marketing sections
│   └── sections/
│       ├── HeroSection.tsx   # Headline + Connect GitHub CTA + stats row + grid background + glow effect
│       ├── FeaturesSection.tsx  # 6-feature grid with icons and descriptions
│       └── CTASection.tsx    # Bottom conversion card with gradient background
│
├── Auth/
│   ├── AuthPage.tsx          # Login page: GitHub OAuth button + feature bullets + privacy note
│   └── AuthCallbackPage.tsx  # Handles ?code= after GitHub redirect; waits then navigates to /dashboard
│
├── Dashboard/
│   ├── DashboardPage.tsx     # Main dashboard: KPI strip, heatmap, commit chart, streak, language pie, top repos, insights preview
│   └── widgets/
│       ├── KPIStrip.tsx      # 4-card grid (commits, repos, streak, score) with skeleton loading
│       ├── HeatmapWidget.tsx # Card wrapper around ContributionCalendar with loading skeleton
│       └── StreakWidget.tsx  # Current + longest streak side by side with total active days
│
├── Repositories/
│   └── RepositoriesPage.tsx  # Split-panel: left = filterable/sortable repo list, right = repo analytics (language chart)
│
├── Insights/
│   └── InsightsPage.tsx      # Score ring SVG, 4-axis breakdown bars, quick stats row, insights grouped by category
│
├── Portfolio/
│   └── PortfolioPage.tsx     # Preview of public portfolio: profile, language bar, calendar, featured repos, copy link
│
├── Settings/
│   └── SettingsPage.tsx      # Tabbed settings shell + ProfileSettings, AppearanceSettings, PrivacySettings, AccountSettings
│
├── PublicProfile/
│   └── PublicProfilePage.tsx # Fully public shareable page at /u/:username — no auth required to view
│
└── NotFound/
    └── NotFoundPage.tsx      # 404 page with large background number and back-to-home button
```

---

### Data Flow Summary

```
Browser → AuthContext (/api/auth/status)
        → TanStack Query → /api/github/* (REST/GraphQL)
        → Express server injects GitHub token from session
        → GitHub API responds
        → Pure analytics utils derive insights + score
        → Components render with dark-mode-aware charts
```

Every GitHub API call travels through the Express server which injects the OAuth token from the session — the token is never exposed to the browser.

## 1. Tech Languages Used in DevSight

---

### Languages

| Language                   | Where Used                                                    | Purpose                                                             |
| -------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------- |
| **TypeScript**             | `client/src/**` + `server/src/**`                             | Primary language for all application code — strict typed throughout |
| **TSX (TypeScript + JSX)** | `client/src/components/**`, `client/src/pages/**`             | All React UI components and pages                                   |
| **CSS**                    | `client/src/styles/globals.css`                               | Global design tokens, Tailwind layers, component utility classes    |
| **HTML**                   | `client/index.html`                                           | Single shell HTML file — fonts, meta tags, OG tags, root div        |
| **JSON**                   | `package.json`, `tsconfig.json` files                         | Dependency manifests and TypeScript compiler configuration          |
| **YAML**                   | `docker/docker-compose.yml`, `docker/docker-compose.prod.yml` | Container orchestration definitions                                 |
| **Dockerfile** (DSL)       | `docker/Dockerfile.client`, `docker/Dockerfile.server`        | Multi-stage container build instructions                            |
| **Nginx config**           | `client/nginx.conf`                                           | Static file serving rules, SPA fallback, gzip, cache headers        |
| **Markdown**               | `README.md`, `docs/**`                                        | Documentation and setup guides                                      |

---

### Frameworks, Libraries & Runtimes

| Category               | Technology                      |
| ---------------------- | ------------------------------- |
| Runtime                | Node.js 20                      |
| Frontend framework     | React 18                        |
| Build tool             | Vite 5                          |
| Styling                | Tailwind CSS 3                  |
| Routing                | React Router v6                 |
| Server state / caching | TanStack Query (React Query) v5 |
| Charts                 | Recharts                        |
| Icons                  | Lucide React                    |
| Backend framework      | Express 4                       |
| Auth                   | GitHub OAuth 2.0                |
| Session management     | express-session                 |
| Security middleware    | Helmet, CORS                    |
| Date utilities         | date-fns                        |
| Class utilities        | clsx                            |
| Dev containerization   | Docker + Docker Compose         |

---

---

## 2. Step-by-Step Setup Guide

Starting from just the `.zip` file on a Windows machine.

---

### Step 1 — Install Required Tools

Install these before anything else.

**Node.js 20+**

- Download from https://nodejs.org (choose LTS)
- After install, verify in terminal:

```bash
node --version    # should print v20.x.x or higher
npm --version     # should print 10.x.x or higher
```

**Docker Desktop**

- Download from https://www.docker.com/products/docker-desktop
- Install and launch it — make sure the Docker whale icon appears in the system tray
- Verify:

```bash
docker --version
docker compose version
```

**Git (optional but recommended)**

- Download from https://git-scm.com/download/win

---

### Step 2 — Extract the ZIP

1. Right-click `devsight_v2.zip`
2. Select **Extract All…**
3. Choose a destination, e.g. `C:\Projects\devsight`
4. Click **Extract**

You should now have this folder:

```
C:\Projects\devsight\
├── client\
├── server\
├── docker\
├── docs\
├── README.md
├── .env.example
└── .gitignore
```

Open a terminal in that folder. The easiest way on Windows: navigate to the folder in File Explorer, then click the address bar, type `cmd` or `powershell`, press Enter.

---

### Step 3 — Create a GitHub OAuth App

DevSight needs a GitHub OAuth app to authenticate users. This is free and takes 2 minutes.

1. Go to https://github.com/settings/developers
2. Click **New OAuth App**
3. Fill in the form exactly like this:

| Field                      | Value                                     |
| -------------------------- | ----------------------------------------- |
| Application name           | `DevSight Local`                          |
| Homepage URL               | `http://localhost:3000`                   |
| Authorization callback URL | `http://localhost:4000/api/auth/callback` |

4. Click **Register application**
5. On the next screen, copy the **Client ID** — you'll need it shortly
6. Click **Generate a new client secret**, then copy that too

> Keep this browser tab open — you'll paste these values in the next step.

---

### Step 4 — Create Your Environment File

In the `devsight` folder, find `.env.example`. You need to copy it and fill it in.

**On Windows (Command Prompt):**

```cmd
copy .env.example .env.local
```

**On Windows (PowerShell):**

```powershell
Copy-Item .env.example .env.local
```

Now open `.env.local` in any text editor (Notepad, VS Code, etc.) and fill in your values:

```env
GITHUB_CLIENT_ID=paste_your_client_id_here
GITHUB_CLIENT_SECRET=paste_your_client_secret_here
SESSION_SECRET=any_long_random_string_at_least_32_characters_long
VITE_API_URL=http://localhost:4000
VITE_GITHUB_CLIENT_ID=paste_your_client_id_here
VITE_APP_URL=http://localhost:3000
```

For `SESSION_SECRET`, just type any long random string — for example:

```
SESSION_SECRET=xk92mPqL8vRtNwY3aB7cDeFgHjKlMnOpQrStUvWxYz1234567890
```

Save the file.

---

### Step 5 — Start the Project with Docker

Make sure Docker Desktop is running (check the system tray for the whale icon), then run:

```bash
docker compose -f docker/docker-compose.yml up --build
```

This will:

1. Pull Node.js and nginx base images
2. Install all `npm` dependencies inside the containers
3. Start the React frontend (Vite dev server)
4. Start the Express API server
5. Connect them together on a shared network

The first run takes **3–5 minutes** because it downloads Docker images and installs packages. You'll see logs streaming from both services. When you see output like this, it's ready:

```
frontend  |   VITE v5.x.x  ready in 800ms
frontend  |   ➜  Local: http://localhost:3000/
api       |  🚀 DevSight API running
api       |     URL:  http://localhost:4000
```

---

### Step 6 — Open the App

Open your browser and go to:

```
http://localhost:3000
```

You should see the DevSight home page. Click **Connect with GitHub**, authorize the app, and you'll land on your dashboard.

---

### Step 7 — Stopping and Restarting

**Stop the project:**

```bash
# Press Ctrl+C in the terminal where it's running
# Then run:
docker compose -f docker/docker-compose.yml down
```

**Restart later (no rebuild needed):**

```bash
docker compose -f docker/docker-compose.yml up
```

**Rebuild after code changes:**

```bash
docker compose -f docker/docker-compose.yml up --build
```

---

### Running Without Docker (Alternative)

If you don't want to use Docker, you can run both services directly with Node.js.

**Terminal 1 — Start the API:**

```bash
cd server
npm install
npm run dev
```

**Terminal 2 — Start the Frontend:**

```bash
cd client
npm install
npm run dev
```

Then open `http://localhost:3000` as before.

> For this to work, copy your env variables into both directories or keep `.env.local` in the root and ensure the server picks it up via `dotenv/config`.

---

### Troubleshooting

| Problem                                         | Fix                                                                                                            |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Docker says "port already in use"               | Another app is using port 3000 or 4000. Stop it or change the ports in `docker-compose.yml`                    |
| "Missing required env var" error on API startup | `.env.local` is missing or has empty values — re-check Step 4                                                  |
| GitHub redirects back with `error=oauth_failed` | Your callback URL in the GitHub OAuth app doesn't exactly match `http://localhost:4000/api/auth/callback`      |
| HMR (live reload) not working on Windows        | Add `CHOKIDAR_USEPOLLING=true` to the frontend service in `docker-compose.yml` — it's already there by default |
| Docker Desktop not starting                     | Make sure WSL 2 is enabled. Run `wsl --install` in PowerShell as Administrator                                 |
| `npm install` fails with peer dependency errors | Run `npm install --legacy-peer-deps` inside `client/` or `server/`                                             |
