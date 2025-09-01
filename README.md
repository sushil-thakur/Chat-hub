# chatHub (Slack-like) — Monorepo

Modern full‑stack chat app built with:
- Frontend: React (Vite), Clerk auth, React Query, Stream Chat UI SDK
- Backend: Express (ESM), MongoDB (Mongoose), Clerk (server), Inngest, Sentry
- Deploy: Vercel (frontend + backend)

## Monorepo structure

```
/ (repo root)
├─ backend/
│  ├─ src/
│  │  ├─ server.js                # Express app entry (ESM)
│  │  ├─ config/
│  │  │  ├─ env.js                # Loads env vars (dotenv) and exports ENV
│  │  │  ├─ db.js                 # Mongoose connect
│  │  │  ├─ stream.js             # Stream Chat server helpers
│  │  │  └─ inngest.js            # Inngest client + functions (Clerk webhooks)
│  │  ├─ routes/chat.routes.js    # /api/chat endpoints
│  │  ├─ controllers/chat.controller.js
│  │  ├─ middleware/auth.middleware.js
│  │  └─ models/user.model.js     # Mongo user model
│  ├─ instrument.mjs              # Sentry init for Node
│  ├─ vercel.json                 # Serverless routing (when needed)
│  └─ package.json
└─ frontend/
   ├─ src/
   │  ├─ main.jsx                 # App bootstrap, Sentry (browser), providers
   │  └─ App.jsx                  # Routes (protected with Clerk)
   ├─ pages/                      # Home, Auth, Call
   ├─ components/                 # Chat UI helpers (Channel preview, Users list)
   ├─ hooks/useStreamChat.js      # Connects current user to Stream Chat
   ├─ lib/axios.js                # Axios instance (baseURL per env)
   └─ package.json
```

## Features
- Email/social auth via Clerk (frontend + backend verification)
- Real‑time chat using Stream Chat (channels, DMs, unread counts)
- Optional video calling (Stream Video SDK)
- Background user sync with Inngest (Clerk user.created/user.deleted)
- MongoDB for app data (users)
- Sentry for error tracking (client + server)

## Prerequisites
- Node.js 18+ (LTS recommended)
- A MongoDB connection string (Atlas or local)
- Clerk app (publishable + secret keys)
- Stream Chat (API key + secret)
- Sentry DSNs (optional but recommended)

## Environment variables

Create a `.env` file in `backend/`:

```
# Server
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173            # no trailing slash
# optional: comma-separated extras (no trailing slashes)
# CLIENT_URLS=https://your-preview.vercel.app,https://chathub-frontend-six.vercel.app

# Database
MONGO_URL=your-mongodb-connection-string

# Clerk
CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Stream Chat (server)
STREAM_API_KEY=xxx
STREAM_API_SECRET=xxx

# Sentry (server)
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Inngest (optional, if used)
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...
```

Create a `.env` file in `frontend/` (or use Vite env):

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
VITE_STREAM_API_KEY=xxx
# Optional if you wire Sentry DSN via env
# VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

## Install & run (local dev)

From repo root (PowerShell):

1) Backend
- cd backend
- npm install
- npm run dev

2) Frontend
- cd ../frontend
- npm install
- npm run dev

App will be available on http://localhost:5173 and server on http://localhost:5001.

## API overview (backend)
- GET `/api/chat/token` → returns `{ token }` for current Clerk user
- Inngest endpoint (if used): `/api/inngest` (Clerk webhooks -> DB sync)

## Key implementation details

- Express app (`src/server.js`)
  - CORS is configured early and uses ENV.CLIENT_URL (+ optional CLIENT_URLS).
  - Avoid trailing slashes in origins to prevent Vercel CORS mismatches.
  - Clerk middleware populates `req.auth` for protected routes.

- Clerk protection (`src/middleware/auth.middleware.js`)
  - Ensures `req.auth.userId` and `sessionId` are present, otherwise 401.

- Stream Chat (server, `src/config/stream.js`)
  - `generateStreamToken(userId)` issues tokens for the authenticated user.
  - Helpers to upsert/delete users and add users to public channels.

- Stream Chat (client, `frontend/hooks/useStreamChat.js`)
  - Fetches token from `/api/chat/token`, runs `client.connectUser(...)`.
  - Disconnect is skipped in dev to avoid StrictMode double‑mount noise.

- Sentry
  - Backend: initialized in `backend/instrument.mjs` and imported first by `server.js`.
  - Frontend: initialized in `src/main.jsx` and wraps router for tracing.

## Deployment (Vercel)

- Frontend: deploy `frontend/` as a Vite app.
- Backend: deploy `backend/` as a Vercel Node/Express app.
  - Set all backend env vars in Vercel (no trailing slashes in CLIENT_URL/CLIENT_URLS).
  - If using `vercel.json`, ensure routes point to `src/server.js`.

CORS on Vercel
- The server normalizes origins (strips trailing `/`) and compares against allowlist.
- Ensure your frontend origin matches exactly, e.g. `https://chathub-frontend-six.vercel.app` (no trailing `/`).

## Common pitfalls & fixes

- CORS preflight fails
  - Ensure CLIENT_URL matches frontend origin exactly and has no trailing slash.
  - For multiple origins, set `CLIENT_URLS` as a comma‑separated list.

- SSL error in dev (ERR_SSL_PROTOCOL_ERROR)
  - Use `http://localhost:5001` (not https) for local backend.

- Express 5 wildcard errors (path-to-regexp)
  - Use regex for catch‑all OPTIONS: `app.options(/.*/, ...)`.

- 500 from `/api/chat/token`
  - Must be signed in; backend reads `req.auth.userId`.
  - Check `STREAM_API_KEY/SECRET` are set and valid.

- Stream Chat token/session warnings in dev
  - React StrictMode runs effects twice; transient warnings are expected.

## Scripts

Backend (`backend/package.json`):
- `npm run dev` → nodemon src/server.js
- `npm start` → node src/server.js

Frontend (`frontend/package.json`):
- `npm run dev` → vite
- `npm run build` → vite build
- `npm run preview` → vite preview

## License
Not specified.
