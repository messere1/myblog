<script setup lang="ts">
import type { GitHubRepository } from '@/api/github'
defineProps<{ project: GitHubRepository; featured?: boolean }>()
</script>
<template>
  <article :class="['project-card',{featured}]">
    <div class="top"><span class="folder">⌁</span><a :href="project.url" target="_blank" rel="noopener noreferrer">↗</a></div>
    <p class="eyebrow">{{ featured ? 'FEATURED PROJECT' : 'OPEN SOURCE' }}</p>
    <h3>{{ project.name }}</h3>
    <p class="description">{{ project.description || '持续迭代中的工程实践项目。' }}</p>
    <div class="topics">
      <span v-if="project.language">{{ project.language }}</span>
      <span v-for="topic in project.topics.slice(0,3)" :key="topic">{{ topic }}</span>
    </div>
    <div class="meta"><span>☆ {{ project.stars }}</span><span>⑂ {{ project.forks }}</span><span>Updated {{ new Date(project.updatedAt).toLocaleDateString('zh-CN') }}</span></div>
  </article>
</template>
<style scoped>
.project-card{display:flex;min-height:270px;flex-direction:column;padding:25px;border:1px solid #202b3a;border-radius:11px;background:#0d121a;transition:.25s}.project-card:hover{transform:translateY(-6px);border-color:#3d5878;box-shadow:0 20px 45px rgba(0,0,0,.25)}.project-card.featured{background:linear-gradient(145deg,#111a27,#0d121a);border-color:#2c4461}.top{display:flex;align-items:center;justify-content:space-between}.folder{color:#58a6ff;font-size:26px}.top a{color:#718096;font-size:20px}.top a:hover{color:#58a6ff}.eyebrow{margin:22px 0 8px;color:#58789d;font:700 10px ui-monospace,monospace;letter-spacing:.15em}h3{margin:0;color:#e6edf3;font-size:21px;letter-spacing:-.02em}.description{flex:1;margin:13px 0 18px;color:#8b98a8;font-size:13px;line-height:1.75}.topics{display:flex;flex-wrap:wrap;gap:7px}.topics span{padding:4px 8px;border-radius:4px;background:#151f2d;color:#8cb4df;font:10px ui-monospace,monospace}.meta{display:flex;gap:13px;margin-top:20px;padding-top:15px;border-top:1px solid #1d2735;color:#5f6d7e;font:10px ui-monospace,monospace}.meta span:last-child{margin-left:auto}
</style>
