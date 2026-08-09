<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useTitle } from '@vueuse/core'
import HeroSection from '@/components/home/HeroSection.vue'
import AboutSection from '@/components/home/AboutSection.vue'
import TechStack from '@/components/home/TechStack.vue'
import ProjectCard from '@/components/home/ProjectCard.vue'
import CareerTimeline from '@/components/home/CareerTimeline.vue'
import BlogPreview from '@/components/home/BlogPreview.vue'
import { usePostStore } from '@/stores/post'
import { fetchLiveGitHubSnapshot, loadGitHubFallback, type GitHubSnapshot } from '@/api/github'

useTitle('Messere | Java Backend Engineer')
const postStore = usePostStore()
const github = ref<GitHubSnapshot>()
const projects = computed(() => github.value?.repositories.slice(0, 3) || [])

onMounted(async () => {
  postStore.fetchAll()
  try { github.value = await loadGitHubFallback() } catch { /* keep the page usable */ }
  try { github.value = await fetchLiveGitHubSnapshot() } catch { /* cached projects stay visible */ }
})
</script>

<template>
  <div class="portfolio-home portfolio-surface">
    <HeroSection />
    <div class="divider" />
    <AboutSection />
    <div class="divider" />
    <TechStack />
    <section class="projects-section">
      <div class="section-heading">
        <span>03</span><div><p>SELECTED WORK</p><h2>Projects from GitHub</h2></div>
        <RouterLink to="/projects">All projects →</RouterLink>
      </div>
      <div v-if="projects.length" class="projects-grid">
        <ProjectCard v-for="(project,index) in projects" :key="project.name" :project="project" :featured="index===0" />
      </div>
      <div v-else class="loading">Loading repositories<span>_</span></div>
    </section>
    <CareerTimeline />
    <BlogPreview :posts="postStore.posts" />
    <section class="contact-cta">
      <p>LET'S BUILD SOMETHING RELIABLE</p>
      <h2>Looking for a backend engineering opportunity.</h2>
      <div><RouterLink to="/resume">Read resume</RouterLink><a href="mailto:3023209092@tju.edu.cn">Contact me ↗</a></div>
    </section>
  </div>
</template>

<style scoped>
.portfolio-home{min-height:100vh}.divider{height:1px;max-width:1116px;margin:auto;background:linear-gradient(90deg,transparent,#202b3a,transparent)}.projects-section{max-width:1180px;margin:auto;padding:112px 32px}.section-heading{display:flex;align-items:flex-start;gap:18px;margin-bottom:42px}.section-heading>span{color:#58a6ff;font:12px var(--portfolio-mono)}.section-heading p{margin:0 0 6px;color:#667587;font:700 11px var(--portfolio-mono);letter-spacing:.18em}.section-heading h2{margin:0;color:#f0f6fc;font-size:36px;letter-spacing:-.04em}.section-heading>a{margin-left:auto;color:#7d8b9c;font-size:12px}.section-heading>a:hover{color:#58a6ff}.projects-grid{display:grid;grid-template-columns:1.35fr 1fr;gap:14px}.projects-grid>*:first-child{grid-row:span 2}.loading{padding:55px;border:1px dashed #263548;border-radius:var(--radius-md);color:#657386;text-align:center;font:12px var(--portfolio-mono)}.loading span{animation:blink 1s infinite}.contact-cta{max-width:1116px;margin:40px auto 110px;padding:64px;border:1px solid rgba(255,255,255,.09);border-radius:var(--radius-lg);background:linear-gradient(135deg,rgba(24,42,65,.78),rgba(10,15,23,.82));box-shadow:var(--portfolio-shadow);backdrop-filter:blur(20px);text-align:center}.contact-cta>p{margin:0;color:#58a6ff;font:700 10px var(--portfolio-mono);letter-spacing:.18em}.contact-cta h2{max-width:700px;margin:18px auto 28px;color:#f0f6fc;font-size:clamp(25px,4vw,42px);line-height:1.25}.contact-cta div{display:flex;justify-content:center;gap:12px}.contact-cta a{padding:10px 17px;border:1px solid #33465e;border-radius:var(--radius-sm);color:#c7d4e2;font-size:12px}.contact-cta a:first-child{border-color:#58a6ff;background:#58a6ff;color:#07101d;font-weight:700}@keyframes blink{50%{opacity:0}}@media(max-width:900px){.projects-grid{grid-template-columns:1fr 1fr}.projects-grid>*:first-child{grid-row:auto;grid-column:1/-1}}@media(max-width:640px){.projects-section{padding:82px 20px}.projects-grid{grid-template-columns:1fr}.projects-grid>*:first-child{grid-column:auto}.section-heading>a{display:none}.contact-cta{margin:20px 20px 80px;padding:42px 20px}.contact-cta div{flex-direction:column}}
</style>
