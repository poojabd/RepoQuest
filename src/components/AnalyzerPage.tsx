import React, { useState, useEffect } from 'react';
import { 
  FolderTree, 
  Search, 
  ExternalLink, 
  FileCode, 
  Folder, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Sparkles, 
  Terminal, 
  Cpu, 
  ArrowRight, 
  Layers, 
  BookOpen, 
  ShieldCheck, 
  Copy, 
  Check,
  ChevronDown,
  ChevronRight,
  GitBranch,
  Compass
} from 'lucide-react';
import { RepoAnalysisResult, OllamaStatus } from '../types';
import { analyzeRepository, fetchRepoDetails } from '../services/api';

interface AnalyzerPageProps {
  initialRepoUrl?: string;
  onNavigateToRoadmap: (repoName: string) => void;
  ollamaStatus: OllamaStatus | null;
  onOpenOllamaModal: () => void;
}

const QUICK_PICKS = [
  { name: 'first-contributions', owner: 'firstcontributions', desc: 'Designed specifically for first-time open-source PRs' },
  { name: 'flask', owner: 'pallets', desc: 'Classic Python microframework with modular code' },
  { name: 'express', owner: 'expressjs', desc: 'Minimalist Node.js web server library' },
  { name: 'tldraw', owner: 'tldraw', desc: 'Modern TypeScript collaborative canvas' },
];

