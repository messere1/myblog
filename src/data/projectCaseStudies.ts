export interface ProjectCaseStudy {
  label: string
  challenge: string
  outcome: string
  decisions: Array<{ title: string; description: string }>
  flow: string[]
}

const caseStudies: Record<string, ProjectCaseStudy> = {
  myblog: {
    label: 'PRODUCTION CASE STUDY',
    challenge: '把个人博客重构为在国内移动网络中可访问、可维护，并能持续展示真实 GitHub 与技术内容的工程作品集。',
    outcome: '形成由 EdgeOne Pages 托管的响应式站点，文章与权限由 Supabase 管理，GitHub 数据在实时请求失败时使用构建快照降级。',
    flow: ['Visitor', 'EdgeOne Pages', 'Vue 3 Client', 'Supabase · GitHub · Giscus'],
    decisions: [
      { title: 'Resilient first paint', description: '公开页面不等待可选的 Supabase 会话恢复，远端认证异常时仍能先渲染内容。' },
      { title: 'Snapshot fallback', description: '构建阶段生成 GitHub 项目快照与 RSS；外部 API 暂时不可用时保留核心内容。' },
      { title: 'Database authorization', description: '管理员白名单与 Supabase RLS 控制最终写权限，前端路由守卫只负责界面跳转。' },
      { title: 'Safe content pipeline', description: 'Markdown 输出经 DOMPurify 清洗后渲染，评论交给 GitHub Discussions 身份体系。' },
    ],
  },
}

export function getProjectCaseStudy(name: string) {
  return caseStudies[name.toLowerCase()]
}
