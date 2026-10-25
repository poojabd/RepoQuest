import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Star, 
  GitFork, 
  ExternalLink, 
  FolderTree, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Code, 
  Sparkles,
  Filter
} from 'lucide-react';
import { Repository } from '../types';
import { searchRepositories } from '../services/api';

interface ExplorePageProps {
  onAnalyzeRepo: (repoUrl: string) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Projects', query: 'stars:>500' },
  { id: 'beginner', label: 'Beginner-Friendly', query: 'good-first-issues:>1' },
  { id: 'web', label: 'Web Development', query: 'topic:web OR topic:frontend OR topic:fullstack' },
  { id: 'python', label: 'Python', query: 'language:python stars:>1000' },
  { id: 'ai', label: 'Artificial Intelligence', query: 'topic:ai OR topic:machine-learning OR topic:llm' },
  { id: 'devtools', label: 'Developer Tools', query: 'topic:cli OR topic:developer-tools' },
  { id: 'education', label: 'Education & Learning', query: 'topic:education OR topic:curriculum' },
];

const LANGUAGES = ['All', 'TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'Java', 'C++'];

export const ExplorePage: React.FC<ExplorePageProps> = ({ onAnalyzeRepo }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);
  const [isSamplePreview, setIsSamplePreview] = useState(false);
  const [rateLimitRemaining, setRateLimitRemaining] = useState<string | null>(null);

  const fetchRepos = async () => {
    setLoading(true);
    setError(null);

    const cat = CATEGORIES.find(c => c.id === selectedCategory);
    let baseQuery = cat ? cat.query : 'stars:>500';

    if (searchTerm.trim()) {
      baseQuery = `${searchTerm.trim()} ${baseQuery}`;
    }

    try {
      const result = await searchRepositories(baseQuery, selectedLanguage);
      setRepositories(result.items);
      setIsLive(result.isLive);
      setIsSamplePreview(result.isSamplePreview);
      if (result.rateLimitRemaining !== undefined) {
        setRateLimitRemaining(result.rateLimitRemaining);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve repositories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, [selectedCategory, selectedLanguage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRepos();
  };

  const getLanguageColor = (lang: string | null) => {
    switch (lang?.toLowerCase()) {
      case 'typescript': return 'bg-blue-400 text-blue-950';
      case 'javascript': return 'bg-yellow-400 text-yellow-950';
      case 'python': return 'bg-emerald-400 text-emerald-950';
      case 'rust': return 'bg-orange-400 text-orange-950';
      case 'go': return 'bg-cyan-400 text-cyan-950';
      case 'java': return 'bg-red-400 text-red-950';
      default: return 'bg-slate-400 text-slate-950';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-widest mb-1.5">
          <Sparkles className="w-4 h-4" />
          <span>REPOSITORY DIRECTORY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          EXPLORE <span className="text-teal-400">REPOSITORIES</span>
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          Search real public GitHub repositories, discover active communities, and send any project directly into our AI analyzer for beginner breakdown.
        </p>

        {/* Live GitHub status indicator bar */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
          {isLive ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-950/40 border border-teal-500/30 text-teal-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Live GitHub API</span>
              {rateLimitRemaining && (
                <span className="text-teal-400/80 font-mono">({rateLimitRemaining} req left/hr)</span>
              )}
            </div>
          ) : isSamplePreview ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/40 border border-amber-500/30 text-amber-300">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Offline / Curated Preview Dataset</span>
            </div>
          ) : null}
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">{repositories.length} repositories shown</span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-4 mb-8">
        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keyword, topic, or repo name (e.g., react, algorithm, documentation)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 focus:border-teal-400 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-900 font-semibold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(45,212,191,0.2)]"
          >
            Search
          </button>
        </form>

        {/* Category Filter Pills (Functional Buttons) */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                selectedCategory === cat.id
                  ? 'bg-teal-400 text-slate-900 font-semibold shadow-[0_0_12px_rgba(45,212,191,0.25)]'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Language Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-400">
          <Filter className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span className="shrink-0 font-medium text-slate-300">Language:</span>
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-2.5 py-1 rounded-md text-xs transition-colors shrink-0 ${
                selectedLanguage === lang
                  ? 'bg-slate-800 text-teal-300 border border-teal-500/30'
                  : 'hover:text-white'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Connecting to GitHub public API...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="p-6 rounded-xl bg-red-950/20 border border-red-500/30 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <h4 className="text-white font-semibold">Error Loading Repositories</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">{error}</p>
          <button
            onClick={fetchRepos}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Repository Grid */}
      {!loading && !error && repositories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {repositories.map((repo) => (
            <div
              key={repo.id}
              className="flex flex-col justify-between p-5 rounded-xl bg-[#090d16] border border-slate-800/80 hover:border-teal-500/40 hover:shadow-[0_0_25px_rgba(20,184,166,0.12)] transition-all group"
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={repo.owner.avatar_url}
                      alt={repo.owner.login}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full bg-slate-800 shrink-0 border border-slate-700"
                    />
                    <div className="min-w-0">
                      <span className="text-[11px] text-slate-400 font-mono truncate block">
                        {repo.owner.login}
                      </span>
                      <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors truncate">
                        {repo.name}
                      </h3>
                    </div>
                  </div>

                  {repo.language && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${getLanguageColor(repo.language)}`}>
                      {repo.language}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {repo.description || 'No description provided by repository maintainers.'}
                </p>

                {/* Topics */}
                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {repo.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="text-[10px] text-teal-400/90 font-mono bg-teal-950/30 px-1.5 py-0.5 rounded border border-teal-500/20"
                      >
                        #{topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom stats and action strip */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Star className="w-3.5 h-3.5 text-teal-400" />
                    {repo.stargazers_count > 1000 ? `${(repo.stargazers_count / 1000).toFixed(1)}k` : repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <GitFork className="w-3.5 h-3.5 text-slate-400" />
                    {repo.forks_count > 1000 ? `${(repo.forks_count / 1000).toFixed(1)}k` : repo.forks_count}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title="View on GitHub"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => onAnalyzeRepo(repo.html_url)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-500/10 hover:bg-teal-400 text-teal-300 hover:text-slate-900 border border-teal-500/30 transition-all"
                  >
                    <FolderTree className="w-3.5 h-3.5" />
                    <span>Analyze</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && repositories.length === 0 && (
        <div className="text-center py-16 bg-[#090d16] rounded-2xl border border-slate-800 p-8 space-y-3">
          <Code className="w-8 h-8 text-teal-400 mx-auto" />
          <h3 className="text-base font-semibold text-white">No repositories matched your filters</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms or clearing language filters to see more results.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedLanguage('All');
            }}
            className="px-4 py-2 bg-teal-400 text-slate-900 text-xs font-semibold rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
