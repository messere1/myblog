<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePostStore } from '@/stores/post'
import { useCategoryStore } from '@/stores/category'

const router = useRouter()
const postStore = usePostStore()
const catStore = useCategoryStore()

onMounted(async () => {
  await Promise.all([postStore.fetchAll(), catStore.fetchAll()])
})

const stats = computed(() => [
  { label: '文章总数', value: postStore.posts.length, icon: '📝', to: '/admin/posts' },
  { label: '分类总数', value: catStore.categories.length, icon: '🏷️', to: '/admin/categories' },
])

const recentPosts = computed(() =>
  [...postStore.posts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
)
</script>

<template>
  <div class="dashboard">
    <h2 class="page-title">仪表盘</h2>

    <div class="stats-grid">
      <div
        v-for="s in stats"
        :key="s.label"
        class="stat-card"
        @click="router.push(s.to)"
      >
        <span class="icon">{{ s.icon }}</span>
        <div>
          <div class="value">{{ s.value }}</div>
          <div class="label">{{ s.label }}</div>
        </div>
      </div>
    </div>

    <div class="recent-section">
      <div class="section-header">
        <h3>最近文章</h3>
        <button class="btn primary" @click="router.push('/admin/posts/edit')">+ 新建文章</button>
      </div>
      <table class="data-table">
        <thead>
          <tr><th>标题</th><th>分类</th><th>创建时间</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="p in recentPosts" :key="p.id">
            <td>{{ p.title }}</td>
            <td>{{ catStore.categories.find(c => c.id === p.categoryId)?.name || '-' }}</td>
            <td>{{ new Date(p.createdAt).toLocaleDateString('zh-CN') }}</td>
            <td>
              <button class="btn" @click="router.push(`/admin/posts/edit/${p.id}`)">编辑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.dashboard {
  padding: 24px;
  .page-title { margin: 0 0 24px; font-size: 22px; }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
    margin-bottom: 32px;

    .stat-card {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      cursor: pointer;
      border: 1px solid $border-color;
      transition: all 0.2s;
      &:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
      .icon { font-size: 32px; }
      .value { font-size: 28px; font-weight: 700; color: $primary; }
      .label { font-size: 13px; color: $text-muted; margin-top: 4px; }
    }
  }

  .recent-section {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    border: 1px solid $border-color;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      h3 { margin: 0; }
    }
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid $border-color; font-size: 14px; }
    th { background: $bg-light; font-weight: 600; }
  }

  .btn {
    padding: 6px 12px;
    border: 1px solid $border-color;
    background: #fff;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    &.primary { background: $primary; color: #fff; border-color: $primary; }
  }
}
</style>
