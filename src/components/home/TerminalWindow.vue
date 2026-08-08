<template>
  <div class="terminal" aria-label="Messere backend engineer profile code">
    <div class="bar"><span class="red"/><span class="yellow"/><span class="green-dot"/><b>Messere.java</b></div>
    <pre><code><span class="muted">01</span>  <span class="purple">public class</span> <span class="blue">Messere</span> {
<span class="muted">02</span>    String role =
<span class="muted">03</span>      <span class="green">"Backend Engineer"</span>;
<span class="muted">04</span>    String goal =
<span class="muted">05</span>      <span class="green">"System Architect"</span>;
<span class="muted">06</span>    String[] stack = {
<span class="muted">07</span>      <span class="green">"Java"</span>, <span class="green">"Spring Boot"</span>,
<span class="muted">08</span>      <span class="green">"MySQL"</span>, <span class="green">"Redis"</span>
<span class="muted">09</span>    };
<span class="muted">10</span>  }</code></pre>
    <div class="status"><span>main*</span><span>UTF-8</span><span>Java</span></div>
  </div>
</template>

<style scoped>
.terminal{overflow:hidden;border:1px solid #28364a;border-radius:12px;background:rgba(8,12,18,.94);box-shadow:0 28px 80px rgba(0,0,0,.45)}
.bar{display:flex;align-items:center;gap:8px;padding:13px 16px;border-bottom:1px solid #202b3a;background:#0e141d}.bar span{width:10px;height:10px;border-radius:50%}.red{background:#ff5f56}.yellow{background:#ffbd2e}.green-dot{background:#27c93f}.bar b{margin-left:8px;color:#6f7e90;font:500 11px ui-monospace,SFMono-Regular,Consolas,monospace}
pre{margin:0;padding:27px 24px 22px;overflow:auto;color:#c9d1d9;font:13px/1.8 ui-monospace,SFMono-Regular,Consolas,monospace}.muted{color:#3d4a5d}.purple{color:#d2a8ff}.blue{color:#79c0ff}.green{color:#a5d6a7}.status{display:flex;gap:18px;padding:7px 14px;background:#1f6feb;color:#fff;font:10px ui-monospace,SFMono-Regular,Consolas,monospace}.status span:first-child{margin-right:auto}
</style>
