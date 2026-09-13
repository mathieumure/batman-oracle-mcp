<script setup>
import { ref, nextTick } from 'vue';
import { onSlideEnter, onSlideLeave } from '@slidev/client';

defineOptions({ name: 'CriminalsAVK3YobO' });

const props = defineProps({
  replies: {
    type: Array,
    default: () => [],
  },
  errors: {
    type: Array,
    default: () => [],
  },
  tools: {
    type: Array,
    default: () => [],
  },
  images: {
    type: Array,
    default: () => [],
  },
});

const messages = ref([]);
const replyIndex = ref(0);
const pendingTool = ref('');
const lastConnectorName = ref('');

const inputText = ref('');
const menuStep = ref(0);
const modalOpen = ref(false);
const connectorName = ref('');
const connectorUrl = ref('');
const messagesEl = ref(null);
const thinking = ref(false);
const verifying = ref(false);
const verified = ref(false);
const customConnectors = ref([]);
const cascade1Bottom = ref(0);
const cascade2Bottom = ref(0);

function alignWithClickedRow(event) {
  const container = event.currentTarget.closest('.composer-zone');
  const rowRect = event.currentTarget.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const scale = containerRect.width / container.offsetWidth;
  return (containerRect.bottom - rowRect.bottom) / scale + 2;
}

function reset() {
  clearTimeout(thinkingTimer);
  clearTimeout(toolRevealTimer);
  clearInterval(streamTimer);
  messages.value = [];
  replyIndex.value = 0;
  inputText.value = '';
  menuStep.value = 0;
  modalOpen.value = false;
  connectorName.value = '';
  connectorUrl.value = '';
  thinking.value = false;
  verifying.value = false;
  verified.value = false;
  customConnectors.value = [];
  pendingTool.value = '';
  lastConnectorName.value = '';
}

async function scrollToEnd() {
  await nextTick();
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
  }
}

let thinkingTimer;
let streamTimer;

function logErrors(error) {
  if (!error) return;
  const errorList = Array.isArray(error) ? error : [error];
  errorList.forEach((e) => console.error(e));
}

function streamReply(text, error, tool) {
  messages.value.push({ role: 'assistant', text: '', tool });
  const idx = messages.value.length - 1;
  let i = 0;
  const chunkSize = 3;
  clearInterval(streamTimer);
  streamTimer = setInterval(() => {
    i += chunkSize;
    messages.value[idx].text = text.slice(0, i);
    scrollToEnd();
    if (i >= text.length) {
      clearInterval(streamTimer);
      setTimeout(() => logErrors(error), 2000);
    }
  }, 20);
}

let toolRevealTimer;

function showImageReply(image, error, tool) {
  messages.value.push({ role: 'assistant', text: '', image, tool });
  scrollToEnd();
  setTimeout(() => logErrors(error), 2000);
}

function sendMessage() {
  const text = inputText.value.trim();
  if (!text) return;
  const index = replyIndex.value;
  replyIndex.value += 1;
  const toolForThisMessage = props.tools[index] || lastConnectorName.value || '';
  messages.value.push({ role: 'user', text });
  inputText.value = '';
  thinking.value = true;
  scrollToEnd();
  toolRevealTimer = setTimeout(() => {
    pendingTool.value = toolForThisMessage;
  }, 2000);
  thinkingTimer = setTimeout(() => {
    thinking.value = false;
    const reply = props.replies[index];
    const image = props.images[index];
    const error = props.errors[index];
    pendingTool.value = '';
    if (image) {
      showImageReply(image, error, toolForThisMessage);
    } else if (reply) {
      streamReply(reply, error, toolForThisMessage);
    } else {
      logErrors(error);
    }
  }, 4000);
}

function onSendClick(event) {
  event.stopPropagation();
  if (thinking.value) {
    clearTimeout(thinkingTimer);
    clearTimeout(toolRevealTimer);
    thinking.value = false;
    pendingTool.value = '';
  } else {
    sendMessage();
  }
}

