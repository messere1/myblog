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
            <td colspan="5" style="text-align:center; color:#999; padding: 40px">暂无文章</td>
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

  .toolbar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    gap: 12px;
    input {
      padding: 8px 12px;
      border: 1px solid $border-color;
      border-radius: 6px;
      width: 280px;
      outline: none;
      &:focus { border-color: $primary; }
    }
  }

  .table-wrap { overflow-x: auto; }

  .data-table {
    width: 100%;
    background: #fff;
    border-collapse: collapse;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid $border-color;
    th, td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid $border-color;
      font-size: 14px;
    }
    th { background: #fafbfc; font-weight: 600; }
    tr:last-child td { border-bottom: none; }
    .actions { display: flex; gap: 8px; }
  }

  .btn {
    padding: 6px 12px;
    border: 1px solid $border-color;
    background: #fff;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    white-space: nowrap;
    &.primary { background: $primary; color: #fff; border-color: $primary; }
    &.danger { background: $danger; color: #fff; border-color: $danger; }
  }
}
</style>
