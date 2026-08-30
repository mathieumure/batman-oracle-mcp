<script setup>
import { computed } from 'vue';
import { useNav } from '@slidev/client';

const props = defineProps({
  phase: { type: String, default: 'story' },
});

const { clicks } = useNav();
const combos = computed(() => props.phase === 'combos');

const showLeft = computed(() => combos.value || clicks.value >= 1);
const showUserMsg = computed(() => combos.value || clicks.value >= 2);
const showBot = computed(() => combos.value || clicks.value >= 3);
const showRight = computed(() => combos.value || clicks.value >= 3);
const showMcp = computed(() => combos.value || clicks.value >= 4);

const combo = computed(() => {
  if (combos.value) {
    if (clicks.value >= 3) return 'roles';
    if (clicks.value >= 2) return 'ide-data';
    if (clicks.value >= 1) return 'chat-tools';
    return 'claude-data';
  }
  return 'claude-data';
});

const roles = computed(() => combo.value === 'roles');
const showTool = computed(() => combos.value && clicks.value >= 4);
const showResource = computed(() => combos.value && clicks.value >= 5);
const showMore = computed(() => combos.value && clicks.value >= 6);

const leftKind = computed(() => {
  if (combo.value === 'roles') return 'hosts';
  if (combo.value === 'ide-data') return 'vscode';
  if (combo.value === 'chat-tools') return 'chatgpt';
  return 'claude';
});

const rightKind = computed(() => {
  if (combo.value === 'roles') return 'server';
  if (combo.value === 'ide-data') return 'postgres';
  if (combo.value === 'chat-tools') return 'figma';
  return 'swagger';
});

const leftMeta = computed(() => {
  if (leftKind.value === 'hosts') return { title: '', label: 'Client' };
  if (leftKind.value === 'vscode') return { title: 'Visual Studio Code', label: 'IDE' };
  if (leftKind.value === 'chatgpt') return { title: 'chatgpt.com', label: 'Chat interface' };
  return { title: 'claude.ai', label: 'Application IA' };
});

const rightMeta = computed(() => {
  if (rightKind.value === 'server') return { title: '', label: 'Serveur' };
  if (rightKind.value === 'postgres') return { title: 'psql gcpd', label: 'Data' };
  if (rightKind.value === 'figma') return { title: 'Figma GCPD Map', label: 'Tools' };
  return { title: 'api.gcpd.com/swagger', label: 'Système externe' };
});

const rightBg = computed(() =>
  rightKind.value === 'swagger' || rightKind.value === 'postgres' ? '#fff' : '#1a1a1a',
);
</script>

