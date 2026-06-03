<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePostStore } from '@/stores/post'

const router = useRouter()
const postStore = usePostStore()
const query = ref('')

function handleSearch() {
  if (query.value.trim()) {
    postStore.keyword = query.value.trim()
    router.push('/search')
    query.value = ''
  }
}
</script>

<template>
  <div class="search-bar">
    <input
      v-model="query"
      type="search"
      placeholder="搜索文章标题或内容..."
      @keyup.enter="handleSearch"
    />
    <button @click="handleSearch">⌕</button>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.search-bar {
  display: flex;
  gap: 8px;
  input {
    flex: 1;
    padding: 10px 16px;
    border: 1px solid $line;
    border-radius: $radius;
    font-size: 14px;
    background: $card;
    color: $ink;
    outline: none;
    font-family: $sans;
    transition: border-color .25s;
    &:focus { border-color: $dai; }
    &::placeholder { color: $ink-faint; }
  }
  button {
    width: 40px;
    height: 40px;
    background: $dai;
    color: #f7f4ec;
    border: none;
    border-radius: $radius;
    cursor: pointer;
    font-size: 18px;
    transition: background .25s;
    &:hover { background: $dai-deep; }
  }
}
</style>
