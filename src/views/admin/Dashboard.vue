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
    <div class="page-head">
      <span class="vbar"></span>
      <h2 class="page-title">仪表盘</h2>
    </div>

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

  .page-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 24px;
  }
  .vbar {
    display: inline-block;
    width: 4px;
    height: 22px;
    background: $dai;
    border-radius: 2px;
  }
  .page-title {
    margin: 0;
    font-family: $serif;
    font-size: 20px;
    color: $ink;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
    margin-bottom: 32px;

    .stat-card {
      background: $card;
      border-radius: $radius-card;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      cursor: pointer;
      border: 1px solid $line;
      transition: all 0.25s;
      &:hover {
        transform: translateY(-2px);
        border-color: $dai;
        box-shadow: 0 4px 16px rgba(74, 107, 92, 0.1);
      }
      .icon { font-size: 28px; }
      .value { font-size: 28px; font-weight: 700; color: $dai; font-family: $serif; }
      .label { font-size: 13px; color: $ink-faint; margin-top: 4px; }
    }
  }

  .recent-section {
    background: $card;
    border-radius: $radius-card;
    padding: 20px;
    border: 1px solid $line;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      h3 { margin: 0; font-family: $serif; }
    }
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    th, td {
      padding: 10px 12px;
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
  }

  .btn {
    padding: 6px 14px;
    border: 1px solid $line;
    background: $card;
    border-radius: $radius;
    cursor: pointer;
    font-size: 13px;
    color: $ink;
    transition: all 0.2s;
    &:hover { border-color: $dai; color: $dai; }
    &.primary {
      background: $dai;
      color: $card;
      border-color: $dai;
      &:hover { background: $dai-deep; }
    }
  }
}

html.dark {
  .page-title { color: #d4cfc4; }
  .stat-card {
    background: #242220 !important;
    border-color: #3a3630 !important;
    &:hover { border-color: #4a6b5c !important; }
    .value { color: #7d9471; }
    .label { color: #6a6458; }
  }
  .recent-section {
    background: #242220 !important;
    border-color: #3a3630 !important;
    h3 { color: #d4cfc4; }
  }
  .data-table {
    th { background: #1a1916; color: #9a9488; border-bottom-color: #3a3630; }
    td { border-bottom-color: #3a3630; color: #b0a898; }
  }
  .btn {
    background: #242220;
    border-color: #3a3630;
    color: #d4cfc4;
    &:hover { border-color: #4a6b5c; color: #7d9471; }
    &.primary { background: #3a5c4c; border-color: #3a5c4c; &:hover { background: #2e4a3c; } }
  }
}
</style>
