<script setup lang="ts">
import { portfolio } from '@/data/portfolio'
</script>

<template>
  <section class="about-section fade-up">
    <div class="section-heading">
      <span>01</span>
      <div><p>ABOUT ME</p><h2>Engineering with intent</h2></div>
    </div>
    <div class="about-grid">
      <div class="statement">
        <p>{{ portfolio.description }}</p>
        <RouterLink to="/about">More about me →</RouterLink>
      </div>
      <dl>
        <div><dt>EDUCATION</dt><dd>{{ portfolio.school }}<small>Software Engineering</small></dd></div>
        <div><dt>CURRENT FOCUS</dt><dd>Java Backend<small>Spring · Data · Systems</small></dd></div>
        <div><dt>CAREER PATH</dt><dd>Backend Engineer<small>towards System Architect</small></dd></div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.about-section{max-width:1180px;margin:auto;padding:96px 32px}.section-heading{display:flex;gap:18px;margin-bottom:36px}.section-heading>span{color:var(--portfolio-primary);font:12px var(--portfolio-mono)}.section-heading p{margin:0 0 6px;color:#667587;font:700 11px var(--portfolio-mono);letter-spacing:.18em}.section-heading h2{margin:0;color:var(--portfolio-text);font-size:32px;letter-spacing:-.03em}.about-grid{display:grid;grid-template-columns:1.05fr 1.35fr;gap:70px;align-items:start}.statement>p{margin:0 0 25px;color:#a8b5c4;font-size:clamp(18px,2.1vw,25px);line-height:1.75;letter-spacing:-.02em}.statement>a{color:#8fc6ff;font:12px var(--portfolio-mono)}dl{margin:0;border-top:1px solid #202b3a}dl>div{display:grid;grid-template-columns:140px 1fr;gap:25px;padding:20px 5px;border-bottom:1px solid #202b3a}dt{color:#637286;font:10px var(--portfolio-mono);letter-spacing:.12em}dd{margin:0;color:#dce7f2;font-size:15px}dd small{display:block;margin-top:4px;color:#6f7f91;font:11px var(--portfolio-mono)}@media(max-width:760px){.about-section{padding:72px 20px}.about-grid{grid-template-columns:1fr;gap:42px}}@media(max-width:430px){dl>div{grid-template-columns:1fr;gap:7px}}
</style>
