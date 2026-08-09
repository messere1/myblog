<script setup lang="ts">import { portfolio } from '@/data/portfolio'</script>
<template>
  <section class="section timeline-section">
    <div class="section-heading"><span>04</span><div><p>GROWTH PATH</p><h2>Learning timeline</h2></div></div>
    <div class="timeline">
      <article v-for="(item,index) in portfolio.timeline" :key="item.year">
        <span class="year">{{ item.year }}</span><i/><div><h3>{{ item.title }}</h3><p>{{ item.description }}</p></div><b>0{{ index+1 }}</b>
      </article>
    </div>
  </section>
</template>
<style scoped>
.section{max-width:1180px;margin:auto;padding:96px 32px}.section-heading{display:flex;gap:18px;margin-bottom:38px}.section-heading>span{color:#58a6ff;font:12px ui-monospace,monospace}.section-heading p{margin:0 0 6px;color:#667587;font:700 11px ui-monospace,monospace;letter-spacing:.18em}.section-heading h2{margin:0;color:#f0f6fc;font-size:32px}.timeline{position:relative}.timeline:before{content:'';position:absolute;top:18px;bottom:18px;left:96px;width:1px;background:#263446}.timeline article{position:relative;display:grid;grid-template-columns:74px 16px 1fr auto;gap:14px;align-items:start;padding:0 0 40px}.year{color:#79c0ff;font:600 13px ui-monospace,monospace}.timeline i{z-index:1;width:9px;height:9px;margin-top:5px;border:2px solid #58a6ff;border-radius:50%;background:#070a0f;box-shadow:0 0 0 5px rgba(88,166,255,.08)}.timeline h3{margin:0 0 7px;color:#dbe7f3;font-size:17px}.timeline p{margin:0;color:#78879a;font-size:13px}.timeline b{color:#172232;font:700 38px ui-monospace,monospace}@media(max-width:600px){.section{padding:72px 20px}.timeline:before{left:68px}.timeline article{grid-template-columns:52px 14px 1fr}.timeline b{display:none}}
</style>
