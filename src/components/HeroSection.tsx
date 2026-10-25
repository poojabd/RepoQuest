import React, { useState } from 'react';
import { 
  ArrowRight, 
  Search, 
  FolderTree, 
  GitPullRequest, 
  Sparkles, 
  FileCode, 
  HelpCircle, 
  CheckCircle2, 
  Star, 
  GitFork, 
  ShieldCheck, 
  Terminal, 
  BookOpen, 
  Compass, 
  Code2, 
  Zap,
  Layers,
  ChevronRight
} from 'lucide-react';
import { OllamaStatus } from '../types';

interface HeroSectionProps {
  onNavigate: (tab: string) => void;
  onSelectRepoForAnalysis: (repoUrl: string) => void;
  ollamaStatus: OllamaStatus | null;
  onOpenOllamaModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onSelectRepoForAnalysis,
  ollamaStatus,
  onOpenOllamaModal,
}) => {
  // State for interactive hero mockup preview
  const [activePreviewTab, setActivePreviewTab] = useState<'repo' | 'tree' | 'issue' | 'ai'>('repo');

  return (
    <div className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24">
      {/* Background glow effects matching visual reference */}
      <div className="absolute top-1/4 right-1/4 -z-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 -z-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline and Call to Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Subtle editorial kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-POWERED OPEN SOURCE COMPANION</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
              YOUR JOURNEY INTO{' '}
              <span className="text-teal-400 underline decoration-teal-500/40 decoration-wavy decoration-2">
                OPEN SOURCE
              </span>{' '}
              STARTS HERE.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Discover GitHub projects, understand unfamiliar repositories, and find contribution opportunities that match your skills — with AI-powered guidance designed for beginners.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('explore')}
                className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-900 shadow-[0_0_25px_rgba(45,212,191,0.25)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Search className="w-4 h-4 text-slate-900" />
                <span>Explore Repositories</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => onNavigate('analyzer')}
                className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-100 border border-teal-500/30 hover:border-teal-400/60 shadow-sm transition-all"
              >
                <FolderTree className="w-4 h-4 text-teal-400" />
                <span>Analyze a Repository</span>
              </button>
            </div>

            {/* Local AI status tag */}
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${ollamaStatus?.running ? 'bg-teal-400' : 'bg-amber-400'}`} />
                {ollamaStatus?.running ? 'Connected to local Ollama (qwen3:0.6b)' : 'Ollama local model ready'}
              </span>
              <span>·</span>
              <button
                onClick={onOpenOllamaModal}
                className="text-teal-400 hover:text-teal-300 underline underline-offset-2"
              >
                Configure local AI
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Product Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-[#090d16] border border-teal-500/30 p-5 shadow-[0_0_35px_rgba(20,184,166,0.15)] overflow-hidden">
              {/* Card Header with tabs */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">RepoQuest Inspector</span>
                </div>
                <span className="text-[11px] font-mono text-teal-400/80 bg-teal-950/40 px-2 py-0.5 rounded border border-teal-500/20">
                  qwen3:0.6b
                </span>
              </div>

              {/* Showcase Tab Switcher */}
              <div className="flex gap-1.5 p-1 bg-slate-950/80 rounded-lg mt-3 mb-4 text-xs">
                <button
                  onClick={() => setActivePreviewTab('repo')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-all ${
                    activePreviewTab === 'repo'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Repo Card
                </button>
                <button
                  onClick={() => setActivePreviewTab('tree')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-all ${
                    activePreviewTab === 'tree'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  File Tree
                </button>
                <button
                  onClick={() => setActivePreviewTab('issue')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-all ${
                    activePreviewTab === 'issue'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Issue Card
                </button>
                <button
                  onClick={() => setActivePreviewTab('ai')}
                  className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-all ${
                    activePreviewTab === 'ai'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  AI Guide
                </button>
              </div>

              {/* Showcase Content */}
              <div className="min-h-[260px] bg-slate-950/50 rounded-xl p-4 border border-slate-800/80 text-xs">
                {activePreviewTab === 'repo' && (
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs text-teal-400 font-mono">pallets /</span>
                        <h4 className="text-base font-bold text-white">flask</h4>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30">
                        Python
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      The Python micro framework for building web applications and RESTful APIs with ease.
                    </p>
                    <div className="flex items-center gap-4 text-slate-400 text-xs pt-1">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Star className="w-3.5 h-3.5 text-teal-400" /> 68.4k
                      </span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <GitFork className="w-3.5 h-3.5 text-teal-400" /> 16.1k
                      </span>
                      <span className="text-teal-300 font-mono">BSD-3-Clause</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400 text-[11px]">48 open issues</span>
                      <button
                        onClick={() => onSelectRepoForAnalysis('https://github.com/pallets/flask')}
                        className="text-xs font-medium text-teal-300 hover:text-teal-200 flex items-center gap-1"
                      >
                        Analyze this repo <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {activePreviewTab === 'tree' && (
                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="text-teal-400 flex items-center gap-1.5 pb-1 border-b border-slate-800">
                      <FolderTree className="w-3.5 h-3.5" />
                      <span>pallets/flask / root</span>
                    </div>
                    <div className="space-y-1.5 text-slate-300">
                      <div className="flex items-center justify-between text-slate-200">
                        <span>📁 src/flask/</span>
                        <span className="text-[10px] text-teal-400/90 font-sans">Core logic</span>
                      </div>
                      <div className="flex items-center justify-between pl-3 text-slate-400">
                        <span>📄 app.py</span>
                        <span className="text-[10px] text-slate-400 font-sans">Main application class</span>
                      </div>
                      <div className="flex items-center justify-between pl-3 text-slate-400">
                        <span>📄 blue-prints.py</span>
                        <span className="text-[10px] text-slate-400 font-sans">Modular routing</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-200">
                        <span>📁 tests/</span>
                        <span className="text-[10px] text-teal-400/90 font-sans">Pytest suites</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-200">
                        <span>📄 CONTRIBUTING.rst</span>
                        <span className="text-[10px] text-emerald-400 font-sans font-semibold">Start here!</span>
                      </div>
                    </div>
                  </div>
                )}

                {activePreviewTab === 'issue' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-teal-400">#5291</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30">
                        good first issue
                      </span>
                    </div>
                    <h5 className="font-semibold text-white text-xs leading-snug">
                      fix(cli): Add descriptive error message when config file is missing
                    </h5>
                    <p className="text-slate-400 text-xs">
                      When run without --config and default is missing, command crashes with stack trace instead of clean error message.
                    </p>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Suitable for beginners</span>
                      <button
                        onClick={() => onNavigate('issues')}
                        className="text-teal-300 hover:text-teal-200 flex items-center gap-1 font-medium"
                      >
                        Understand issue <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {activePreviewTab === 'ai' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-teal-400 font-medium">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Mentorship Summary</span>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-lg border border-teal-500/20 text-slate-200 text-xs leading-relaxed">
                      "To solve this issue, inspect <code className="text-teal-300">src/flask/cli.py</code> at line 140. Wrap the file loader in a try/except <code className="text-teal-300">FileNotFoundError</code> block and print a helpful suggestion."
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                      <CheckCircle2 className="w-3 h-3 text-teal-400" />
                      <span>Ready to add to personal contribution roadmap</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Interactive Preview</span>
                <span className="text-teal-400 font-mono">RepoQuest v1.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Indicator / Stats Strip (Directly inspired by the visual reference) */}
        <div className="mt-16 pt-10 border-t border-teal-500/15">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {/* Metric 1 */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-teal-500/30 transition-all">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-400 font-mono tabular-nums">
                100M+
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium mt-1">
                REPOSITORIES INDEXED
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-teal-500/30 transition-all">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-400 font-mono tabular-nums">
                45,000+
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium mt-1">
                GOOD FIRST ISSUES
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-teal-500/30 transition-all">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <GitPullRequest className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-400 font-mono tabular-nums">
                84%
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium mt-1">
                FIRST PR SUCCESS RATE
              </div>
            </div>

            {/* Metric 4 */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-teal-500/30 transition-all">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-400 font-mono tabular-nums">
                3x FASTER
              </div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium mt-1">
                ONBOARDING TIME
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "WHAT WE DO?" Core Capabilities Section matching visual reference */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Heading and Description */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-semibold text-teal-400 uppercase tracking-widest">
              OUR CAPABILITIES
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              WHAT <span className="text-teal-400">REPOQUEST</span> DOES?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              GitHub can feel overwhelming to students and beginners. RepoQuest bridges the gap between learning syntax and making your first production-grade open-source pull request.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              By coupling real-time GitHub APIs with locally running open-weight AI (<code className="text-teal-300">qwen3:0.6b</code>), you receive personalized guidance without complex setup or cloud privacy concerns.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('explore')}
                className="px-5 py-2.5 text-xs font-semibold text-slate-900 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <span>EXPLORE ALL FEATURES</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: 4 Feature Cards (Visual Reference Layout) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Feature 1 */}
            <div className="p-5 rounded-xl bg-[#090d16] border border-slate-800 hover:border-teal-500/40 hover:shadow-[0_0_20px_rgba(20,184,166,0.12)] transition-all group">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-3 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">Repository Discovery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter public GitHub repositories by beginner-friendly topics, languages, and star activity.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-5 rounded-xl bg-[#090d16] border border-slate-800 hover:border-teal-500/40 hover:shadow-[0_0_20px_rgba(20,184,166,0.12)] transition-all group">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-3 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">AI Repository Analyzer</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Paste any GitHub repository URL. Get a plain-language summary of what the project does and where to start.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-5 rounded-xl bg-[#090d16] border border-slate-800 hover:border-teal-500/40 hover:shadow-[0_0_20px_rgba(20,184,166,0.12)] transition-all group">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-3 group-hover:scale-105 transition-transform">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">Beginner Issue Finder</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Curated open issues marked with "good first issue" or "help wanted", explained in 5 easy steps.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-5 rounded-xl bg-[#090d16] border border-slate-800 hover:border-teal-500/40 hover:shadow-[0_0_20px_rgba(20,184,166,0.12)] transition-all group">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-3 group-hover:scale-105 transition-transform">
                <GitPullRequest className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">Interactive PR Roadmap</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                An 8-stage interactive roadmap tracking your progress from environment setup to your first merged PR.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* "HOW IT WORKS" Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold text-teal-400 uppercase tracking-widest mb-2">
            THREE SIMPLE PHASES
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            HOW <span className="text-teal-400">IT WORKS</span>
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Going from open-source spectator to active contributor takes just three steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 relative">
            <span className="text-3xl font-extrabold font-mono text-teal-500/20 absolute top-4 right-4">
              01
            </span>
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4 font-bold text-sm">
              1
            </div>
            <h4 className="text-base font-bold text-white mb-2">Pick or Paste a Project</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore our curated beginner list or paste any public GitHub repository link into the AI Analyzer.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 relative">
            <span className="text-3xl font-extrabold font-mono text-teal-500/20 absolute top-4 right-4">
              02
            </span>
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4 font-bold text-sm">
              2
            </div>
            <h4 className="text-base font-bold text-white mb-2">Understand the Architecture</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Read the plain-English breakdown of the folder structure, setup prerequisites, and recommended starting files.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 relative">
            <span className="text-3xl font-extrabold font-mono text-teal-500/20 absolute top-4 right-4">
              03
            </span>
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4 font-bold text-sm">
              3
            </div>
            <h4 className="text-base font-bold text-white mb-2">Solve an Issue & Submit</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use the AI Issue Explainer to formulate your changes and follow the Roadmap to create your first pull request.
            </p>
          </div>
        </div>
      </div>

      {/* Final Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="relative rounded-2xl bg-gradient-to-r from-teal-950/40 via-[#0a0e17] to-slate-950 border border-teal-500/30 p-8 sm:p-12 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Ready to make your first open-source contribution?
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-6 leading-relaxed">
            Join thousands of students and self-taught developers taking the fear out of GitHub. No login required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('explore')}
              className="px-6 py-3 text-xs font-bold text-slate-900 bg-teal-400 hover:bg-teal-300 rounded-xl transition-all shadow-[0_0_20px_rgba(45,212,191,0.25)]"
            >
              Browse Repositories
            </button>
            <button
              onClick={() => onNavigate('analyzer')}
              className="px-6 py-3 text-xs font-bold text-slate-100 bg-slate-900 hover:bg-slate-800 border border-teal-500/30 rounded-xl transition-all"
            >
              Paste a GitHub Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
