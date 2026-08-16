interface SocialConfig {
  github?: string;
  gitee?: string;
  google?: string;
  email?: string;
  qq?: string;
  wechat?: string;
  twitter?: string;
  xiaohongshu?: string;
}

interface AiConfig {
  modelId: string;
  systemPrompt: string;
  maxOutputTokens: number;
  temperature: number;
}

interface PetConfig {
  name: string;
  avatar: string;
  systemPrompt: string;
  proactiveMessages: string[];
  proactiveInterval: number;
  allowedApiHosts: string[];
}

interface FooterBadge {
  name: string;
  color: string;
  svg: string;
}

interface CloudMusicItem {
  id: string;
  name: string;
  artist: string;
}

interface SiteConfig {
  title: string;
  siteUrl: string;
  faviconUrl: string;
  authorName: string;
  bio: string;
  navTitle: string;
  navSuffix: string;
  navAfter: string;
  avatarUrl: string;
  useGradient: boolean;
  themeColors: string[];
  bgImages: string[];
  defaultPostCover: string;
  photoWallImage: string;
  cloudMusicList: CloudMusicItem[];
  social: SocialConfig;
  counts: { photos: number };
  chatterTitle: string;
  chatterDescription: string;
  danmakuList: string[];
  buildDate: string;
  footerBadges: FooterBadge[];
  icpConfig: { name: string; link: string };
  aiConfig: AiConfig;
  petConfig: PetConfig;
  friendLinkApplyFormat: string;
  enableLevelSystem: boolean;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://messere.cn";

export const siteConfig: SiteConfig = {
  title: "Messere · Java Backend Engineer",
  siteUrl,
  faviconUrl: "/favicon.svg",
  authorName: "Messere",
  bio: "专注 Java 后端、Spring 生态与分布式系统，持续把学习过程沉淀为可运行的项目和技术文章。",
  navTitle: "MESSERE",
  navSuffix: " · ",
  navAfter: "BLOG",
  avatarUrl: "https://avatars.githubusercontent.com/u/189848840?v=4",
  useGradient: true,
  themeColors: ["#f7fcff", "#e7f5ff", "#cfeeff", "#b8e4ff"],
  bgImages: [
    "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop",
  ],
  defaultPostCover: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
  photoWallImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
  cloudMusicList: [],
  social: {
    github: "https://github.com/messere1",
    email: "3023209092@tju.edu.cn",
    qq: "31107711",
    wechat: "zichenyao666",
  },
  counts: { photos: 0 },
  chatterTitle: "留言墙",
  chatterDescription: "欢迎留下想法、建议，或只是来打个招呼。",
  danmakuList: ["持续学习，持续构建", "Java Backend", "Spring Boot", "Distributed Systems", "把问题想清楚，再把系统做可靠"],
  buildDate: "2026-08-16T00:00:00+08:00",
  footerBadges: [
    { name: "Next.js", color: "text-sky-600", svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8 8z"/>' },
    { name: "React", color: "text-cyan-500", svg: '<path d="M12 22.6l-9.8-5.6V5.6L12 0l9.8 5.6v11.4l-9.8 5.6zm-8.2-6.5l8.2 4.7 8.2-4.7V7.5L12 2.8 3.8 7.5v8.6z"/>' },
    { name: "Tailwind", color: "text-blue-500", svg: '<path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c.913.228,1.565.89,2.288,1.624C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8-.913-.228-1.565-.89-2.288-1.624C16.337,6.182,14.976,4.8,12.001,4.8z"/>' },
  ],
  icpConfig: { name: "", link: "" },
  aiConfig: {
    modelId: "glm-5.3",
    systemPrompt: "你是 Messere 博客里的学习伙伴。请用简洁、友善的中文回答，优先讨论 Java 后端、工程实践与分布式系统。每次回复不超过 100 字。",
    maxOutputTokens: 256,
    temperature: 0.75,
  },
  petConfig: {
    name: "Byte",
    avatar: "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=messere&backgroundColor=b6e3f4",
    systemPrompt: "你是 Messere 博客里的小助手 Byte。说话简短、友好、有一点工程师式幽默；每次最多两句话，不超过 100 字。",
    proactiveMessages: [
      "写累了就休息一下，可靠的系统也需要留出余量。",
      "今天又学到什么新东西了？",
      "遇到难题时，先把输入、输出和边界条件写下来。",
      "欢迎来聊聊 Java、数据库或分布式系统。",
    ],
    proactiveInterval: 30 * 60 * 1000,
    allowedApiHosts: ["glm.llm.autos"],
  },
  friendLinkApplyFormat: `名称：Messere Blog\n简介：Java 后端与分布式系统学习记录\n链接：${siteUrl}\n头像：https://avatars.githubusercontent.com/u/189848840?v=4`,
  enableLevelSystem: false,
};
