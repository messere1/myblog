<script setup lang="ts">
import { portfolio } from '@/data/portfolio'
import TerminalWindow from './TerminalWindow.vue'
import EngineeringStatus from './EngineeringStatus.vue'
</script>

<template>
  <section class="hero-section">
    <div class="hero-grid" aria-hidden="true" />
    <div class="hero-copy">
      <span class="availability"><i /> OPEN TO OPPORTUNITIES · 2026</span>
      <p class="overline">{{ portfolio.school }} · SOFTWARE ENGINEERING</p>
      <h1>{{ portfolio.name }}</h1>
      <h2>{{ portfolio.title }}</h2>
      <p class="tagline">{{ portfolio.tagline }}</p>
      <p class="description">{{ portfolio.description }}</p>
      <div class="focus-list">
        <span v-for="item in portfolio.focus" :key="item">{{ item }}</span>
      </div>
      <div class="actions">
        <a :href="portfolio.github" target="_blank" rel="noopener noreferrer" class="button primary">GitHub ↗</a>
        <RouterLink to="/projects" class="button">View projects</RouterLink>
        <RouterLink to="/resume" class="text-link">Resume →</RouterLink>
      </div>
    </div>
    <div class="hero-visual">
      <TerminalWindow />
      <EngineeringStatus />
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero-section { position:relative; display:grid; grid-template-columns:1.08fr .92fr; gap:64px; align-items:center; min-height:calc(100vh - 74px); max-width:1180px; margin:auto; padding:96px 32px; overflow:hidden; }
.hero-grid { position:absolute; inset:0; z-index:0; opacity:.16; background-image:linear-gradient(#223044 1px,transparent 1px),linear-gradient(90deg,#223044 1px,transparent 1px); background-size:52px 52px; mask-image:linear-gradient(to bottom,transparent,black 25%,transparent 92%); }
.hero-copy,.hero-visual { position:relative; z-index:1; }
.hero-visual { display:grid; gap:14px; }
.availability { display:inline-flex; align-items:center; gap:9px; color:#8b98a8; font:600 11px/1.2 ui-monospace,SFMono-Regular,Consolas,monospace; letter-spacing:.12em; }
.availability i { width:7px; height:7px; border-radius:50%; background:#3fb950; box-shadow:0 0 12px #3fb950; }
.overline { margin:30px 0 16px; color:#58a6ff; font:600 12px/1.4 ui-monospace,SFMono-Regular,Consolas,monospace; letter-spacing:.16em; }
h1 { margin:0; color:#f0f6fc; font-size:clamp(58px,8vw,104px); font-weight:800; line-height:.88; letter-spacing:-.065em; }
h2 { margin:22px 0 20px; color:#8b98a8; font-size:clamp(25px,3vw,38px); font-weight:500; letter-spacing:-.025em; }
.tagline { margin:-9px 0 18px; color:#d8e4f0; font:600 clamp(15px,1.7vw,19px)/1.5 var(--portfolio-mono); letter-spacing:-.03em; }
.description { max-width:650px; margin:0; color:#aab6c5; font-size:16px; line-height:1.85; }
.focus-list { display:flex; flex-wrap:wrap; gap:9px; margin-top:24px; }
.focus-list span { padding:7px 11px; border:1px solid #273447; border-radius:6px; background:#0d131c; color:#9fc6f3; font:12px ui-monospace,SFMono-Regular,Consolas,monospace; }
.actions { display:flex; align-items:center; flex-wrap:wrap; gap:12px; margin-top:34px; }
.button { padding:11px 18px; border:1px solid #2d3b4e; border-radius:7px; color:#dbe7f3; font-size:13px; font-weight:600; transition:.2s; }
.button:hover { border-color:#58a6ff; transform:translateY(-2px); }
.button.primary { border-color:#58a6ff; background:#58a6ff; color:#07101d; }
.text-link { margin-left:6px; color:#8b98a8; font-size:13px; }
.text-link:hover { color:#58a6ff; }
@media(max-width:900px){.hero-section{grid-template-columns:1fr;gap:50px;padding:72px 24px}.hero-visual{max-width:720px}.hero-grid{background-size:40px 40px}}
@media(max-width:560px){.hero-section{padding:60px 20px}.overline{margin-top:24px}h1{font-size:56px}.actions{align-items:stretch}.button{text-align:center}.text-link{width:100%;margin:6px 0 0}}
</style>
