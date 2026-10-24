#!/usr/bin/env node
import { execFileSync, spawn } from 'node:child_process';

const MCP_PORT = 3000;
const AUTH_PORT = 3001;
const GCPD_PORT = 8080;
const TUNNEL_TIMEOUT_MS = 30_000;
const REACHABLE_TIMEOUT_MS = 90_000;

const COLORS = { tunnel: 36, build: 33, gcpd: 35, auth: 34, mcp: 32 };
const children = [];
let shuttingDown = false;

const paint = (code, text) => `\x1b[${code}m${text}\x1b[0m`;
const log = (message) => console.log(`${paint(1, '▸')} ${message}`);

function pipeWithPrefix(stream, label) {
  let pending = '';
  stream.on('data', (chunk) => {
    const lines = (pending + chunk).split('\n');
    pending = lines.pop() ?? '';
    for (const line of lines) {
      if (line.trim()) console.log(`${paint(COLORS[label.split(':')[0]] ?? 0, label.padEnd(12))} ${line}`);
    }
  });
}

function run(label, command, args, { env = {}, quiet = false, onLine } = {}) {
  const child = spawn(command, args, {
    env: { ...process.env, ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
  });
  children.push(child);
  for (const stream of [child.stdout, child.stderr]) {
    if (!quiet) pipeWithPrefix(stream, label);
    if (onLine) stream.on('data', (chunk) => onLine(String(chunk)));
  }
  return child;
}

function runServer(label, args, env) {
  const child = run(label, 'pnpm', args, { env });
  child.on('exit', (code) => {
    if (shuttingDown) return;
    console.error(`\n${paint(31, '✘')} ${label} stopped unexpectedly (code ${code})`);
    shutdown(1);
  });
}

function runToCompletion(label, command, args, options) {
  return new Promise((resolve, reject) => {
    const child = run(label, command, args, options);
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${label} exited with code ${code}`))));
  });
}

function killGroup(child, signal) {
  try {
    process.kill(-child.pid, signal);
  } catch {}
}

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`\n${paint(1, '▸')} Stopping servers and tunnels…`);
  for (const child of children) killGroup(child, 'SIGTERM');
  setTimeout(
    () => {
      for (const child of children) killGroup(child, 'SIGKILL');
      process.exit(code);
    },
    children.length ? 1500 : 0,
  );
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function listeners(port) {
  try {
    return execFileSync('lsof', ['-ti', `:${port}`, '-sTCP:LISTEN'], { encoding: 'utf8' })
      .split('\n')
      .filter(Boolean)
      .map(Number);
  } catch {
    return [];
  }
}

function projectRoots() {
  try {
    return execFileSync('git', ['worktree', 'list', '--porcelain'], { encoding: 'utf8' })
      .split('\n')
      .filter((line) => line.startsWith('worktree '))
      .map((line) => line.slice('worktree '.length));
  } catch {
    return [process.cwd()];
  }
}

function processInfo(pid) {
  const run = (args) => {
    try {
      return execFileSync(args[0], args.slice(1), { encoding: 'utf8' }).trim();
    } catch {
      return '';
    }
  };
  const cwd =
    run(['lsof', '-a', '-p', String(pid), '-d', 'cwd', '-Fn'])
      .split('\n')
      .find((line) => line.startsWith('n'))
      ?.slice(1) ?? '';
  const command = run(['ps', '-o', 'command=', '-p', String(pid)]);
  return { cwd, command };
}

async function freePorts(ports) {
  const roots = projectRoots();
  const foreign = [];
  const ours = [];
  for (const port of ports) {
    for (const pid of listeners(port)) {
      const info = processInfo(pid);
      const isOurs = roots.some((root) => info.cwd.startsWith(root)) || /batman-oracle|@batman/.test(info.command);
      (isOurs ? ours : foreign).push({ port, pid, ...info });
    }
  }

  if (foreign.length > 0 && !process.argv.includes('--force')) {
    const details = foreign.map((p) => `  :${p.port}  pid ${p.pid}  ${p.command.slice(0, 80)}\n         in ${p.cwd}`).join('\n');
    throw new Error(
      `These ports are used by processes that do not look like this project:\n${details}\nStop them, or rerun with --force to kill them.`,
    );
  }

  for (const { port, pid } of [...ours, ...foreign]) {
    log(`Port ${port} busy (pid ${pid}), stopping it`);
    try {
      process.kill(pid, 'SIGTERM');
    } catch {}
  }
  for (let i = 0; i < 20; i++) {
    if (ports.every((port) => listeners(port).length === 0)) return;
    await sleep(250);
  }
  for (const { pid } of [...ours, ...foreign]) {
    try {
      process.kill(pid, 'SIGKILL');
    } catch {}
  }
}

function startTunnel(name, port) {
  return new Promise((resolve, reject) => {
    let found = false;
    const timer = setTimeout(() => reject(new Error(`No tunnel URL for ${name} after ${TUNNEL_TIMEOUT_MS / 1000}s`)), TUNNEL_TIMEOUT_MS);
    const child = run(`tunnel:${name}`, 'cloudflared', ['tunnel', '--no-autoupdate', '--url', `http://localhost:${port}`], {
      quiet: true,
      onLine: (text) => {
        const match = text.match(/https:\/\/(?!api\.)[a-z0-9-]+\.trycloudflare\.com/);
        if (match && !found) {
          found = true;
          clearTimeout(timer);
          resolve(match[0]);
        }
      },
    });
    child.on('exit', (code) => {
      if (!found) {
        clearTimeout(timer);
        reject(new Error(`cloudflared (${name}) exited with code ${code} before giving a URL`));
      }
    });
  });
}