function togglePlusMenu(event) {
  event.stopPropagation();
  menuStep.value = menuStep.value === 0 ? 1 : 0;
}

function openConnecteurs(event) {
  event.stopPropagation();
  cascade1Bottom.value = alignWithClickedRow(event);
  menuStep.value = 2;
}

function openAjouterConnecteur(event) {
  event.stopPropagation();
  cascade2Bottom.value = alignWithClickedRow(event);
  menuStep.value = 3;
}

function openModal(event) {
  event.stopPropagation();
  menuStep.value = 0;
  modalOpen.value = true;
}

function closeModal(event) {
  event.stopPropagation();
  modalOpen.value = false;
  verifying.value = false;
  verified.value = false;
  connectorName.value = '';
  connectorUrl.value = '';
}

function submitConnector(event) {
  event.stopPropagation();
  if (!connectorName.value || !connectorUrl.value || verifying.value) return;

  if (!verified.value) {
    verifying.value = true;
    setTimeout(() => {
      verifying.value = false;
      verified.value = true;
    }, 1200);
    return;
  }

  customConnectors.value.push({ name: connectorName.value });
  lastConnectorName.value = connectorName.value;
  modalOpen.value = false;
  verifying.value = false;
  verified.value = false;
  connectorName.value = '';
  connectorUrl.value = '';
}

function closeMenu() {
  menuStep.value = 0;
}

onSlideEnter(reset);
onSlideLeave(reset);
</script>

