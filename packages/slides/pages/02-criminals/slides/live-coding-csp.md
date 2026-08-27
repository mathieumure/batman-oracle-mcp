---
layout: blank
---

<div class="h-full flex items-center justify-center p-4">
    <Editor
            session="demo"
            defaultFolder="../mcp/demo"
            file="./01-criminal-tools.ts"
            hideMinimap
            hideActivityBar
            hideStatusBar />
</div>

<!--
Démo : suite de 01-criminal-tools.ts — ajout de la resource, ajout de la meta dans le tool, UI branchée.
Démo dans Claude : ça foire (cf. DEMO.md 1.2.4) — sert de transition vers le concept CSP.
-->
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