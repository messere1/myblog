<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { usePostStore } from '@/stores/post'
import { useCategoryStore } from '@/stores/category'
import { portfolio } from '@/data/portfolio'
import { markdownExcerpt, readingMinutes } from '@/utils/format'

useHead({
  title: 'Messere 的技术手记',
  meta: [{ name: 'description', content: '记录 Java 后端、数据库、系统设计与持续学习的个人技术博客。' }],
})

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
const featured = computed(() => filtered.value[0])
const remaining = computed(() => filtered.value.slice(1))
const totalWords = computed(() => posts.posts.reduce((total, post) => total + post.content.length, 0))
const categoryName = (id:number) => categories.categories.find(item => item.id===id)?.name || '工程随笔'
const formatDate = (date:string) => new Date(date).toLocaleDateString('zh-CN',{year:'numeric',month:'long',day:'numeric'})
const excerpt = (content:string, fallback:string, length=120) => fallback || markdownExcerpt(content,length)

onMounted(() => Promise.allSettled([posts.fetchAll(),categories.fetchAll()]))
</script>

<template>
  <main class="blog-page">
    <div class="ambient ambient-one" aria-hidden="true" />
    <div class="ambient ambient-two" aria-hidden="true" />

    <div class="blog-shell">
      <section class="blog-hero fade-up">
        <div class="hero-copy">
          <p class="eyebrow"><span /> MESSERE'S FIELD NOTES</p>
          <h1>把学习写成<br><em>可以复用的经验。</em></h1>
          <p>代码、系统与偶尔的生活切片。这里记录 Java 后端学习、工程实践和对可靠系统的理解。</p>
        </div>
        <div class="hero-note" aria-label="博客状态">
          <span>NOW WRITING</span>
          <b>Backend · Systems · Growth</b>
          <small>持续更新于天津</small>
        </div>
      </section>

      <section class="toolbar soft-glass">
        <label class="search-box">
          <span>⌕</span>
          <input v-model="query" type="search" placeholder="搜索文章、标签或关键词..." aria-label="搜索文章" />
          <kbd>⌘ K</kbd>
        </label>
        <div class="category-tabs" aria-label="文章分类">
          <button :class="{active:activeCategory===null}" @click="activeCategory=null">全部</button>
          <button v-for="category in categories.categories" :key="category.id" :class="{active:activeCategory===category.id}" @click="activeCategory=category.id">{{ category.name }}</button>
        </div>
      </section>

      <div class="content-layout">
        <section class="feed" aria-labelledby="latest-heading">
          <div class="section-heading"><div><span>01</span><h2 id="latest-heading">最新文章</h2></div><p>{{ filtered.length }} 篇记录</p></div>

          <RouterLink v-if="featured" :to="`/post/${featured.id}`" class="featured-card soft-glass-strong">
            <div class="featured-cover" :style="featured.coverImage?{backgroundImage:`url(${featured.coverImage})`}:{}">
              <span>{{ categoryName(featured.categoryId) }}</span>
              <div v-if="!featured.coverImage" class="cover-art"><i /><i /><i /><b>FIELD<br>NOTE</b></div>
            </div>
            <div class="featured-body">
              <div class="post-meta"><time>{{ formatDate(featured.createdAt) }}</time><span>{{ readingMinutes(featured.content) }} 分钟阅读</span></div>
              <h2>{{ featured.title }}</h2>
              <p>{{ excerpt(featured.content,featured.excerpt,150) }}</p>
              <div class="post-footer"><div><span v-for="tag in featured.tags.slice(0,3)" :key="tag">#{{ tag }}</span></div><b>阅读全文 ↗</b></div>
            </div>
          </RouterLink>

          <div class="article-list">
            <RouterLink v-for="post in remaining" :key="post.id" :to="`/post/${post.id}`" class="article-card soft-glass">
              <div class="article-date"><b>{{ new Date(post.createdAt).getDate().toString().padStart(2,'0') }}</b><span>{{ new Date(post.createdAt).toLocaleDateString('zh-CN',{month:'short'}) }}</span></div>
              <div class="article-copy">
                <div class="post-meta"><span>{{ categoryName(post.categoryId) }}</span><span>{{ readingMinutes(post.content) }} 分钟</span></div>
                <h3>{{ post.title }}</h3>
                <p>{{ excerpt(post.content,post.excerpt) }}</p>
                <div class="mini-tags"><span v-for="tag in post.tags.slice(0,3)" :key="tag">#{{ tag }}</span></div>
              </div>
              <span class="article-arrow">↗</span>
            </RouterLink>
          </div>

          <div v-if="posts.loading" class="empty soft-glass">正在从文字宇宙取回文章<span>…</span></div>
          <div v-else-if="!filtered.length" class="empty soft-glass"><b>没有找到匹配的文章</b><span>换一个关键词或分类试试。</span></div>
        </section>

        <aside class="sidebar">
          <section class="profile-card soft-glass-strong">
            <RouterLink to="/about" class="avatar" aria-label="查看关于页面"><span>M</span></RouterLink>
            <p class="eyebrow">ABOUT THE AUTHOR</p>
            <h2>Messere</h2>
            <p>{{ portfolio.description }}</p>
            <div class="socials"><a :href="portfolio.github" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a :href="`mailto:${portfolio.email}`">Email ↗</a></div>
            <div class="stats"><div><b>{{ posts.posts.length }}</b><span>文章</span></div><div><b>{{ categories.categories.length }}</b><span>分类</span></div><div><b>{{ totalWords.toLocaleString() }}</b><span>字数</span></div></div>
          </section>

          <section class="sidebar-card soft-glass">
            <div class="side-title"><span>02</span><h3>写作主题</h3></div>
            <button class="topic" :class="{active:activeCategory===null}" @click="activeCategory=null"><span>全部手记</span><b>{{ posts.posts.length }}</b></button>
            <button v-for="category in categories.categories" :key="category.id" class="topic" :class="{active:activeCategory===category.id}" @click="activeCategory=category.id"><span>{{ category.name }}</span><b>{{ posts.posts.filter(post=>post.categoryId===category.id).length }}</b></button>
          </section>

          <section class="quote-card">
            <span>“</span><p>Learn deeply.<br>Build honestly.<br>Write clearly.</p><small>— Messere</small>
          </section>

          <a href="/feed.xml" class="rss-card soft-glass"><span>RSS</span><div><b>订阅更新</b><small>不被算法打扰</small></div><i>→</i></a>
        </aside>
      </div>
    </div>
  </main>
