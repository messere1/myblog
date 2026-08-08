<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
const auth=useAuthStore()
const menuOpen=ref(false)
const links=[['/','Home'],['/blog','Blog'],['/projects','Projects'],['/about','About'],['/resume','Resume']]
</script>
<template>
  <nav class="navbar">
    <div class="inner">
      <RouterLink to="/" class="brand"><span>//</span> MESSERE<b>_</b></RouterLink>
      <button class="menu" type="button" :aria-expanded="menuOpen" aria-label="切换导航" @click="menuOpen=!menuOpen">{{ menuOpen?'×':'☰' }}</button>
      <div :class="['links',{open:menuOpen}]">
        <RouterLink v-for="([to,label],index) in links" :key="to" :to="to" :active-class="to==='/'?'':'active'" @click="menuOpen=false"><small>0{{ index+1 }}.</small>{{ label }}</RouterLink>
        <RouterLink v-if="auth.isLoggedIn" to="/admin" class="admin" @click="menuOpen=false">Dashboard</RouterLink>
        <RouterLink v-else to="/admin/login" class="admin" @click="menuOpen=false">Admin</RouterLink>
      </div>
    </div>
  </nav>
</template>
<style scoped>
.navbar{position:sticky;top:0;z-index:100;border-bottom:1px solid rgba(39,52,70,.85);background:rgba(7,10,15,.88);backdrop-filter:blur(16px);font-family:Inter,"PingFang SC",system-ui,sans-serif}.inner{display:flex;align-items:center;justify-content:space-between;max-width:1180px;height:74px;margin:auto;padding:0 32px}.brand{color:#e6edf3;font:800 15px ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.08em}.brand span{color:#58a6ff}.brand b{color:#3fb950;animation:blink 1.1s infinite}.links{display:flex;align-items:center;gap:29px}.links a{color:#8290a1;font-size:12px;font-weight:500}.links small{margin-right:5px;color:#3e658f;font:9px ui-monospace,monospace}.links a:hover,.links a.active,.links a.router-link-exact-active{color:#e6edf3}.links .admin{padding:7px 10px;border:1px solid #29394d;border-radius:5px;color:#6f8094;font:10px ui-monospace,monospace}.menu{display:none;border:0;background:none;color:#c6d3e0;font-size:21px}@keyframes blink{50%{opacity:0}}@media(max-width:760px){.inner{height:64px;padding:0 20px}.menu{display:block}.links{display:none;position:absolute;top:100%;right:0;left:0;align-items:stretch;flex-direction:column;gap:0;padding:12px 20px 22px;border-bottom:1px solid #263446;background:#090d13}.links.open{display:flex}.links a{padding:12px}.links .admin{margin-top:8px;text-align:center}}
</style>
