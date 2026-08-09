<template>
  <div class="terminal" aria-label="Messere engineering profile terminal">
    <div class="bar"><span class="red"/><span class="yellow"/><span class="green-dot"/><b>messere@portfolio:~</b></div>
    <pre><code><span class="prompt">$</span> whoami
<span class="output">messere · java-backend</span>

<span class="prompt">$</span> current --project
<span class="output">messere.cn · portfolio v3</span>

<span class="prompt">$</span> focus --now
<span class="output">spring-boot · redis · distributed-systems</span>

<span class="prompt">$</span> career --target
<span class="output">backend-engineer → system-architect</span><span class="cursor">_</span></code></pre>
    <div class="status"><span>main</span><span>UTF-8</span><span>bash</span></div>
  </div>
</template>

<style scoped>
.terminal{overflow:hidden;border:1px solid #28364a;border-radius:12px;background:rgba(8,12,18,.94);box-shadow:0 28px 80px rgba(0,0,0,.45)}
.bar{display:flex;align-items:center;gap:8px;padding:13px 16px;border-bottom:1px solid #202b3a;background:#0e141d}.bar span{width:10px;height:10px;border-radius:50%}.red{background:#ff5f56}.yellow{background:#ffbd2e}.green-dot{background:#27c93f}.bar b{margin-left:8px;color:#6f7e90;font:500 11px ui-monospace,SFMono-Regular,Consolas,monospace}
pre{margin:0;padding:27px 24px 22px;overflow:auto;color:#8290a1;font:13px/1.65 var(--portfolio-mono)}.prompt{color:#58a6ff}.output{color:#c5d2df}.cursor{color:#3fb950;animation:cursor-blink 1s steps(1) infinite}.status{display:flex;gap:18px;padding:7px 14px;background:#1f6feb;color:#fff;font:10px var(--portfolio-mono)}.status span:first-child{margin-right:auto}@keyframes cursor-blink{50%{opacity:0}}
</style>
