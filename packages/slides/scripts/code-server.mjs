#!/usr/bin/env node
import { execFileSync, spawn } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { LIVECODE_PORT, LIVECODE_PROFILE_DIR } from '../livecode.config.mjs'

const deckRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = resolve(deckRoot, '..', '..')
const profileDir = join(deckRoot, LIVECODE_PROFILE_DIR)

const INSTALL_HINT = `code-server not found.

Install the standalone build. On macOS install.sh hands off to Homebrew, whose
formula lags behind and predates workbench.experimental.modernUI:

  curl -fsSL https://code-server.dev/install.sh | sh -s -- --method standalone

Then make sure ~/.local/bin is on your PATH.`

// Written only when the profile is missing, so UI changes stick. `modernUI`
// is forced because VS Code ships it through an experiment assignment.

const SETTINGS = {
  'workbench.colorTheme': 'Light Modern',
  'workbench.activityBar.location': 'hidden',
  'workbench.statusBar.visible': false,
  'editor.minimap.enabled': false,
  'workbench.experimental.modernUI': true,
}

function resolveBinary() {
  try {
    return execFileSync('which', ['code-server'], { encoding: 'utf8' }).trim()
  } catch {
  }

  const fallback = join(homedir(), '.local', 'bin', 'code-server')
  return existsSync(fallback) ? fallback : null
}

function ensureProfile() {
  const settingsPath = join(profileDir, 'User', 'settings.json')
  if (existsSync(settingsPath)) return

  mkdirSync(dirname(settingsPath), { recursive: true })
  writeFileSync(settingsPath, `${JSON.stringify(SETTINGS, null, 2)}\n`)
  console.log(`[livecode] profile created at ${settingsPath}`)
}

const binary = resolveBinary()
if (!binary) {
  console.error(INSTALL_HINT)
  process.exit(1)
}

ensureProfile()

const args = [
  repoRoot,
  '--auth=none',
  `--port=${LIVECODE_PORT}`,
  '--disable-workspace-trust',
  // Default is 10800s. An iframe that leaves the screen would keep its
  // extension host and tsserver alive for three hours.
  '--reconnection-grace-time=10',
  `--user-data-dir=${profileDir}`,
  // The deck carries its own extensions rather than borrowing the desktop
  // install, so a clone behaves the same everywhere. It ships empty.
  `--extensions-dir=${join(profileDir, 'extensions')}`,
]

console.log(`[livecode] ${binary} sur http://localhost:${LIVECODE_PORT} (${repoRoot})`)

const child = spawn(binary, args, { stdio: 'inherit' })

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal))
}

child.on('exit', (code, signal) => {
  process.exit(signal ? 1 : (code ?? 0))
})
