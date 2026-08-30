<template>
  <div class="usb-stage">
    <img class="mcp-logo" src="../../pages/02-criminals/assets/mcp.png" alt="MCP" />

    <h1 class="usb-title">C'est quoi un Model Context Protocol (MCP) ?</h1>

    <span v-click="1" class="usb-approx">≈</span>

    <div class="usb-row">
      <div class="usb-slot">
        <div v-click="2" class="usb-device">
          <img class="usb-batmobile" src="../../pages/02-criminals/assets/batmobile.png" alt="Batmobile" />
        </div>
      </div>

      <div class="usb-slot">
        <div v-click="1" class="usb-link">
          <img class="usb-c-logo" src="../../pages/02-criminals/assets/usb-c.png" alt="USB-C" />
          <span>USB-C</span>
        </div>
      </div>

      <div class="usb-slot">
        <div v-click="2" class="usb-device">
          <img class="usb-batcomputer" src="../../pages/02-criminals/assets/batcomputer.png" alt="Batcomputer" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.usb-stage {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1.2rem;
  padding: 3.2rem 3.2rem 2.4rem;
  text-align: center;
}

.usb-title {
  margin: 0;
  max-width: 42rem;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.35;
  color: var(--text-primary, #fff);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.mcp-logo {
  width: 110px;
  height: 110px;
  margin-top: 0.4rem;
  mix-blend-mode: screen;
  view-transition-name: mcp-logo;
}

.usb-approx {
  font-size: 4rem;
  font-weight: 700;
  line-height: 1;
  color: var(--color-gold);
}

.usb-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  column-gap: 5.5rem;
  width: 100%;
  margin-top: 0.8rem;
  min-height: 5.5rem;
}

.usb-device {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45rem;
  color: var(--color-gold);
  font-size: 0.85rem;
  font-weight: 700;
}

.usb-slot {
  display: flex;
  justify-content: center;
  min-width: 0;
}

.usb-batmobile {
  width: 300px;
  height: auto;
}

.usb-batcomputer {
  width: 9rem;
  height: auto;
}

.usb-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45rem;
  color: #EEE;
  font-size: 1.5rem;
  font-weight: 700;
}

.usb-c-logo {
  width: 20rem;
  height: auto;
  mix-blend-mode: screen;
}
</style>
