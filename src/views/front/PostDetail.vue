<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { getPost } from '@/api/posts'
import { renderMd } from '@/utils/markdown'
import { useTitle } from '@vueuse/core'
import type { Post } from '@/types'

const route = useRoute()
const post = ref<Post | null>(null)
const loading = ref(true)
const title = useTitle()

const html = computed(() => post.value ? renderMd(post.value.content) : '')

onMounted(async () => {
  try {
    post.value = await getPost(Number(route.params.id))
    if (post.value) title.value = `${post.value.title} | 墨笺`
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="post-detail">
    <div v-if="loading" class="loading">加载中...</div>
    <article v-else-if="post">
      <header>
        <h1>{{ post.title }}</h1>
        <div class="meta">
          <span>{{ dayjs(post.createdAt).format('YYYY-MM-DD HH:mm') }}</span>
          <div class="tags">
            <span v-for="t in post.tags" :key="t" class="tag">#{{ t }}</span>
          </div>
        </div>
      </header>
      <div class="md-content" v-html="html" />
    </article>
    <div v-else class="empty">文章不存在</div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.post-detail {
  max-width: 800px;
  margin: 40px auto;
  padding: 40px;
  background: $card;
  border-radius: $radius-card;
  border: 1px solid $line;

  .loading, .empty {
    text-align: center;
    padding: 60px;
    color: $ink-faint;
  }

  header {
    margin-bottom: 32px;
    border-bottom: 1px solid $line;
    padding-bottom: 20px;
    h1 {
      font-family: $serif;
      margin: 0 0 16px;
      font-size: 28px;
      line-height: 1.5;
      letter-spacing: 1px;
    }
    .meta {
      display: flex;
      align-items: center;
      gap: 12px;
      color: $ink-faint;
      font-size: 13px;
      flex-wrap: wrap;
    }
    .tags { display: flex; gap: 8px; }
    .tag {
      background: $dai-soft;
      padding: 2px 10px;
      border-radius: $radius;
      font-size: 12px;
      color: $dai;
    }
  }

  :deep(.md-content) {
    line-height: 1.9;
    h1, h2, h3 {
      font-family: $serif;
      margin: 1.5em 0 0.5em;
      letter-spacing: 1px;
    }
    p { margin: 1em 0; color: $ink-soft; }
    pre {
      background: #2b2925;
      color: #f8f8f2;
      padding: 16px;
      border-radius: $radius;
      overflow-x: auto;
    }
    code {
      background: $bg-soft;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 0.9em;
      color: $dai-deep;
    }
    pre code { background: transparent; padding: 0; color: #f8f8f2; }
    blockquote {
      border-left: 4px solid $dai;
      padding-left: 16px;
      color: $ink-soft;
      margin: 1em 0;
    }
    img { max-width: 100%; border-radius: $radius; }
    table {
      border-collapse: collapse;
      width: 100%;
      th, td { padding: 8px 12px; border: 1px solid $line; }
      th { background: $bg-soft; }
    }
    a { color: $dai; &:hover { color: $dai-deep; } }
  }

  @include mobile {
    margin: 20px 16px;
    padding: 20px;
    header h1 { font-size: 22px; }
  }
}

/* 暗色模式 */
html.dark {
  .post-detail {
    background: #242220;
    border-color: #3a3630;
    header {
      border-bottom-color: #3a3630;
      h1 { color: #d4cfc4; }
      .meta { color: #6a6458; }
      .tag { background: rgba(#4a6b5c, 0.2); color: #7d9471; }
    }
    .loading, .empty { color: #6a6458; }
    :deep(.md-content) {
      p { color: #b0a898; }
      pre { background: #1a1916; }
      code { background: #2a2724; color: #7d9471; }
      pre code { color: #d4cfc4; }
      blockquote { border-left-color: #4a6b5c; color: #9a9488; }
      table {
        th, td { border-color: #3a3630; }
        th { background: #2a2724; }
      }
      a { color: #7d9471; &:hover { color: #5a8a6a; } }
    }
  }
}
