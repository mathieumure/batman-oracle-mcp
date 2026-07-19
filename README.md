# Batman Oracle Mcp

NX monorepo containing the Batman Oracle MCP server and its supporting packages.

## Packages

| Package           | Tech                      | Description                              |
| ----------------- | ------------------------- | ---------------------------------------- |
| `packages/mcp-ui` | Vite + React + TypeScript | UI components served by the MCP server   |
| `packages/mcp`    | Node + TypeScript         | MCP server (`@modelcontextprotocol/sdk`) |
| `packages/slides` | Slidev                    | Presentation                             |
| `packages/data`   | Redis (Docker)            | Data layer                               |

## Prerequisites

- [pnpm](https://pnpm.io/) v9+
- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/) (for the `data` package)

## Installation

```bash
pnpm install
```

## How to run

Make sure Docker is running, then:

```bash
pnpm install
pnpm serve
```

`pnpm serve` builds `mcp-ui`, compiles `mcp`, starts Redis and the server together (see [Task graph](#task-graph)).

#### Check it's alive:

```bash
curl -s -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"smoke-test","version":"0.0.1"}}}'
```

A `200` with `result.serverInfo` means it's healthy.

#### Stop everything:

```bash
lsof -ti:3000 -sTCP:LISTEN | xargs -r kill
nx run data:stop
```

## Try it in Claude

claude.ai needs an HTTPS URL for custom connectors, so tunnel the local server:

```bash
ngrok http 3000
```

Grab the `https://...ngrok-free.dev` URL it prints.

1. **Settings** > **Connectors** > **Add custom connector**
2. URL: `https://<your-ngrok-domain>/mcp`
3. Connect, then enable the connector in a conversation
4. Ask for exemple "Alfred, montre-moi la liste des vilains". Claude calls `get_villains` and renders the `Villains` widget inline.

## Try the UI

- Vite dev server, fastest loop for UI/CSS work (no live MCP data):

```bash
pnpm dev:ui
```

Open `http://localhost:5173/src/villains/`. HMR on.

- MCP Inspector, raw protocol view (tools, resources, JSON-RPC):

```bash
cd packages/mcp && pnpm inspect
```

- ngrok inspector: while the tunnel above is running, `http://127.0.0.1:4040` shows every request/response crossing it.

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

## Task graph

When `pnpm serve` runs:

1. `mcp-ui:build` completes (Vite build)
2. `mcp:build` completes (tsup compilation)
3. `data:serve` and `node dist/index.js` start in parallel
