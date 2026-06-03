<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { usePostStore } from '@/stores/post'
import { useCategoryStore } from '@/stores/category'

const router = useRouter()
const postStore = usePostStore()
const catStore = useCategoryStore()

const search = ref('')
const filtered = computed(() => {
  if (!search.value) return postStore.posts
  const kw = search.value.toLowerCase()
  return postStore.posts.filter(p => p.title.toLowerCase().includes(kw))
})

onMounted(async () => {
  await Promise.all([postStore.fetchAll(), catStore.fetchAll()])
})

function getCatName(id: number) {
  return catStore.categories.find(c => c.id === id)?.name || '-'
}

async function handleDelete(id: number, title: string) {
  if (!confirm(`确定删除文章「${title}」?`)) return
  try {
    await postStore.remove(id)
  } catch (e) {
    alert('删除失败')
  }
}
</script>

<template>
  <div class="post-manage">
    <div class="page-head">
      <span class="vbar"></span>
      <h3>文章管理</h3>
    </div>

    <div class="toolbar">
      <input v-model="search" placeholder="搜索文章标题..." />
      <button class="btn primary" @click="router.push('/admin/posts/edit')">
        + 新建文章
      </button>
    </div>

    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>标题</th>
            <th>分类</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filtered" :key="p.id">
            <td>{{ p.id }}</td>
            <td>{{ p.title }}</td>
            <td>{{ getCatName(p.categoryId) }}</td>
            <td>{{ dayjs(p.createdAt).format('YYYY-MM-DD HH:mm') }}</td>
            <td class="actions">
              <button class="btn" @click="router.push(`/admin/posts/edit/${p.id}`)">编辑</button>
              <button class="btn danger" @click="handleDelete(p.id, p.title)">删除</button>
            </td>
          </tr>
          <tr v-if="!filtered.length">
            <td colspan="5" class="empty">暂无文章</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.post-manage {
  padding: 16px;

  .page-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }
  .vbar {
    display: inline-block;
    width: 4px;
    height: 20px;
    background: $dai;
    border-radius: 2px;
  }
  h3 { margin: 0; font-family: $serif; }

  .toolbar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    gap: 12px;
    input {
      padding: 8px 12px;
      border: 1px solid $line;
      border-radius: $radius;
      background: $card;
      width: 280px;
      outline: none;
      color: $ink;
      font-size: 14px;
      &:focus { border-color: $dai; }
      &::placeholder { color: $ink-faint; }
    }
  }

  .table-wrap { overflow-x: auto; }

  .data-table {
    width: 100%;
    background: $card;
    border-collapse: collapse;
    border-radius: $radius-card;
    overflow: hidden;
    border: 1px solid $line;
    th, td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid $line;
      font-size: 14px;
    }
    th {
      background: $bg;
      font-weight: 600;
      color: $ink-soft;
      font-size: 13px;
    }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: rgba($dai, 0.03); }
    .actions { display: flex; gap: 8px; }
    .empty { text-align: center; color: $ink-faint; padding: 40px; }
  }

  .btn {
    padding: 6px 14px;
    border: 1px solid $line;
    background: $card;
    border-radius: $radius;
    cursor: pointer;
    font-size: 13px;
    white-space: nowrap;
    color: $ink;
    transition: all 0.2s;
    &:hover { border-color: $dai; color: $dai; }
    &.primary {
      background: $dai;
      color: $card;
      border-color: $dai;
      &:hover { background: $dai-deep; }
    }
    &.danger {
      background: $danger;
      color: #fff;
      border-color: $danger;
      &:hover { opacity: .85; }
    }
  }
}

html.dark {
  h3 { color: #d4cfc4; }
  .toolbar input {
    background: #242220;
    border-color: #3a3630;
    color: #d4cfc4;
    &::placeholder { color: #6a6458; }
    &:focus { border-color: #4a6b5c; }
  }
  .data-table {
    background: #242220 !important;
    border-color: #3a3630 !important;
    th { background: #1a1916; color: #9a9488; border-bottom-color: #3a3630; }
    td { border-bottom-color: #3a3630; color: #b0a898; }
    .empty { color: #6a6458; }
  }
  .btn {
    background: #242220;
    border-color: #3a3630;
    color: #d4cfc4;
    &:hover { border-color: #4a6b5c; color: #7d9471; }
    &.primary { background: #3a5c4c; border-color: #3a5c4c; color: #d4cfc4; &:hover { background: #2e4a3c; } }
    &.danger { background: #8b2020; border-color: #8b2020; }
  }
}
</style>
