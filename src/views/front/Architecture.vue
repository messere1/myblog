<script setup lang="ts">
import { useHead } from '@unhead/vue'

useHead({
  title: 'System Architecture | Messere',
  meta: [
    { name: 'description', content: 'The production architecture, security boundaries and resilience decisions behind messere.cn.' },
  ],
})

const decisions = [
  { number: '01', title: 'Static-first delivery', text: 'EdgeOne Pages serves the application close to visitors. Public content can render without waiting for an authenticated session.' },
  { number: '02', title: 'Database-enforced access', text: 'Supabase Auth identifies administrators; Row Level Security and the blog_admins whitelist enforce write permission at the data boundary.' },
  { number: '03', title: 'External API fallback', text: 'GitHub data is refreshed at runtime when available and backed by a build-time snapshot when the API is slow or unreachable.' },
  { number: '04', title: 'Untrusted content isolation', text: 'Markdown is sanitized before rendering. Visitor comments use Giscus and GitHub Discussions instead of a custom anonymous write endpoint.' },
]
</script>

<template>
  <main class="architecture-page portfolio-surface">
    <div class="shell">
      <header class="fade-up">
        <p>PRODUCTION SYSTEM · MESSERE.CN</p>
        <h1>Architecture,<br><em>not decoration.</em></h1>
        <span>本站当前真实运行架构、信任边界和可用性设计。所有节点均对应现有代码或已配置服务。</span>
        <div class="header-links">
          <RouterLink to="/project/myblog">Read the case study →</RouterLink>
          <a href="https://github.com/messere1/myblog" target="_blank" rel="noopener noreferrer">Inspect source ↗</a>
        </div>
      </header>

      <section class="system-map fade-up fade-up-delay-1" aria-labelledby="system-map-title">
        <div class="section-title"><span>01</span><div><p>CURRENT STATE</p><h2 id="system-map-title">Request and data flow</h2></div></div>
        <div class="flow" aria-label="Visitor to EdgeOne, Vue application, and external data services">
          <div class="node entry"><small>CLIENT</small><b>Visitor Browser</b><span>Desktop · Mobile</span></div>
          <i aria-hidden="true">→</i>
          <div class="node"><small>DELIVERY</small><b>EdgeOne Pages</b><span>Static assets · CDN · HTTPS</span></div>
          <i aria-hidden="true">→</i>
          <div class="node primary"><small>APPLICATION</small><b>Vue 3 + TypeScript</b><span>Router · Pinia · Responsive UI</span></div>
        </div>
        <div class="branches">
          <article><small>CONTENT + AUTH</small><h3>Supabase</h3><p>Posts, categories, authentication and Row Level Security.</p><code>Vue → anon key → RLS policy</code></article>
          <article><small>PROJECT DATA</small><h3>GitHub API</h3><p>Public profile and repository facts with a build snapshot fallback.</p><code>live request ?? static snapshot</code></article>
          <article><small>COMMENTS</small><h3>Giscus</h3><p>GitHub Discussions provides visitor identity, moderation and storage.</p><code>OAuth → Discussion thread</code></article>
        </div>
      </section>

      <section class="decisions fade-up fade-up-delay-2" aria-labelledby="decisions-title">
        <div class="section-title"><span>02</span><div><p>ENGINEERING DECISIONS</p><h2 id="decisions-title">Why the system works this way</h2></div></div>
        <div class="decision-grid">
          <article v-for="decision in decisions" :key="decision.number">
            <span>{{ decision.number }}</span><h3>{{ decision.title }}</h3><p>{{ decision.text }}</p>
          </article>
        </div>
      </section>

      <section class="boundary">
        <div><p>HONEST SCOPE</p><h2>What this architecture does not claim</h2></div>
        <p>当前站点是静态前端与托管服务组合，并不是 Java 微服务项目。Java、Spring Boot、Redis 与分布式系统属于正在学习和建设的方向；相关后端系统会在有可公开源码与验证依据后加入作品集。</p>
      </section>

      <section class="evolution" aria-labelledby="evolution-title">
        <div class="section-title"><span>03</span><div><p>LEARNING ROADMAP</p><h2 id="evolution-title">Backend architecture progression</h2></div></div>
        <ol>
          <li><span>NOW</span><b>Single-service fundamentals</b><p>Spring Boot、REST API、MySQL schema design and automated testing.</p></li>
          <li><span>NEXT</span><b>Performance and reliability</b><p>Redis cache strategy、Docker deployment、metrics and failure handling.</p></li>
          <li><span>TARGET</span><b>Distributed system design</b><p>Service boundaries、messaging、consistency and observability based on measurable projects.</p></li>
        </ol>
      </section>
    </div>
  </main>
</template>