<template>
  <div class="mcp-stage">
    <div class="mcp-pane">
      <div v-if="showLeft" :key="combo + '-left'" class="mcp-side pop">
        <MacWindow :title="leftMeta.title" height="260px" content-bg="#1a1a1a" style="width: 100%">
          <div v-if="leftKind === 'claude'" class="claude">
            <div class="claude-top">
              <img class="brand-logo" src="../../pages/02-criminals/assets/logos/claude.svg" alt="" />
              <span class="claude-name">Claude</span>
            </div>
            <div class="claude-thread">
              <p v-if="showUserMsg" class="claude-bubble me fade">Liste les criminels du GCPD.</p>
              <p v-if="showBot" class="claude-bubble bot fade">Je n'ai pas accès à cette base.</p>
            </div>
            <div class="claude-input">
              <span class="claude-placeholder">Répondre à Claude…</span>
              <span class="claude-send" />
            </div>
          </div>

          <div v-else-if="leftKind === 'chatgpt'" class="claude gpt">
            <div class="claude-top">
              <img class="brand-logo" src="../../pages/02-criminals/assets/logos/openai.svg" alt="" />
              <span class="claude-name">ChatGPT</span>
            </div>
            <div class="claude-thread">
              <p class="claude-bubble me">Ouvre le fichier Figma du GCPD.</p>
              <p class="claude-bubble bot">Je m'y connecte via MCP.</p>
            </div>
            <div class="claude-input">
              <span class="claude-placeholder">Envoyer un message…</span>
              <span class="claude-send" />
            </div>
          </div>

          <div v-else-if="leftKind === 'vscode'" class="ide">
            <div class="ide-bar">
              <img class="brand-logo" src="../../pages/02-criminals/assets/logos/vscode.svg" alt="" />
              <span>mcp-server.ts</span>
            </div>
            <pre class="ide-code">server.tool("list_criminals",
  async () => {
    return gcpd.criminals()
  })</pre>
          </div>

          <div v-else class="hosts">
            <div class="host">
              <img src="../../pages/02-criminals/assets/logos/claude.svg" alt="" />
              <span>Claude</span>
            </div>
            <div class="host">
              <img src="../../pages/02-criminals/assets/logos/openai.svg" alt="" />
              <span>ChatGPT</span>
            </div>
            <div class="host">
              <svg class="host-custom" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="none"
                  stroke="#eee"
                  stroke-width="1.7"
                  stroke-linejoin="round"
                  d="M4.5 6.5h15v9.2H9.2L4.5 19.2z"
                />
                <circle cx="9" cy="11" r="1" fill="#eee" />
                <circle cx="12" cy="11" r="1" fill="#eee" />
                <circle cx="15" cy="11" r="1" fill="#eee" />
              </svg>
              <span>Custom</span>
            </div>
          </div>
        </MacWindow>
        <p v-if="combos" :class="roles ? 'mcp-tag' : 'mcp-label'">{{ leftMeta.label }}</p>
      </div>
    </div>

    <div class="mcp-gap">
      <div v-if="showMcp" class="mcp-link">
        <svg class="mcp-arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#988829"
            d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
          />
        </svg>
        <img class="mcp-logo" src="../../pages/02-criminals/assets/mcp.png" alt="MCP" />
        <svg class="mcp-arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#988829"
            d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
          />
        </svg>
      </div>
    </div>

    <div class="mcp-pane">
      <div v-if="showRight" :key="combo + '-right'" class="mcp-side pop">
        <MacWindow :title="rightMeta.title" height="260px" :content-bg="rightBg" style="width: 100%">
          <div v-if="rightKind === 'swagger'" class="swagger">
            <div class="swagger-bar">
              <img class="brand-logo" src="../../pages/02-criminals/assets/logos/swagger.svg" alt="" />
              <strong>GCPD API</strong>
              <span>OAS 3.0</span>
            </div>
            <div class="swagger-row"><em>GET</em><span>/criminals</span></div>
            <div class="swagger-row"><em>GET</em><span>/crimes</span></div>
            <div class="swagger-row"><em>GET</em><span>/crime-scene</span></div>
          </div>

          <div v-else-if="rightKind === 'figma'" class="figma">
            <div class="figma-bar">
              <img class="brand-logo" src="../../pages/02-criminals/assets/logos/figma.svg" alt="" />
              <span>GCPD Map</span>
            </div>
            <div class="figma-board">
              <span class="figma-frame">Frame 1</span>
              <span class="figma-frame tall">Frame 2</span>
              <span class="figma-frame" />
            </div>
          </div>

          <div v-else-if="rightKind === 'postgres'" class="postgres">
            <div class="pg-bar">
              <img class="brand-logo" src="../../pages/02-criminals/assets/logos/postgresql.svg" alt="" />
              <span>postgres gcpd</span>
            </div>
            <div class="pg-body">
              <table class="pg-table">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Joker</td>
                    <td>wanted</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Penguin</td>
                    <td>jailed</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Riddler</td>
                    <td>wanted</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-else class="server">
            <div class="bricks">
              <div v-if="showTool" class="brick">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"
                  />
                </svg>
                Outils
              </div>
              <div v-if="showResource" class="brick">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zm16 4.1c-1.8 1.1-4.7 1.9-8 1.9s-6.2-.8-8-1.9V14c0 1.7 3.6 3 8 3s8-1.3 8-3zm0 5.9c-1.8 1.1-4.7 1.9-8 1.9s-6.2-.8-8-1.9V20c0 1.7 3.6 3 8 3s8-1.3 8-3z"
                  />
                </svg>
                Ressources
              </div>
              <div v-if="showMore" class="brick more">…</div>
            </div>
          </div>
        </MacWindow>
        <p v-if="combos" :class="roles ? 'mcp-tag' : 'mcp-label'">{{ rightMeta.label }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mcp-stage {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.6rem 3.2rem 2.2rem;
}

.mcp-pane {
  flex: 1;
  min-width: 0;
}

.mcp-side {
  width: 100%;
}

.mcp-side.pop {
  animation: fade-in 0.4s ease;
}

.mcp-label {
  margin: 0.7rem 0 0;
  text-align: center;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--color-gold);
}

