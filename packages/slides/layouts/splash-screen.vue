<template>
  <div class="splash-screen-wrapper">
    <video src="../assets/intro.webm" autoplay muted loop />
    <div class="conference-logo"><slot /></div>
    <div class="splash-screen-content">
      <img src="../assets/splash-screen-logo.png" />
      <h1 class="splash-screen-title">Créer son App<br />dans ChatGPT & Claude</h1>
    </div>
  </div>
</template>

<style scoped>
.splash-screen-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  color: white;
  background-color: black;
  video {
    position: absolute;
    top: 0;
    left: 0;
  }
  img {
    filter: drop-shadow(0px 7px 5px black);
    width: 50%;
    height: auto;
  }

  .conference-logo {
    position: absolute;
    top: 25px;
    right: 25px;
  }
}

.splash-screen-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding-bottom: 20px;
  text-align: center;
  letter-spacing: 1em;
}

.splash-screen-title {
  font-family: Trajan, sans-serif;
  text-transform: uppercase;
  font-size: 2rem;
  text-shadow:
    -1px -1px 3px black,
    1px -1px 3px black,
    -1px 1px 3px black,
    1px 1px 3px black;
}
</style>