<style scoped>
.architecture-page{padding:90px 24px 120px}.shell{max-width:1116px;margin:auto}header{max-width:900px;padding:30px 0 90px}header>p,.section-title p,.boundary>div>p{margin:0;color:var(--portfolio-primary);font:700 10px var(--portfolio-mono);letter-spacing:.18em}header h1{margin:18px 0;color:var(--portfolio-text);font-size:clamp(50px,8vw,88px);line-height:.98;letter-spacing:-.065em}header h1 em{color:#718096;font-style:normal}header>span{display:block;max-width:660px;color:#96a5b6;font-size:16px;line-height:1.9}.header-links{display:flex;gap:12px;margin-top:28px}.header-links a{padding:10px 14px;border:1px solid #30445c;border-radius:var(--radius-sm);color:#b7cce3;font:11px var(--portfolio-mono)}.header-links a:first-child{border-color:var(--portfolio-primary);background:var(--portfolio-primary);color:#07101d;font-weight:700}.section-title{display:flex;gap:18px;margin-bottom:34px}.section-title>span{padding-top:3px;color:var(--portfolio-primary);font:11px var(--portfolio-mono)}.section-title h2{margin:8px 0 0;color:#e9f2fb;font-size:32px;letter-spacing:-.04em}.system-map,.decisions,.evolution{padding:70px 0;border-top:1px solid var(--portfolio-border)}.flow{display:grid;grid-template-columns:1fr auto 1fr auto 1.15fr;align-items:center;gap:12px}.flow>i{color:#45698d;font:18px var(--portfolio-mono);font-style:normal}.node,.branches article,.decision-grid article{border:1px solid var(--portfolio-border);border-radius:var(--radius-md);background:var(--portfolio-glass);box-shadow:0 18px 50px rgba(0,0,0,.16)}.node{display:flex;flex-direction:column;min-height:145px;padding:24px}.node.primary{border-color:rgba(88,166,255,.5);background:linear-gradient(145deg,rgba(26,50,78,.92),rgba(13,18,26,.9))}.node small,.branches small{color:#60748b;font:700 8px var(--portfolio-mono);letter-spacing:.15em}.node b{margin:auto 0 7px;color:#e6edf3;font-size:16px}.node span{color:#718095;font:9px var(--portfolio-mono)}.branches{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:20px;padding-left:18%}.branches article{padding:24px}.branches h3{margin:13px 0 9px;color:#dce8f4;font-size:18px}.branches p{min-height:57px;margin:0;color:#7f8ea1;font-size:12px;line-height:1.6}.branches code{display:block;margin-top:18px;padding-top:14px;border-top:1px solid #202c3b;color:#6faeea;font:9px var(--portfolio-mono)}.decision-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.decision-grid article{padding:28px}.decision-grid article>span{color:#4f7195;font:9px var(--portfolio-mono)}.decision-grid h3{margin:16px 0 10px;color:#dce7f2;font-size:18px}.decision-grid p{margin:0;color:#8493a5;font-size:13px;line-height:1.75}.boundary{display:grid;grid-template-columns:.8fr 1.2fr;gap:60px;margin:30px 0 90px;padding:38px;border:1px solid rgba(210,153,34,.25);border-radius:var(--radius-md);background:rgba(210,153,34,.045)}.boundary h2{margin:12px 0 0;color:#e7edf4;font-size:25px}.boundary>p{margin:0;color:#a29b8d;font-size:13px;line-height:1.9}.evolution ol{display:grid;grid-template-columns:repeat(3,1fr);margin:0;padding:0;list-style:none}.evolution li{position:relative;padding:25px 30px;border-top:2px solid #263c55}.evolution li::before{position:absolute;top:-6px;left:30px;width:10px;height:10px;border-radius:50%;background:#4d7097;content:''}.evolution li:first-child{border-color:var(--portfolio-primary)}.evolution li:first-child::before{background:var(--portfolio-primary);box-shadow:0 0 12px var(--portfolio-primary)}.evolution li>span{color:#52769d;font:8px var(--portfolio-mono)}.evolution b{display:block;margin:18px 0 9px;color:#d8e4ef;font-size:15px}.evolution li p{margin:0;color:#748397;font-size:12px;line-height:1.7}@media(max-width:800px){.flow{grid-template-columns:1fr}.flow>i{transform:rotate(90deg);text-align:center}.branches{grid-template-columns:1fr;padding-left:0}.branches p{min-height:0}.boundary{grid-template-columns:1fr;gap:22px}.evolution ol{grid-template-columns:1fr}.decision-grid{grid-template-columns:1fr}}@media(max-width:560px){.architecture-page{padding:55px 20px 90px}header{padding-bottom:65px}.header-links{flex-direction:column}.header-links a{text-align:center}.system-map,.decisions,.evolution{padding:55px 0}.section-title h2{font-size:27px}.boundary{margin-bottom:65px;padding:26px}}
</style>
