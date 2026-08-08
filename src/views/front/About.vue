<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useTitle } from '@vueuse/core'
import { usePostStore } from '@/stores/post'
import { useCategoryStore } from '@/stores/category'
import { fetchLiveGitHubSnapshot, loadGitHubFallback, type GitHubSnapshot } from '@/api/github'
import avatarUrl from '@/assets/hero.png'

useTitle('关于 | 墨笺')

const postStore = usePostStore()
const categoryStore = useCategoryStore()
const github = ref<GitHubSnapshot>()
const currentYear = new Date().getFullYear()

const displayName = computed(() => github.value?.profile.name || github.value?.profile.login || '墨笺')
const displayAvatar = computed(() => github.value?.profile.avatarUrl || avatarUrl)
const displayBio = computed(() => github.value?.profile.bio || '在代码与生活之间，记录真实的学习与思考。')
const recentPosts = computed(() => postStore.posts.slice(0, 4))
const tagNames = computed(() => [...new Set(postStore.posts.flatMap(post => post.tags))].slice(0, 8))
const languages = computed(() => [
  ...new Set(github.value?.repositories.map(repository => repository.language).filter(Boolean) || []),
] as string[])
const skills = computed(() => [
  { group: '代码语言', items: languages.value },
  { group: '博客主题', items: tagNames.value },
].filter(group => group.items.length))
const socials = computed(() => [
  {
    label: 'GitHub',
    icon: '⌥',
    href: github.value?.profile.url || 'https://github.com/messere1',
    text: `@${github.value?.profile.login || 'messere1'}`,
  },
  {
    label: '博客源码',
    icon: '◇',
    href: 'https://github.com/messere1/myblog',
    text: 'messere1/myblog',
  },
  { label: 'RSS', icon: '✦', href: '/feed.xml', text: '订阅最新文章' },
])

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })
    .format(new Date(value))
}

