---
layout: content
columns: 1
background: /assets/images/bg-cave-canyon.svg
---

::title::
Ressources

::default::

<ul class="res">
  <li>
    <span>Slides</span>
    <code>https://example.com/batman-oracle-mcp</code>
  </li>
  <li>
    <span>Repo</span>
    <code>https://github.com/example/batman-oracle-mcp</code>
  </li>
  <li>
    <span>Spec MCP</span>
    <code>https://modelcontextprotocol.io</code>
  </li>
  <li>
    <span>MCP Apps</span>
    <code>https://modelcontextprotocol.io/docs/apps</code>
  </li>
</ul>

<style scoped>
.res {
  list-style: none;
  margin: 1.2rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.res li {
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

.res li::before {
  content: '';
  flex-shrink: 0;
  width: 0.7rem;
  height: 0.7rem;
  margin-top: 0.25rem;
  background: var(--color-gold);
  clip-path: polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%);
}

.res span {
  min-width: 7.5rem;
  color: #fff;
  font-weight: 700;
}

.res code {
  color: var(--text-secondary, #b9c0cf);
  font-size: 0.95rem;
}
</style>
