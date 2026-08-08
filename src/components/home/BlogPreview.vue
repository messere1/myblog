<script setup lang="ts">
import type { Post } from '@/types'
import { markdownExcerpt } from '@/utils/format'
defineProps<{ posts: Post[] }>()
</script>
<template>
  <section class="section blog-preview">
    <div class="section-heading"><span>04</span><div><p>ENGINEERING NOTES</p><h2>Latest articles</h2></div><RouterLink to="/blog">All articles →</RouterLink></div>
    <div class="articles">
      <RouterLink v-for="post in posts.slice(0,3)" :key="post.id" :to="`/post/${post.id}`">
        <time>{{ new Date(post.createdAt).toLocaleDateString('zh-CN') }}</time>
        <div><h3>{{ post.title }}</h3><p>{{ post.excerpt || markdownExcerpt(post.content,110) }}</p></div>
        <span>↗</span>
      </RouterLink>
    </div>
  </section>
</template>
<style scoped>
.section{max-width:1180px;margin:auto;padding:96px 32px}.section-heading{display:flex;align-items:flex-start;gap:18px;margin-bottom:35px}.section-heading>span{color:#58a6ff;font:12px ui-monospace,monospace}.section-heading p{margin:0 0 6px;color:#667587;font:700 11px ui-monospace,monospace;letter-spacing:.18em}.section-heading h2{margin:0;color:#f0f6fc;font-size:32px}.section-heading>a{margin-left:auto;color:#7d8b9c;font-size:12px}.articles{border-top:1px solid #202b3a}.articles>a{display:grid;grid-template-columns:120px minmax(0,1fr) auto;gap:24px;align-items:center;padding:24px 6px;border-bottom:1px solid #202b3a;transition:.2s}.articles>a:hover{padding-left:14px;background:#0b1017}.articles time{color:#5f6d7e;font:11px ui-monospace,monospace}.articles h3{margin:0 0 7px;color:#dbe7f3;font-size:17px}.articles p{overflow:hidden;margin:0;color:#738195;font-size:12px;white-space:nowrap;text-overflow:ellipsis}.articles>a>span{color:#58a6ff}@media(max-width:640px){.section{padding:72px 20px}.articles>a{grid-template-columns:minmax(0,1fr) auto;gap:8px}.articles time{grid-column:1/-1}.section-heading>a{display:none}}
</style>
