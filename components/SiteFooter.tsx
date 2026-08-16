"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "../siteConfig";

export default function SiteFooter() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative z-10 mt-auto border-t border-sky-200/60 bg-white/45 px-5 py-8 text-slate-600 backdrop-blur-xl dark:border-sky-900/40 dark:bg-slate-950/45 dark:text-slate-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/" className="text-sm font-black tracking-[0.16em] text-sky-700 transition-colors hover:text-sky-500 dark:text-sky-300">
            {siteConfig.navTitle}
          </Link>
          <p className="mt-2 max-w-xl text-xs leading-6">Java 后端、分布式系统与持续学习的技术记录。</p>
          <p className="mt-1 text-[11px]">© {year} {siteConfig.authorName} · Built with Next.js · messere.cn</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold" aria-label="页脚导航">
          <Link href="/about" className="hover:text-sky-600 dark:hover:text-sky-300">关于</Link>
          <Link href="/projects" className="hover:text-sky-600 dark:hover:text-sky-300">项目</Link>
          <Link href="/timeline" className="hover:text-sky-600 dark:hover:text-sky-300">归档</Link>
          <a href={siteConfig.social.github} target="_blank" rel="noreferrer" className="hover:text-sky-600 dark:hover:text-sky-300">GitHub</a>
          <a href={`mailto:${siteConfig.social.email}`} className="hover:text-sky-600 dark:hover:text-sky-300">Email</a>
        </nav>
      </div>
    </footer>
  );
}
