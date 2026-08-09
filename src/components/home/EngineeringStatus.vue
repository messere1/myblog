<template>
  <div class="engineering-status" aria-label="当前工程方向">
    <RouterLink class="status-row building" to="/project/myblog">
      <span><i /> CURRENTLY BUILDING</span>
      <strong>messere.cn · Portfolio v2.5</strong>
      <b>VIEW PROJECT ↗</b>
    </RouterLink>
    <div class="status-row">
      <span>LEARNING</span>
      <strong>Distributed Systems</strong>
      <small>Redis · Cloud Native</small>
    </div>
    <div class="status-row">
      <span>CAREER TARGET</span>
      <strong>Backend Engineer</strong>
      <small>→ System Architect</small>
    </div>
  </div>
</template>

<style scoped>
.engineering-status{display:grid;grid-template-columns:1.35fr 1fr 1fr;overflow:hidden;border:1px solid rgba(255,255,255,.08);border-radius:var(--radius-md);background:var(--portfolio-glass);box-shadow:var(--portfolio-shadow);backdrop-filter:blur(20px)}.status-row{display:flex;min-width:0;flex-direction:column;padding:17px 18px;border-left:1px solid rgba(255,255,255,.07)}.status-row:first-child{border-left:0}.status-row>span{overflow:hidden;color:#66778b;font:700 9px var(--portfolio-mono);letter-spacing:.12em;text-overflow:ellipsis;white-space:nowrap}.status-row i{display:inline-block;width:6px;height:6px;margin-right:7px;border-radius:50%;background:var(--portfolio-success);box-shadow:0 0 9px var(--portfolio-success);animation:pulse-dot 1.8s infinite}.status-row strong{overflow:hidden;margin-top:8px;color:#dce8f4;font-size:12px;text-overflow:ellipsis;white-space:nowrap}.status-row small,.status-row b{margin-top:4px;color:#68798e;font:9px var(--portfolio-mono)}.status-row b{color:#76aee8}.building:hover{background:rgba(88,166,255,.055)}@media(max-width:600px){.engineering-status{grid-template-columns:1fr}.status-row{border-top:1px solid rgba(255,255,255,.07);border-left:0}.status-row:first-child{border-top:0}}
</style>
