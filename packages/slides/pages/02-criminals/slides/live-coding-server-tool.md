---
layout: blank
---

<div class="h-full flex items-center justify-center p-4">
  <Editor
    session="demo"
    defaultFolder="../mcp/demo"
    file="./mcp-server.ts"
    hideMinimap
    hideActivityBar
    hideStatusBar />
</div>

<!--
Démo : packages/mcp/demo/00-mcp-server.ts puis début de 01-criminal-tools.ts (soluces dans demo/soluce/).
Serveur MCP nu, puis un premier tool sans UI qui renvoie la liste des criminels en texte brut/JSON.
-->

---
layout: blank
background: /assets/images/bg-cave-drip.svg
---

::default::

<div class="h-full flex items-center justify-center p-12 w-full">

```shell {lines:false}{all|w-full}
npx @modelcontextprotocol/inspector
```

</div>
---
layout: blank
background: /assets/images/bg-cave-drip.svg
---

::default::

<div class="h-full flex items-center justify-center p-12">
    <MacWindow title="MCP Inspector" height="500px" style="width: 100%">
        <iframe src="http://localhost:6274/" height="500px" style="width: 100%" />
    </MacWindow>
</div>
---