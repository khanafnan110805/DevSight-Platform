# System Architecture Overview

## High-Level Topology

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│   React 18 + Vite + TanStack Query + Recharts + Tailwind    │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS / cookies
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   DevSight API (Express)                      │
│                                                               │
│  /api/auth/*        GitHub OAuth 2.0 flow                    │
│  /api/github/*      Authenticated GitHub REST proxy          │
│  /api/github/graphql  GitHub GraphQL proxy                   │
└────────────────────────────┬────────────────────────────────┘
                             │ access_token (Bearer)
                             ▼
                   ┌─────────────────────┐
                   │   GitHub REST API   │
                   │   GitHub GraphQL    │
                   └─────────────────────┘
```

---

## Client Architecture

```
src/
├── main.tsx                # Entry: StrictMode + root render
├── App.tsx                 # QueryClient + Providers tree
├── router/
│   └── AppRouter.tsx       # React Router v6 route definitions
│
├── contexts/
│   ├── AuthContext.tsx      # isAuthenticated, user, login(), logout()
│   └── ThemeContext.tsx     # theme state, CSS class management
│
├── hooks/                  # TanStack Query wrappers
│   ├── useContributions.ts
│   ├── useRepositories.ts
│   ├── useGitHubProfile.ts
│   └── useInsights.ts
│
├── services/
│   ├── github/
│   │   ├── rest.ts         # REST API calls → /api/github/*
│   │   ├── graphql.ts      # GraphQL → /api/github/graphql
│   │   └── queries.ts      # GQL query strings
│   └── analytics/
│       ├── insights.ts     # Rule-based insight generation engine
│       └── scoring.ts      # Productivity score calculation
│
├── components/
│   ├── atoms/              # Primitive UI (Button, Badge, Avatar…)
│   ├── molecules/          # Composed UI (StatCard, RepoCard…)
│   ├── organisms/          # Complex sections (ContributionHeatmap…)
│   └── layout/             # AppShell, Sidebar, TopBar, ProtectedRoute
│
├── charts/                 # Recharts wrappers
├── pages/                  # Route-level components
├── types/                  # TypeScript interfaces
├── utils/                  # Pure helpers (date, format, color, analytics)
└── config/                 # Constants, route names, query keys, cache TTLs
```

---

## Data Flow

```
User visits /dashboard
       │
       ▼
AuthProvider checks /api/auth/status
       │
       ├── Not authenticated → redirect /auth/login
       │
       └── Authenticated → render DashboardPage
               │
               ├── useContributions(username)
               │     └── TanStack Query → /api/github/graphql
               │           └── GitHub GraphQL → ContributionsCollection
               │
               ├── useRepositories(username)
               │     └── TanStack Query → /api/github/users/:username/repos
               │
               └── useInsights(username) — derived from above
                     ├── calculateStreaks()       (pure function)
                     ├── generateInsights()       (rule engine)
                     └── calculateProductivityScore()
```

---

## Session Management

Sessions are server-side only (express-session, in-memory store for development).
The access token is stored in the encrypted session cookie — never exposed to the client.

The client only receives:
- `{ authenticated: true, user: { login, name, avatar_url } }` from `/api/auth/status`

The actual GitHub access token lives exclusively on the server.

---

## State Management

No global client-side state management library (no Redux, no Zustand).
State is layered:

| Layer | Tool | Use |
|-------|------|-----|
| Server cache | TanStack Query | GitHub API responses with TTL |
| Auth state | React Context | Lightweight, rarely changes |
| Theme state | React Context + localStorage | Persisted preference |
| UI state | useState / useReducer | Local to each component |
| URL state | React Router | Active page, route params |
