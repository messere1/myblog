export interface GitHubRepository {
  name: string
  url: string
  description: string | null
  language: string | null
  stars: number
  forks: number
  updatedAt: string
  homepage: string | null
  topics: string[]
}

export interface GitHubRepositoryDetails extends GitHubRepository {
  createdAt: string
  defaultBranch: string
  openIssues: number
  sizeKb: number
  license: string | null
  languages: Record<string, number>
}

export interface GitHubSnapshot {
  generatedAt: string
  profile: {
    login: string
    name: string | null
    avatarUrl: string
    url: string
    bio: string | null
    location: string | null
    blog: string | null
    company: string | null
    followers: number
    following: number
    publicRepos: number
  }
  repositories: GitHubRepository[]
}

interface GitHubProfileResponse {
  login: string
  name: string | null
  avatar_url: string
  html_url: string
  bio: string | null
  location: string | null
  blog: string | null
  company: string | null
  followers: number
  following: number
  public_repos: number
}

interface GitHubRepositoryResponse {
  name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  homepage: string | null
  topics?: string[]
  fork: boolean
  archived: boolean
  created_at: string
  default_branch: string
  open_issues_count: number
  size: number
  license: { spdx_id: string | null } | null
}

const USERNAME = 'messere1'
const STORAGE_KEY = 'github-profile-cache-v1'

async function fetchJson<T>(url: string, timeout = 8_000): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    signal: AbortSignal.timeout(timeout),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`GitHub API ${response.status}`)
  return response.json() as Promise<T>
}

function readBrowserCache(): GitHubSnapshot | undefined {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value ? JSON.parse(value) as GitHubSnapshot : undefined
  } catch {
    return undefined
  }
}

function saveBrowserCache(snapshot: GitHubSnapshot) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
  } catch {
    // Storage may be blocked; the in-memory result remains usable.
  }
}

export async function loadGitHubFallback(): Promise<GitHubSnapshot> {
  const browserCache = readBrowserCache()
  if (browserCache) return browserCache

  const response = await fetch('/github-profile.json', {
    signal: AbortSignal.timeout(5_000),
    cache: 'no-cache',
  })
  if (!response.ok) throw new Error(`Snapshot HTTP ${response.status}`)
  return response.json() as Promise<GitHubSnapshot>
}

export async function fetchLiveGitHubSnapshot(): Promise<GitHubSnapshot> {
  const [profile, repositories] = await Promise.all([
    fetchJson<GitHubProfileResponse>(`https://api.github.com/users/${USERNAME}`),
    fetchJson<GitHubRepositoryResponse[]>(
      `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100&type=owner`,
    ),
  ])

  const snapshot: GitHubSnapshot = {
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
    repositories: repositories
      .filter(repository => !repository.fork && !repository.archived)
      .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))
      .slice(0, 6)
      .map(repository => ({
        name: repository.name,
        url: repository.html_url,
        description: repository.description,
        language: repository.language,
        stars: repository.stargazers_count,
        forks: repository.forks_count,
        updatedAt: repository.updated_at,
        homepage: repository.homepage,
        topics: repository.topics || [],
      })),
  }

  saveBrowserCache(snapshot)
  return snapshot
}

export async function fetchGitHubRepositoryDetails(name: string): Promise<GitHubRepositoryDetails> {
  if (!/^[a-zA-Z0-9._-]+$/.test(name)) throw new Error('Invalid repository name')

  const [repository, languages] = await Promise.all([
    fetchJson<GitHubRepositoryResponse>(`https://api.github.com/repos/${USERNAME}/${name}`),
    fetchJson<Record<string, number>>(`https://api.github.com/repos/${USERNAME}/${name}/languages`),
  ])

  return {
    name: repository.name,
    url: repository.html_url,
    description: repository.description,
    language: repository.language,
    stars: repository.stargazers_count,
    forks: repository.forks_count,
    updatedAt: repository.updated_at,
    homepage: repository.homepage,
    topics: repository.topics || [],
    createdAt: repository.created_at,
    defaultBranch: repository.default_branch,
    openIssues: repository.open_issues_count,
    sizeKb: repository.size,
    license: repository.license?.spdx_id || null,
    languages,
  }
}
