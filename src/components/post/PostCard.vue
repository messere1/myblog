<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import type { Post } from '@/types'

const props = defineProps<{ post: Post }>()
const router = useRouter()

const excerpt = computed(() =>
  props.post.content
    .replace(/[#*`>\-\[\]!]/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .slice(0, 100)
)

const gradients = [
  'linear-gradient(135deg,#4a6b5c,#344e42)',
  'linear-gradient(135deg,#5a6b78,#3a4750)',
  'linear-gradient(135deg,#7d9471,#566b4d)',
  'linear-gradient(135deg,#9a8468,#6e5b40)',
]

const coverBg = computed(() => gradients[props.post.id % gradients.length])

// 简易阅读时长估算
const readTime = computed(() => Math.max(1, Math.ceil(props.post.content.length / 300)))
</script>

<template>
  <article class="post-card" @click="router.push(`/post/${post.id}`)">
    <div class="post-cover">
      <div class="ph" :style="{ background: coverBg }">COVER</div>
      <div class="post-cat">{{ post.categoryId }}</div>
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

.ph {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-size: 12px;
  color: rgba(255,255,255,0.85);
  letter-spacing: 3px;
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
</style>