<template>
  <div class="claude-app" @click="closeMenu">
    <div class="app-header">
      <button type="button" class="icon-btn sidebar-btn" @click.stop>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="9" y1="4" x2="9" y2="20" />
        </svg>
      </button>
    </div>

    <div class="chat-body" ref="messagesEl">
      <div v-for="(m, i) in messages" :key="i" class="message-row" :class="m.role">
        <div v-if="m.role === 'user'" class="user-bubble">
          <p>{{ m.text }}</p>
        </div>
        <div v-else class="assistant-content" :class="{ 'full-width': m.image }">
          <div v-if="m.tool" class="tool-call">
            <span class="tool-icon">
              <svg viewBox="0 0 256 116" xmlns="http://www.w3.org/2000/svg"><path fill="#FFF" d="m202.357 49.394-5.311-2.124C172.085 103.434 72.786 69.289 66.81 85.997c-.996 11.286 54.227 2.146 93.706 4.059 12.039.583 18.076 9.671 12.964 24.484l10.069.031c11.615-36.209 48.683-17.73 50.232-29.68-2.545-7.857-42.601 0-31.425-35.497Z" /><path fill="#F4811F" d="M176.332 108.348c1.593-5.31 1.062-10.622-1.593-13.809-2.656-3.187-6.374-5.31-11.154-5.842L71.17 87.634c-.531 0-1.062-.53-1.593-.53-.531-.532-.531-1.063 0-1.594.531-1.062 1.062-1.594 2.124-1.594l92.946-1.062c11.154-.53 22.839-9.56 27.087-20.182l5.312-13.809c0-.532.531-1.063 0-1.594C191.203 20.182 166.772 0 138.091 0 111.535 0 88.697 16.995 80.73 40.896c-5.311-3.718-11.684-5.843-19.12-5.31-12.747 1.061-22.838 11.683-24.432 24.43-.531 3.187 0 6.374.532 9.56C16.996 70.107 0 87.103 0 108.348c0 2.124 0 3.718.531 5.842 0 1.063 1.062 1.594 1.594 1.594h170.489c1.062 0 2.125-.53 2.125-1.594l1.593-5.842Z" /><path fill="#FAAD3F" d="M205.544 48.863h-2.656c-.531 0-1.062.53-1.593 1.062l-3.718 12.747c-1.593 5.31-1.062 10.623 1.594 13.809 2.655 3.187 6.373 5.31 11.153 5.843l19.652 1.062c.53 0 1.062.53 1.593.53.53.532.53 1.063 0 1.594-.531 1.063-1.062 1.594-2.125 1.594l-20.182 1.062c-11.154.53-22.838 9.56-27.087 20.182l-1.063 4.78c-.531.532 0 1.594 1.063 1.594h70.108c1.062 0 1.593-.531 1.593-1.593 1.062-4.25 2.124-9.03 2.124-13.81 0-27.618-22.838-50.456-50.456-50.456" /></svg>
            </span>
            <em>Calling tool {{ m.tool }}...</em>
          </div>
          <div v-if="m.image" class="reply-image">
            <img v-if="typeof m.image === 'string'" :src="m.image" alt="" />
            <div v-else class="reply-image-placeholder">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>Image</span>
            </div>
          </div>
          <p v-else>{{ m.text }}</p>
        </div>
      </div>

      <div v-if="thinking" class="message-row assistant">
        <div class="thinking-block">
          <div v-if="pendingTool" class="tool-call">
            <span class="tool-icon">
              <svg viewBox="0 0 256 116" xmlns="http://www.w3.org/2000/svg"><path fill="#FFF" d="m202.357 49.394-5.311-2.124C172.085 103.434 72.786 69.289 66.81 85.997c-.996 11.286 54.227 2.146 93.706 4.059 12.039.583 18.076 9.671 12.964 24.484l10.069.031c11.615-36.209 48.683-17.73 50.232-29.68-2.545-7.857-42.601 0-31.425-35.497Z" /><path fill="#F4811F" d="M176.332 108.348c1.593-5.31 1.062-10.622-1.593-13.809-2.656-3.187-6.374-5.31-11.154-5.842L71.17 87.634c-.531 0-1.062-.53-1.593-.53-.531-.532-.531-1.063 0-1.594.531-1.062 1.062-1.594 2.124-1.594l92.946-1.062c11.154-.53 22.839-9.56 27.087-20.182l5.312-13.809c0-.532.531-1.063 0-1.594C191.203 20.182 166.772 0 138.091 0 111.535 0 88.697 16.995 80.73 40.896c-5.311-3.718-11.684-5.843-19.12-5.31-12.747 1.061-22.838 11.683-24.432 24.43-.531 3.187 0 6.374.532 9.56C16.996 70.107 0 87.103 0 108.348c0 2.124 0 3.718.531 5.842 0 1.063 1.062 1.594 1.594 1.594h170.489c1.062 0 2.125-.53 2.125-1.594l1.593-5.842Z" /><path fill="#FAAD3F" d="M205.544 48.863h-2.656c-.531 0-1.062.53-1.593 1.062l-3.718 12.747c-1.593 5.31-1.062 10.623 1.594 13.809 2.655 3.187 6.373 5.31 11.153 5.843l19.652 1.062c.53 0 1.062.53 1.593.53.53.532.53 1.063 0 1.594-.531 1.063-1.062 1.594-2.125 1.594l-20.182 1.062c-11.154.53-22.838 9.56-27.087 20.182l-1.063 4.78c-.531.532 0 1.594 1.063 1.594h70.108c1.062 0 1.593-.531 1.593-1.593 1.062-4.25 2.124-9.03 2.124-13.81 0-27.618-22.838-50.456-50.456-50.456" /></svg>
            </span>
            <em>
              Calling tool {{ pendingTool }}
              <span class="dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>
            </em>
          </div>
          <img class="claude-avatar spin" src="../../pages/02-criminals/assets/logos/claude.svg" alt="" />
        </div>
      </div>
    </div>

    <div class="composer-zone">
      <div v-if="menuStep >= 1" class="add-menu" @click.stop>
        <div class="menu-item">
          <span class="menu-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </span>
          <span class="menu-label">Ajouter des fichiers ou des photos</span>
          <span class="menu-shortcut"><kbd>⌘</kbd><kbd>U</kbd></span>
        </div>

        <div class="menu-item">
          <span class="menu-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </span>
          <span class="menu-label">Prendre une capture d'écran</span>
        </div>

        <div class="menu-item submenu">
          <span class="menu-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          <span class="menu-label">Ajouter au projet</span>
          <span class="menu-chevron">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>

        <div class="menu-item submenu">
          <span class="menu-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19.44 9.86a2.68 2.68 0 0 0 .13-2.31 2.68 2.68 0 0 0-3.6-1.34 2.62 2.62 0 0 0-1.3-2.87 2.62 2.62 0 0 0-3.3.6 2.62 2.62 0 0 0-3.3-.6 2.62 2.62 0 0 0-1.3 2.87 2.68 2.68 0 0 0-3.6 1.34 2.68 2.68 0 0 0 .13 2.31A2.62 2.62 0 0 0 2 12.2a2.62 2.62 0 0 0 1.3 2.27 2.68 2.68 0 0 0-.13 2.31 2.68 2.68 0 0 0 3.6 1.34 2.62 2.62 0 0 0 1.3 2.87 2.62 2.62 0 0 0 3.3-.6 2.62 2.62 0 0 0 3.3.6 2.62 2.62 0 0 0 1.3-2.87 2.68 2.68 0 0 0 3.6-1.34 2.68 2.68 0 0 0-.13-2.31A2.62 2.62 0 0 0 22 12.2a2.62 2.62 0 0 0-1.3-2.27z" />
            </svg>
          </span>
          <span class="menu-label">Compétences</span>
          <span class="menu-chevron">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>

        <div class="menu-item submenu highlighted" @click="openConnecteurs">
          <span class="menu-icon accent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 2v6M15 2v6M12 17v5M8 13h8a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2z" />
            </svg>
          </span>
          <span class="menu-label">Connecteurs</span>
          <span class="menu-chevron">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>

        <div class="menu-item">
          <span class="menu-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </span>
          <span class="menu-label">Ajouter des plugins</span>
        </div>

        <div class="menu-separator"></div>

        <div class="menu-item checkbox">
          <span class="menu-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <span class="menu-label">Recherche</span>
        </div>

        <div class="menu-item checkbox checked">
          <span class="menu-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </span>
          <span class="menu-label">Recherche Web</span>
          <span class="menu-check">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        </div>
      </div>

      <div v-if="menuStep >= 2" class="add-menu cascade-1" :style="{ bottom: cascade1Bottom + 'px' }" @click.stop>
        <div class="menu-item submenu" @click="openAjouterConnecteur">
          <span class="menu-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </span>
          <span class="menu-label">Ajouter un connecteur</span>
          <span class="menu-chevron">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>

        <div class="menu-item">
          <span class="menu-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </span>
          <span class="menu-label">Gérer les connecteurs</span>
        </div>

        <div class="menu-separator"></div>

        <div class="menu-item">
          <span class="menu-icon connector-icon gmail">✉</span>
          <span class="menu-label">Gmail</span>
          <span class="switch on"><span class="switch-knob"></span></span>
        </div>

        <div v-for="(c, i) in customConnectors" :key="i" class="menu-item">
          <span class="menu-icon connector-icon custom">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 2v6M15 2v6M12 17v5M8 13h8a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2z" />
            </svg>
          </span>
          <span class="menu-label">{{ c.name }}</span>
          <span class="switch on"><span class="switch-knob"></span></span>
        </div>

        <div class="menu-separator"></div>

        <div class="menu-item submenu">
          <span class="menu-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <span class="menu-label">Accès aux outils</span>
          <span class="menu-chevron">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>
      </div>

      <div v-if="menuStep >= 3" class="add-menu cascade-2" :style="{ bottom: cascade2Bottom + 'px' }" @click.stop>
        <div class="menu-item">
          <span class="menu-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <span class="menu-label">Parcourir les connecteurs</span>
        </div>

        <div class="menu-item highlighted" @click="openModal">
          <span class="menu-icon accent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </span>
          <span class="menu-label">Ajouter un connecteur personnalisé</span>
        </div>
      </div>

      <div class="composer">
        <button type="button" class="icon-btn plus-btn" :class="{ open: menuStep > 0 }" @click="togglePlusMenu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <input
          v-model="inputText"
          type="text"
          class="composer-placeholder"
          placeholder="Écrire un message…"
          @keydown.enter="sendMessage"
          @click.stop
        />

        <button type="button" class="icon-btn send-btn" @click="onSendClick">
          <svg v-if="thinking" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <rect x="5" y="5" width="14" height="14" rx="2" />
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      </div>

      <div class="composer-footer">
        <p class="disclaimer">Claude est une IA et peut faire des erreurs. Veuillez vérifier les réponses.</p>
        <span class="model-selector">Sonnet 5<span class="model-sub"> Moyen</span></span>
      </div>
    </div>

    <div v-if="modalOpen" class="modal-backdrop" @click.stop="closeModal">
      <div class="modal-card" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">Ajouter un connecteur personnalisé</h2>
          <button type="button" class="modal-close" @click="closeModal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <p class="modal-desc">
          Connectez Claude à vos données et outils.
          <span class="text-link">En savoir plus sur les connecteurs</span>
          ou commencez avec
          <span class="text-link">ceux prêts à l'emploi</span>.
        </p>

        <div class="modal-field">
          <input v-model="connectorName" type="text" placeholder="Nom" />
          <p class="field-hint">Affiché dans la liste des connecteurs.</p>
        </div>

        <div class="modal-field">
          <input v-model="connectorUrl" type="text" placeholder="URL du serveur MCP" />
          <p class="field-hint">L'adresse HTTPS où le serveur accepte les requêtes MCP, par exemple https://mcp.example.com/mcp.</p>
        </div>

        <p class="modal-legal">N'utilisez que des connecteurs provenant de développeurs en qui vous avez confiance. Anthropic ne contrôle pas les outils que les développeurs mettent à disposition et ne peut pas garantir qu'ils fonctionneront comme prévu ou qu'ils ne changeront pas.</p>
        <p class="modal-legal">Vous développez un serveur MCP ? <span class="text-link">Signalez les problèmes et abonnez-vous aux mises à jour ici</span></p>

        <div v-if="verifying || verified" class="verify-status">
          <p class="verify-title">Vérification du serveur…</p>
          <div class="verify-row">
            <span v-if="verifying" class="status-spinner-lg"></span>
            <svg v-if="verified" class="status-check-lg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span class="verify-text">Connexion au serveur en cours</span>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Annuler</button>
          <button
            type="button"
            class="btn btn-primary"
            :class="{ disabled: !connectorName || !connectorUrl || verifying }"
            @click="submitConnector"
          >
            <span v-if="verifying" class="btn-spinner"></span>
            <span v-else>Continuer</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.claude-app {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #faf9f6;
  color: #2d2b26;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  padding: 1.19rem 1.105rem 0.765rem;
  overflow: hidden;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin: 0 0 0.51rem;
  flex-shrink: 0;
}

