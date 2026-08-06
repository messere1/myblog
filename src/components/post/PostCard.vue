<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { useCategoryStore } from '@/stores/category'
import type { Post } from '@/types'

// 模块级常量，避免每个卡片实例都重建数组
const gradients = [
  'linear-gradient(135deg,#4a6b5c,#344e42)',
  'linear-gradient(135deg,#5a6b78,#3a4750)',
  'linear-gradient(135deg,#7d9471,#566b4d)',
  'linear-gradient(135deg,#9a8468,#6e5b40)',
]

const props = defineProps<{ post: Post }>()
const router = useRouter()
const catStore = useCategoryStore()

const excerpt = computed(() =>
  props.post.content
    ? props.post.content
        .replace(/[#*`>\-\[\]!]/g, '')
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .slice(0, 100)
    : ''
)

const coverBg = computed(() => gradients[props.post.id % gradients.length])

const categoryName = computed(() => {
  const cat = catStore.categories.find(c => c.id === props.post.categoryId)
  return cat?.name ?? ''
})

const hasCover = computed(() => !!props.post.coverImage)

// 简易阅读时长估算
const readTime = computed(() => Math.max(1, Math.ceil(props.post.content.length / 300)))
</script>

<template>
  <article class="post-card" @click="router.push(`/post/${post.id}`)">
    <div class="post-cover">
      <img v-if="hasCover" :src="post.coverImage" :alt="post.title" class="cover-img" />
      <div v-else class="ph" :style="{ background: coverBg }">
        <span class="ph-title">{{ post.title }}</span>
      </div>
      <div class="post-cat">{{ categoryName || '未分类' }}</div>
    </div>
    <div class="post-body">
      <div class="post-meta">
        <span>{{ dayjs(post.createdAt).format('YYYY-MM-DD') }}</span>
        <span>· {{ readTime }} min</span>
      </div>
      <h3>{{ post.title }}</h3>
      <p>{{ excerpt }}...</p>
      <div class="post-tags">
        <span v-for="t in post.tags?.slice(0, 3)" :key="t" class="ptag">{{ t }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.post-card {
  background: $card;
  border: 1px solid $line;
  border-radius: $radius-card;
  overflow: hidden;
  cursor: pointer;
  display: grid;
  grid-template-columns: 200px 1fr;
  transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s, border-color .35s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 32px rgba(43,41,37,0.1);
    border-color: $dai;
  }
}

.post-cover {
  position: relative;
  overflow: hidden;
  min-height: 150px;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ph {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  padding: 20px;
}

.ph-title {
  font-size: 16px;
  color: rgba(255,255,255,0.85);
  letter-spacing: 2px;
  text-align: center;
  font-family: $serif;
  line-height: 1.6;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.post-cat {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(43,41,37,0.7);
  backdrop-filter: blur(4px);
  padding: 4px 12px;
  border-radius: $radius;
  font-size: 11px;
  color: #f7f4ec;
  letter-spacing: 1px;
}

.post-body {
  padding: 22px 26px;
  display: flex;
  flex-direction: column;
}

.post-meta {
  font-size: 12px;
  color: $ink-faint;
  margin-bottom: 10px;
  letter-spacing: 1px;
  display: flex;
  gap: 14px;
}

.post-card h3 {
  font-family: $serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 1.5;
  margin-bottom: 10px;
  transition: color .25s;
  letter-spacing: 1px;
}

.post-card:hover h3 { color: $dai; }

.post-card p {
  font-size: 14px;
  color: $ink-soft;
  line-height: 1.8;
  flex: 1;
  font-weight: 300;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-tags {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}

.ptag {
  font-size: 12px;
  color: $dai;
  letter-spacing: .5px;
  &::before { content: '#'; opacity: .5; }
}

@include mobile {
  .post-card {
    grid-template-columns: 1fr;
  }
  .post-cover { min-height: 160px; }
}

/* 暗色模式 */
html.dark {
  .post-card {
    background: #242220;
    border-color: #3a3630;
    &:hover {
      border-color: #4a6b5c;
      box-shadow: 0 14px 32px rgba(0,0,0,0.3);
    }
  }
  .post-body h3 { color: #d4cfc4; }
  .post-card:hover h3 { color: #7d9471; }
  .post-body p { color: #9a9488; }
  .post-meta { color: #6a6458; }
  .ptag { color: #7d9471; }
}
</style>