</template>

<style scoped>
.blog-page{--warm-bg:#f7efe7;--warm-soft:#fffaf4;--warm-text:#3f352e;--warm-muted:#82746a;--warm-accent:#b86f2b;--warm-gold:#d68a3a;position:relative;min-height:100vh;overflow:hidden;background:radial-gradient(circle at 10% 8%,rgba(255,255,255,.85),transparent 28rem),radial-gradient(circle at 88% 14%,rgba(244,201,158,.4),transparent 28rem),linear-gradient(180deg,#fffaf4 0%,#f7efe7 42%,#efe0d4 100%);color:var(--warm-text);font-family:'Songti SC','STSong','Noto Serif SC','PingFang SC',serif}.ambient{position:absolute;border-radius:50%;filter:blur(1px);pointer-events:none}.ambient-one{top:160px;right:-120px;width:360px;height:360px;background:rgba(222,156,94,.1)}.ambient-two{top:760px;left:-150px;width:320px;height:320px;background:rgba(196,151,112,.1)}.blog-shell{position:relative;z-index:1;width:min(calc(100% - 48px),1160px);margin:auto;padding:92px 0 120px}.blog-hero{display:grid;grid-template-columns:1fr 300px;align-items:end;gap:70px;padding:35px 4px 72px}.eyebrow{margin:0;color:var(--warm-accent);font:800 9px/1.4 var(--portfolio-mono);letter-spacing:.18em}.eyebrow>span{display:inline-block;width:24px;height:1px;margin:0 10px 3px 0;background:var(--warm-accent)}.hero-copy h1{margin:20px 0;color:#3a302a;font-size:clamp(48px,7vw,82px);font-weight:900;line-height:1.07;letter-spacing:-.055em}.hero-copy h1 em{color:#a86b3a;font-style:normal}.hero-copy>p:last-child{max-width:660px;margin:0;color:#74665d;font-size:15px;line-height:2}.hero-note{display:flex;flex-direction:column;padding:24px 0 6px;border-top:1px solid rgba(120,81,49,.2)}.hero-note>span{color:#a87954;font:700 8px var(--portfolio-mono);letter-spacing:.15em}.hero-note b{margin:12px 0 5px;color:#51443a;font-size:14px}.hero-note small{color:#9a887a;font-size:11px}.soft-glass,.soft-glass-strong{border:1px solid rgba(255,255,255,.72);background:rgba(255,250,244,.66);box-shadow:0 22px 70px rgba(126,91,64,.11),inset 0 1px 0 rgba(255,255,255,.6);backdrop-filter:blur(16px) saturate(120%)}.soft-glass-strong{background:rgba(255,252,247,.8);backdrop-filter:blur(22px) saturate(135%)}.toolbar{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:44px;padding:13px 16px;border-radius:24px}.search-box{display:flex;align-items:center;flex:1;min-width:260px;gap:10px}.search-box>span{color:#a87852;font-size:21px}.search-box input{width:100%;border:0;outline:0;background:transparent;color:#51443a;font:13px 'PingFang SC',sans-serif}.search-box input::placeholder{color:#aa9a8e}.search-box kbd{padding:4px 8px;border:1px solid rgba(120,81,49,.12);border-radius:8px;background:rgba(255,255,255,.45);color:#a29184;font:9px var(--portfolio-mono)}.category-tabs{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:5px}.category-tabs button{padding:7px 12px;border:0;border-radius:999px;background:transparent;color:#88776b;font:600 11px 'PingFang SC',sans-serif;cursor:pointer}.category-tabs button:hover,.category-tabs button.active{background:#b86f2b;color:#fff;box-shadow:0 6px 18px rgba(184,111,43,.2)}.content-layout{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:34px}.section-heading{display:flex;align-items:end;justify-content:space-between;margin-bottom:18px}.section-heading>div{display:flex;align-items:center;gap:12px}.section-heading span,.side-title>span{color:#b86f2b;font:9px var(--portfolio-mono)}.section-heading h2{margin:0;color:#51443a;font-size:24px}.section-heading>p{margin:0;color:#9a887a;font-size:11px}.featured-card{display:grid;grid-template-columns:42% 58%;min-height:330px;overflow:hidden;border-radius:28px;transition:transform .35s,box-shadow .35s}.featured-card:hover{transform:translateY(-5px);box-shadow:0 28px 80px rgba(126,91,64,.18)}.featured-cover{position:relative;min-height:300px;background:linear-gradient(145deg,#e2aa71,#a85d32);background-position:center;background-size:cover}.featured-cover::after{position:absolute;inset:0;background:linear-gradient(135deg,rgba(64,39,24,.05),rgba(64,39,24,.3));content:''}.featured-cover>span{position:absolute;z-index:2;top:20px;left:20px;padding:6px 11px;border:1px solid rgba(255,255,255,.38);border-radius:999px;background:rgba(255,255,255,.2);color:#fff;font:700 9px 'PingFang SC',sans-serif;backdrop-filter:blur(8px)}.cover-art{position:absolute;z-index:1;inset:0;overflow:hidden}.cover-art i{position:absolute;border:1px solid rgba(255,255,255,.2);border-radius:50%}.cover-art i:nth-child(1){top:30%;left:20%;width:130px;height:130px}.cover-art i:nth-child(2){top:45%;left:38%;width:180px;height:180px}.cover-art i:nth-child(3){top:12%;left:55%;width:90px;height:90px}.cover-art b{position:absolute;right:25px;bottom:25px;color:rgba(255,255,255,.85);font:800 28px/1 var(--portfolio-mono);letter-spacing:-.08em}.featured-body{display:flex;flex-direction:column;padding:34px}.post-meta{display:flex;flex-wrap:wrap;gap:12px;color:#9a887a;font:9px var(--portfolio-mono);letter-spacing:.04em}.featured-body h2{margin:22px 0 13px;color:#473b33;font-size:27px;line-height:1.4}.featured-body>p{display:-webkit-box;overflow:hidden;margin:0;color:#796b61;font:13px/1.85 'PingFang SC',sans-serif;-webkit-box-orient:vertical;-webkit-line-clamp:3}.post-footer{display:flex;align-items:end;justify-content:space-between;gap:14px;margin-top:auto;padding-top:24px}.post-footer>div,.mini-tags{display:flex;flex-wrap:wrap;gap:7px;color:#a8744d;font:9px var(--portfolio-mono)}.post-footer>b{color:#87572f;font-size:11px}.article-list{display:grid;gap:14px;margin-top:18px}.article-card{display:grid;grid-template-columns:62px 1fr auto;align-items:start;gap:20px;padding:23px;border-radius:22px;transition:transform .3s,background .3s}.article-card:hover{transform:translateX(5px);background:rgba(255,252,247,.9)}.article-date{display:flex;align-items:center;flex-direction:column;padding:7px 5px 12px;border-right:1px solid rgba(126,91,64,.13)}.article-date b{color:#9d6030;font-size:24px;line-height:1}.article-date span{margin-top:7px;color:#a39487;font-size:9px}.article-copy h3{margin:10px 0 7px;color:#4b3f36;font-size:19px;line-height:1.45}.article-copy>p{display:-webkit-box;overflow:hidden;margin:0;color:#82746a;font:12px/1.75 'PingFang SC',sans-serif;-webkit-box-orient:vertical;-webkit-line-clamp:2}.mini-tags{margin-top:12px}.article-arrow{color:#ad7b55;font-size:17px}.sidebar{display:flex;flex-direction:column;gap:18px}.profile-card{padding:28px;border-radius:28px;text-align:center}.avatar{display:grid;width:82px;height:82px;margin:0 auto 20px;padding:4px;border-radius:25px;background:linear-gradient(145deg,#e1a267,#b66232);box-shadow:0 14px 36px rgba(184,111,43,.24);place-items:center;transform:rotate(-3deg)}.avatar span{display:grid;width:100%;height:100%;border:2px solid rgba(255,255,255,.65);border-radius:21px;color:#fff;font:800 34px var(--portfolio-mono);place-items:center}.profile-card h2{margin:8px 0;color:#473b33;font-size:24px}.profile-card>p:not(.eyebrow){margin:0;color:#82746a;font:11px/1.8 'PingFang SC',sans-serif}.socials{display:flex;justify-content:center;gap:8px;margin:18px 0}.socials a{padding:7px 10px;border:1px solid rgba(126,91,64,.14);border-radius:10px;background:rgba(255,255,255,.4);color:#8c6242;font:9px var(--portfolio-mono)}.stats{display:grid;grid-template-columns:repeat(3,1fr);padding-top:18px;border-top:1px solid rgba(126,91,64,.12)}.stats div{display:flex;flex-direction:column}.stats div+div{border-left:1px solid rgba(126,91,64,.12)}.stats b{color:#9e5f2d;font-size:17px}.stats span{color:#9a887a;font-size:9px}.sidebar-card{padding:24px;border-radius:24px}.side-title{display:flex;align-items:center;gap:10px;margin-bottom:15px}.side-title h3{margin:0;color:#51443a;font-size:16px}.topic{display:flex;width:100%;align-items:center;justify-content:space-between;padding:10px;border:0;border-bottom:1px solid rgba(126,91,64,.1);background:transparent;color:#746358;cursor:pointer}.topic:last-child{border:0}.topic span{font:12px 'PingFang SC',sans-serif}.topic b{display:grid;width:22px;height:22px;border-radius:50%;background:rgba(184,111,43,.09);color:#a26637;font:9px var(--portfolio-mono);place-items:center}.topic:hover,.topic.active{color:#b86f2b}.quote-card{padding:28px;border-radius:26px;background:linear-gradient(145deg,#b86f2b,#8f4e28);box-shadow:0 20px 55px rgba(126,72,35,.2);color:#fff}.quote-card>span{font:50px/1 Georgia,serif;opacity:.45}.quote-card p{margin:-8px 0 16px;font:700 21px/1.55 Georgia,'Songti SC',serif}.quote-card small{font:9px var(--portfolio-mono);opacity:.7}.rss-card{display:flex;align-items:center;gap:12px;padding:17px;border-radius:20px}.rss-card>span{display:grid;width:38px;height:38px;border-radius:13px;background:#e58a3a;color:#fff;font:800 10px var(--portfolio-mono);place-items:center}.rss-card>div{display:flex;flex:1;flex-direction:column}.rss-card b{color:#594a40;font-size:12px}.rss-card small{color:#9c8a7d;font-size:9px}.rss-card i{color:#b86f2b;font-style:normal}.empty{display:flex;align-items:center;flex-direction:column;gap:8px;margin-top:18px;padding:50px;border-radius:24px;color:#8c7b70}.empty span{font-size:11px}:global(html.dark) .blog-page{--warm-text:#eee9e4;--warm-muted:#a99a90;background:radial-gradient(circle at 12% 8%,rgba(150,104,72,.16),transparent 28rem),radial-gradient(circle at 86% 15%,rgba(196,125,64,.1),transparent 26rem),linear-gradient(180deg,#2a211c 0%,#241b17 48%,#1b1411 100%)}:global(html.dark) .soft-glass,:global(html.dark) .soft-glass-strong{border-color:rgba(255,246,235,.12);background:rgba(64,52,45,.48);box-shadow:0 22px 70px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.06)}:global(html.dark) .hero-copy h1,:global(html.dark) .section-heading h2,:global(html.dark) .featured-body h2,:global(html.dark) .article-copy h3,:global(html.dark) .profile-card h2,:global(html.dark) .side-title h3,:global(html.dark) .rss-card b,:global(html.dark) .hero-note b{color:#eee9e4}:global(html.dark) .hero-copy>p:last-child,:global(html.dark) .featured-body>p,:global(html.dark) .article-copy>p,:global(html.dark) .profile-card>p:not(.eyebrow),:global(html.dark) .topic{color:#b9aaa0}:global(html.dark) .article-card:hover{background:rgba(78,62,53,.72)}:global(html.dark) .search-box input{color:#eee9e4}:global(html.dark) .search-box kbd,:global(html.dark) .socials a{background:rgba(255,255,255,.05)}@media(max-width:900px){.content-layout{grid-template-columns:1fr}.sidebar{display:grid;grid-template-columns:1fr 1fr}.profile-card{grid-row:span 2}.quote-card{min-height:220px}}@media(max-width:720px){.blog-shell{width:min(calc(100% - 32px),1160px);padding:55px 0 85px}.blog-hero{grid-template-columns:1fr;gap:34px;padding:20px 4px 50px}.hero-note{display:none}.toolbar{align-items:stretch;flex-direction:column;border-radius:20px}.search-box{min-width:0}.category-tabs{justify-content:flex-start;overflow-x:auto;flex-wrap:nowrap}.category-tabs button{flex-shrink:0}.featured-card{grid-template-columns:1fr}.featured-cover{min-height:210px}.featured-body{padding:25px}.article-card{grid-template-columns:48px 1fr;gap:14px}.article-arrow{display:none}.sidebar{grid-template-columns:1fr}.profile-card{grid-row:auto}.post-footer{align-items:flex-start;flex-direction:column}.section-heading h2{font-size:22px}}@media(max-width:420px){.hero-copy h1{font-size:44px}.featured-body h2{font-size:23px}.article-card{grid-template-columns:1fr}.article-date{align-items:flex-start;flex-direction:row;gap:6px;padding:0;border:0}.article-date b{font-size:13px}.article-date span{margin:0}}
</style>
