<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { useTitle } from '@vueuse/core'
import { usePostStore } from '@/stores/post'

useTitle('归档 | 墨笺')
const router = useRouter()
const postStore = usePostStore()

onMounted(() => postStore.fetchAll())  // 已有缓存时会直接返回，不再重复请求

// 按年份分组，年份倒序、组内按日期倒序
const grouped = computed(() => {
  const map = new Map<string, typeof postStore.posts>()
  const sorted = [...postStore.posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  for (const p of sorted) {
    const y = dayjs(p.createdAt).format('YYYY')
    if (!map.has(y)) map.set(y, [])
    map.get(y)!.push(p)
  }
  return Array.from(map.entries()).map(([year, posts]) => ({ year, posts }))
})

const total = computed(() => postStore.posts.length)
</script>

<template>
  <div class="archive">
    <div class="page-head">
      <span class="vbar"></span>
      <div>
        <h1>文章归档</h1>
        <div class="jp">ARCHIVE · 共 {{ total }} 篇</div>
      </div>
    </div>

    <div v-if="postStore.loading" class="loading">加载中...</div>
    <div v-else-if="total === 0" class="empty">还没有文章</div>

    <div v-else class="timeline">
      <section v-for="g in grouped" :key="g.year" class="year-group">
        <div class="year">
          <span class="y-num">{{ g.year }}</span>
          <span class="y-count">{{ g.posts.length }} 篇</span>
        </div>
        <ul class="post-line">
          <li
            v-for="p in g.posts"
            :key="p.id"
            class="post-item"
            @click="router.push(`/post/${p.id}`)"
          >
            <span class="dot"></span>
            <span class="date">{{ dayjs(p.createdAt).format('MM-DD') }}</span>
            <span class="title">{{ p.title }}</span>
            <span class="tags">
              <span v-for="t in p.tags?.slice(0, 2)" :key="t">#{{ t }}</span>
            </span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.archive {
  max-width: 760px;
  margin: 0 auto;
  padding: 48px 32px 80px;

  .page-head {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 40px;
    .vbar { width: 4px; height: 40px; background: $dai; }
    h1 {
      font-family: $serif;
      font-size: 28px;
      font-weight: 600;
      letter-spacing: 2px;
      margin: 0;
      color: $ink;
    }
    .jp { font-size: 13px; color: $ink-faint; letter-spacing: 2px; margin-top: 4px; }
  }

  .loading, .empty { text-align: center; padding: 60px; color: $ink-faint; }

  .timeline {
    position: relative;
    padding-left: 8px;
  }

  .year-group { margin-bottom: 36px; }

  .year {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 16px;
    .y-num {
      font-family: $serif;
      font-size: 26px;
      font-weight: 700;
      color: $dai;
      letter-spacing: 2px;
    }
    .y-count { font-size: 13px; color: $ink-faint; }
  }

  .post-line {
    list-style: none;
    margin: 0;
    padding: 0 0 0 6px;
    border-left: 2px solid $line;
  }

  .post-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 11px 0 11px 22px;
    position: relative;
    cursor: pointer;
    transition: all .25s;

    .dot {
      position: absolute;
      left: -7px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: $bg;
      border: 2px solid $line;
      transition: all .25s;
    }
    .date {
      font-size: 13px;
      color: $ink-faint;
      font-family: $serif;
      flex-shrink: 0;
      width: 44px;
    }
    .title {
      font-size: 15px;
      color: $ink;
      transition: color .25s;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .tags {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
      span { font-size: 12px; color: $ink-faint; }
    }

    &:hover {
      .dot { border-color: $dai; background: $dai; transform: scale(1.2); }
      .title { color: $dai; }
      padding-left: 28px;
    }
  }

  @include mobile {
    padding: 32px 20px 60px;
    .post-item .tags { display: none; }
  }
}

/* 暗色模式 */
html.dark {
  .archive {
    .page-head { h1 { color: #d4cfc4; } .jp { color: #6a6458; } }
    .loading, .empty { color: #6a6458; }
    .year { .y-num { color: #7d9471; } .y-count { color: #6a6458; } }
    .post-line { border-left-color: #3a3630; }
    .post-item {
      .dot { background: #1a1916; border-color: #3a3630; }
      .date { color: #6a6458; }
      .title { color: #d4cfc4; }
      .tags span { color: #6a6458; }
      &:hover {
        .dot { border-color: #7d9471; background: #7d9471; }
        .title { color: #7d9471; }
      }
    }
  }
}
</style>
