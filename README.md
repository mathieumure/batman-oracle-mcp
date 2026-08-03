# Batman Oracle Mcp

NX monorepo containing the Batman Oracle MCP server and its supporting packages.

## Packages

| Package             | Tech                      | Description                                            |
| ------------------- | ------------------------- | ------------------------------------------------------ |
| `packages/mcp-ui`   | Vite + React + TypeScript | UI components served by the MCP server                 |
| `packages/mcp`      | Node + TypeScript         | MCP server (`@modelcontextprotocol/sdk`)               |
| `packages/auth`     | Fastify + Better Auth     | OAuth 2.1 authorization server, see [AUTH.md](AUTH.md) |
| `packages/gcpd-api` | Fastify                   | Mock GCPD API (`/criminals`, `/crimes`)                |
| `packages/slides`   | Slidev                    | Presentation                                           |
| `packages/data`     | Redis (Docker)            | Data layer                                             |

## Prerequisites

- [pnpm](https://pnpm.io/) v9+
- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/) (for the `data` package)

## Installation

```bash
pnpm install
```

## Quick start

Everything needed for a working local setup reachable from Claude, in order:

```bash
pnpm install
npx nx run mcp-ui:build
npx nx run mcp:build

npx nx run auth:db:migrate                 # one-time, creates auth.db's tables on a fresh clone

npx nx run gcpd-api:dev &                  # mock GCPD API on :8080 (needed by get_criminals / get_crime_map)
npx tsx packages/auth/src/index.ts &       # auth server on :3001 (no build step, runs straight from source)
node packages/mcp/dist/index.js &          # MCP server on :3000
```

`packages/mcp` does not enforce OAuth by default (`REQUIRE_AUTH` is off), so the setup above works immediately for local tool iteration, `pnpm inspect`, etc. See [AUTH.md](AUTH.md) for how the auth actually works, and set `REQUIRE_AUTH=true` (see [Try it in Claude](#try-it-in-claude)) whenever the server is reachable from Claude or from anywhere outside your machine.

## How to run

See [Quick start](#quick-start) above for the full sequence. Once the MCP server is up:

#### Check it's alive:

```bash
curl -s -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"smoke-test","version":"0.0.1"}}}'
```

A `200` with `result.serverInfo` means it's healthy. If you started the server with `REQUIRE_AUTH=true`, expect a `401` here instead, see [AUTH.md](AUTH.md).

#### Stop everything:

```bash
lsof -ti:3000,3001 -sTCP:LISTEN | xargs -r kill
nx run data:stop
```

## Try it in Claude

claude.ai and Claude Desktop both need an HTTPS URL for custom connectors, so tunnel the local servers. Use **Cloudflare Tunnel**, not ngrok. Since OAuth now involves two servers (the MCP server and the auth server), tunnel both:

```bash
cloudflared tunnel --url http://localhost:3000   # MCP server, prints its own https://<mcp-tunnel>.trycloudflare.com
cloudflared tunnel --url http://localhost:3001   # auth server, prints its own https://<auth-tunnel>.trycloudflare.com
```

(`brew install cloudflared` if you don't have it. No account needed, the quick-tunnel command above is enough.)

Grab both `https://...trycloudflare.com` URLs, then restart both servers pointing at each other so the widget's own assets and the OAuth discovery URLs all point somewhere Claude can actually reach, not `localhost`:

```bash
lsof -ti:3000,3001 -sTCP:LISTEN | xargs -r kill
AUTH_ORIGIN=https://<auth-tunnel> MCP_ORIGIN=https://<mcp-tunnel> npx tsx packages/auth/src/index.ts &
REQUIRE_AUTH=true PUBLIC_ORIGIN=https://<mcp-tunnel> AUTH_ORIGIN=https://<auth-tunnel> node packages/mcp/dist/index.js &
```

`REQUIRE_AUTH=true` is required here, without it Claude can call every tool with no login at all.

The origin vars (`PUBLIC_ORIGIN`, `AUTH_ORIGIN`, `MCP_ORIGIN`) are a separate concern from `REQUIRE_AUTH`: they control whether the widget's assets and the OAuth discovery URLs point somewhere Claude can actually reach, not `localhost`. Skip them and the widget silently falls back to a generic rendering instead of the real one, and the OAuth flow fails outright since the auth server can't validate the MCP server as a resource, regardless of what `REQUIRE_AUTH` is set to.

There's no `.env` for this yet, it's plain env vars you set by hand each time the tunnels restart.

1. **Settings** > **Connectors** > **Add custom connector**
2. URL: `https://<mcp-tunnel>/mcp`
3. Connect: you'll be sent to the auth server's login page, then a consent screen. Log in as the seeded demo user, `alfred@wayne-enterprises.com` / `IAmBatman!123`, and allow the `mcp:tools` scope.
4. Ask for exemple "Alfred, montre-moi la liste des vilains". Claude calls `get_criminals` and renders the `Criminals` widget inline.

See [AUTH.md](AUTH.md) for how the OAuth flow works.

## Try the UI

- Vite dev server, fastest loop for UI/CSS work (no live MCP data):

```bash
pnpm dev:ui
```

Open `http://localhost:5173/src/criminals/`. HMR on.

- MCP Inspector, raw protocol view (tools, resources, JSON-RPC). Works against the default `REQUIRE_AUTH`-off setup from [Quick start](#quick-start), Inspector doesn't drive the OAuth login/consent flow:

```bash
cd packages/mcp && pnpm inspect
```

- ngrok inspector (only if you fell back to ngrok): while the tunnel is running, `http://127.0.0.1:4040` shows every request/response crossing it. `cloudflared` has no equivalent local dashboard.

## Commands

### Development

```bash
pnpm dev:ui        # mcp-ui — Vite dev server with HMR
pnpm dev:slides    # slides — Slidev dev server
```

### Per-package targets via NX

```bash
nx run mcp-ui:build    # Vite production build
nx run mcp:build       # Compile MCP server with tsup
nx run data:serve      # Start Redis (docker compose up)
nx run data:stop       # Stop Redis (docker compose down)
nx run slides:build    # Build Slidev presentation
nx run slides:export   # Export slides to PDF
```

### GCPD API

Mock HTTP API on `http://localhost:8080`. Start with `nx run gcpd-api:dev`, or use `pnpm dev:mcp` / `nx run mcp:dev` (starts gcpd-api alongside MCP).

| Route            | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| `GET /criminals` | Full criminals list (`get_criminals`, criminals widget in dev) |
| `GET /crimes`    | Full crimes list (`get_crime_map`)                             |

```bash
curl http://localhost:8080/criminals
curl http://localhost:8080/crimes
```

## Task graph

When `pnpm serve` runs:

1. `mcp-ui:build` completes (Vite build)
2. `mcp:build` completes (tsup compilation)
3. `data:serve` and `node dist/index.js` start in parallel
