import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const username = process.env.GITHUB_USERNAME || 'messere1'
const outputDir = process.argv.includes('--public') ? 'public' : 'dist'
const outputPath = resolve(outputDir, 'github-profile.json')
const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'messere-blog-build',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
}

async function getJson(url) {
  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(10_000),
  })
  if (!response.ok) throw new Error(`GitHub API ${response.status}: ${url}`)
  return response.json()
}

try {
  const [profile, repositories] = await Promise.all([
    getJson(`https://api.github.com/users/${username}`),
    getJson(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=owner`),
  ])

  const repos = repositories
    .filter((repo) => !repo.fork && !repo.archived)
    .sort((a, b) =>
      b.stargazers_count - a.stargazers_count
      || Date.parse(b.updated_at) - Date.parse(a.updated_at),
    )
    .slice(0, 6)
    .map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updatedAt: repo.updated_at,
      homepage: repo.homepage,
      topics: repo.topics || [],
    }))

  const payload = {
    generatedAt: new Date().toISOString(),
    profile: {
      login: profile.login,
      name: profile.name,
      avatarUrl: profile.avatar_url,
      url: profile.html_url,
      bio: profile.bio,
      location: profile.location,
      blog: profile.blog,
      company: profile.company,
      followers: profile.followers,
      following: profile.following,
      publicRepos: profile.public_repos,
    },
    repositories: repos,
  }

  await mkdir(resolve(outputDir), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
  console.log(`GitHub profile snapshot written to ${outputPath}`)
} catch (error) {
  // Vite has already copied the committed snapshot to dist. Keep that fallback
  // when GitHub is temporarily unavailable or its anonymous rate limit is hit.
  console.warn(`GitHub profile refresh skipped: ${error.message}`)
}
