<script setup>
import { ref, onMounted, nextTick } from 'vue';

const messages = ref([]);
const messagesEl = ref(null);

async function scrollToEnd() {
  await nextTick();
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
  }
}

function formatText(text) {
  // Convertit **texte** en <strong>texte</strong>
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

onMounted(() => {
  // Tous les messages sont ajoutés immédiatement mais apparaissent avec un délai CSS
  messages.value.push({ 
    role: 'user', 
    text: 'Dis-moi Claude, comment demander les retours sur cette enquête ?' 
  });
  
  messages.value.push({ 
    role: 'assistant', 
    text: 'C\'est vrai que c\'est **important** de récupérer des **retours** sur l\'enquête si jamais Alfred meurt à nouveau dans une autre ville avec une conférence. Partage-leur ce lien **OpenFeedback** :' 
  });
  
  messages.value.push({ 
    role: 'qr', 
    text: '' 
  });
  
  scrollToEnd();
});
</script>

<template>
  <div class="claude-app">
    <div class="app-header">
      <button type="button" class="icon-btn sidebar-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="9" y1="4" x2="9" y2="20" />
        </svg>
      </button>
    </div>

    <div ref="messagesEl" class="chat-body">
      <div v-for="(msg, i) in messages" :key="i" class="message-row" :class="msg.role">
        <div v-if="msg.role === 'user'" class="user-bubble">
          <p>{{ msg.text }}</p>
        </div>
        <div v-else-if="msg.role === 'assistant'" class="assistant-content">
          <p v-html="formatText(msg.text)"></p>
        </div>
        <div v-else-if="msg.role === 'qr'" class="assistant-content full-width">
          <div class="reply-image">
            <img src="/qrcode-feedback.png" alt="QR Code Feedback" />
          </div>
        </div>
      </div>
    </div>

    <div class="composer-zone">
      <div class="composer">
        <input type="text" class="composer-input" placeholder="Répondre à Claude…" />
        <button type="button" class="send-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
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

.icon-btn {
  background: none;
  border: none;
  padding: 0.34rem;
  border-radius: 6px;
  cursor: pointer;
  color: #6b6761;
  transition: background 0.15s;
}

.icon-btn:hover {
  background: #eeece2;
}

.chat-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
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

.message-row.assistant,
.message-row.qr {
  justify-content: flex-start;
}

.message-row {
  display: flex;
  opacity: 0;
  animation: fade-in 0.5s ease forwards;
}

.message-row:nth-child(1) {
  animation-delay: 0s;
}

.message-row:nth-child(2) {
  animation-delay: 1s;
}

.message-row:nth-child(3) {
  animation-delay: 2.5s;
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

.assistant-content {
  max-width: 85%;
}

.assistant-content.full-width {
  max-width: 280px;
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
  border: 2px solid #2d2b26;
}

.composer-zone {
  position: relative;
  width: 100%;
  max-width: 28.9rem;
  margin: 0.765rem auto 0;
  flex-shrink: 0;
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

.composer-input {
  border: none;
  background: transparent;
  color: #2d2b26;
  font-size: 0.578rem;
  padding: 0.085rem 0.17rem;
  outline: none;
  flex: 1;
  min-width: 0;
}

.composer-input::placeholder {
  color: #a39e96;
}

.send-btn {
  width: 1.105rem;
  height: 1.105rem;
  border: none;
  background: #2d2b26;
  color: #faf9f6;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.send-btn:hover {
  background: #403d34;
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
