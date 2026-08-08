<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useTitle } from '@vueuse/core'
import ProjectCard from '@/components/home/ProjectCard.vue'
import { fetchLiveGitHubSnapshot, loadGitHubFallback, type GitHubSnapshot } from '@/api/github'
useTitle('Projects | Messere')
const github=ref<GitHubSnapshot>()
const refreshing=ref(false)
async function load(){refreshing.value=true;try{github.value=await loadGitHubFallback()}catch{}try{github.value=await fetchLiveGitHubSnapshot()}catch{}finally{refreshing.value=false}}
onMounted(load)
</script>
<template>
  <main class="projects-page">
    <header><p>BUILD · LEARN · ITERATE</p><h1>Engineering Projects</h1><span>所有项目数据直接来自 GitHub，按最近更新时间排列。</span></header>
    <div class="project-status"><span><i/> {{ refreshing?'SYNCING WITH GITHUB':'LIVE FROM GITHUB' }}</span><a href="https://github.com/messere1?tab=repositories" target="_blank" rel="noopener noreferrer">View all on GitHub ↗</a></div>
    <section v-if="github?.repositories.length" class="grid"><ProjectCard v-for="(project,index) in github.repositories" :key="project.name" :project="project" :featured="index===0"/></section>
    <div v-else class="empty">Loading project data...</div>
  </main>
</template>
<style scoped>
.projects-page{min-height:100vh;padding:90px max(24px,calc((100vw - 1116px)/2)) 110px;background:#070a0f;color:#e6edf3;font-family:Inter,"PingFang SC",system-ui,sans-serif}header{max-width:780px}header p{margin:0;color:#58a6ff;font:700 11px ui-monospace,monospace;letter-spacing:.18em}header h1{margin:12px 0;color:#f0f6fc;font-size:clamp(42px,6vw,68px);letter-spacing:-.055em}header span{color:#7d8b9c}.project-status{display:flex;justify-content:space-between;margin:48px 0 22px;color:#627185;font:10px ui-monospace,monospace;letter-spacing:.1em}.project-status span{display:flex;align-items:center;gap:8px}.project-status i{width:6px;height:6px;border-radius:50%;background:#3fb950;box-shadow:0 0 8px #3fb950}.project-status a{color:#7896b8}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.empty{padding:70px;border:1px dashed #263548;border-radius:10px;color:#657386;text-align:center}@media(max-width:700px){.projects-page{padding-top:65px}.grid{grid-template-columns:1fr}}
</style>
