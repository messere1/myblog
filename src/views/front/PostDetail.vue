<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { getPost, getPosts } from '@/api/posts'
import { renderMd, extractToc, initHighlighter, type TocItem } from '@/utils/markdown'
import { useTitle, useWindowScroll, useEventListener } from '@vueuse/core'
import { useHead } from '@vueuse/head'
import GiscusComment from '@/components/common/GiscusComment.vue'
import type { Post } from '@/types'

const route = useRoute()
const router = useRouter()
const post = ref<Post | null>(null)
const prevPost = ref<Post | null>(null)
const nextPost = ref<Post | null>(null)
const loading = ref(true)
const title = useTitle()
const hlReady = ref(false)

// 动态 SEO meta（在 setup 顶层调用 useHead，使用 computed 实现响应式）
const seoDesc = computed(() =>
  post.value
    ? post.value.content.replace(/[#*`>\-\[\]!]/g, '').replace(/!\[.*?\]\(.*?\)/g, '').slice(0, 120)
    : '一隅清净，长存于此。记录代码与热爱的山水之间。'
)
const seoTitle = computed(() =>
  post.value ? `${post.value.title} | 墨笺` : '墨笺 · Mo'
)
useHead(computed(() => ({
  title: seoTitle.value,
  meta: [
    { name: 'description', content: seoDesc.value },
    { property: 'og:title', content: seoTitle.value },
    { property: 'og:description', content: seoDesc.value },
    { property: 'og:type', content: post.value ? 'article' : 'website' },
    { name: 'twitter:title', content: seoTitle.value },
    { name: 'twitter:description', content: seoDesc.value },
    ...(post.value?.coverImage ? [
      { property: 'og:image', content: post.value.coverImage },
      { name: 'twitter:image', content: post.value.coverImage },
      { name: 'twitter:card', content: 'summary_large_image' },
    ] : []),
  ],
})))

// 依赖 hlReady：高亮器就绪后自动重新渲染，代码块从纯文本变为带语法着色
const html = computed(() => {
  void hlReady.value
  return post.value ? renderMd(post.value.content) : ''
})
const toc = computed<TocItem[]>(() => (post.value ? extractToc(post.value.content) : []))

// ── 阅读进度条 ──
const { y } = useWindowScroll()
const progress = ref(0)
function updateProgress() {
  const h = document.documentElement
  const scrollable = h.scrollHeight - h.clientHeight
  progress.value = scrollable > 0 ? Math.min(100, (y.value / scrollable) * 100) : 0
  // 同步高亮当前章节
  updateActiveAnchor()
}
useEventListener('scroll', updateProgress, { passive: true })

// ── 目录高亮当前章节 ──
const activeAnchor = ref('')
function updateActiveAnchor() {
  const headings = toc.value
    .map(t => document.getElementById(t.anchor))
    .filter(Boolean) as HTMLElement[]
  const offset = 120
  let current = ''
  for (const el of headings) {
    if (el.getBoundingClientRect().top <= offset) current = el.id
  }
  activeAnchor.value = current || (toc.value[0]?.anchor ?? '')
}

function jumpTo(anchor: string) {
  const el = document.getElementById(anchor)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 90
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

async function load() {
  loading.value = true
  try {
    const id = Number(route.params.id)
    post.value = await getPost(id)
    if (post.value) {
      title.value = `${post.value.title} | 墨笺`
      // 上一篇 / 下一篇（按 id 顺序的相邻文章）
      const all = await getPosts()
      const sorted = [...all].sort((a, b) => a.id - b.id)
      const idx = sorted.findIndex(p => p.id === id)
      prevPost.value = idx > 0 ? sorted[idx - 1] : null
      nextPost.value = idx < sorted.length - 1 ? sorted[idx + 1] : null
    }
    await nextTick()
    updateProgress()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  load()
  // 异步加载 Shiki，就绪后触发代码块重新高亮
  initHighlighter().then(() => { hlReady.value = true }).catch(() => {})
})

function goPost(id: number) {
  router.push(`/post/${id}`)
  setTimeout(load, 50)
  window.scrollTo({ top: 0 })
}

const readMinutes = computed(() =>
  post.value ? Math.max(1, Math.ceil(post.value.content.length / 400)) : 0
)
</script>

<template>
  <div class="post-page">
    <!-- 顶部阅读进度条 -->
    <div class="read-progress" :style="{ width: progress + '%' }"></div>

    <div class="detail-wrap">
    <div v-if="loading" class="loading">加载中...</div>

    <template v-else-if="post">
      <!-- 文章主体 -->
      <article class="post-detail">
        <header>
          <div class="bread">
            <router-link to="/">首页</router-link>
            <span class="sep">/</span>
            <span>文章</span>
          </div>
          <h1>{{ post.title }}</h1>
          <div class="meta">
            <span>📅 {{ dayjs(post.createdAt).format('YYYY年MM月DD日') }}</span>
            <span>· ⏱ 约 {{ readMinutes }} 分钟</span>
            <span>· ✍ {{ post.content.length }} 字</span>
          </div>
          <div class="tags">
            <span v-for="t in post.tags" :key="t" class="tag">#{{ t }}</span>
          </div>
        </header>

        <div class="md-content" v-html="html" />

        <!-- 上一篇 / 下一篇 -->
        <nav class="post-nav">
          <div
            class="nav-item prev"
            :class="{ disabled: !prevPost }"
            @click="prevPost && goPost(prevPost.id)"
          >
            <span class="label">← 上一篇</span>
            <span class="t">{{ prevPost?.title || '没有了' }}</span>
          </div>
          <div
            class="nav-item next"
            :class="{ disabled: !nextPost }"
            @click="nextPost && goPost(nextPost.id)"
          >
            <span class="label">下一篇 →</span>
            <span class="t">{{ nextPost?.title || '没有了' }}</span>
          </div>
        </nav>
        <!-- 评论区 -->
        <GiscusComment class="post-comment" />      </article>

      <!-- 目录侧栏 -->
      <aside class="toc-side" v-if="toc.length">
        <div class="toc-card">
          <h4>目录</h4>
          <ul>
            <li
              v-for="item in toc"
              :key="item.anchor"
              :class="['lv' + item.level, { active: activeAnchor === item.anchor }]"
              @click="jumpTo(item.anchor)"
            >
              {{ item.text }}
            </li>
          </ul>
        </div>
      </aside>
    </template>

    <div v-else class="empty">文章不存在</div>
  </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

/* 页面根容器 */
.post-page {
  width: 100%;
}

/* 顶部阅读进度条 */
.read-progress {
  position: fixed;
  top: 0; left: 0;
  height: 3px;
  background: $dai;
  z-index: 999;
  transition: width .1s linear;
}

.detail-wrap {
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 36px;
  display: grid;
  grid-template-columns: 1fr 240px;
  gap: 40px;
  align-items: start;
}
.loading, .empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px;
  color: $ink-faint;
}

/* 文章主体 */
.post-detail {
  background: $card;
  border: 1px solid $line;
  border-radius: $radius-card;
  padding: 44px 48px;

  header {
    margin-bottom: 32px;
    border-bottom: 1px solid $line;
    padding-bottom: 24px;

    .bread {
      font-size: 13px;
      color: $ink-faint;
      margin-bottom: 18px;
      .sep { margin: 0 8px; }
      a:hover { color: $dai; }
    }
    h1 {
      font-family: $serif;
      margin: 0 0 18px;
      font-size: 32px;
      line-height: 1.5;
      letter-spacing: 1px;
      color: $ink;
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      color: $ink-faint;
      font-size: 13px;
      margin-bottom: 16px;
    }
    .tags { display: flex; gap: 8px; flex-wrap: wrap; }
    .tag {
      background: $dai-soft;
      padding: 3px 12px;
      border-radius: $radius;
      font-size: 12px;
      color: $dai;
    }
  }
}

:deep(.md-content) {
  line-height: 1.95;
  font-size: 16px;
  color: $ink;

  h1, h2, h3 {
    font-family: $serif;
    margin: 1.6em 0 0.6em;
    letter-spacing: 1px;
    scroll-margin-top: 90px;
    position: relative;
  }
  h2 { padding-left: 14px; border-left: 4px solid $dai; }
  h3 { color: $dai-deep; }
  p { margin: 1em 0; color: $ink-soft; }
  pre {
    background: #2b2925;
    color: #f8f8f2;
    padding: 18px;
    border-radius: $radius;
    overflow-x: auto;
    margin: 1.2em 0;
  }
  code {
    background: $bg-soft;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 0.9em;
    color: $dai-deep;
    font-family: 'Consolas', monospace;
  }
  pre code { background: transparent; padding: 0; color: #f8f8f2; }

  /* Shiki 代码块：明亮模式用 light 主题色 */
  pre.shiki {
    padding: 18px;
    border-radius: $radius;
    overflow-x: auto;
    margin: 1.2em 0;
    border: 1px solid $line;
    font-size: 14px;
    line-height: 1.7;
    background: var(--shiki-light-bg);
    code { color: inherit; font-family: 'Consolas', monospace; }
    span { color: var(--shiki-light); }
  }
  pre.shiki-fallback {
    background: #2b2925; color: #f8f8f2;
    padding: 18px; border-radius: $radius; overflow-x: auto; margin: 1.2em 0;
  }
  blockquote {
    border-left: 4px solid $dai;
    padding: 4px 16px;
    color: $ink-soft;
    margin: 1.2em 0;
    background: $bg-soft;
    border-radius: 0 $radius $radius 0;
  }
  img { max-width: 100%; border-radius: $radius; margin: 1em 0; }
  ul, ol { padding-left: 1.6em; margin: 1em 0; color: $ink-soft; }
  li { margin: .4em 0; }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1.2em 0;
    th, td { padding: 10px 14px; border: 1px solid $line; }
    th { background: $bg-soft; font-weight: 500; }
  }
  a { color: $dai; text-decoration: underline; text-underline-offset: 3px;
    &:hover { color: $dai-deep; } }
}

/* 上下篇 */
.post-nav {
  display: flex;
  gap: 16px;
  margin-top: 40px;
  padding-top: 28px;
  border-top: 1px solid $line;
}
.nav-item {
  flex: 1;
  background: $bg-soft;
  border: 1px solid $line;
  border-radius: $radius-card;
  padding: 16px 20px;
  cursor: pointer;
  transition: all .25s;
  display: flex;
  flex-direction: column;
  gap: 6px;
  &:hover:not(.disabled) {
    border-color: $dai;
    transform: translateY(-2px);
  }
  &.disabled { opacity: .5; cursor: default; }
  &.next { text-align: right; }
  .label { font-size: 12px; color: $dai; letter-spacing: 1px; }
  .t {
    font-size: 14px;
    color: $ink;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

/* 目录侧栏 */
.toc-side {
  position: sticky;
  top: 90px;
}
.toc-card {
  background: $card;
  border: 1px solid $line;
  border-radius: $radius-card;
  padding: 22px 20px;
  h4 {
    font-family: $serif;
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 16px;
    letter-spacing: 2px;
    display: flex;
    align-items: center;
    gap: 10px;
    &::before { content: ''; width: 4px; height: 15px; background: $dai; }
  }
  ul { list-style: none; }
  li {
    font-size: 13px;
    color: $ink-soft;
    padding: 7px 0 7px 12px;
    cursor: pointer;
    border-left: 2px solid transparent;
    transition: all .2s;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &.lv2 { padding-left: 24px; }
    &.lv3 { padding-left: 36px; font-size: 12px; }
    &:hover { color: $dai; }
    &.active {
      color: $dai;
      border-left-color: $dai;
      font-weight: 500;
    }
  }
}

@include mobile {
  .detail-wrap {
    grid-template-columns: 1fr;
    margin: 20px 0;
    padding: 0 16px;
  }
  .toc-side { display: none; }
  .post-detail {
    padding: 24px 20px;
    header h1 { font-size: 24px; }
  }
  .post-nav { flex-direction: column; }
}

/* 暗色模式 */
html.dark {
  .read-progress { background: #7d9471; }
  .post-detail {
    background: #242220;
    border-color: #3a3630;
    header {
      border-bottom-color: #3a3630;
      .bread { color: #6a6458; a:hover { color: #7d9471; } }
      h1 { color: #d4cfc4; }
      .meta { color: #6a6458; }
      .tag { background: rgba(74,107,92,0.2); color: #7d9471; }
    }
  }
  :deep(.md-content) {
    color: #d4cfc4;
    h3 { color: #9ab592; }
    p { color: #b0a898; }
    pre { background: #1a1916; }
    code { background: #2a2724; color: #7d9471; }
    pre code { color: #d4cfc4; }
    pre.shiki {
      border-color: #3a3630;
      background: var(--shiki-dark-bg);
      span { color: var(--shiki-dark); }
    }
    blockquote { border-left-color: #4a6b5c; color: #9a9488; background: #2a2724; }
    ul, ol { color: #b0a898; }
    table {
      th, td { border-color: #3a3630; }
      th { background: #2a2724; }
    }
    a { color: #7d9471; &:hover { color: #5a8a6a; } }
  }
  .nav-item {
    background: #2a2724;
    border-color: #3a3630;
    &:hover:not(.disabled) { border-color: #4a6b5c; }
    .label { color: #7d9471; }
    .t { color: #d4cfc4; }
  }
  .toc-card {
    background: #242220;
    border-color: #3a3630;
    h4::before { background: #4a6b5c; }
    li {
      color: #9a9488;
      &:hover, &.active { color: #7d9471; }
      &.active { border-left-color: #7d9471; }
    }
  }
  .loading, .empty { color: #6a6458; }
}
</style>
