# Local Development Setup

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 20+ | [nodejs.org](https://nodejs.org) |
| Docker Desktop | Latest | [docker.com](https://www.docker.com/products/docker-desktop/) |
| GitHub OAuth App | — | [Create one](https://github.com/settings/developers) |

---

## 1. Create a GitHub OAuth App

1. Go to [GitHub Developer Settings → OAuth Apps](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name:** `DevSight Local`
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:4000/api/auth/callback`
4. Click **Register application**
5. Copy the **Client ID** and generate a **Client Secret**

---

## 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
SESSION_SECRET=any_long_random_string_here
```

Generate a session secret quickly:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 3. Start with Docker (Recommended)

```bash
docker compose -f docker/docker-compose.yml up --build
```

Services:
- Frontend: http://localhost:3000
- API:      http://localhost:4000
- API health: http://localhost:4000/api/health

Hot-reloading works for both frontend and backend.

---

## 4. Start without Docker

### API (Terminal 1)
```bash
cd server
npm install
npm run dev
```

### Frontend (Terminal 2)
```bash
cd client
npm install
npm run dev
```

---

## 5. Authentication Flow

```
Browser                    DevSight API           GitHub
   │                           │                     │
   │ GET /api/auth/github       │                     │
   │──────────────────────────>│                     │
   │                           │ 302 → GitHub OAuth  │
   │<──────────────────────────│                     │
   │                                                  │
   │  User authorizes on GitHub                       │
   │──────────────────────────────────────────────── >│
   │<──────────────────────────────────────────────── │
   │ ?code=XXXX                                       │
   │                           │                     │
   │ GET /api/auth/callback?code=XXXX                 │
   │──────────────────────────>│                     │
   │                           │ Exchange code        │
   │                           │──────────────────── >│
   │                           │<──────────────────── │
   │                           │  access_token        │
   │                           │                     │
   │                           │ Store in session cookie
   │  302 → /dashboard         │
   │<──────────────────────────│
```

---

## Troubleshooting

### HMR not working in Docker on Windows
The `CHOKIDAR_USEPOLLING=true` env var in docker-compose.yml should handle this.
If it doesn't, add this to `client/vite.config.ts`:
```ts
server: {
  watch: { usePolling: true }
}
```

### "Missing required env var" on server start
Make sure `.env.local` exists and has all three required vars filled in.

### Session cookie not persisting
In development, ensure `sameSite: 'lax'` is set (handled by `NODE_ENV=development`).
