<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import { portfolio } from '@/data/portfolio'
useTitle('Resume | Messere')
function printResume(){ window.print() }
</script>
<template>
  <main class="resume-page">
    <div class="resume-actions"><span>MESSERE / RESUME</span><button type="button" @click="printResume">Print / Save PDF</button></div>
    <header><div><h1>Messere</h1><h2>Backend Engineer</h2></div><address><a :href="`mailto:${portfolio.email}`">{{ portfolio.email }}</a><a :href="portfolio.github">github.com/messere1</a><span>Tianjin, China</span></address></header>
    <section><h3>PROFILE</h3><p>{{ portfolio.description }}</p></section>
    <section><h3>EDUCATION</h3><div class="row"><div><h4>Tianjin University</h4><p>Software Engineering · Undergraduate</p></div><time>2024 — Present</time></div></section>
    <section><h3>TECHNICAL FOCUS</h3><div class="skills"><span v-for="item in portfolio.stack" :key="item.name"><b>{{ item.name }}</b>{{ item.group }} · {{ item.level }}</span></div></section>
    <section><h3>ENGINEERING JOURNEY</h3><div v-for="item in portfolio.timeline" :key="item.year" class="row"><div><h4>{{ item.title }}</h4><p>{{ item.description }}</p></div><time>{{ item.year }}</time></div></section>
    <section><h3>SELECTED WORK</h3><div class="row"><div><h4>Messere Personal Engineering Portfolio</h4><p>Vue 3、TypeScript、Supabase 与 EdgeOne Pages 驱动的个人技术主页和博客系统，包含权限隔离、实时 GitHub 数据、评论与后台管理。</p></div><a href="https://github.com/messere1/myblog">Source ↗</a></div></section>
  </main>
</template>
<style scoped>
.resume-page{max-width:900px;min-height:100vh;margin:auto;padding:70px 45px 100px;background:#070a0f;color:#c9d5e2;font-family:Inter,"PingFang SC",system-ui,sans-serif}.resume-actions{display:flex;justify-content:space-between;margin-bottom:60px;color:#607086;font:10px ui-monospace,monospace;letter-spacing:.14em}.resume-actions button{padding:7px 11px;border:1px solid #2b3b50;border-radius:5px;background:#0f1620;color:#9fb5ce;cursor:pointer}header{display:flex;justify-content:space-between;gap:30px;padding-bottom:38px;border-bottom:1px solid #273446}h1{margin:0;color:#f0f6fc;font-size:56px;letter-spacing:-.05em}h2{margin:5px 0 0;color:#58a6ff;font-size:21px;font-weight:500}address{display:flex;align-items:flex-end;flex-direction:column;justify-content:center;gap:5px;color:#7f8ea0;font-size:12px;font-style:normal}section{display:grid;grid-template-columns:150px 1fr;gap:30px;padding:34px 0;border-bottom:1px solid #202b3a}section>h3{margin:3px 0;color:#58a6ff;font:700 10px ui-monospace,monospace;letter-spacing:.16em}section>p{margin:0;color:#9cabbc;font-size:14px;line-height:1.9}.row{display:flex;justify-content:space-between;gap:30px}.row+.row{margin-top:24px}.row h4{margin:0 0 5px;color:#e6edf3;font-size:15px}.row p{max-width:580px;margin:0;color:#8391a3;font-size:12px;line-height:1.7}.row time,.row>a{flex-shrink:0;color:#617288;font:10px ui-monospace,monospace}.skills{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.skills span{padding:13px;border:1px solid #253246;border-radius:6px;color:#6f7f92;font-size:10px}.skills b{display:block;margin-bottom:3px;color:#d5e2ef;font-size:13px}@media(max-width:650px){.resume-page{padding:50px 22px}header{flex-direction:column}address{align-items:flex-start}section{grid-template-columns:1fr;gap:15px}.skills{grid-template-columns:1fr}h1{font-size:44px}}@media print{.resume-page{max-width:none;padding:20px;background:#fff;color:#222}.resume-actions{display:none}h1,.row h4,.skills b{color:#111}h2,section>h3{color:#1f6feb}header,section{border-color:#ddd}section>p,.row p,address,.skills span{color:#444}.skills span{border-color:#ddd}}
</style>
