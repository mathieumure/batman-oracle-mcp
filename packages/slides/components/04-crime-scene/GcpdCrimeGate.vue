<script setup>
import { useNav } from '@slidev/client';

const props = defineProps({
  login: { type: Boolean, default: false },
});

const { nextSlide } = useNav();
</script>

<template>
  <div class="gate">
    <img class="bg" src="/assets/images/bg-cave-drip.svg" alt="" />
    <MacWindow
      :title="login ? 'https://auth.wayne-enterprises.com/login' : 'https://gcpd.gov/cases/alfred'"
      height="460px"
      content-bg="#000"
      style="width: min(72%, 640px)"
    >
      <div v-if="!login" class="home">
        <img class="badge" src="../../pages/02-criminals/assets/gcpd.jpg" alt="GCPD" />

        <button type="button" class="card" @click.stop="nextSlide()">
          <img
            class="scene"
            src="../../pages/01-alert/assets/murder-scene.jpeg"
            alt="Scène de crime d'Alfred"
          />
          <span class="veil" />
          <svg class="lock" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="6" y="11" width="12" height="9" rx="1.6" />
            <path d="M8.2 11V8.2a3.8 3.8 0 0 1 7.6 0V11" />
          </svg>
          <span class="lead">Consulter les pièces à conviction</span>
          <span class="caption">Crime d'Alfred</span>
        </button>
      </div>

      <div v-else class="wayne">
        <form class="form" @submit.prevent>
          <h1>Wayne Enterprises</h1>
          <label>Email<input type="email" /></label>
          <label>Password<input type="password" /></label>
          <button type="submit">Sign in</button>
        </form>
      </div>
    </MacWindow>
  </div>
</template>

<style scoped>
.gate {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 2.2rem 3.2rem;
}

.bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gate :deep(.mac-window) {
  position: relative;
  z-index: 1;
}

.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  height: 100%;
  padding: 0.9rem 1.1rem 1.1rem;
  background: #000;
}

.badge {
  width: min(38%, 150px);
  height: auto;
  object-fit: contain;
}

.card {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 14.5rem;
  padding: 0;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  background: #141414;
  cursor: pointer;
}

.scene {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 40%;
}

.veil {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
}

.lock {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2.8rem;
  height: 2.8rem;
  fill: none;
  stroke: #fff;
  stroke-width: 1.7;
  stroke-linecap: round;
  transform: translate(-50%, -50%);
}

.lead {
  position: absolute;
  left: 0.85rem;
  bottom: 2rem;
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.68rem;
  font-weight: 600;
}

.caption {
  position: absolute;
  left: 0.85rem;
  bottom: 0.7rem;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 700;
}

.wayne {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #0a0a0a;
}

.form {
  width: 300px;
  padding: 2rem;
  border: 2px solid #f5c518;
  border-radius: 12px;
  background: #141414;
  color: #f5c518;
  font-family: Georgia, serif;
}

.form h1 {
  margin: 0 0 1.5rem;
  color: #f5c518;
  font-size: 1.2rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-align: center;
  text-transform: uppercase;
}

.form label {
  display: block;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.form input {
  box-sizing: border-box;
  width: 100%;
  margin-top: 0.25rem;
  padding: 0.5rem;
  border: 1px solid #f5c518;
  border-radius: 6px;
  background: #0a0a0a;
  color: #f5c518;
}

.form button {
  width: 100%;
  padding: 0.6rem;
  border: 0;
  border-radius: 6px;
  background: #f5c518;
  color: #0a0a0a;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
</style>
