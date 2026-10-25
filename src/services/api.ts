import { Repository, Issue, RepoAnalysisResult, IssueExplanationResult, OllamaStatus } from '../types';
import { SAMPLE_REPOSITORIES, SAMPLE_ISSUES } from '../data/sampleData';

export async function checkOllamaStatus(): Promise<OllamaStatus> {
  try {
    const res = await fetch('/api/ollama/status');
    if (res.ok) {
      return await res.json();
    }
    return {
      running: false,
      host: 'http://localhost:11434',
      targetModel: 'qwen3:0.6b',
      models: [],
      error: `Server responded with ${res.status}`,
    };
  } catch (err: any) {
    return {
      running: false,
      host: 'http://localhost:11434',
      targetModel: 'qwen3:0.6b',
      models: [],
      error: 'Backend API unreachable or offline',
    };
  }
}

export async function searchRepositories(
  query: string,
  language?: string,
  sort: string = 'stars'
): Promise<{ items: Repository[]; total_count: number; isLive: boolean; isSamplePreview: boolean; rateLimitRemaining?: string | null }> {
  // Construct search query
  let finalQuery = query.trim();
  if (!finalQuery) {
    finalQuery = 'stars:>500';
  }
  if (language && language !== 'All') {
    finalQuery += ` language:${language}`;
  }

  try {
    const res = await fetch(
      `/api/github/search-repos?q=${encodeURIComponent(finalQuery)}&sort=${sort}&order=desc&per_page=16`
    );

    if (res.ok) {
      const data = await res.json();
      return {
        items: data.items || [],
        total_count: data.total_count || 0,
        isLive: true,
        isSamplePreview: false,
        rateLimitRemaining: data.rateLimitRemaining,
      };
    }

    // If rate limited or error, try direct GitHub API fallback from client
    const directRes = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(finalQuery)}&sort=${sort}&order=desc&per_page=16`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    );

    if (directRes.ok) {
      const directData = await directRes.json();
      return {
        items: directData.items || [],
        total_count: directData.total_count || 0,
        isLive: true,
        isSamplePreview: false,
        rateLimitRemaining: directRes.headers.get('x-ratelimit-remaining'),
      };
    }
  } catch (err) {
    console.warn('Network or rate limit encountered, using curated repositories:', err);
  }

  // Graceful fallback to curated sample data
  const filtered = SAMPLE_REPOSITORIES.filter(repo => {
    const matchesQuery = query
      ? repo.name.toLowerCase().includes(query.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(query.toLowerCase())) ||
        repo.topics.some(t => t.toLowerCase().includes(query.toLowerCase()))
      : true;
    const matchesLang = language && language !== 'All' ? repo.language?.toLowerCase() === language.toLowerCase() : true;
    return matchesQuery && matchesLang;
  });

  return {
    items: filtered.length > 0 ? filtered : SAMPLE_REPOSITORIES,
    total_count: filtered.length > 0 ? filtered.length : SAMPLE_REPOSITORIES.length,
    isLive: false,
    isSamplePreview: true,
  };
}

export async function searchIssues(
  query: string,
  language?: string,
  labelFilter: string = 'good first issue'
): Promise<{ items: Issue[]; total_count: number; isLive: boolean; isSamplePreview: boolean }> {
  let q = 'is:issue is:open';
  if (labelFilter && labelFilter !== 'All') {
    q += ` label:"${labelFilter}"`;
  }
  if (language && language !== 'All') {
    q += ` language:${language}`;
  }
  if (query.trim()) {
    q += ` ${query.trim()}`;
  }

  try {
    const res = await fetch(`/api/github/search-issues?q=${encodeURIComponent(q)}&sort=created&order=desc&per_page=16`);
    if (res.ok) {
      const data = await res.json();
      const itemsWithRepoName = (data.items || []).map((item: any) => {
        let repoName = '';
        if (item.repository_url) {
          const parts = item.repository_url.split('/repos/');
          if (parts[1]) repoName = parts[1];
        }
        return { ...item, repo_name: repoName };
      });

      return {
        items: itemsWithRepoName,
        total_count: data.total_count || 0,
        isLive: true,
        isSamplePreview: false,
      };
    }
  } catch (err) {
    console.warn('Could not fetch live issues, using curated dataset:', err);
  }

  // Curated fallback
  const filtered = SAMPLE_ISSUES.filter(issue => {
    const matchesQuery = query
      ? issue.title.toLowerCase().includes(query.toLowerCase()) ||
        (issue.body && issue.body.toLowerCase().includes(query.toLowerCase()))
      : true;
    const matchesLabel =
      labelFilter && labelFilter !== 'All'
        ? issue.labels.some(l => l.name.toLowerCase().includes(labelFilter.toLowerCase()))
        : true;
    return matchesQuery && matchesLabel;
  });

  return {
    items: filtered.length > 0 ? filtered : SAMPLE_ISSUES,
    total_count: filtered.length > 0 ? filtered.length : SAMPLE_ISSUES.length,
    isLive: false,
    isSamplePreview: true,
  };
}

export async function fetchRepoDetails(owner: string, repo: string) {
  const res = await fetch(`/api/github/repo-details?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Repository fetch failed (${res.status})`);
  }
  return await res.json();
}

export async function analyzeRepository(
  owner: string,
  repo: string,
  customQuestion?: string
): Promise<RepoAnalysisResult> {
  const res = await fetch('/api/ai/analyze-repo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ owner, repo, customQuestion }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to analyze repository');
  }

  return await res.json();
}

export async function explainIssue(issue: Partial<Issue> & { repo?: string }): Promise<IssueExplanationResult> {
  const res = await fetch('/api/ai/explain-issue', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: issue.title,
      body: issue.body,
      labels: issue.labels?.map(l => l.name) || [],
      repo: issue.repo_name,
      number: issue.number,
      html_url: issue.html_url,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to explain issue');
  }

  return await res.json();
}
