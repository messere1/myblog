<template>
  <footer class="blog-footer">
    <div>
      <RouterLink to="/" class="brand"><span>//</span> MESSERE</RouterLink>
      <p>Backend engineering, systems thinking, continuous learning.</p>
    </div>
    <div class="links">
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/architecture">Architecture</RouterLink>
      <RouterLink to="/blog">Blog</RouterLink>
      <RouterLink to="/projects">Projects</RouterLink>
      <RouterLink to="/github">GitHub</RouterLink>
      <a href="/feed.xml">RSS</a>
    </div>
    <small>© {{ new Date().getFullYear() }} Messere · Built with Vue &amp; Supabase · Deployed on EdgeOne</small>
  </footer>
</template>

<style scoped>
footer{display:grid;grid-template-columns:1fr auto;gap:38px;padding:48px max(24px,calc((100vw - 1116px)/2));border-top:1px solid rgba(133,89,50,.14);background:#efe0d4;color:#82746a;font-family:Inter,"PingFang SC",system-ui,sans-serif;transition:background .35s}.brand{color:#54483f;font:800 13px ui-monospace,monospace;letter-spacing:.08em}.brand span,.links a:hover{color:#b86f2b}p{margin:10px 0 0;font-size:11px}.links{display:flex;gap:20px}.links a{color:#746358;font-size:11px}small{grid-column:1/-1;padding-top:24px;border-top:1px solid rgba(133,89,50,.12);color:#9b897c;font:9px ui-monospace,monospace;letter-spacing:.08em}:global(html.dark) footer{border-color:rgba(255,246,235,.08);background:#1b1411;color:#9d8d82}:global(html.dark) .brand{color:#eee9e4}:global(html.dark) .links a{color:#ad9c90}@media(max-width:600px){footer{grid-template-columns:1fr}.links{flex-wrap:wrap}small{grid-column:auto}}
</style>
