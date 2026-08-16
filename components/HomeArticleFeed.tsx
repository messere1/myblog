"use client";

import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import ArticleCard from './ArticleCard';

interface HomeArticle {
  slug: string;
  title: string;
  description?: string;
  cover?: string;
  formattedDate?: string;
  tags?: string[];
  viewCount?: number;
}

const POSTS_PER_PAGE = 5;

export default function HomeArticleFeed({ posts }: { posts: HomeArticle[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageDirection, setPageDirection] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * POSTS_PER_PAGE;
  const visiblePosts = useMemo(
    () => posts.slice(startIndex, startIndex + POSTS_PER_PAGE),
    [posts, startIndex],
  );

  const changePage = (nextPage: number) => {
    const safeNextPage = Math.min(Math.max(1, nextPage), totalPages);
    if (safeNextPage === safePage) return;

    setPageDirection(safeNextPage > safePage ? 1 : -1);
    setCurrentPage(safeNextPage);
    listRef.current?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <main className="flex-1 min-w-0 flex flex-col gap-6 scroll-mt-24">
      <div
        ref={listRef}
        className="flex flex-col gap-6 scroll-mt-24 outline-none"
        aria-live="polite"
        aria-label={`第 ${safePage} 页文章`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={safePage}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            exit={reduceMotion ? undefined : "exit"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.055,
                  delayChildren: 0.025,
                },
              },
              exit: {
                opacity: 0,
                x: pageDirection * -14,
                transition: {
                  duration: 0.16,
                  ease: [0.4, 0, 1, 1],
                },
              },
            }}
            className="flex flex-col gap-6"
          >
            {visiblePosts.length > 0 ? visiblePosts.map((post, index) => (
              <motion.div
                key={post.slug}
                variants={{
                  hidden: {
                    opacity: 0,
                    x: pageDirection * 20,
                    y: 6,
                  },
                  visible: {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    transition: {
                      duration: 0.38,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                }}
              >
                <ArticleCard post={post} index={startIndex + index} />
              </motion.div>
            )) : (
              <div className="soft-glass-panel rounded-3xl p-12 text-center">
                <p className="text-slate-400 dark:text-slate-500 font-bold">暂无文章</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {posts.length > 0 && (
        <nav className="flex items-center justify-center gap-3 mt-4" aria-label="文章分页">
          <button
            type="button"
            onClick={() => changePage(safePage - 1)}
            disabled={safePage <= 1}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 active:scale-[0.98] ${
              safePage <= 1
                ? 'bg-white/20 dark:bg-slate-800/30 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                : 'soft-glass-panel text-stone-600 dark:text-stone-300 hover:bg-sky-500 hover:text-white hover:border-sky-500'
            }`}
          >
            上一页
          </button>
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400" aria-current="page">
            {safePage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => changePage(safePage + 1)}
            disabled={safePage >= totalPages}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 active:scale-[0.98] ${
              safePage >= totalPages
                ? 'bg-white/20 dark:bg-slate-800/30 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                : 'soft-glass-panel text-stone-600 dark:text-stone-300 hover:bg-sky-500 hover:text-white hover:border-sky-500'
            }`}
          >
            下一页
          </button>
        </nav>
      )}
    </main>
  );
}
