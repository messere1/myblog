<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTitle } from '@vueuse/core'
import {
  fetchGitHubRepositoryDetails,
  loadGitHubFallback,
  type GitHubRepository,
  type GitHubRepositoryDetails,
} from '@/api/github'

const route = useRoute()
const repository = ref<GitHubRepository | GitHubRepositoryDetails>()
const details = ref<GitHubRepositoryDetails>()
const loading = ref(true)
const error = ref('')
const name = computed(() => String(route.params.name || ''))
const technologies = computed(() => {
  const languages = details.value ? Object.keys(details.value.languages) : []
  return [...new Set([repository.value?.language, ...languages, ...(repository.value?.topics || [])].filter(Boolean))] as string[]
})
const languageTotal = computed(() => Object.values(details.value?.languages || {}).reduce((sum, bytes) => sum + bytes, 0))
const languagePercent = (bytes: number) => languageTotal.value ? Math.round(bytes / languageTotal.value * 100) : 0

async function load() {
  loading.value = true
  error.value = ''
  repository.value = undefined
  details.value = undefined
  try {
    const snapshot = await loadGitHubFallback()
    repository.value = snapshot.repositories.find(item => item.name.toLowerCase() === name.value.toLowerCase())
  } catch { /* live request below remains available */ }
  try {
    details.value = await fetchGitHubRepositoryDetails(name.value)
    repository.value = details.value
  } catch {
    if (!repository.value) error.value = 'Repository data is temporarily unavailable.'
  } finally {
    loading.value = false
  }
}

watch(name, value => useTitle(`${value} Project | Messere`), { immediate: true })
onMounted(load)
</script>

<template>
  <main class="project-detail portfolio-surface">
    <div class="shell">
      <RouterLink class="back" to="/projects">← ALL PROJECTS</RouterLink>
      <div v-if="loading && !repository" class="state">Loading repository data<span>_</span></div>
      <div v-else-if="error" class="state error">{{ error }} <RouterLink to="/projects">Return to projects</RouterLink></div>
      <template v-else-if="repository">
        <header class="fade-up">
          <p>OPEN SOURCE PROJECT · LIVE FROM GITHUB</p>
          <h1>{{ repository.name }}</h1>
          <h2>{{ repository.description || '持续迭代中的工程实践项目。' }}</h2>
          <div class="actions">
            <a :href="repository.url" target="_blank" rel="noopener noreferrer">Source code ↗</a>
            <a v-if="repository.homepage" :href="repository.homepage" target="_blank" rel="noopener noreferrer">Live site ↗</a>
          </div>
        </header>

        <section class="metrics fade-up fade-up-delay-1">
          <div><span>PRIMARY</span><b>{{ repository.language || 'Mixed' }}</b></div>
          <div><span>STARS</span><b>{{ repository.stars }}</b></div>
          <div><span>FORKS</span><b>{{ repository.forks }}</b></div>
          <div><span>UPDATED</span><b>{{ new Date(repository.updatedAt).toLocaleDateString('zh-CN') }}</b></div>
        </section>

        <section class="content-grid fade-up fade-up-delay-2">
          <article>
            <p class="eyebrow">TECHNOLOGY</p>
            <h2>Repository stack</h2>
            <div class="chips"><span v-for="item in technologies" :key="item">{{ item }}</span></div>
            <div v-if="details && languageTotal" class="languages">
              <div v-for="(bytes, language) in details.languages" :key="language">
                <div><span>{{ language }}</span><b>{{ languagePercent(bytes) }}%</b></div>
                <i><em :style="{ width: `${languagePercent(bytes)}%` }" /></i>
              </div>
            </div>
          </article>
          <article>
            <p class="eyebrow">ENGINEERING SIGNALS</p>
            <h2>Repository facts</h2>
            <dl v-if="details">
              <div><dt>Default branch</dt><dd>{{ details.defaultBranch }}</dd></div>
              <div><dt>Open issues</dt><dd>{{ details.openIssues }}</dd></div>
              <div><dt>Repository size</dt><dd>{{ details.sizeKb.toLocaleString() }} KB</dd></div>
              <div><dt>License</dt><dd>{{ details.license || 'Not specified' }}</dd></div>
              <div><dt>Created</dt><dd>{{ new Date(details.createdAt).toLocaleDateString('zh-CN') }}</dd></div>
            </dl>
            <p v-else class="fallback">基础信息来自站点构建快照；打开 GitHub 可查看完整源码与最新工程结构。</p>
          </article>
        </section>
      </template>
    </div>
  </main>
