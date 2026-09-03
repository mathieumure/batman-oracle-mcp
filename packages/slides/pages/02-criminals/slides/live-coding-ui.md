---
layout: blank
background: /assets/images/bg-cave-drip.svg
---

<div class="h-full flex items-center justify-center p-4">
    <Editor
        session="demo-1-ui"
        defaultFolder="../.."
        openFile="../../packages/mcp-ui/src/demo/criminals.tsx"
        hideMinimap
        hideActivityBar
        hideStatusBar />
</div>

---
layout: blank
background: /assets/images/bg-cave-drip.svg
---

::default::

<div class="h-full flex items-center justify-center p-12">
    <MacWindow title="MCP Inspector" height="500px" style="width: 100%">
        <ScaledIframe src="http://localhost:6274/" />
    </MacWindow>
</div>
