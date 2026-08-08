<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useTitle } from '@vueuse/core'
import { portfolio } from '@/data/portfolio'
import { usePostStore } from '@/stores/post'
import { fetchLiveGitHubSnapshot, loadGitHubFallback, type GitHubSnapshot } from '@/api/github'
import fallbackAvatar from '@/assets/hero.png'

useTitle('About | Messere')
const posts=usePostStore()
const github=ref<GitHubSnapshot>()
const profile=computed(()=>github.value?.profile)
const languages=computed(()=>[...new Set(github.value?.repositories.map(repo=>repo.language).filter(Boolean)||[])] as string[])
onMounted(async()=>{posts.fetchAll();try{github.value=await loadGitHubFallback()}catch{}try{github.value=await fetchLiveGitHubSnapshot()}catch{}})
</script>
<template>
  <main class="about-page">
    <header>
      <img :src="profile?.avatarUrl||fallbackAvatar" alt="Messere avatar" />
      <div><p>ABOUT THE ENGINEER</p><h1>{{ profile?.name||'Messere' }}</h1><h2>{{ portfolio.title }} · {{ portfolio.school }}</h2><span>{{ profile?.bio||portfolio.description }}</span></div>
    </header>
    <section class="manifesto"><span>01 / MINDSET</span><blockquote>“Build systems that are understandable, observable, and reliable.”</blockquote><p>我关注的不只是功能是否完成，也关注数据边界、失败路径、性能与长期维护成本。这个网站记录我从基础知识走向工程实践的过程。</p></section>
    <section><span>02 / DIRECTION</span><div class="focus"><article v-for="item in portfolio.focus" :key="item"><i>→</i><h3>{{ item }}</h3><p>通过项目、源码阅读和技术写作持续积累。</p></article></div></section>
    <section><span>03 / REAL DATA</span><div class="numbers"><div><b>{{ posts.posts.length }}</b><small>Published notes</small></div><div><b>{{ profile?.publicRepos||0 }}</b><small>Public repositories</small></div><div><b>{{ profile?.followers||0 }}</b><small>GitHub followers</small></div><div><b>{{ languages.length }}</b><small>Active languages</small></div></div></section>
    <section><span>04 / LANGUAGES</span><div class="tags"><b v-for="language in languages" :key="language">{{ language }}</b><b v-if="!languages.length">Loading GitHub data...</b></div></section>
    <footer><a :href="portfolio.github" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a :href="`mailto:${portfolio.email}`">{{ portfolio.email }} ↗</a><RouterLink to="/resume">Resume →</RouterLink></footer>
  </main>
</template>
<style scoped>
.about-page{min-height:100vh;padding:90px max(24px,calc((100vw - 1000px)/2)) 110px;background:#070a0f;color:#d6e0eb;font-family:Inter,"PingFang SC",system-ui,sans-serif}header{display:grid;grid-template-columns:150px 1fr;gap:35px;align-items:center;padding-bottom:55px;border-bottom:1px solid #263446}header img{width:150px;height:150px;border:1px solid #33465e;border-radius:14px;object-fit:cover;filter:grayscale(.2)}header p,section>span{display:block;margin:0 0 9px;color:#58a6ff;font:700 10px ui-monospace,monospace;letter-spacing:.17em}header h1{margin:0;color:#f0f6fc;font-size:52px;line-height:1.1;letter-spacing:-.05em}header h2{margin:9px 0 14px;color:#8da0b5;font-size:16px;font-weight:500}header div>span{color:#78889a;font-size:13px;line-height:1.8}section{padding:55px 0;border-bottom:1px solid #202b3a}.manifesto blockquote{max-width:780px;margin:22px 0;color:#e6edf3;font-size:clamp(25px,4vw,40px);font-weight:600;line-height:1.35;letter-spacing:-.03em}.manifesto p{max-width:720px;margin:0;color:#7f8ea0;font-size:14px;line-height:1.9}.focus{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:24px}.focus article{padding:24px;border:1px solid #202b3a;border-radius:9px;background:#0d121a}.focus i{color:#58a6ff;font-style:normal}.focus h3{margin:20px 0 8px;color:#e6edf3;font-size:16px}.focus p{margin:0;color:#69788b;font-size:12px;line-height:1.7}.numbers{display:grid;grid-template-columns:repeat(4,1fr);margin-top:25px;border:1px solid #202b3a;border-radius:10px}.numbers div{display:grid;gap:4px;padding:24px;text-align:center}.numbers div+div{border-left:1px solid #202b3a}.numbers b{color:#79c0ff;font:700 30px ui-monospace,monospace}.numbers small{color:#627185}.tags{display:flex;flex-wrap:wrap;gap:9px;margin-top:22px}.tags b{padding:9px 14px;border:1px solid #2b3b50;border-radius:6px;color:#9fb5ce;font:500 12px ui-monospace,monospace}footer{display:flex;gap:11px;padding-top:45px}footer a{padding:9px 13px;border:1px solid #29394d;border-radius:6px;color:#91a7be;font-size:11px}footer a:hover{border-color:#58a6ff;color:#79c0ff}@media(max-width:650px){.about-page{padding-top:60px}header{grid-template-columns:1fr}header img{width:100px;height:100px}.focus{grid-template-columns:1fr}.numbers{grid-template-columns:repeat(2,1fr)}.numbers div:nth-child(3){border-left:0;border-top:1px solid #202b3a}.numbers div:nth-child(4){border-top:1px solid #202b3a}footer{flex-direction:column}}
</style>
