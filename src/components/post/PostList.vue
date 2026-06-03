<script setup lang="ts">
import type { Post } from '@/types'
import PostCard from './PostCard.vue'

defineProps<{ posts: Post[]; loading?: boolean }>()
</script>

<template>
  <div class="post-list">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="!posts.length" class="empty">暂无文章</div>
    <div v-else class="list">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.post-list {
  .list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .loading, .empty {
    text-align: center;
    padding: 60px;
    color: $ink-faint;
  }
}

html.dark {
  .post-list {
    .loading, .empty { color: #6a6458; }
  }
}
</style>