.chat-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 0.765rem;
  width: 100%;
  max-width: 28.9rem;
  margin: 0 auto;
  overflow-y: auto;
}

.message-row {
  display: flex;
}

.message-row.user {
  justify-content: flex-end;
}

.user-bubble {
  background: #eeece2;
  border-radius: 14px;
  padding: 0.425rem 0.68rem;
  max-width: 85%;
}

.user-bubble p {
  margin: 0;
  font-size: 0.578rem;
  line-height: 1.5;
}

.message-row.assistant {
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.34rem;
}

.thinking-block {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.claude-avatar {
  width: 0.765rem;
  height: 0.765rem;
  flex-shrink: 0;
  margin-top: 0.128rem;
}

.claude-avatar.spin {
  animation: claude-spin 2s linear infinite;
}

@keyframes claude-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.tool-call {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-bottom: 0.3rem;
  color: #87857e;
  font-size: 0.54rem;
}

.tool-call em {
  font-style: italic;
}

.tool-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.tool-icon svg {
  width: 0.85em;
  height: auto;
  display: block;
}

.dots {
  display: inline-flex;
  gap: 0.15em;
  margin-left: 0.2em;
}

.dot {
  width: 0.2em;
  height: 0.2em;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.3;
  animation: dot-pulse 1.2s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dot-pulse {
  0%,
  80%,
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1);
  }
}

