---
layout: blank
background: /assets/images/bg-cave-drip.svg
---

<div class="h-full flex items-center justify-center p-4">
    <Editor
            session="demo"
            defaultFolder="../.."
            openFile="../../packages/mcp/demo/01-criminal-tools.ts"
            hideMinimap
            hideActivityBar
            hideStatusBar />
</div>

---
layout: blank
background: /assets/images/bg-cave-drip.svg
---
<div class="h-full flex items-center justify-center p-12">
    <MacWindow title="MCP Inspector" height="500px" style="width: 100%">
        <ScaledIframe src="http://localhost:6274/" />
    </MacWindow>
</div>
---
layout: blank
background: /assets/images/bg-cave-drip.svg
---

<DesktopApps />