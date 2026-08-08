<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePostStore } from '@/stores/post'
import { useCategoryStore } from '@/stores/category'
import PostCard from '@/components/post/PostCard.vue'

const postStore = usePostStore()
const catStore = useCategoryStore()

const searchInput = ref('')

function doSearch() {
  postStore.keyword = searchInput.value
}

const results = computed(() => postStore.filtered)

onMounted(async () => {
  if (!postStore.posts.length) {
    await Promise.all([postStore.fetchAll(), catStore.fetchAll()])
  }
  searchInput.value = postStore.keyword
})
</script>

<template>
  <div class="search-page">
    <div class="search-header">
      <span class="vbar"></span>
      <div>
        <h1>文章搜索</h1>
        <div class="jp">SEARCH</div>
      </div>
    </div>
    <div class="search-box">
      <input
        v-model="searchInput"
        placeholder="输入关键词搜索文章..."
        @input="doSearch"
        @keyup.enter="doSearch"
        autofocus
      />
      <button @click="doSearch">搜索</button>
    </div>
    <p v-if="postStore.keyword" class="result-info">
      关键词「{{ postStore.keyword }}」共找到 {{ results.length }} 篇文章
    </p>

    <div v-if="results.length" class="post-list">
      <PostCard
        v-for="post in results"
        :key="post.id"
        :post="post"
      />
    </div>
    <div v-else-if="postStore.keyword" class="empty">
      未找到与「{{ postStore.keyword }}」相关的文章
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.search-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 56px 36px;
}

.search-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  h1 {
    font-family: $serif;
    font-size: 27px;
    font-weight: 600;
    letter-spacing: 3px;
    margin: 0;
  }
  .jp { font-size: 12px; color: $ink-faint; letter-spacing: 3px; margin-top: 2px; }
}

.vbar { width: 3px; height: 38px; background: $dai; flex-shrink: 0; }

.search-box {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  input {
    flex: 1;
    padding: 13px 20px;
    border: 1px solid $line;
    border-radius: $radius;
    font-size: 15px;
    background: $card;
    color: $ink;
    outline: none;
    font-family: $sans;
    letter-spacing: 1px;
    transition: border-color .25s;
    &:focus { border-color: $dai; }
    &::placeholder { color: $ink-faint; }
  }
  button {
    padding: 13px 28px;
    background: $dai;
    color: #f7f4ec;
    border: none;
    border-radius: $radius;
    cursor: pointer;
    font-size: 15px;
    font-family: $sans;
    letter-spacing: 1px;
    transition: background .25s;
    &:hover { background: $dai-deep; }
  }
}

.result-info {
  margin-bottom: 24px;
  color: $ink-faint;
  font-size: 13px;
  letter-spacing: 1px;
}

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
  .search-page { padding: 40px 20px; }
}

html.dark {
  .search-header {
    h1 { color: #d4cfc4; }
    .jp { color: #6a6458; }
  }
  .search-box {
    input {
      background: #242220;
      border-color: #3a3630;
      color: #d4cfc4;
      &::placeholder { color: #6a6458; }
      &:focus { border-color: #4a6b5c; }
    }
    button { background: #3a5c4c; &:hover { background: #2e4a3c; } }
  }
  .result-info { color: #6a6458; }
  .empty { color: #6a6458; }
}
</style>
