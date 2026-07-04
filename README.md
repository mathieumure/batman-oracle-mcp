# Batman Oracle Mcp

NX monorepo containing the Batman Oracle MCP server and its supporting packages.

## Packages

| Package | Tech | Description |
|---|---|---|
| `packages/mcp-ui` | Vite + React + TypeScript | UI components served by the MCP server |
| `packages/mcp` | Node + TypeScript | MCP server (`@modelcontextprotocol/sdk`) |
| `packages/slides` | Slidev | Presentation |
| `packages/data` | Redis (Docker) | Data layer |

## Prerequisites

- [pnpm](https://pnpm.io/) v9+
- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/) (for the `data` package)

## Installation

```bash
pnpm install
```

## Commands

### Start everything

Builds `mcp-ui`, compiles `mcp`, then starts Redis and the MCP server in parallel:

```bash
pnpm serve
```

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