.assistant-content {
  max-width: 85%;
}

.assistant-content.full-width {
  max-width: 425px;
  width: 100%;
}

.assistant-content p {
  margin: 0;
  font-size: 0.578rem;
  line-height: 1.6;
}

.reply-image {
  width: 100%;
  border-radius: 8px;
  overflow: visible;
}

.reply-image img {
  display: block;
  max-width: 100%;
  border-radius: 8px;
}

.reply-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  width: 14rem;
  height: 9rem;
  background: #f0eee5;
  color: #a3a096;
  border-radius: 8px;
  font-size: 0.5rem;
  font-weight: 600;
}

.composer-zone {
  position: relative;
  width: 100%;
  max-width: 28.9rem;
  margin: 0.765rem auto 0;
  flex-shrink: 0;
}

.add-menu {
  position: absolute;
  bottom: calc(100% + 0.34rem);
  left: 0;
  display: flex;
  flex-direction: column;
  width: 12.325rem;
  background: #ffffff;
  border-radius: 10px;
  padding: 0.255rem;
  box-shadow: 0 8px 24px rgba(61, 57, 41, 0.16), 0 0 0 1px rgba(61, 57, 41, 0.06);
  z-index: 5;
}

.add-menu.cascade-1 {
  left: 12.45rem;
  z-index: 6;
}

