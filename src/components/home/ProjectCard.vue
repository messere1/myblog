<script setup lang="ts">
import type { GitHubRepository } from '@/api/github'
defineProps<{ project: GitHubRepository; featured?: boolean }>()
</script>
<template>
  <article :class="['project-card',{featured}]">
    <div class="top"><span class="folder">⌁</span><a :href="project.url" target="_blank" rel="noopener noreferrer">↗</a></div>
    <p class="eyebrow">{{ featured ? 'FEATURED PROJECT' : 'OPEN SOURCE' }}</p>
    <h3><RouterLink :to="{ name: 'project-detail', params: { name: project.name } }">{{ project.name }}</RouterLink></h3>
    <p class="description">{{ project.description || '持续迭代中的工程实践项目。' }}</p>
    <div class="topics">
      <span v-if="project.language">{{ project.language }}</span>
      <span v-for="topic in project.topics.slice(0,3)" :key="topic">{{ topic }}</span>
    </div>
    <ul v-if="featured" class="signals">
      <li>Public source repository</li>
      <li v-if="project.homepage">Live production deployment</li>
      <li>Continuously updated on GitHub</li>
    </ul>
    <div class="meta"><span>☆ {{ project.stars }}</span><span>⑂ {{ project.forks }}</span><RouterLink :to="{ name: 'project-detail', params: { name: project.name } }">Details →</RouterLink></div>
  </article>
</template>
<style scoped>
.project-card{display:flex;min-height:270px;flex-direction:column;padding:27px;border:1px solid rgba(255,255,255,.075);border-radius:var(--radius-md);background:var(--portfolio-glass);box-shadow:0 12px 40px rgba(0,0,0,.12);backdrop-filter:blur(18px);transition:.25s}.project-card:hover{transform:translateY(-6px);border-color:#3d5878;box-shadow:var(--portfolio-shadow)}.project-card.featured{min-height:554px;padding:34px;background:linear-gradient(145deg,rgba(20,34,52,.92),rgba(11,17,25,.82));border-color:#2c4461}.top{display:flex;align-items:center;justify-content:space-between}.folder{color:#58a6ff;font-size:26px}.top a{color:#718096;font-size:20px}.top a:hover{color:#58a6ff}.eyebrow{margin:22px 0 8px;color:#58789d;font:700 10px var(--portfolio-mono);letter-spacing:.15em}h3{margin:0;color:#e6edf3;font-size:21px;letter-spacing:-.02em}.featured h3{font-size:clamp(30px,4vw,48px)}h3 a:hover{color:#79c0ff}.description{flex:1;margin:13px 0 18px;color:#8b98a8;font-size:13px;line-height:1.75}.featured .description{max-width:560px;flex:0;margin-top:20px;font-size:15px}.topics{display:flex;flex-wrap:wrap;gap:7px}.topics span{padding:5px 9px;border-radius:6px;background:#151f2d;color:#8cb4df;font:10px var(--portfolio-mono)}.signals{display:grid;gap:10px;margin:28px 0 0;padding:22px 0 0;border-top:1px solid rgba(255,255,255,.07);list-style:none;color:#9babbc;font-size:12px}.signals li:before{margin-right:9px;color:#3fb950;content:'✓'}.meta{display:flex;gap:13px;margin-top:20px;padding-top:15px;border-top:1px solid #1d2735;color:#5f6d7e;font:10px var(--portfolio-mono)}.meta a{margin-left:auto;color:#7896b8}.meta a:hover{color:#79c0ff}@media(max-width:900px){.project-card.featured{min-height:360px}}@media(max-width:640px){.project-card.featured{min-height:0;padding:27px}.featured h3{font-size:28px}}
</style>