async function waitFor(description, url, { timeoutMs, accept = (res) => res.ok }) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (accept(res)) return;
    } catch {}
    await sleep(1000);
  }
  throw new Error(`${description} not reachable: ${url}`);
}

function copyToClipboard(text) {
  try {
    execFileSync('pbcopy', { input: text });
    return true;
  } catch {
    return false;
  }
}

function assertInstalled(binary, hint) {
  try {
    execFileSync('which', [binary], { stdio: 'ignore' });
  } catch {
    console.error(`${binary} not found. ${hint}`);
    process.exit(1);
  }
}

async function main() {
  assertInstalled('cloudflared', 'Install it with: brew install cloudflared');
  assertInstalled('lsof', 'lsof is required to free the demo ports.');

  log('Freeing ports');
  await freePorts([MCP_PORT, AUTH_PORT, GCPD_PORT]);

  log('Opening Cloudflare tunnels');
  const [mcpOrigin, authOrigin] = await Promise.all([startTunnel('mcp', MCP_PORT), startTunnel('auth', AUTH_PORT)]);
  log(`MCP  → ${mcpOrigin}`);
  log(`Auth → ${authOrigin}`);

  const env = {
    MCP_ORIGIN: mcpOrigin,
    AUTH_ORIGIN: authOrigin,
    GCPD_API_ORIGIN: `http://localhost:${GCPD_PORT}`,
    REQUIRE_AUTH: 'true',
  };

  log('Building the widgets against the tunnel URL');
  await runToCompletion('build:ui', 'pnpm', ['--filter', '@batman/mcp-ui', 'build'], { env });
  await runToCompletion('migrate', 'pnpm', ['--filter', '@batman/auth', 'db:migrate'], { env, quiet: true });

  log('Starting servers');
  runServer('gcpd', ['--filter', '@batman/gcpd-api', 'start'], env);
  runServer('auth', ['--filter', '@batman/auth', 'start'], env);
  runServer('mcp', ['--filter', '@batman/mcp', 'exec', 'tsx', 'src/index.ts'], env);

  log('Waiting for everything to be reachable from the internet');
  await Promise.all([
    waitFor('gcpd-api', `http://localhost:${GCPD_PORT}/criminals`, { timeoutMs: 60_000 }),
    waitFor('mcp', `${mcpOrigin}/.well-known/oauth-protected-resource`, { timeoutMs: REACHABLE_TIMEOUT_MS }),
    waitFor('auth', `${authOrigin}/.well-known/oauth-authorization-server`, { timeoutMs: REACHABLE_TIMEOUT_MS }),
    waitFor('mcp assets', `${mcpOrigin}/img/default-crime.jpg`, { timeoutMs: REACHABLE_TIMEOUT_MS }),
  ]);

  const connectorUrl = `${mcpOrigin}/mcp`;
  const copied = copyToClipboard(connectorUrl);
  console.log(`
${paint(1, '✔ Demo ready')}

  Claude connector URL  ${paint(1, connectorUrl)}${copied ? paint(2, '  (copied to clipboard)') : ''}
  Login                 alfred@wayne-enterprises.com / IAmBatman!123

  Claude → Settings → Connectors → Add custom connector, then paste the URL.
  Ctrl+C stops everything.
`);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

main().catch((error) => {
  console.error(`\n${paint(31, '✘')} ${error.message}`);
  shutdown(1);
});