.add-menu.cascade-2 {
  left: 24.9rem;
  z-index: 7;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.34rem;
  padding: 0.255rem 0.34rem;
  border-radius: 6px;
  font-size: 0.527rem;
  color: #2d2b26;
  cursor: pointer;
}

.menu-item:hover {
  background: #f5f3ec;
}

.menu-item.highlighted {
  background: #f2efe4;
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0.722rem;
  height: 0.722rem;
  flex-shrink: 0;
  color: #87857e;
}

.menu-icon.accent {
  color: #d97757;
}

.menu-icon.connector-icon {
  border-radius: 4px;
  font-size: 0.468rem;
}

.menu-icon.connector-icon.gmail {
  background: #fbe4e1;
  color: #c0392b;
}

.menu-icon.connector-icon.custom {
  background: #f2efe4;
  color: #d97757;
}

.menu-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-shortcut {
  display: flex;
  gap: 0.128rem;
  flex-shrink: 0;
}

.menu-shortcut kbd {
  font-size: 0.468rem;
  color: #87857e;
  font-family: inherit;
}

.menu-chevron {
  display: flex;
  align-items: center;
  color: #87857e;
  flex-shrink: 0;
}

.menu-check {
  display: flex;
  align-items: center;
  color: #d97757;
  flex-shrink: 0;
}

.menu-separator {
  height: 1px;
  background: #e8e5da;
  margin: 0.212rem 0.425rem;
}

.switch {
  width: 1.105rem;
  height: 0.612rem;
  border-radius: 999px;
  background: #e0ddd2;
  padding: 2px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.switch.on {
  background: #d97757;
  justify-content: flex-end;
}

.switch-knob {
  width: 0.468rem;
  height: 0.468rem;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
}

.composer {
  display: flex;
  align-items: center;
  gap: 0.34rem;
  background: #ffffff;
  border-radius: 8px;
  padding: 0.34rem 0.425rem;
  box-shadow: 0 4px 20px rgba(61, 57, 41, 0.06), 0 0 0 1px rgba(61, 57, 41, 0.08);
}

.composer-placeholder {
  border: none;
  background: transparent;
  color: #2d2b26;
  font-size: 0.578rem;
  padding: 0.085rem 0.17rem;
  outline: none;
  flex: 1;
  min-width: 0;
  font-family: inherit;
}

.composer-placeholder::placeholder {
  color: #a3a096;
}

.composer-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.51rem;
  margin-top: 0.425rem;
}

