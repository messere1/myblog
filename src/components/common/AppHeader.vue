<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
const auth=useAuthStore()
const menuOpen=ref(false)
const links=[['/','Home'],['/projects','Projects'],['/architecture','Architecture'],['/blog','Writing']]
</script>
<template>
  <nav class="navbar">
    <div class="inner">
      <RouterLink to="/" class="brand"><span>//</span><span class="brand-copy">MESSERE<b>_</b><small>JAVA BACKEND ENGINEER</small></span></RouterLink>
      <button class="menu" type="button" :aria-expanded="menuOpen" aria-label="切换导航" @click="menuOpen=!menuOpen">{{ menuOpen?'×':'☰' }}</button>
      <div :class="['links',{open:menuOpen}]">
        <RouterLink v-for="([to,label],index) in links" :key="to" :to="to" :active-class="to==='/'?'':'active'" @click="menuOpen=false"><small>0{{ index+1 }}.</small>{{ label }}</RouterLink>
        <span class="opportunity"><i /> OPEN TO WORK</span>
        <RouterLink to="/resume" class="resume-cta" @click="menuOpen=false">Resume / PDF</RouterLink>
        <RouterLink v-if="auth.isLoggedIn" to="/admin" class="admin" @click="menuOpen=false">Dashboard</RouterLink>
        <RouterLink v-else to="/admin/login" class="admin" @click="menuOpen=false">Admin</RouterLink>
      </div>
    </div>
  </nav>
</template>
<style scoped>
.navbar{position:sticky;top:0;z-index:100;border-bottom:1px solid rgba(255,255,255,.07);background:rgba(5,8,12,.78);backdrop-filter:blur(20px);font-family:'Inter Variable',Inter,"PingFang SC",system-ui,sans-serif}.inner{display:flex;align-items:center;justify-content:space-between;max-width:1240px;height:74px;margin:auto;padding:0 32px}.brand{display:flex;align-items:center;gap:8px;color:#e6edf3;font:800 15px var(--portfolio-mono);letter-spacing:.08em}.brand>span:first-child{color:#58a6ff}.brand-copy{display:flex;flex-direction:column}.brand b{color:#3fb950;animation:blink 1.1s infinite}.brand small{margin-top:2px;color:#526276;font:600 7px var(--portfolio-mono);letter-spacing:.14em}.links{display:flex;align-items:center;gap:21px}.links a{color:#8290a1;font-size:12px;font-weight:500}.links small{margin-right:5px;color:#3e658f;font:9px var(--portfolio-mono)}.links a:hover,.links a.active,.links a.router-link-exact-active{color:#e6edf3}.opportunity{display:flex;align-items:center;gap:7px;padding:7px 10px;border:1px solid rgba(63,185,80,.2);border-radius:999px;background:rgba(63,185,80,.055);color:#82aa8a;font:700 8px var(--portfolio-mono);letter-spacing:.08em}.opportunity i{width:6px;height:6px;border-radius:50%;background:#3fb950;box-shadow:0 0 8px #3fb950}.links .resume-cta{padding:8px 11px;border:1px solid #365271;border-radius:6px;color:#b9d7f7;font:700 9px var(--portfolio-mono)}.links .admin{padding:7px 10px;border:1px solid #29394d;border-radius:5px;color:#6f8094;font:10px var(--portfolio-mono)}.menu{display:none;border:0;background:none;color:#c6d3e0;font-size:21px}@keyframes blink{50%{opacity:0}}@media(max-width:1040px){.opportunity{display:none}.links{gap:16px}}@media(max-width:760px){.inner{height:64px;padding:0 20px}.menu{display:block}.links{display:none;position:absolute;top:100%;right:0;left:0;align-items:stretch;flex-direction:column;gap:0;padding:12px 20px 22px;border-bottom:1px solid #263446;background:rgba(5,8,12,.98)}.links.open{display:flex}.links a{padding:12px}.links .resume-cta,.links .admin{margin-top:8px;text-align:center}.opportunity{display:flex;align-self:flex-start;margin:10px 12px}}
</style>
