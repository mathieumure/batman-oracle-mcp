<script setup>
import { ref } from 'vue';

const selected = ref(null);

const apps = [
  { id: 'claude', name: 'Claude' },
  { id: 'chatgpt', name: 'ChatGPT' },
  { id: 'custom', name: 'Custom' },
];
</script>

<template>
  <div class="desk">
    <button
      v-for="app in apps"
      :key="app.id"
      type="button"
      class="app"
      :class="{ on: selected === app.id }"
      @click.stop="selected = app.id"
    >
      <span class="icon">
        <img
          v-if="app.id === 'claude'"
          src="../../pages/02-criminals/assets/logos/claude.svg"
          alt=""
        />
        <img
          v-else-if="app.id === 'chatgpt'"
          src="../../pages/02-criminals/assets/logos/openai.svg"
          alt=""
        />
        <svg v-else viewBox="0 0 24 24" aria-hidden="true">
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
      </span>
      <span class="name">{{ app.name }}</span>
    </button>
  </div>
</template>

<style scoped>
.desk {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.8rem;
}

.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45rem;
  width: 6.4rem;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: default;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.6rem;
  height: 4.6rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.08);
}

.icon img,
.icon svg {
  width: 2.5rem;
  height: 2.5rem;
}

.name {
  padding: 0.12rem 0.45rem;
  border-radius: 4px;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
}

.app.on .icon {
  background: rgba(10, 100, 216, 0.38);
  box-shadow: inset 0 0 0 2px rgba(90, 168, 255, 0.85);
}

.app.on .name {
  background: #0a64d8;
  text-shadow: none;
}
</style>
