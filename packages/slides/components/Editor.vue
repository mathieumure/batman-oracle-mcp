<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNav, useSlideContext } from '@slidev/client'

import { DECK_ROOT, PORT } from 'virtual:livecode'

const props = withDefaults(
  defineProps<{
    // Ignored, declared so the existing slides keep parsing.
    session?: string
    defaultFolder?: string
    openFile?: string
    hideActivityBar?: boolean
    hideMinimap?: boolean
    hideStatusBar?: boolean
    zoom?: number
  }>(),
  { zoom: 1 },
)

const isDev = import.meta.env.DEV

function resolveFromDeck(relative?: string): string {
  if (!relative) return DECK_ROOT
  if (relative.startsWith('/')) return relative

  const segments = DECK_ROOT.split('/').filter(Boolean)
  for (const segment of relative.split('/')) {
    if (!segment || segment === '.') continue
    if (segment === '..') segments.pop()
    else segments.push(segment)
  }
  return `/${segments.join('/')}`
}

const url = computed(() => {
  const target = new URL(`http://localhost:${PORT}/`)
  target.searchParams.set('folder', resolveFromDeck(props.defaultFolder))

  if (props.openFile) {
    const file = resolveFromDeck(props.openFile)
    // Must be the serving host. The `remote` the workbench config advertises
    // puts the file outside the workspace, which kills its diagnostics.
    target.searchParams.set(
      'payload',
      JSON.stringify([['openFile', `vscode-remote://${target.host}${file}`]]),
    )
  }
  return target.toString()
})

let probe: Promise<boolean> | null = null

function checkServer(): Promise<boolean> {
  probe ??= fetch(`http://localhost:${PORT}/`, { mode: 'no-cors' })
    .then(() => true)
    .catch(() => false)
  return probe
}

const state = ref<'PROBING' | 'RUNNING' | 'ERROR'>('PROBING')

async function start(): Promise<void> {
  state.value = 'PROBING'
  state.value = (await checkServer()) ? 'RUNNING' : 'ERROR'
}

function retry(): void {
  probe = null
  void start()
}

// Slidev keeps every slide mounted, so connecting on mount starts one VS Code
// per editor slide. Two slides of lead cover the ~8s tsserver startup.
const LEAD_SLIDES = 2

const { $page, $renderContext } = useSlideContext()
const { currentPage } = useNav()

const isVisibleView = computed(
  () => $renderContext.value === 'slide' || $renderContext.value === 'presenter',
)

const shouldLoad = computed(
  () =>
    isDev &&
    isVisibleView.value &&
    currentPage.value >= $page.value - LEAD_SLIDES &&
    currentPage.value <= $page.value,
)

watch(
  shouldLoad,
  (load) => {
    if (load) void start()
  },
  { immediate: true },
)
</script>

<template>
  <div class="slidev-editor" tabindex="-1">
    <template v-if="!isDev">
      <div class="slidev-editor-overlay">
        <div class="slidev-editor-overlay-title">IDE not available</div>
        <div>Live IDE requires Slidev dev mode — not supported in static exports.</div>
      </div>
    </template>

    <template v-else-if="shouldLoad">
      <iframe
        v-if="state === 'RUNNING'"
        :src="url"
        :style="zoom !== 1 ? { zoom: String(zoom) } : undefined"
        class="slidev-editor-frame"
        allow="clipboard-read; clipboard-write"
      />

      <div v-else-if="state === 'PROBING'" class="slidev-editor-overlay">
        <div class="slidev-editor-spinner" />
        <div>Connecting to VS Code…</div>
      </div>

      <div v-else class="slidev-editor-overlay">
        <div class="slidev-editor-overlay-title">IDE Unavailable</div>
        <div>No code-server responding on port {{ PORT }}</div>
        <div class="slidev-editor-overlay-detail">pnpm dev:slides</div>
        <button class="slidev-editor-overlay-retry" @click="retry">Retry</button>
      </div>
    </template>
  </div>
</template>

<style>
:root {
  --slidev-editor-bg: #1e1e1e;
  --slidev-editor-border: none;
  --slidev-editor-border-radius: 8px;
  --slidev-editor-fg: #d4d4d4;
  --slidev-editor-muted: rgba(128, 128, 128, 0.4);
}

:root:not(.dark) {
  --slidev-editor-bg: #f3f3f3;
  --slidev-editor-fg: #383a42;
  --slidev-editor-muted: rgba(0, 0, 0, 0.15);
}

.slidev-editor {
  background: var(--slidev-editor-bg);
  border: var(--slidev-editor-border);
  border-radius: var(--slidev-editor-border-radius);
  height: 100%;
  outline: none;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.slidev-editor-frame {
  border: none;
  display: block;
  height: 100%;
  width: 100%;
}

.slidev-editor-overlay {
  align-items: center;
  background: var(--slidev-editor-bg);
  bottom: 0;
  color: var(--slidev-editor-fg);
  display: flex;
  flex-direction: column;
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 0.9em;
  gap: 12px;
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
}

.slidev-editor-overlay-title {
  font-size: 1.1em;
  font-weight: 600;
}

.slidev-editor-overlay-detail {
  background: var(--slidev-editor-muted);
  border-radius: 4px;
  font-family: ui-monospace, monospace;
  font-size: 0.85em;
  padding: 4px 10px;
}

.slidev-editor-overlay-retry {
  background: var(--slidev-editor-muted);
  border: none;
  border-radius: 4px;
  color: inherit;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9em;
  padding: 6px 16px;
  transition: background 0.15s;
}

.slidev-editor-overlay-retry:hover {
  background: rgba(128, 128, 128, 0.55);
}

@keyframes slidev-editor-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .slidev-editor-spinner {
    animation: none;
    opacity: 0.5;
  }
}

.slidev-editor-spinner {
  animation: slidev-editor-spin 0.8s ease-in-out infinite;
  border: 2px solid var(--slidev-editor-muted);
  border-radius: 50%;
  border-top-color: var(--slidev-editor-fg);
  height: 24px;
  width: 24px;
}
</style>
