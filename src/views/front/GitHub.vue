<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useTitle } from '@vueuse/core'
import {
  fetchLiveGitHubSnapshot,
  loadGitHubFallback,
  type GitHubSnapshot,
} from '@/api/github'

useTitle('GitHub | 墨笺')

const snapshot = ref<GitHubSnapshot>()
const loading = ref(true)
const error = ref(false)
const refreshing = ref(false)
const live = ref(false)

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}

function externalUrl(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`
}

async function loadProfile() {
  loading.value = true
  error.value = false

  try {
    snapshot.value = await loadGitHubFallback()
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }

  await refreshProfile()
}

async function refreshProfile() {
  if (refreshing.value) return
  refreshing.value = true
  try {
    snapshot.value = await fetchLiveGitHubSnapshot()
    error.value = false
    live.value = true
  } catch {
    // 国内网络无法连接 GitHub 时继续展示最近一次成功数据。
    if (!snapshot.value) error.value = true
    live.value = false
  } finally {
    refreshing.value = false
    loading.value = false
  }
}

onMounted(loadProfile)
</script>

<template>
  <main class="github-page">
    <div class="page-head">
      <span class="vbar" />
      <div>
        <h1>GitHub</h1>
        <div class="subhead">PROFILE · 开源与代码</div>
      </div>
    </div>

    <div v-if="loading" class="state" role="status">正在读取 GitHub 主页…</div>
    <div v-else-if="error || !snapshot" class="state error">
      <p>GitHub 主页暂时加载失败。</p>
      <button type="button" @click="loadProfile">重新加载</button>
    </div>

    <template v-else>
      <section class="profile-card">
        <img :src="snapshot.profile.avatarUrl" :alt="`${snapshot.profile.login} 的头像`" />
        <div class="profile-main">
          <span class="eyebrow">@{{ snapshot.profile.login }}</span>
          <h2>{{ snapshot.profile.name || snapshot.profile.login }}</h2>
          <p>{{ snapshot.profile.bio || '把想法写进代码，也把成长留在提交记录里。' }}</p>
          <div class="details">
            <span v-if="snapshot.profile.company">{{ snapshot.profile.company }}</span>
            <span v-if="snapshot.profile.location">{{ snapshot.profile.location }}</span>
            <a
              v-if="snapshot.profile.blog"
              :href="externalUrl(snapshot.profile.blog)"
              target="_blank"
              rel="noopener noreferrer"
            >{{ snapshot.profile.blog }}</a>
          </div>
        </div>
        <a class="github-button" :href="snapshot.profile.url" target="_blank" rel="noopener noreferrer">
          访问 GitHub 主页 ↗
        </a>
      </section>

      <section class="stats" aria-label="GitHub 数据概览">
        <div><strong>{{ snapshot.profile.publicRepos }}</strong><span>公开仓库</span></div>
        <div><strong>{{ snapshot.profile.followers }}</strong><span>关注者</span></div>
        <div><strong>{{ snapshot.profile.following }}</strong><span>正在关注</span></div>
      </section>

      <section class="repositories">
        <div class="section-head">
          <div><h2>最近更新的项目</h2><span>REPOSITORIES</span></div>
          <div class="freshness">
            <small>{{ live ? '实时数据' : '缓存数据' }} · {{ formatDate(snapshot.generatedAt) }}</small>
            <button type="button" :disabled="refreshing" @click="refreshProfile">
              {{ refreshing ? '刷新中…' : '立即刷新' }}
            </button>
          </div>
        </div>

        <div class="repo-grid">
          <article v-for="repo in snapshot.repositories" :key="repo.name" class="repo-card">
            <div class="repo-title">
              <a :href="repo.url" target="_blank" rel="noopener noreferrer">{{ repo.name }}</a>
              <span>公开</span>
            </div>
            <p>{{ repo.description || '这个项目还没有填写简介。' }}</p>
            <div class="repo-meta">
              <span v-if="repo.language"><i />{{ repo.language }}</span>
              <span aria-label="星标数">☆ {{ repo.stars }}</span>
              <span aria-label="复刻数">⑂ {{ repo.forks }}</span>
              <span class="updated">{{ formatDate(repo.updatedAt) }}</span>
            </div>
          </article>
        </div>
      </section>
    </template>
  </main>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.github-page { max-width: 1000px; margin: 0 auto; padding: 48px 32px 80px; }
.page-head { display: flex; align-items: center; gap: 14px; margin-bottom: 32px; }
.page-head .vbar { width: 4px; height: 40px; background: $dai; }
.page-head h1 { margin: 0; color: $ink; font: 600 28px $serif; letter-spacing: 2px; }
.subhead { margin-top: 4px; color: $ink-faint; font-size: 13px; letter-spacing: 2px; }

.state { padding: 70px 24px; color: $ink-soft; text-align: center; }
.state p { margin: 0 0 16px; }
.state button { padding: 8px 20px; border: 1px solid $dai; border-radius: $radius; background: transparent; color: $dai; cursor: pointer; }

.profile-card { display: flex; align-items: center; gap: 24px; padding: 28px; border: 1px solid $line; border-radius: $radius-card; background: $card; }
.profile-card > img { width: 112px; height: 112px; flex: 0 0 auto; border: 3px solid $dai-soft; border-radius: 50%; }
.profile-main { min-width: 0; flex: 1; }
.eyebrow { color: $dai; font-size: 13px; letter-spacing: 1px; }
.profile-main h2 { margin: 5px 0 10px; color: $ink; font: 600 26px $serif; }
.profile-main p { margin: 0; color: $ink-soft; line-height: 1.8; }
.details { display: flex; flex-wrap: wrap; gap: 8px 16px; margin-top: 12px; color: $ink-faint; font-size: 13px; }
.details a { color: $dai; }
.github-button { flex: 0 0 auto; padding: 11px 17px; border: 1px solid $dai; border-radius: $radius; color: $dai; font-size: 13px; transition: .2s; }
.github-button:hover { background: $dai; color: #fff; }

.stats { display: grid; grid-template-columns: repeat(3, 1fr); margin: 22px 0 46px; border: 1px solid $line; border-radius: $radius-card; background: $card; }
.stats div { display: grid; gap: 4px; padding: 18px; text-align: center; }
.stats div + div { border-left: 1px solid $line; }
.stats strong { color: $ink; font: 600 23px $serif; }
.stats span { color: $ink-faint; font-size: 12px; }

.section-head { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 20px; }
.section-head > div { display: flex; align-items: baseline; gap: 12px; }
.section-head h2 { margin: 0; color: $ink; font: 600 22px $serif; letter-spacing: 1px; }
.section-head span, .section-head small { color: $ink-faint; font-size: 11px; letter-spacing: 1px; }
.freshness { display: flex; align-items: center; gap: 10px; }
.freshness button { padding: 5px 10px; border: 1px solid $line; border-radius: $radius; background: $card; color: $ink-soft; font-size: 11px; cursor: pointer; }
.freshness button:hover { border-color: $dai; color: $dai; }
.freshness button:disabled { cursor: wait; opacity: .6; }
.repo-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.repo-card { display: flex; min-height: 160px; flex-direction: column; padding: 20px; border: 1px solid $line; border-radius: $radius-card; background: $card; transition: transform .25s, border-color .25s; }
.repo-card:hover { transform: translateY(-3px); border-color: $dai; }
.repo-title { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.repo-title a { overflow: hidden; color: $dai-deep; font-weight: 600; text-overflow: ellipsis; }
.repo-title > span { padding: 2px 8px; border: 1px solid $line; border-radius: 99px; color: $ink-faint; font-size: 10px; }
.repo-card p { flex: 1; margin: 14px 0 18px; color: $ink-soft; font-size: 13px; line-height: 1.7; }
.repo-meta { display: flex; align-items: center; gap: 13px; color: $ink-faint; font-size: 11px; }
.repo-meta span { display: inline-flex; align-items: center; gap: 5px; }
.repo-meta i { width: 9px; height: 9px; border-radius: 50%; background: $dai; }
.repo-meta .updated { margin-left: auto; }

@include mobile {
  .github-page { padding: 32px 20px 60px; }
  .profile-card { align-items: flex-start; flex-wrap: wrap; padding: 22px; }
  .profile-card > img { width: 82px; height: 82px; }
  .profile-main { flex-basis: calc(100% - 106px); }
  .profile-main h2 { font-size: 22px; }
  .github-button { width: 100%; text-align: center; }
  .repo-grid { grid-template-columns: 1fr; }
  .section-head { align-items: flex-start; flex-direction: column; gap: 6px; }
  .section-head > div { align-items: flex-start; flex-direction: column; gap: 4px; }
  .section-head .freshness { align-items: center; flex-direction: row; }
  .stats div { padding: 14px 6px; }
}

html.dark {
  .page-head h1, .profile-main h2, .stats strong, .section-head h2 { color: #d4cfc4; }
  .profile-card, .stats, .repo-card { border-color: #3a3630; background: #242220; }
  .profile-main p, .repo-card p, .state { color: #b0a898; }
  .eyebrow, .details a, .repo-title a { color: #7d9471; }
  .details, .stats span, .section-head span, .section-head small, .repo-meta { color: #6a6458; }
  .freshness button { border-color: #3a3630; background: #242220; color: #9a9488; }
  .stats div + div, .repo-title > span { border-color: #3a3630; }
  .repo-card:hover { border-color: #4a6b5c; }
}
</style>
