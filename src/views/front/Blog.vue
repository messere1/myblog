<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useTitle } from '@vueuse/core'
import { usePostStore } from '@/stores/post'
import { useCategoryStore } from '@/stores/category'
import { markdownExcerpt, readingMinutes } from '@/utils/format'

useTitle('Technical Blog | Messere')
const posts = usePostStore()
const categories = useCategoryStore()
const query = ref('')
const activeCategory = ref<number | null>(null)
const filtered = computed(() => posts.posts.filter(post => {
  const matchesCategory = !activeCategory.value || post.categoryId === activeCategory.value
  const needle = query.value.trim().toLowerCase()
  const matchesQuery = !needle || `${post.title} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase().includes(needle)
  return matchesCategory && matchesQuery
}))
const categoryName = (id:number) => categories.categories.find(item => item.id===id)?.name || 'Engineering'
onMounted(() => Promise.allSettled([posts.fetchAll(),categories.fetchAll()]))
</script>
<template>
  <main class="blog-page">
    <header><p>ENGINEERING NOTES</p><h1>Technical Blog</h1><span>记录后端、数据库、系统设计与工程实践。</span></header>
    <div class="toolbar">
      <input v-model="query" type="search" placeholder="Search articles, tags..." aria-label="搜索文章" />
      <div><button :class="{active:activeCategory===null}" @click="activeCategory=null">All</button><button v-for="category in categories.categories" :key="category.id" :class="{active:activeCategory===category.id}" @click="activeCategory=category.id">{{ category.name }}</button></div>
    </div>
    <section class="post-grid">
      <RouterLink v-for="post in filtered" :key="post.id" :to="`/post/${post.id}`" class="post">
        <div class="meta"><span>{{ categoryName(post.categoryId) }}</span><time>{{ new Date(post.createdAt).toLocaleDateString('zh-CN') }} · {{ readingMinutes(post.content) }} min read</time></div>
        <h2>{{ post.title }}</h2>
        <p>{{ post.excerpt || markdownExcerpt(post.content,140) }}</p>
        <div class="tags"><span v-for="tag in post.tags.slice(0,4)" :key="tag">#{{ tag }}</span></div>
        <b>Read article →</b>
      </RouterLink>
    </section>
    <p v-if="!posts.loading&&!filtered.length" class="empty">No matching articles.</p>
  </main>
</template>
<style scoped>
.blog-page{min-height:100vh;padding:90px max(24px,calc((100vw - 1116px)/2)) 110px;background:#070a0f;color:#e6edf3;font-family:Inter,"PingFang SC",system-ui,sans-serif}header{max-width:720px;margin-bottom:45px}header p{margin:0;color:#58a6ff;font:700 11px ui-monospace,monospace;letter-spacing:.18em}header h1{margin:12px 0;color:#f0f6fc;font-size:clamp(42px,6vw,68px);letter-spacing:-.055em}header span{color:#7d8b9c;font-size:15px}.toolbar{display:flex;justify-content:space-between;gap:20px;margin-bottom:25px;padding:14px;border:1px solid #202b3a;border-radius:10px;background:#0b1017}.toolbar input{min-width:260px;border:0;outline:0;background:transparent;color:#dbe7f3;font:12px ui-monospace,monospace}.toolbar div{display:flex;flex-wrap:wrap;gap:5px}.toolbar button{padding:7px 11px;border:0;border-radius:5px;background:transparent;color:#728196;cursor:pointer}.toolbar button.active,.toolbar button:hover{background:#172336;color:#79c0ff}.post-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.post{display:flex;min-height:260px;flex-direction:column;padding:26px;border:1px solid #202b3a;border-radius:10px;background:#0d121a;transition:.25s}.post:hover{transform:translateY(-5px);border-color:#385170}.meta{display:flex;justify-content:space-between;color:#637286;font:10px ui-monospace,monospace}.meta span{color:#58a6ff}.post h2{margin:22px 0 12px;color:#e6edf3;font-size:21px;line-height:1.4}.post>p{flex:1;margin:0;color:#8391a3;font-size:13px;line-height:1.75}.tags{display:flex;gap:9px;margin-top:18px;color:#607da0;font:10px ui-monospace,monospace}.post b{margin-top:18px;color:#9fc6f3;font-size:11px}.empty{padding:60px;color:#69788a;text-align:center}@media(max-width:720px){.blog-page{padding-top:65px}.toolbar{align-items:stretch;flex-direction:column}.toolbar input{min-width:0;padding:8px}.post-grid{grid-template-columns:1fr}}
</style>
