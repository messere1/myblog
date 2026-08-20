/**
 * 一次性脚本：把歌曲资源 URL 从 blog-music-ekr.pages.dev 迁移到博客自有 /music/ 路径。
 * 用法：先加载 .env.local（scripts/load-local-env.ts 已自动处理），然后
 *   npx tsx scripts/migrate-song-urls.ts          # 本地库
 *   DATABASE_URL=<生产> npx tsx scripts/migrate-song-urls.ts  # 生产库
 */
import './load-local-env';

async function main() {
  const { db } = await import('../lib/db');
  const result = await db.execute(
    `UPDATE songs SET url = REPLACE(url, 'https://blog-music-ekr.pages.dev/', '/music/'),
                     pic = REPLACE(pic, 'https://blog-music-ekr.pages.dev/', '/music/')
     WHERE url LIKE 'https://blog-music-ekr.pages.dev/%' OR pic LIKE 'https://blog-music-ekr.pages.dev/%'`,
  );
  console.log('rows affected:', result.rowsAffected);
  const check = await db.execute(`SELECT id, title, url, pic FROM songs WHERE deleted_at IS NULL`);
  for (const row of check.rows) {
    console.log(`- ${row.title}: url=${row.url} pic=${row.pic}`);
  }
}

main().catch((err) => {
  console.error('migration failed:', err);
  process.exit(1);
});
