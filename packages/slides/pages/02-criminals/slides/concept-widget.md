---
layout: blank
background: /assets/images/bg-cave-drip.svg
clicks: 2
transition: view-transition
---

<McpAppChat>
  <McpAppMessage from="me">Liste les criminels du GCPD.</McpAppMessage>
  <McpAppMessage :at="1" from="bot" kind="json" />
  <McpAppMessage :at="2" from="me">🥴</McpAppMessage>
</McpAppChat>

---
layout: blank
background: /assets/images/bg-cave-drip.svg
clicks: 5
---

<McpAppRecipe />

---
layout: blank
background: /assets/images/bg-cave-drip.svg
clicks: 1
transition: view-transition
---

<McpAppChat pin-bottom>
  <McpAppMessage from="me">Liste les criminels du GCPD.</McpAppMessage>
  <McpAppMessage from="bot" kind="json" />
  <McpAppMessage from="me">🥴</McpAppMessage>
  <McpAppMessage :at="1" from="bot">Ah tiens, pardon. C'est mieux comme ça.</McpAppMessage>
  <McpAppMessage :at="1" from="bot" kind="widget" />
</McpAppChat>