.mcp-tag {
  display: table;
  margin: 0.85rem auto 0;
  padding: 0.28rem 1rem;
  border: 1.5px solid #6e5a10;
  border-radius: 999px;
  background: color-mix(in srgb, #6e5a10 32%, #1a1a1a);
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #fff;
}

.mcp-gap {
  width: 8.5rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mcp-link {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  animation: fade-in 0.4s ease;
}

.mcp-logo {
  width: 48px;
  height: 48px;
  mix-blend-mode: screen;
  view-transition-name: mcp-logo;
}

.mcp-arrow-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.brand-logo {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  object-fit: contain;
}


.claude {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
  color: #eee;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

.claude-top {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #2c2c2c;
}

.claude-name {
  font-size: 0.75rem;
  font-weight: 600;
}

.claude-thread {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.65rem 0.75rem;
  overflow: hidden;
}

.claude-bubble {
  margin: 0;
  max-width: 90%;
  padding: 0.4rem 0.6rem;
  border-radius: 10px;
  font-size: 0.7rem;
  line-height: 1.35;
}

.claude-bubble.fade {
  animation: fade-in 0.45s ease;
}

.claude-bubble.me {
  align-self: flex-end;
  background: #3a3a3a;
}

.claude-bubble.bot {
  align-self: flex-start;
  background: #262626;
  color: #bbb;
}

.claude-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0.6rem 0.6rem;
  padding: 0.4rem 0.6rem;
  border: 1px solid #333;
  border-radius: 12px;
  background: #111;
}

.claude-placeholder {
  flex: 1;
  font-size: 0.66rem;
  color: #777;
}

.claude-send {
  width: 8px;
  height: 8px;
  border-right: 2px solid #888;
  border-top: 2px solid #888;
  transform: rotate(45deg);
}

.ide {
  height: 100%;
  background: #1e1e1e;
  color: #d4d4d4;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.ide-bar {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.65rem;
  background: #2d2d2d;
  font-size: 0.64rem;
  color: #ccc;
}

.ide-code {
  margin: 0;
  padding: 0.7rem 0.8rem;
  font-size: 0.68rem;
  line-height: 1.55;
  color: #9cdcfe;
  white-space: pre;
}

.hosts {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.4rem;
  background: #1a1a1a;
}

.host {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45rem;
  color: #eee;
  font-size: 0.68rem;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

.host img,
.host-custom {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.server {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
}

.bricks {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 70%;
}

.brick {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.55rem 0.8rem;
  border: 1px solid #988829;
  border-radius: 4px;
  background: color-mix(in srgb, #988829 18%, #1a1a1a);
  color: #eee;
  font-size: 0.78rem;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  animation: fade-in 0.4s ease;
}

.brick svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.brick.more {
  border-style: dashed;
  color: #888;
  background: transparent;
}

.swagger {
  height: 100%;
  background: #fff;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

.swagger-bar {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.7rem;
  background: #1b1b1b;
  color: #fff;
  font-size: 0.7rem;
}

.swagger-bar strong {
  flex: 1;
}

.swagger-bar span {
  font-size: 0.56rem;
  color: #89bf04;
}

.swagger-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.35rem 0.5rem;
  padding: 0.32rem 0.4rem;
  border: 1px solid #49cc90;
  border-radius: 4px;
  background: #e8f6f0;
  font-size: 0.66rem;
}

.swagger-row em {
  flex-shrink: 0;
  width: 2.5rem;
  padding: 0.1rem 0;
  border-radius: 3px;
  background: #49cc90;
  color: #fff;
  font-style: normal;
  font-weight: 700;
  font-size: 0.56rem;
  text-align: center;
}

.swagger-row span {
  color: #333;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.figma {
  height: 100%;
  background: #2c2c2c;
  color: #eee;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

.figma-bar {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.65rem;
  background: #1e1e1e;
  font-size: 0.66rem;
}

.figma-board {
  display: flex;
  align-items: flex-end;
  gap: 0.55rem;
  height: calc(100% - 2rem);
  padding: 0.8rem;
}

.figma-frame {
  flex: 1;
  height: 62%;
  border: 1px solid #4a4a4a;
  background: #3a3a3a;
  color: #888;
  font-size: 0.52rem;
  padding: 0.25rem;
}

.figma-frame.tall {
  height: 86%;
}

.postgres {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: #1a1a1a;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.pg-body {
  flex: 1;
  overflow: hidden;
  background: #fff;
}

.pg-bar {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.65rem;
  background: #336791;
  color: #fff;
  font-size: 0.66rem;
  font-weight: 700;
}

.pg-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
  color: #1a1a1a;
}

.pg-table th,
.pg-table td {
  padding: 0.42rem 0.6rem;
  border-bottom: 1px solid #d8d8d8;
  text-align: left;
  color: #1a1a1a;
}

.pg-table th {
  color: #336791;
  font-weight: 700;
  background: #eef3f8;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
