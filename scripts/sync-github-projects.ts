import './load-local-env';
import { db } from '../lib/db';

interface GitHubRepository {
  id: number;
  name: string;
  html_url: string;
  homepage?: string | null;
  description?: string | null;
  language?: string | null;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

async function main() {
  const username = process.env.GITHUB_USERNAME || 'messere1';
  const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'messere-blog-project-sync' },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`GitHub 项目读取失败：${response.status}`);

  const repositories = (await response.json() as GitHubRepository[])
    .filter((repository) => !repository.fork && !repository.archived);

  for (const [index, repository] of repositories.entries()) {
    const content = repository.language
      ? `主要语言：${repository.language}${repository.topics?.length ? `\n\n主题：${repository.topics.join('、')}` : ''}`
      : null;
    await db.execute({
      sql: `INSERT INTO projects (id, title, slug, description, content, project_url, github_url, status, sort_order, started_at, ended_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, NULL, ?, ?)
            ON CONFLICT(id) DO UPDATE SET title=excluded.title, description=excluded.description, content=excluded.content, project_url=excluded.project_url, github_url=excluded.github_url, status=excluded.status, sort_order=excluded.sort_order, updated_at=excluded.updated_at`,
      args: [`github-${repository.id}`, repository.name, `github-${repository.name.toLowerCase()}`, repository.description || '暂无项目简介', content, repository.homepage || null, repository.html_url, index, repository.created_at, repository.created_at, repository.updated_at],
    });
  }

  console.log(`已同步 ${repositories.length} 个 GitHub 项目。`);
  await db.close();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
