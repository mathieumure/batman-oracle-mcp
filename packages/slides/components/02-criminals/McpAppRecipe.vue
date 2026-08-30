<script setup>
import { useNav } from '@slidev/client';

const { clicks } = useNav();
</script>

<template>
  <div class="recipe">
    <h1 class="recipe-title">Notre serveur MCP</h1>
    <div class="recipe-cols">
      <div class="recipe-col" :class="clicks >= 1 ? 'pop' : 'is-hidden'">
        <p class="recipe-tag">Ce qu'il nous renvoie</p>
        <pre class="json recipe-json">{
  "criminals": [
    { "name": "Joker", ... },
    { "name": "Penguin", ... },
    { ... }
  ]
}
<span class="json-more">+ 24 000 lines</span></pre>
      </div>

      <div class="recipe-mid">
        <template v-if="clicks >= 3">
          <p class="recipe-mid-title pop">
            <span class="mcp-name">
              <img src="../../pages/02-criminals/assets/mcp.png" alt="" />
              UI
            </span>
            <span class="mcp-sep">/</span>
            <span class="mcp-name">
              <img src="../../pages/02-criminals/assets/mcp.png" alt="" />
              Apps
            </span>
          </p>
          <p class="recipe-mid-hint pop">On enrichit notre serveur</p>
        </template>
        <div v-if="clicks >= 4" class="brick pop">
          <span>Une ressource</span>
          <div class="brick-logos">
            <img src="../../pages/02-criminals/assets/logos/html5.svg" alt="" />
            <img src="../../pages/02-criminals/assets/logos/css3.svg" alt="" />
            <img src="../../pages/02-criminals/assets/logos/javascript.svg" alt="" />
          </div>
          <code>ui://get_criminals</code>
        </div>
        <div v-if="clicks >= 5" class="brick pop">
          <span>Le tool pointe vers cette UI</span>
          <code>_meta.ui.resourceUri</code>
        </div>
      </div>

      <div class="recipe-col" :class="clicks >= 2 ? 'pop' : 'is-hidden'">
        <p class="recipe-tag">Ce qu'on voudrait</p>
        <div class="recipe-ui">
          <div class="web-stack">
            <div class="web-item html">
              <img src="../../pages/02-criminals/assets/logos/html5.svg" alt="" />
              <span>HTML</span>
            </div>
            <div class="web-item css">
              <img src="../../pages/02-criminals/assets/logos/css3.svg" alt="" />
              <span>CSS</span>
            </div>
            <div class="web-item js">
              <img src="../../pages/02-criminals/assets/logos/javascript.svg" alt="" />
              <span>JS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipe {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5.2rem;
  padding: 2.4rem 3.2rem;
}

.recipe-title {
  margin: 0;
  font-size: 1.85rem;
  font-weight: 800;
  color: var(--text-primary, #fff);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.recipe-cols {
  display: grid;
  grid-template-columns: 1fr 18rem 1fr;
  align-items: start;
  gap: 1.2rem;
  width: 100%;
}

.recipe-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
  min-width: 0;
}

.recipe-col.is-hidden {
  visibility: hidden;
}

.recipe-tag {
  margin: 0;
  padding: 0.28rem 0.85rem;
  border: 1.5px solid #6e5a10;
  border-radius: 999px;
  background: color-mix(in srgb, #6e5a10 32%, #1a1a1a);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 800;
  text-align: center;
}

.json {
  align-self: flex-start;
  flex-shrink: 0;
  margin: 0;
  max-width: 96%;
  padding: 0.65rem 0.8rem;
  border-radius: 10px;
  background: #141414;
  color: #d4d4d4;
  font-size: 0.68rem;
  line-height: 1.45;
  white-space: pre;
}

.json-more {
  display: block;
  margin-top: 0.35rem;
  color: #888;
  font-size: 0.62rem;
}

.recipe-json {
  width: 100%;
  height: 12.5rem;
  max-width: none;
  margin: 0;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
}

.recipe-mid {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 0.55rem;
  min-height: 10rem;
}

.recipe-mid-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  margin: 0 0 0.2rem;
  font-size: 1.05rem;
  font-weight: 800;
  color: #fff;
}

.mcp-name {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.mcp-name img {
  width: 1.15rem;
  height: 1.15rem;
}

.mcp-sep {
  color: rgba(255, 255, 255, 0.45);
  font-weight: 700;
}

.recipe-mid-hint {
  margin: 0 0 0.15rem;
  text-align: center;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
}

.recipe-ui {
  width: 100%;
  height: 12.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  background: #141414;
}

.web-stack {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
}

.web-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  color: #eee;
  font-size: 0.68rem;
  font-weight: 700;
}

.web-item img {
  width: 28px;
  height: 28px;
}

.web-item.html span {
  color: #e44d26;
}

.web-item.css span {
  color: #1572b6;
}

.web-item.js span {
  color: #f7df1e;
}

.brick {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.55rem 0.65rem;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.14);
}

.brick-logos {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
}

.brick-logos img {
  width: 22px;
  height: 22px;
}

.brick span {
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1.3;
  text-align: center;
}

.brick code {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.58rem;
  text-align: center;
  word-break: break-all;
}

.pop {
  animation: pop 0.35s ease;
}

@keyframes pop {
  0% {
    opacity: 0;
    transform: scale(0.72);
  }

  70% {
    opacity: 1;
    transform: scale(1.08);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
