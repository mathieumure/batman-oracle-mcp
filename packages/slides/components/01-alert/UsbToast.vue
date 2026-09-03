<script setup>
import { useNav } from '@slidev/client';
import { useTemplateRef } from 'vue';

const { nextSlide } = useNav();
const buttonRef = useTemplateRef('usb-toast');

function openDevice() {
  buttonRef.value.classList.add('move-down');
  setTimeout(() => {
    nextSlide();
  }, 100);
}
</script>

<template>
  <button type="button" class="usb-toast" @click.stop="openDevice" ref="usb-toast">
    <span class="usb-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M8 8V4h3v4h2V4h3v4" stroke="currentColor" stroke-width="1.6" />
        <rect x="6" y="8" width="12" height="11" rx="1.5" stroke="currentColor" stroke-width="1.6" />
        <path d="M10 13h4" stroke="currentColor" stroke-width="1.6" />
      </svg>
    </span>
    <span class="usb-copy">
      <strong>BAT-USB détectée</strong>
      <em>Bat-click pour consulter</em>
    </span>
    <svg class="usb-chevron" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6 3.5l5 4.5-5 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
</template>

<style scoped>
.slidev-vclick-current {
  transform: translateX(0%);
  opacity: 1;
}

.slidev-vclick-hidden {
  transform: translateX(100%);
  opacity: 0;
}

.move-down {
  opacity: 0;
  transform: translateY(100%);
}

.usb-toast {
  position: absolute;
  top: 2.2rem;
  right: 2.4rem;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  padding: 0.45rem 0.65rem;
  border: 1px solid color-mix(in srgb, var(--color-gold) 35%, #3a4154);
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-navy) 88%, #000);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.45);
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  transition: 0.3s all;
}

.usb-toast:hover {
  border-color: var(--color-gold);
}

.usb-icon {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 5px;
  background: color-mix(in srgb, var(--color-gold) 18%, transparent);
  color: var(--color-yellow);
}

.usb-icon svg {
  width: 13px;
  height: 13px;
}

.usb-copy {
  display: flex;
  flex-direction: column;
  gap: 0.08rem;
}

.usb-copy strong {
  font-size: 0.72rem;
  font-weight: 700;
}

.usb-copy em {
  font-size: 0.58rem;
  font-style: normal;
  color: var(--text-secondary);
}

.usb-chevron {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  color: var(--text-secondary);
}
</style>
