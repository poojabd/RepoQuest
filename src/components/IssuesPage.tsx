import React, { useState, useEffect } from 'react';
import { 
  Search, 
  HelpCircle, 
  ExternalLink, 
  Sparkles, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Clock, 
  Cpu, 
  X, 
  RefreshCw,
  GitBranch,
  ArrowRight
} from 'lucide-react';
import { Issue, IssueExplanationResult, OllamaStatus } from '../types';
import { searchIssues, explainIssue } from '../services/api';

interface IssuesPageProps {
  onAddIssueToRoadmap: (issueTitle: string, repoName: string) => void;
  ollamaStatus: OllamaStatus | null;
  onOpenOllamaModal: () => void;
}

const LABELS = [
  { id: 'good first issue', label: 'good first issue' },
  { id: 'beginner-friendly', label: 'beginner-friendly' },
  { id: 'help wanted', label: 'help wanted' },
  { id: 'documentation', label: 'documentation' },
  { id: 'bug', label: 'bug' },
  { id: 'All', label: 'All Labels' },
];

const LANGUAGES = ['All', 'Python', 'JavaScript', 'TypeScript', 'Rust', 'Go', 'Java'];

export const IssuesPage: React.FC<IssuesPageProps> = ({
  onAddIssueToRoadmap,
  ollamaStatus,
  onOpenOllamaModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('good first issue');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);
  const [isSamplePreview, setIsSamplePreview] = useState(false);

  // Active Issue for Explanation Modal
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanationResult, setExplanationResult] = useState<IssueExplanationResult | null>(null);
  const [explanationError, setExplanationError] = useState<string | null>(null);

  const fetchIssuesList = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await searchIssues(searchTerm, selectedLanguage, selectedLabel);
      setIssues(result.items);
      setIsLive(result.isLive);
      setIsSamplePreview(result.isSamplePreview);
    } catch (err: any) {
      setError(err.message || 'Failed to load GitHub issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssuesList();
  }, [selectedLabel, selectedLanguage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchIssuesList();
  };

  const handleUnderstandIssue = async (issue: Issue) => {
    setSelectedIssue(issue);
    setExplanationResult(null);
    setExplanationError(null);
    setExplanationLoading(true);

    try {
      const result = await explainIssue(issue);
      setExplanationResult(result);
    } catch (err: any) {
      setExplanationError(err.message || 'Could not generate explanation');
    } finally {
      setExplanationLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-widest mb-1.5">
          <Sparkles className="w-4 h-4" />
          <span>REAL-TIME CONTRIBUTION OPPORTUNITIES</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          FIND BEGINNER-FRIENDLY <span className="text-teal-400">ISSUES</span>
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          Discover verified open GitHub issues tagged for newcomers. Read AI-powered breakdowns explaining the problem, prerequisites, and suggested first steps.
        </p>

        {/* Live GitHub status indicator bar */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
          {isLive ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-950/40 border border-teal-500/30 text-teal-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Live GitHub Issues API</span>
            </div>
          ) : isSamplePreview ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/40 border border-amber-500/30 text-amber-300">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Offline / Curated Preview Dataset</span>
            </div>
          ) : null}
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">{issues.length} issues available</span>
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
              placeholder="Search issues by topic, error message, or feature (e.g., documentation, cli, typescript)..."
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

        {/* Label Filters */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {LABELS.map((lbl) => (
            <button
              key={lbl.id}
              onClick={() => setSelectedLabel(lbl.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                selectedLabel === lbl.id
                  ? 'bg-teal-400 text-slate-900 font-semibold shadow-[0_0_12px_rgba(45,212,191,0.25)]'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              label:{lbl.label}
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

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Searching open GitHub issues...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="p-6 rounded-xl bg-red-950/20 border border-red-500/30 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <h4 className="text-white font-semibold">Error Loading Issues</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">{error}</p>
          <button
            onClick={fetchIssuesList}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Issues Grid */}
      {!loading && !error && issues.length > 0 && (
        <div className="space-y-4">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="p-5 rounded-xl bg-[#090d16] border border-slate-800/80 hover:border-teal-500/40 hover:shadow-[0_0_25px_rgba(20,184,166,0.1)] transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  {/* Meta strip: Repo name + Issue number */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono text-teal-400 font-semibold">
                      {issue.repo_name || 'Open Issue'}
                    </span>
                    <span>·</span>
                    <span className="font-mono text-slate-300">#{issue.number}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {new Date(issue.created_at).toLocaleDateString()}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-slate-500" />
                      {issue.comments} comments
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors leading-snug">
                    {issue.title}
                  </h3>

                  {/* Excerpt */}
                  {issue.body && (
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {issue.body}
                    </p>
                  )}

                  {/* Labels */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {issue.labels?.map((label) => (
                      <span
                        key={label.id}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700/60 text-teal-300"
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0 pt-2 md:pt-0">
                  <button
                    onClick={() => handleUnderstandIssue(issue)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-900 font-bold text-xs transition-all shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Understand Issue</span>
                  </button>

                  <a
                    href={issue.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-2 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <span>View on GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && issues.length === 0 && (
        <div className="text-center py-16 bg-[#090d16] rounded-2xl border border-slate-800 p-8 space-y-3">
          <HelpCircle className="w-8 h-8 text-teal-400 mx-auto" />
          <h3 className="text-base font-semibold text-white">No issues found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try switching label filters or searching for general keywords like "documentation" or "bug".
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedLabel('good first issue');
              setSelectedLanguage('All');
            }}
            className="px-4 py-2 bg-teal-400 text-slate-900 text-xs font-semibold rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* "UNDERSTAND THIS ISSUE" AI EXPLANATION MODAL */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-3xl bg-[#090d16] border border-teal-500/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(20,184,166,0.2)] text-slate-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="space-y-1 pr-6">
                <div className="flex items-center gap-2 text-xs font-mono text-teal-400">
                  <span>{selectedIssue.repo_name || 'GitHub Issue'}</span>
                  <span>#{selectedIssue.number}</span>
                </div>
                <h3 className="text-lg font-bold text-white leading-snug">
                  {selectedIssue.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedIssue(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Status Banner */}
            <div className="mb-6 p-3 rounded-xl bg-slate-950 border border-teal-500/20 flex flex-wrap items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-teal-400" />
                <span>
                  {explanationResult?.engine === 'ollama' ? (
                    <>Analyzed with local model <strong className="text-teal-300">qwen3:0.6b</strong></>
                  ) : (
                    <>Automated beginner breakdown for this issue</>
                  )}
                </span>
              </div>
              <a
                href={selectedIssue.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:text-teal-300 flex items-center gap-1 underline"
              >
                <span>Original GitHub Thread</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Explanation Content */}
            {explanationLoading && (
              <div className="py-16 text-center space-y-4">
                <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400">
                  Generating beginner breakdown with {ollamaStatus?.running ? 'qwen3:0.6b' : 'RepoQuest AI'}...
                </p>
              </div>
            )}

            {explanationError && !explanationLoading && (
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-xs text-red-200">
                {explanationError}
              </div>
            )}

            {explanationResult && !explanationLoading && (
              <div className="space-y-6 text-xs text-slate-300">
                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 font-mono whitespace-pre-wrap leading-relaxed text-slate-200">
                  {explanationResult.explanation}
                </div>

                {/* Direct Action: Add this issue to roadmap */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800">
                  <div className="text-slate-400">
                    Ready to tackle this issue? Add it to your contribution roadmap.
                  </div>
                  <button
                    onClick={() => {
                      onAddIssueToRoadmap(selectedIssue.title, selectedIssue.repo_name || '');
                      setSelectedIssue(null);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-900 font-bold transition-all shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                  >
                    <GitBranch className="w-4 h-4" />
                    <span>Add to My Contribution Roadmap</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
