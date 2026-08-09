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
import { getProjectCaseStudy } from '@/data/projectCaseStudies'

const route = useRoute()
const repository = ref<GitHubRepository | GitHubRepositoryDetails>()
const details = ref<GitHubRepositoryDetails>()
const loading = ref(true)
const error = ref('')
const name = computed(() => String(route.params.name || ''))
const caseStudy = computed(() => getProjectCaseStudy(name.value))
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

        <section v-if="caseStudy" class="case-study">
          <div class="case-heading">
            <div><p class="eyebrow">{{ caseStudy.label }}</p><h2>From repository to engineering story</h2></div>
            <RouterLink to="/architecture">Full system architecture →</RouterLink>
          </div>
          <div class="brief">
            <article><span>PROBLEM</span><p>{{ caseStudy.challenge }}</p></article>
            <article><span>OUTCOME</span><p>{{ caseStudy.outcome }}</p></article>
          </div>
          <div class="system-flow" aria-label="Project system flow">
            <template v-for="(node,index) in caseStudy.flow" :key="node">
              <b>{{ node }}</b><i v-if="index < caseStudy.flow.length - 1" aria-hidden="true">→</i>
            </template>
          </div>
          <div class="decision-list">
            <article v-for="(decision,index) in caseStudy.decisions" :key="decision.title">
              <span>0{{ index + 1 }}</span><div><h3>{{ decision.title }}</h3><p>{{ decision.description }}</p></div>
            </article>
          </div>
        </section>
      </template>
    </div>
  </main>
</template>

<style scoped>
.project-detail{padding:80px 24px 120px}.shell{max-width:1116px;margin:auto}.back{color:#6d7d90;font:10px var(--portfolio-mono);letter-spacing:.14em}.back:hover{color:var(--portfolio-primary)}header{max-width:850px;padding:70px 0 55px}header>p,.eyebrow{margin:0;color:var(--portfolio-primary);font:700 10px var(--portfolio-mono);letter-spacing:.16em}h1{margin:16px 0 10px;color:var(--portfolio-text);font-size:clamp(48px,8vw,86px);line-height:1;letter-spacing:-.06em;overflow-wrap:anywhere}header h2{max-width:750px;margin:0;color:#8291a3;font-size:18px;font-weight:400;line-height:1.7}.actions{display:flex;gap:10px;margin-top:28px}.actions a{padding:10px 15px;border:1px solid #31445d;border-radius:6px;color:#bdd2e8;font:11px var(--portfolio-mono)}.actions a:first-child{border-color:var(--portfolio-primary);background:var(--portfolio-primary);color:#06101c;font-weight:700}.metrics{display:grid;grid-template-columns:repeat(4,1fr);border-block:1px solid #202b3a}.metrics div{padding:22px;border-right:1px solid #202b3a}.metrics div:last-child{border:0}.metrics span{display:block;color:#5f7084;font:9px var(--portfolio-mono);letter-spacing:.12em}.metrics b{display:block;margin-top:7px;color:#d9e5f2;font-size:14px}.content-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding-top:60px}.content-grid article{padding:30px;border:1px solid #202b3a;border-radius:10px;background:#0d121a}.content-grid h2{margin:9px 0 25px;color:#e6edf3;font-size:24px}.chips{display:flex;flex-wrap:wrap;gap:8px}.chips span{padding:6px 9px;border-radius:4px;background:#172233;color:#8fc6ff;font:10px var(--portfolio-mono)}.languages{display:grid;gap:14px;margin-top:30px}.languages>div>div{display:flex;justify-content:space-between;color:#7f8fa2;font:10px var(--portfolio-mono)}.languages i{display:block;height:3px;margin-top:7px;background:#1d2938}.languages em{display:block;height:100%;background:var(--portfolio-primary)}dl{margin:0}dl>div{display:flex;justify-content:space-between;padding:13px 0;border-bottom:1px solid #202b3a}dt{color:#718095;font-size:12px}dd{margin:0;color:#c5d2df;font:11px var(--portfolio-mono)}.fallback,.state{color:#718095}.state{padding:100px 0;text-align:center}.state span{animation:pulse-dot 1s infinite}.state a{display:block;margin-top:14px;color:var(--portfolio-primary)}.case-study{margin-top:90px;padding-top:65px;border-top:1px solid #263548}.case-heading{display:flex;justify-content:space-between;gap:25px;align-items:flex-end}.case-heading h2{max-width:650px;margin:10px 0 0;color:#e6edf3;font-size:clamp(28px,4vw,42px);letter-spacing:-.04em}.case-heading>a{color:#83bdf4;font:10px var(--portfolio-mono)}.brief{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:36px}.brief article{padding:28px;border:1px solid #263548;border-radius:var(--radius-md);background:var(--portfolio-glass)}.brief span{color:#5f7fa2;font:8px var(--portfolio-mono);letter-spacing:.15em}.brief p{margin:13px 0 0;color:#9ba9b8;font-size:13px;line-height:1.8}.system-flow{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:18px 0;padding:24px;border:1px solid rgba(88,166,255,.28);border-radius:var(--radius-md);background:#0a111b}.system-flow b{padding:10px 13px;border-radius:6px;background:#142235;color:#c3d9ef;font:10px var(--portfolio-mono);text-align:center}.system-flow i{color:#4776a4;font-style:normal}.decision-list{display:grid;grid-template-columns:1fr 1fr;gap:14px}.decision-list article{display:flex;gap:18px;padding:25px;border:1px solid #202b3a;border-radius:var(--radius-md);background:#0d121a}.decision-list article>span{color:#4f7398;font:9px var(--portfolio-mono)}.decision-list h3{margin:0 0 8px;color:#d8e4ef;font-size:15px}.decision-list p{margin:0;color:#7f8ea0;font-size:12px;line-height:1.7}@media(max-width:720px){.project-detail{padding:55px 20px 90px}header{padding:55px 0 40px}.metrics{grid-template-columns:1fr 1fr}.metrics div:nth-child(2){border-right:0}.metrics div:nth-child(-n+2){border-bottom:1px solid #202b3a}.content-grid,.brief,.decision-list{grid-template-columns:1fr}.actions{align-items:stretch;flex-direction:column}.actions a{text-align:center}.case-heading{align-items:flex-start;flex-direction:column}.system-flow{align-items:stretch;flex-direction:column}.system-flow i{transform:rotate(90deg);text-align:center}}@media(max-width:390px){.metrics{grid-template-columns:1fr}.metrics div{border-right:0;border-bottom:1px solid #202b3a!important}}
</style>
