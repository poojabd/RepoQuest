export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  html_url: string;
  description: string | null;
  fork: boolean;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  created_at: string;
  license?: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
}

export interface Issue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  html_url: string;
  state: 'open' | 'closed';
  created_at: string;
  comments: number;
  repository_url: string;
  repo_name?: string;
  labels: Array<{
    id: number;
    name: string;
    color: string;
    description?: string;
  }>;
  user: {
    login: string;
    avatar_url: string;
  };
}

export interface RepoAnalysisResult {
  success: boolean;
  engine: 'ollama' | 'gemini' | 'heuristic';
  model?: string;
  host?: string;
  ollamaOffline?: boolean;
  targetModel?: string;
  analysis: string;
  repository: Repository;
  languages: string[];
  fileList: string[];
  hasReadme: boolean;
  note?: string;
}

export interface IssueExplanationResult {
  success: boolean;
  engine: 'ollama' | 'gemini' | 'heuristic';
  model?: string;
  ollamaOffline?: boolean;
  explanation: string;
}

export interface OllamaStatus {
  running: boolean;
  host: string;
  targetModel: string;
  hasTargetModel?: boolean;
  models: string[];
  error?: string;
}

export interface RoadmapStep {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  tips: string[];
  gitCommands?: string[];
  completed: boolean;
}