.icon-btn {
  width: 1.105rem;
  height: 1.105rem;
  border: none;
  background: transparent;
  color: #2d2b26;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-btn svg {
  width: 60%;
  height: 60%;
}

.icon-btn:hover {
  background: #f2efe4;
}

.icon-btn.open {
  background: #f2efe4;
}

.sidebar-btn {
  color: #87857e;
}

.model-selector {
  font-size: 0.527rem;
  color: #2d2b26;
  padding: 0.128rem 0.297rem;
  border-radius: 6px;
  white-space: nowrap;
}

.model-sub {
  color: #a3a096;
}

.send-btn {
  background: #2d2b26;
  color: #faf9f6;
}

.send-btn:hover {
  background: #403d34;
}

.disclaimer {
  margin: 0;
  color: #a3a096;
  font-size: 0.442rem;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(45, 43, 38, 0.32);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.modal-card {
  width: 17.85rem;
  max-width: 90%;
  max-height: 88%;
  overflow-y: auto;
  background: #f4f2ea;
  border-radius: 12px;
  padding: 0.85rem 1.02rem;
  box-shadow: 0 20px 50px rgba(45, 43, 38, 0.3);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.595rem;
}

.modal-title {
  margin: 0;
  font-size: 0.612rem;
  font-weight: 600;
  color: #2d2b26;
}

.modal-close {
  border: none;
  background: transparent;
  color: #87857e;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0.128rem;
}

.modal-desc {
  margin: 0.383rem 0 0.595rem;
  font-size: 0.527rem;
  line-height: 1.55;
  color: #5c594e;
}

.text-link {
  color: #1a5aa3;
  text-decoration: underline;
  text-decoration-color: rgba(26, 90, 163, 0.35);
  cursor: pointer;
}

.modal-field {
  margin-bottom: 0.595rem;
}

.modal-field input {
  width: 100%;
  border: none;
  background: #ffffff;
  border-radius: 6px;
  padding: 0.297rem 0.425rem;
  font-size: 0.552rem;
  outline: none;
  color: #2d2b26;
  box-shadow: 0 0 0 1px rgba(61, 57, 41, 0.1);
  font-family: inherit;
}

.modal-field input::placeholder {
  color: #a3a096;
}

.field-hint {
  margin: 0.17rem 0 0;
  font-size: 0.468rem;
  color: #a3a096;
  line-height: 1.4;
}

.modal-legal {
  margin: 0.425rem 0 0;
  font-size: 0.442rem;
  color: #a3a096;
  line-height: 1.5;
}

.verify-status {
  margin-top: 0.68rem;
}

.verify-title {
  margin: 0 0 0.383rem;
  font-size: 0.527rem;
  font-weight: 600;
  color: #2d2b26;
}

.verify-row {
  display: flex;
  align-items: center;
  gap: 0.468rem;
  font-size: 0.51rem;
  color: #5c594e;
}

.status-spinner-lg {
  width: 0.977rem;
  height: 0.977rem;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2.5px solid rgba(45, 43, 38, 0.15);
  border-top-color: #2d2b26;
  animation: claude-spin 0.7s linear infinite;
}

.status-check-lg {
  flex-shrink: 0;
  color: #3f9142;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.383rem;
  margin-top: 0.85rem;
}

.btn {
  border: none;
  border-radius: 6px;
  padding: 0.255rem 0.552rem;
  font-size: 0.527rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 3.57rem;
}

.btn-spinner {
  width: 0.552rem;
  height: 0.552rem;
  border-radius: 50%;
  border: 2px solid rgba(250, 249, 246, 0.3);
  border-top-color: #faf9f6;
  animation: claude-spin 0.7s linear infinite;
}

.btn-secondary {
  background: #e8e5da;
  color: #2d2b26;
}

.btn-primary {
  background: #2d2b26;
  color: #faf9f6;
}

.btn-primary.disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
