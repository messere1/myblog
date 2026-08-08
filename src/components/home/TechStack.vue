<script setup lang="ts">
import { portfolio } from '@/data/portfolio'
</script>
<template>
  <section class="section tech">
    <div class="section-heading"><span>01</span><div><p>CAPABILITIES</p><h2>Engineering stack</h2></div></div>
    <div class="stack-grid">
      <article v-for="item in portfolio.stack" :key="item.name">
        <div class="icon">{{ item.name.slice(0, 2).toUpperCase() }}</div>
        <div><h3>{{ item.name }}</h3><p>{{ item.group }}</p></div>
        <span>{{ item.level }}</span>
      </article>
    </div>
  </section>
</template>
<style scoped>
.section{max-width:1180px;margin:auto;padding:96px 32px}.section-heading{display:flex;align-items:flex-start;gap:18px;margin-bottom:36px}.section-heading>span{color:#58a6ff;font:12px ui-monospace,monospace}.section-heading p{margin:0 0 6px;color:#667587;font:700 11px ui-monospace,monospace;letter-spacing:.18em}.section-heading h2{margin:0;color:#f0f6fc;font-size:32px;letter-spacing:-.03em}.stack-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.stack-grid article{display:flex;align-items:center;gap:14px;padding:20px;border:1px solid #202b3a;border-radius:10px;background:#0d121a;transition:.25s}.stack-grid article:hover{transform:translateY(-4px);border-color:#3d5878;background:#101722}.icon{display:grid;place-items:center;width:42px;height:42px;border-radius:8px;background:#172233;color:#79c0ff;font:700 12px ui-monospace,monospace}.stack-grid h3{margin:0;color:#dbe7f3;font-size:14px}.stack-grid p{margin:3px 0 0;color:#657386;font-size:11px}.stack-grid article>span{margin-left:auto;color:#607086;font:10px ui-monospace,monospace;text-transform:uppercase}@media(max-width:760px){.section{padding:72px 20px}.stack-grid{grid-template-columns:1fr 1fr}}@media(max-width:480px){.stack-grid{grid-template-columns:1fr}}
</style>