export const AnalyzerPage: React.FC<AnalyzerPageProps> = ({
  initialRepoUrl,
  onNavigateToRoadmap,
  ollamaStatus,
  onOpenOllamaModal,
}) => {
  const [urlInput, setUrlInput] = useState(initialRepoUrl || '');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<RepoAnalysisResult | null>(null);
  const [repoDetails, setRepoDetails] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'files' | 'start' | 'tech' | 'steps'>('overview');
  const [expandedFiles, setExpandedFiles] = useState<Record<string, boolean>>({});
  const [customQuestion, setCustomQuestion] = useState('');
  const [copiedClone, setCopiedClone] = useState(false);

  useEffect(() => {
    if (initialRepoUrl) {
      setUrlInput(initialRepoUrl);
      runAnalysis(initialRepoUrl);
    }
  }, [initialRepoUrl]);

  const parseGitHubUrl = (input: string): { owner: string; repo: string } | null => {
    const trimmed = input.trim().replace(/\/+$/, '');
    // Support formats: https://github.com/owner/repo or github.com/owner/repo or owner/repo
    const regex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/i;
    const match = trimmed.match(regex);
    if (match) {
      return { owner: match[1], repo: match[2].replace(/\.git$/i, '') };
    }

    const shortRegex = /^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/;
    const shortMatch = trimmed.match(shortRegex);
    if (shortMatch) {
      return { owner: shortMatch[1], repo: shortMatch[2] };
    }

    return null;
  };

  const runAnalysis = async (inputUrl: string) => {
    const parsed = parseGitHubUrl(inputUrl);
    if (!parsed) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo or owner/repo)');
      return;
    }

    setError(null);
    setLoading(true);
    setLoadingStep('Connecting to GitHub API...');

    try {
      setLoadingStep('Retrieving repository details & file structure...');
      const details = await fetchRepoDetails(parsed.owner, parsed.repo).catch(() => null);
      if (details) {
        setRepoDetails(details);
      }

      setLoadingStep(
        ollamaStatus?.running
          ? 'Analyzing codebase with local Ollama (qwen3:0.6b)...'
          : 'Parsing repository architecture and dependencies...'
      );

      const result = await analyzeRepository(parsed.owner, parsed.repo, customQuestion);
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze repository. Check URL and try again.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput) {
      runAnalysis(urlInput);
    }
  };

  const copyCloneCmd = (cloneUrl: string) => {
    navigator.clipboard.writeText(`git clone ${cloneUrl}`);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  // Helper to explain purpose of files commonly found in repositories
  const getFileExplanation = (fileName: string) => {
    const lower = fileName.toLowerCase();
    if (lower === 'readme.md' || lower === 'readme.rst' || lower === 'readme') {
      return 'Primary project manual covering setup, purpose, and usage instructions.';
    }
    if (lower === 'package.json') {
      return 'Node.js manifest defining project dependencies, scripts, and build tasks.';
    }
    if (lower === 'requirements.txt' || lower === 'pyproject.toml' || lower === 'setup.py') {
      return 'Python environment and library dependency specification.';
    }
    if (lower === 'contributing.md' || lower === 'contributing.rst') {
      return 'Essential contribution guide explaining formatting, testing, and PR conventions.';
    }
    if (lower === 'license' || lower === 'license.md' || lower === 'license.txt') {
      return 'Open-source software license defining how code can be used and distributed.';
    }
    if (lower === 'dockerfile' || lower === 'docker-compose.yml') {
      return 'Container configuration for running the application in an isolated environment.';
    }
    if (lower === 'tsconfig.json') {
      return 'TypeScript compiler settings, path aliases, and build targets.';
    }
    if (lower === 'src' || lower === 'lib') {
      return 'Core application source code where business logic and features reside.';
    }
    if (lower === 'tests' || lower === 'test' || lower === '__tests__') {
      return 'Automated test suite (unit and integration tests) to verify code correctness.';
    }
    if (lower === 'docs' || lower === 'documentation') {
      return 'Extended user guides, architecture specifications, and API documentation.';
    }
    if (lower.startsWith('.github')) {
      return 'GitHub workflows (CI/CD automated testing), issue templates, and PR guidelines.';
    }
    return 'Project file or directory.';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-widest mb-1.5">
          <Sparkles className="w-4 h-4" />
          <span>DEEP CODEBASE INSPECTION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI REPOSITORY <span className="text-teal-400">ANALYZER</span>
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          Demystify complex open-source projects. Paste any public GitHub URL to inspect its file structure, get plain-English explanations, and learn where a beginner should start reading.
        </p>
      </div>

      {/* Input Box Card */}
      <div className="p-6 rounded-2xl bg-[#090d16] border border-teal-500/25 shadow-[0_0_30px_rgba(20,184,166,0.1)] mb-8">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FolderTree className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://github.com/owner/repository  or  owner/repo"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700/80 focus:border-teal-400 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !urlInput.trim()}
              className="px-6 py-3 bg-teal-400 hover:bg-teal-300 disabled:opacity-50 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(45,212,191,0.25)] shrink-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Repository</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Pick Starter Repositories */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Quick Pick:</span>
            {QUICK_PICKS.map((pick) => (
              <button
                key={pick.name}
                type="button"
                onClick={() => {
                  const pickUrl = `https://github.com/${pick.owner}/${pick.name}`;
                  setUrlInput(pickUrl);
                  runAnalysis(pickUrl);
                }}
                className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-teal-300 transition-colors"
                title={pick.desc}
              >
                {pick.owner}/{pick.name}
              </button>
            ))}
          </div>
        </form>

        {/* Error notification */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-950/30 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Progress Bar */}
        {loading && (
          <div className="mt-6 p-4 rounded-xl bg-slate-950/70 border border-teal-500/20 text-xs text-slate-300 space-y-2 animate-pulse">
            <div className="flex items-center justify-between text-teal-300 font-medium">
              <span>{loadingStep}</span>
              <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-teal-400 h-full w-2/3 animate-pulse rounded-full" />
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results View */}
      {analysisResult && !loading && (
        <div className="space-y-8 animate-fade-in">
          {/* Top Repository Summary Card */}
          <div className="p-6 rounded-2xl bg-[#090d16] border border-teal-500/30 shadow-[0_0_30px_rgba(20,184,166,0.1)]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-teal-400">
                    {analysisResult.repository.owner?.login} /
                  </span>
                  <h2 className="text-2xl font-bold text-white">
                    {analysisResult.repository.name}
                  </h2>
                  <a
                    href={analysisResult.repository.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors"
                    title="Open on GitHub"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                  {analysisResult.repository.description || 'No description provided on GitHub.'}
                </p>
              </div>

              {/* Action Buttons: Add to Roadmap & Clone */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => copyCloneCmd(`https://github.com/${analysisResult.repository.full_name}.git`)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-teal-500/40 text-xs font-mono text-slate-200 transition-colors"
                >
                  {copiedClone ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedClone ? 'Clone URL Copied' : 'git clone'}</span>
                </button>

                <button
                  onClick={() => onNavigateToRoadmap(analysisResult.repository.full_name)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-900 text-xs font-bold transition-all shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>Start Contribution Roadmap</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <span className="text-slate-300">
                Primary Language: <strong className="text-teal-300">{analysisResult.repository.language || 'Multi-language'}</strong>
              </span>
              <span>·</span>
              <span>
                Stars: <strong className="text-white">{analysisResult.repository.stargazers_count?.toLocaleString()}</strong>
              </span>
              <span>·</span>
              <span>
                Forks: <strong className="text-white">{analysisResult.repository.forks_count?.toLocaleString()}</strong>
              </span>
              <span>·</span>
              <span>
                Open Issues: <strong className="text-white">{analysisResult.repository.open_issues_count}</strong>
              </span>
              <span>·</span>
              <span>
                License: <strong className="text-teal-400 font-mono">{analysisResult.repository.license?.spdx_id || 'Not specified'}</strong>
              </span>
            </div>

            {/* AI Engine Transparency Banner */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded ${analysisResult.engine === 'ollama' ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-300">
                  {analysisResult.engine === 'ollama' ? (
                    <>Analyzed with local model <strong className="text-teal-300">qwen3:0.6b</strong></>
                  ) : analysisResult.engine === 'gemini' ? (
                    <>Analyzed with cloud fallback <strong className="text-teal-300">Gemini 2.5 Flash</strong></>
                  ) : (
                    <>Structured analysis compiled from <strong className="text-teal-300">Live GitHub API Data</strong></>
                  )}
                </span>
              </div>

              {analysisResult.ollamaOffline && (
                <button
                  onClick={onOpenOllamaModal}
                  className="text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>Ollama is offline. Click to view Windows run command</span>
                </button>
              )}
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
            {[
              { id: 'overview', label: 'A. Project Overview & ELI5' },
              { id: 'files', label: 'B. File Structure & Roles' },
              { id: 'start', label: 'C. Where Should I Start?' },
              { id: 'tech', label: 'D. Technologies & Languages' },
              { id: 'steps', label: 'E. Beginner Next Steps' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedTab === tab.id
                    ? 'bg-teal-400 text-slate-900 shadow-[0_0_15px_rgba(45,212,191,0.25)]'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="space-y-6">
            {/* TAB 1: OVERVIEW & EXPLAIN IT SIMPLY */}
            {selectedTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Section A: Project Overview */}
                <div className="p-6 rounded-2xl bg-[#090d16] border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                    <BookOpen className="w-4 h-4" />
                    <span>Project Overview</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    What Problem Does This Project Solve?
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {analysisResult.repository.description || 'This open-source project provides source code, libraries, or utilities for the community.'}
                  </p>
                  <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 space-y-1">
                    <p><strong>Target Users:</strong> Developers, learners, and engineers building applications with {analysisResult.repository.language || 'modern software stacks'}.</p>
                    <p><strong>Repository Type:</strong> {analysisResult.repository.fork ? 'Forked Repository' : 'Original Upstream Project'}.</p>
                  </div>
                </div>

                {/* Section B: Explain It Simply */}
                <div className="p-6 rounded-2xl bg-[#090d16] border border-teal-500/25 space-y-4 shadow-[0_0_20px_rgba(20,184,166,0.08)]">
                  <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Explain It Simply (ELI5)</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    For Students & Beginners
                  </h3>
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-teal-500/20 text-slate-200 text-sm leading-relaxed">
                    Imagine you wanted to build a program without having to recreate the wheels from scratch. <strong>{analysisResult.repository.name}</strong> acts as a pre-packaged toolkit. Instead of writing hundreds of complex lines of code yourself, you can install or import this project and use its tested methods right away.
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    As a beginner contributor, you don't need to understand every single line of code! Open source is collaborative: many contributors start by fixing typos in the documentation, adding test cases, or fixing simple edge case bugs.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: UNDERSTAND FILE STRUCTURE */}
            {selectedTab === 'files' && (
              <div className="p-6 rounded-2xl bg-[#090d16] border border-slate-800 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <FolderTree className="w-4 h-4" />
                    <span>Repository File Tree & File Purpose</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Understand the File Structure
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Inspecting real files found at the root of {analysisResult.repository.full_name}. Click any item to read what role it serves in standard open source projects.
                  </p>
                </div>

                {/* Interactive File Tree Viewer */}
                <div className="space-y-2">
                  {analysisResult.fileList && analysisResult.fileList.length > 0 ? (
                    analysisResult.fileList.map((itemStr) => {
                      const fileName = itemStr.split(' (')[0];
                      const isDir = itemStr.includes('(dir)');
                      const explanation = getFileExplanation(fileName);
                      const isExpanded = expandedFiles[fileName] ?? true;

                      return (
                        <div
                          key={fileName}
                          className="rounded-xl bg-slate-950/80 border border-slate-800/80 overflow-hidden transition-all hover:border-slate-700"
                        >
                          <button
                            onClick={() =>
                              setExpandedFiles((prev) => ({ ...prev, [fileName]: !isExpanded }))
                            }
                            className="w-full flex items-center justify-between p-3.5 text-left text-xs font-mono focus:outline-none"
                          >
                            <div className="flex items-center gap-2.5">
                              {isDir ? (
                                <Folder className="w-4 h-4 text-teal-400 shrink-0" />
                              ) : (
                                <FileCode className="w-4 h-4 text-slate-400 shrink-0" />
                              )}
                              <span className="font-semibold text-white">{fileName}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-sans">
                                {isDir ? 'directory' : 'file'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="px-3.5 pb-3.5 text-xs text-slate-300 border-t border-slate-800/60 pt-2.5">
                              <p className="leading-relaxed">
                                <span className="text-teal-400 font-medium">Role: </span>
                                {explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-xs text-slate-400 p-4 bg-slate-950 rounded-lg">
                      Top-level files could not be enumerated via GitHub contents API. Check README on GitHub.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: WHERE SHOULD I START? */}
            {selectedTab === 'start' && (
              <div className="p-6 rounded-2xl bg-[#090d16] border border-slate-800 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <Compass className="w-4 h-4" />
                    <span>Orientation & Exploration Plan</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Where Should I Start as a Beginner?
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Don't get lost in thousands of files. Follow these high-leverage entry points:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-mono text-teal-400 font-bold">1. DOCUMENTATION FIRST</span>
                    <h4 className="text-sm font-bold text-white">
                      Read {analysisResult.fileList.some(f => f.toLowerCase().includes('contributing')) ? 'CONTRIBUTING.md' : 'README.md'}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Maintainers specifically write this document to tell contributors how to run tests, format code, and submit pull requests.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-mono text-teal-400 font-bold">2. LOCAL TEST RUN</span>
                    <h4 className="text-sm font-bold text-white">
                      Verify Existing Tests Pass
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Clone the code and run the test suite on your computer. If the tests pass before you edit anything, you know your local environment is configured properly.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-mono text-teal-400 font-bold">3. LOCATE ENTRY POINT</span>
                    <h4 className="text-sm font-bold text-white">
                      Inspect {analysisResult.fileList.find(f => f.toLowerCase().startsWith('src')) ? 'src/ directory' : 'core files'}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Browse through the main exports or entry file to see how data flows from input to output.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-500/30 text-xs text-teal-200 leading-relaxed">
                  💡 <strong>Pro Tip for Beginners:</strong> Never try to submit a massive refactor on your first pull request. Maintainers appreciate small, well-tested fixes (like fixing a typo, updating broken links, or writing a missing test case) because they are fast to review and easy to merge!
                </div>
              </div>
            )}

            {/* TAB 4: TECHNOLOGIES USED */}
            {selectedTab === 'tech' && (
              <div className="p-6 rounded-2xl bg-[#090d16] border border-slate-800 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <Layers className="w-4 h-4" />
                    <span>Detected Tech Stack</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Technologies & Languages
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Verified languages detected directly from the repository source code:
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {analysisResult.languages && analysisResult.languages.length > 0 ? (
                    analysisResult.languages.map((lang) => (
                      <div
                        key={lang}
                        className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs font-mono text-teal-300"
                      >
                        <span className="w-2 h-2 rounded-full bg-teal-400" />
                        <span>{lang}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400">
                      Primary Language: {analysisResult.repository.language || 'Multi-language'}
                    </div>
                  )}
                </div>

                {/* Detailed raw analysis breakdown */}
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-300 mb-2">AI Synthesized Notes:</h4>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                    {analysisResult.analysis}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: BEGINNER NEXT STEPS & ROADMAP LINK */}
            {selectedTab === 'steps' && (
              <div className="p-6 rounded-2xl bg-[#090d16] border border-slate-800 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Actionable Checklist</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Practical Next Steps for Contributors
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Ready to take action? Here is what to do next:
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="w-6 h-6 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center justify-center text-xs font-bold shrink-0">
                      1
                    </span>
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-white">Fork the repository to your own GitHub account</p>
                      <p className="text-slate-400">Click the 'Fork' button on GitHub so you have your own personal copy you have permission to push code to.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="w-6 h-6 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center justify-center text-xs font-bold shrink-0">
                      2
                    </span>
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-white">Clone and set up your branch</p>
                      <p className="text-slate-400 font-mono text-[11px] text-teal-300">
                        git clone {analysisResult.repository.html_url}.git<br />
                        git checkout -b fix/my-first-contribution
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="w-6 h-6 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center justify-center text-xs font-bold shrink-0">
                      3
                    </span>
                    <div className="text-xs space-y-1">
                      <p className="font-bold text-white">Track this project in the RepoQuest Roadmap</p>
                      <p className="text-slate-400">Step through our interactive 8-stage roadmap to guide you through testing and opening your pull request.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigateToRoadmap(analysisResult.repository.full_name)}
                    className="w-full py-3 bg-teal-400 hover:bg-teal-300 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(45,212,191,0.25)] flex items-center justify-center gap-2"
                  >
                    <span>Open Contribution Roadmap with {analysisResult.repository.name}</span>
                    <ArrowRight className="w-4 h-4" />
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
