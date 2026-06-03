<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostStore } from '@/stores/post'
import { useCategoryStore } from '@/stores/category'
import PostCard from '@/components/post/PostCard.vue'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const catStore = useCategoryStore()

const categoryId = computed(() => Number(route.params.id))
const category = computed(() => catStore.categories.find(c => c.id === categoryId.value))

const posts = computed(() =>
  postStore.posts.filter(p => p.categoryId === categoryId.value)
)

onMounted(async () => {
  await Promise.all([postStore.fetchAll(), catStore.fetchAll()])
})
</script>

<template>
  <div class="category-page">
    <div class="page-header">
      <span class="vbar"></span>
      <div>
        <h1>{{ category?.name || '分类' }}</h1>
        <div class="jp">CATEGORY</div>
      </div>
      <p class="count">共 {{ posts.length }} 篇文章</p>
    </div>
    <div v-if="posts.length" class="post-list">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
      />
    </div>
    <div v-else class="empty">该分类暂无文章</div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.category-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 56px 36px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
  h1 {
    font-family: $serif;
    font-size: 27px;
    font-weight: 600;
    letter-spacing: 3px;
    margin: 0;
  }
  .jp { font-size: 12px; color: $ink-faint; letter-spacing: 3px; margin-top: 2px; }
  .count { font-size: 13px; color: $ink-faint; margin-left: auto; letter-spacing: 1px; }
}

.vbar { width: 3px; height: 38px; background: $dai; flex-shrink: 0; }

.post-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.empty {
  text-align: center;
  padding: 60px;
  color: $ink-faint;
}

@include mobile {
  .category-page { padding: 40px 20px; }
}
</style>