</template>

<style scoped>
.project-detail{padding:80px 24px 120px}.shell{max-width:1116px;margin:auto}.back{color:#6d7d90;font:10px var(--portfolio-mono);letter-spacing:.14em}.back:hover{color:var(--portfolio-primary)}header{max-width:850px;padding:70px 0 55px}header>p,.eyebrow{margin:0;color:var(--portfolio-primary);font:700 10px var(--portfolio-mono);letter-spacing:.16em}h1{margin:16px 0 10px;color:var(--portfolio-text);font-size:clamp(48px,8vw,86px);line-height:1;letter-spacing:-.06em;overflow-wrap:anywhere}header h2{max-width:750px;margin:0;color:#8291a3;font-size:18px;font-weight:400;line-height:1.7}.actions{display:flex;gap:10px;margin-top:28px}.actions a{padding:10px 15px;border:1px solid #31445d;border-radius:6px;color:#bdd2e8;font:11px var(--portfolio-mono)}.actions a:first-child{border-color:var(--portfolio-primary);background:var(--portfolio-primary);color:#06101c;font-weight:700}.metrics{display:grid;grid-template-columns:repeat(4,1fr);border-block:1px solid #202b3a}.metrics div{padding:22px;border-right:1px solid #202b3a}.metrics div:last-child{border:0}.metrics span{display:block;color:#5f7084;font:9px var(--portfolio-mono);letter-spacing:.12em}.metrics b{display:block;margin-top:7px;color:#d9e5f2;font-size:14px}.content-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding-top:60px}.content-grid article{padding:30px;border:1px solid #202b3a;border-radius:10px;background:#0d121a}.content-grid h2{margin:9px 0 25px;color:#e6edf3;font-size:24px}.chips{display:flex;flex-wrap:wrap;gap:8px}.chips span{padding:6px 9px;border-radius:4px;background:#172233;color:#8fc6ff;font:10px var(--portfolio-mono)}.languages{display:grid;gap:14px;margin-top:30px}.languages>div>div{display:flex;justify-content:space-between;color:#7f8fa2;font:10px var(--portfolio-mono)}.languages i{display:block;height:3px;margin-top:7px;background:#1d2938}.languages em{display:block;height:100%;background:var(--portfolio-primary)}dl{margin:0}dl>div{display:flex;justify-content:space-between;padding:13px 0;border-bottom:1px solid #202b3a}dt{color:#718095;font-size:12px}dd{margin:0;color:#c5d2df;font:11px var(--portfolio-mono)}.fallback,.state{color:#718095}.state{padding:100px 0;text-align:center}.state span{animation:pulse-dot 1s infinite}.state a{display:block;margin-top:14px;color:var(--portfolio-primary)}@media(max-width:720px){.project-detail{padding:55px 20px 90px}header{padding:55px 0 40px}.metrics{grid-template-columns:1fr 1fr}.metrics div:nth-child(2){border-right:0}.metrics div:nth-child(-n+2){border-bottom:1px solid #202b3a}.content-grid{grid-template-columns:1fr}.actions{align-items:stretch;flex-direction:column}.actions a{text-align:center}}@media(max-width:390px){.metrics{grid-template-columns:1fr}.metrics div{border-right:0;border-bottom:1px solid #202b3a!important}}
</style>
