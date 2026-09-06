---
layout: blank
background: /assets/images/bg-cave-drip.svg
clicks: 1
transition: view-transition
---

<MapDataSplit />

<!--
structuredContent. Le serveur MCP le renvoie à l'agent. Jauge à zéro.

Tous les GPS. Le contexte passe au rouge.
-->

---
layout: blank
background: /assets/images/bg-cave-drip.svg
clicks: 1
transition: view-transition
---

<MapDataSplit :split="true" />

<!--
Crime Map renvoie les deux.

structuredContent. Ce que Claude lit. Un résumé. 47 crimes à Gotham. Pas les GPS.

_meta. La liste. Croix rouge. Ça n'entre pas dans le contexte.

La croix saute. Le widget prend _meta. L'iframe. Les pins.
-->