function postSummary(value: string) {
  const plain = value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`#>*_~\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return plain.length > 90 ? `${plain.slice(0, 90)}…` : plain || '阅读全文了解详细内容。'
}

onMounted(async () => {
  await Promise.allSettled([postStore.fetchAll(), categoryStore.fetchAll()])
  try {
    github.value = await loadGitHubFallback()
  } catch {
    // GitHub 不可达时继续展示博客的真实数据。
  }
  try {
    github.value = await fetchLiveGitHubSnapshot()
  } catch {
    // 已有快照时无需打断页面。
  }
})
</script>

<template>
  <div class="about">
    <!-- 头部介绍 -->
    <section class="intro">
      <div class="intro-avatar">
        <img :src="displayAvatar" :alt="`${displayName} 的头像`" />
      </div>
      <div class="intro-text">
        <div class="hello">关于我 · ABOUT</div>
        <h1>你好，我是 {{ displayName }}</h1>
        <p>{{ displayBio }}</p>
        <div class="quote">「 于代码与山水之间，记录所思所感。 」</div>
      </div>
    </section>

    <!-- 技能 -->
    <section class="block">
      <div class="block-head"><span class="vbar"></span><h2>技能栈</h2><span class="jp">SKILLS</span></div>
      <div class="skills">
        <div v-for="s in skills" :key="s.group" class="skill-row">
          <div class="skill-group">{{ s.group }}</div>
          <div class="skill-tags">
            <span v-for="it in s.items" :key="it" class="skill-tag">{{ it }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 最近文章 -->
    <section class="block">
      <div class="block-head"><span class="vbar"></span><h2>近期记录</h2><span class="jp">RECENT POSTS</span></div>
      <div class="timeline">
        <div v-for="post in recentPosts" :key="post.id" class="tl-item">
          <div class="tl-dot"></div>
          <div class="tl-year">{{ formatDate(post.createdAt) }}</div>
          <div class="tl-body">
            <h3><RouterLink :to="`/post/${post.id}`">{{ post.title }}</RouterLink></h3>
            <p>{{ postSummary(post.excerpt) }}</p>
          </div>
        </div>
        <p v-if="!recentPosts.length && postStore.loading" class="empty">正在读取文章…</p>
      </div>
    </section>

    <!-- 社交 -->
    <section class="block">
      <div class="block-head"><span class="vbar"></span><h2>联系我</h2><span class="jp">CONTACT</span></div>
      <div class="socials">
        <a
          v-for="s in socials"
          :key="s.label"
          :href="s.href"
          target="_blank"
          rel="noopener"
          class="social-card"
        >
          <span class="s-icon">{{ s.icon }}</span>
          <div class="s-text">
            <div class="s-label">{{ s.label }}</div>
            <div class="s-sub">{{ s.text }}</div>
          </div>
        </a>
      </div>
    </section>

    <!-- 站点概况 -->
    <section class="block">
      <div class="block-head"><span class="vbar"></span><h2>站点概况</h2><span class="jp">LIVE STATS</span></div>
      <div class="site-card">
        <p>
          本站名为「墨笺」，基于 <b>Vue 3 + Vite + TypeScript</b> 构建，
          内容存储在 Supabase，并由 EdgeOne Pages 部署。
        </p>
        <div class="live-stats">
          <span><b>{{ postStore.posts.length }}</b> 篇文章</span>
          <span><b>{{ categoryStore.categories.length }}</b> 个分类</span>
          <span><b>{{ tagNames.length }}</b> 个近期标签</span>
          <span><b>{{ github?.profile.publicRepos || 0 }}</b> 个公开仓库</span>
        </div>
        <div class="site-meta">
          <span>Built with Vue 3</span>
          <span>·</span>
          <span>© {{ currentYear }} 墨笺</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.about {
  max-width: 820px;
  margin: 0 auto;
  padding: 48px 32px 80px;
}

/* 头部介绍 */
.intro {
  display: flex;
  gap: 36px;
  align-items: center;
  padding-bottom: 44px;
  margin-bottom: 12px;
  border-bottom: 1px solid $line;

  .intro-avatar {
    flex-shrink: 0;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid $dai-soft;
    img { width: 100%; height: 100%; object-fit: cover; display: block; }
  }
  .intro-text {
    .hello {
      font-size: 13px;
      color: $dai;
      letter-spacing: 3px;
      margin-bottom: 12px;
    }
    h1 {
      font-family: $serif;
      font-size: 30px;
      font-weight: 600;
      letter-spacing: 1px;
      margin: 0 0 16px;
      color: $ink;
    }
    p {
      font-size: 15px;
      color: $ink-soft;
      line-height: 2;
      margin: 0 0 16px;
    }
    .quote {
      font-family: $serif;
      font-size: 15px;
      color: $dai-deep;
      letter-spacing: 1px;
    }
  }
}

/* 区块通用 */
.block {
  margin-top: 48px;
  .block-head {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 24px;
    .vbar { width: 3px; height: 24px; background: $dai; }
    h2 {
      font-family: $serif;
      font-size: 22px;
      font-weight: 600;
      letter-spacing: 2px;
      margin: 0;
      color: $ink;
    }
    .jp { font-size: 12px; color: $ink-faint; letter-spacing: 2px; }
  }
}

/* 技能 */
.skills {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.skill-row {
  display: flex;
  align-items: center;
  gap: 20px;
  .skill-group {
    flex-shrink: 0;
    width: 60px;
    font-family: $serif;
    font-size: 15px;
    color: $dai;
    font-weight: 500;
  }
  .skill-tags { display: flex; flex-wrap: wrap; gap: 10px; }
  .skill-tag {
    font-size: 13px;
    padding: 6px 16px;
    background: $card;
    border: 1px solid $line;
    border-radius: $radius;
    color: $ink-soft;
    transition: all .25s;
    cursor: default;
    &:hover { border-color: $dai; color: $dai; transform: translateY(-2px); }
  }
}

/* 时间线 */
.timeline {
  position: relative;
  padding-left: 20px;
  &::before {
    content: '';
    position: absolute;
    left: 4px;
    top: 6px;
    bottom: 6px;
    width: 2px;
    background: $line;
  }
}
.tl-item {
  position: relative;
  padding: 0 0 28px 28px;
  &:last-child { padding-bottom: 0; }
  .tl-dot {
    position: absolute;
    left: -20px;
    top: 4px;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: $dai;
    border: 2px solid $bg;
  }
  .tl-year {
    font-family: $serif;
    font-size: 14px;
    color: $dai;
    font-weight: 600;
    margin-bottom: 6px;
  }
  .tl-body {
    h3 { font-size: 16px; font-weight: 500; margin: 0 0 6px; color: $ink; }
    h3 a { color: inherit; }
    h3 a:hover { color: $dai; }
    p { font-size: 14px; color: $ink-soft; line-height: 1.8; margin: 0; }
  }
}
.empty { color: $ink-faint; font-size: 13px; }

/* 社交 */
.socials {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
.social-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: $card;
  border: 1px solid $line;
  border-radius: $radius-card;
  transition: all .25s;
  &:hover { border-color: $dai; transform: translateY(-2px); box-shadow: 0 4px 16px rgba(74,107,92,0.08); }
  .s-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 50%;
    background: $dai-soft;
    color: $dai;
    display: grid;
    place-items: center;
    font-size: 18px;
  }
  .s-label { font-size: 14px; font-weight: 500; color: $ink; }
  .s-sub { font-size: 12px; color: $ink-faint; margin-top: 2px; }
}

/* 关于本站 */
.site-card {
  background: $card;
  border: 1px solid $line;
  border-radius: $radius-card;
  padding: 28px;
  p {
    font-size: 15px;
    color: $ink-soft;
    line-height: 2;
    margin: 0 0 14px;
    b { color: $dai-deep; font-weight: 600; }
  }
  .live-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-top: 20px;
    span {
      padding: 14px 8px;
      border: 1px solid $line;
      border-radius: $radius;
      color: $ink-faint;
      font-size: 12px;
      text-align: center;
    }
    b { display: block; margin-bottom: 3px; color: $dai-deep; font: 600 20px $serif; }
  }
  .site-meta {
    display: flex;
    gap: 10px;
    margin-top: 18px;
    padding-top: 16px;
    border-top: 1px solid $line;
    font-size: 12px;
    color: $ink-faint;
    letter-spacing: 1px;
  }
}

/* 响应式 */
@include mobile {
  .about { padding: 32px 20px 60px; }
  .intro {
    flex-direction: column;
    text-align: center;
    gap: 20px;
    .intro-text h1 { font-size: 24px; }
  }
  .skill-row { flex-direction: column; align-items: flex-start; gap: 10px; }
  .socials { grid-template-columns: 1fr; }
  .site-card .live-stats { grid-template-columns: repeat(2, 1fr); }
}

/* 暗色模式 */
html.dark {
  .about {
    .intro {
      border-bottom-color: #3a3630;
      .intro-text {
        h1 { color: #d4cfc4; }
        p { color: #b0a898; }
        .hello { color: #7d9471; }
        .quote { color: #9ab592; }
      }
    }
    .block .block-head { h2 { color: #d4cfc4; } .jp { color: #6a6458; } }
    .skill-tag {
      background: #242220;
      border-color: #3a3630;
      color: #b0a898;
      &:hover { border-color: #4a6b5c; color: #7d9471; }
    }
    .skill-group { color: #7d9471; }
    .timeline::before { background: #3a3630; }
    .tl-dot { background: #4a6b5c; border-color: #1a1916; }
    .tl-year { color: #7d9471; }
    .tl-body { h3 { color: #d4cfc4; } p { color: #b0a898; } }
    .social-card {
      background: #242220;
      border-color: #3a3630;
      &:hover { border-color: #4a6b5c; }
      .s-icon { background: rgba(74,107,92,0.2); color: #7d9471; }
      .s-label { color: #d4cfc4; }
      .s-sub { color: #6a6458; }
    }
    .site-card {
      background: #242220;
      border-color: #3a3630;
      p { color: #b0a898; b { color: #9ab592; } }
      .live-stats span { border-color: #3a3630; color: #6a6458; }
      .live-stats b { color: #9ab592; }
      .site-meta { border-top-color: #3a3630; color: #6a6458; }
    }
  }
}
</style>
