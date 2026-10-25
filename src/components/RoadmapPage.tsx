import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Terminal, 
  GitBranch, 
  GitPullRequest, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw,
  BookOpen,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { RoadmapStep } from '../types';

interface RoadmapPageProps {
  activeRepo?: string;
  activeIssue?: string;
}

const DEFAULT_STAGES: RoadmapStep[] = [
  {
    id: 1,
    title: 'Understand the Project',
    subtitle: 'High-level purpose, architecture & target audience',
    category: 'Discovery',
    description: 'Read the project README, explore its website or demo, and understand what user problem it solves before writing code.',
    tips: [
      'Use the RepoQuest AI Analyzer to get a plain-English breakdown.',
      'Check who maintains it and how active commits are.',
      'Test the application as an end-user first if a demo is available.',
    ],
    gitCommands: [],
    completed: false,
  },
  {
    id: 2,
    title: 'Set Up Development Environment',
    subtitle: 'Fork, clone & install dependencies locally',
    category: 'Setup',
    description: 'Fork the repository on GitHub to your account, clone your fork to your computer, and install required tools/libraries.',
    tips: [
      'Always fork first so you have push permissions to your remote.',
      'Check README or CONTRIBUTING for specific runtime versions (e.g. Node 20+, Python 3.11+).',
      'Verify installation succeeds without errors before editing files.',
    ],
    gitCommands: [
      'git clone https://github.com/<your-username>/<repo>.git',
      'cd <repo>',
      'git remote add upstream https://github.com/<original-owner>/<repo>.git',
    ],
    completed: false,
  },
  {
    id: 3,
    title: 'Read Contribution Guidelines',
    subtitle: 'Inspect CONTRIBUTING.md, Code of Conduct & Style Guides',
    category: 'Guidelines',
    description: 'Every mature open-source repository has conventions for branch names, commit formats (e.g. Conventional Commits), and testing requirements.',
    tips: [
      'Look for CONTRIBUTING.md or docs/contributing in the root directory.',
      'Check if they require issues to be assigned before opening a PR.',
      'Check if a Developer Certificate of Origin (DCO) or CLA signature is needed.',
    ],
    gitCommands: [],
    completed: false,
  },
  {
    id: 4,
    title: 'Choose an Appropriate Issue',
    subtitle: 'Select a scoped issue matching your skills',
    category: 'Selection',
    description: 'Find an open issue labeled "good first issue", "beginner-friendly", or "documentation". Leave a comment asking to work on it if required.',
    tips: [
      'Check existing comments to make sure someone else is not already working on it.',
      'Start with a documentation fix or small bugfix before tackling new features.',
      'Comment politely: "Hi! I would like to work on this issue. Could you please assign it to me?"',
    ],
    gitCommands: [],
    completed: false,
  },
  {
    id: 5,
    title: 'Investigate the Issue',
    subtitle: 'Locate the exact files and reproduce behavior',
    category: 'Investigation',
    description: 'Search the codebase for relevant function names or error strings. Reproduce the bug or inspect the current component.',
    tips: [
      'Use RepoQuest AI "Understand This Issue" to see what skills or files to inspect.',
      'Write a small failing test case to confirm the bug before changing source code.',
      'Never hesitate to ask clarifying questions in the issue thread if requirements are vague.',
    ],
    gitCommands: [],
    completed: false,
  },
  {
    id: 6,
    title: 'Make a Small, Atomic Change',
    subtitle: 'Create a feature branch & write clean code',
    category: 'Coding',
    description: 'Create a dedicated git branch for your fix. Keep changes small and focused on only this issue—avoid random formatting changes in other files.',
    tips: [
      'Name your branch descriptively: fix/missing-config-error or docs/powershell-setup.',
      'Write clear commit messages: "fix(cli): show error when config file missing".',
      'Keep your commits atomic and easy for maintainers to review.',
    ],
    gitCommands: [
      'git checkout -b fix/my-first-contribution',
      'git add .',
      'git commit -m "fix: resolve issue description"',
    ],
    completed: false,
  },
  {
    id: 7,
    title: 'Test Your Change',
    subtitle: 'Run automated test suites and linters',
    category: 'Testing',
    description: 'Run the project test suite and linter to make sure your changes didn\'t accidentally break existing features.',
    tips: [
      'Run npm test, pytest, cargo test, or go test depending on the repository language.',
      'Run formatting / lint commands: npm run lint or pre-commit run --all-files.',
      'Add a new test case that specifically tests your fix.',
    ],
    gitCommands: [
      'npm test',
      'npm run lint',
    ],
    completed: false,
  },
  {
    id: 8,
    title: 'Prepare & Submit a Pull Request',
    subtitle: 'Push branch, open PR & respond to maintainer review',
    category: 'Contribution',
    description: 'Push your branch to your GitHub fork and open a Pull Request. Fill out the PR template completely and link your issue.',
    tips: [
      'Include "Fixes #1234" in the PR description so the issue closes automatically when merged.',
      'Be patient! Maintainers are often volunteers reviewing in their free time.',
      'If maintainers request changes, make edits on the same branch and push again—the PR will update automatically.',
    ],
    gitCommands: [
      'git push origin fix/my-first-contribution',
    ],
    completed: false,
  },
];

export const RoadmapPage: React.FC<RoadmapPageProps> = ({ activeRepo, activeIssue }) => {
  const [stages, setStages] = useState<RoadmapStep[]>(() => {
    try {
      const saved = sessionStorage.getItem('repoquest_roadmap_stages');
      return saved ? JSON.parse(saved) : DEFAULT_STAGES;
    } catch {
      return DEFAULT_STAGES;
    }
  });

  const [expandedStage, setExpandedStage] = useState<number>(1);
  const [notes, setNotes] = useState<Record<number, string>>(() => {
    try {
      const saved = sessionStorage.getItem('repoquest_roadmap_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem('repoquest_roadmap_stages', JSON.stringify(stages));
    } catch (e) {
      console.warn('Session storage write error', e);
    }
  }, [stages]);

  useEffect(() => {
    try {
      sessionStorage.setItem('repoquest_roadmap_notes', JSON.stringify(notes));
    } catch (e) {
      console.warn('Session storage write error', e);
    }
  }, [notes]);

  const toggleComplete = (id: number) => {
    setStages(prev =>
      prev.map(s => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const resetRoadmap = () => {
    if (window.confirm('Reset your roadmap progress for this session?')) {
      setStages(DEFAULT_STAGES);
      setNotes({});
    }
  };

  const completedCount = stages.filter(s => s.completed).length;
  const progressPercent = Math.round((completedCount / stages.length) * 100);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-widest mb-1.5">
          <Sparkles className="w-4 h-4" />
          <span>STRUCTURED CONTRIBUTOR JOURNEY</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              MY CONTRIBUTION <span className="text-teal-400">ROADMAP</span>
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              An 8-stage interactive guide taking you from unfamiliar codebase to your first merged pull request.
            </p>
          </div>

          <button
            onClick={resetRoadmap}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-400 hover:text-white transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
        </div>

        {/* Active Target Banner */}
        {(activeRepo || activeIssue) && (
          <div className="mt-4 p-4 rounded-xl bg-teal-950/20 border border-teal-500/30 flex flex-wrap items-center justify-between gap-3 text-xs text-teal-200">
            <div>
              <span className="text-slate-400">Active Target: </span>
              {activeRepo && <strong className="text-white font-mono">{activeRepo}</strong>}
              {activeRepo && activeIssue && <span className="mx-2">·</span>}
              {activeIssue && <span className="text-teal-300 italic">"{activeIssue}"</span>}
            </div>
            <span className="text-[11px] bg-teal-900/40 px-2 py-0.5 rounded border border-teal-500/20">
              Session Tracked
            </span>
          </div>
        )}

        {/* Progress Metric Bar */}
        <div className="mt-6 p-5 rounded-2xl bg-[#090d16] border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-white">Overall Roadmap Completion</span>
            <span className="font-mono text-teal-400 font-bold">{progressPercent}% ({completedCount}/{stages.length} Completed)</span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-teal-400 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(45,212,191,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Progress is tracked in your browser session for privacy. No login or cloud account required.
          </p>
        </div>
      </div>

      {/* 8-Stage Interactive List */}
      <div className="space-y-4">
        {stages.map((stage) => {
          const isExpanded = expandedStage === stage.id;

          return (
            <div
              key={stage.id}
              className={`rounded-2xl bg-[#090d16] border transition-all ${
                stage.completed
                  ? 'border-teal-500/30 bg-teal-950/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Stage Header */}
              <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  {/* Completion Checkbox Button */}
                  <button
                    onClick={() => toggleComplete(stage.id)}
                    className="p-1 rounded-lg text-teal-400 hover:text-teal-300 transition-colors focus:outline-none shrink-0"
                    title={stage.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {stage.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-teal-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-500 hover:text-teal-400" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400 bg-teal-950/40 px-2 py-0.5 rounded border border-teal-500/20">
                        Stage {stage.id}
                      </span>
                      <span className="text-xs text-slate-400">{stage.category}</span>
                    </div>
                    <h3 className={`text-base font-bold text-white transition-colors truncate mt-0.5 ${stage.completed ? 'line-through text-slate-400' : ''}`}>
                      {stage.title}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">
                      {stage.subtitle}
                    </p>
                  </div>
                </div>

                {/* Expand / Collapse Button */}
                <button
                  onClick={() => setExpandedStage(isExpanded ? 0 : stage.id)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0"
                >
                  {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
              </div>

              {/* Stage Body Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-4 text-xs text-slate-300">
                  <p className="leading-relaxed text-sm text-slate-200">
                    {stage.description}
                  </p>

                  {/* Tips */}
                  {stage.tips.length > 0 && (
                    <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                      <div className="font-semibold text-teal-300 text-xs flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Actionable Tips for Beginners</span>
                      </div>
                      <ul className="space-y-1 text-slate-300 list-disc list-inside">
                        {stage.tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Git Commands Cheat Sheet */}
                  {stage.gitCommands && stage.gitCommands.length > 0 && (
                    <div className="space-y-2">
                      <div className="font-semibold text-slate-300 text-xs flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-teal-400" />
                        <span>Terminal / Git Commands</span>
                      </div>
                      <div className="space-y-1.5">
                        {stage.gitCommands.map((cmd, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-teal-300"
                          >
                            <span>{cmd}</span>
                            <button
                              onClick={() => copyToClipboard(cmd, `cmd-${stage.id}-${i}`)}
                              className="text-slate-400 hover:text-teal-300"
                              title="Copy command"
                            >
                              {copiedCmd === `cmd-${stage.id}-${i}` ? (
                                <Check className="w-3.5 h-3.5 text-teal-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contributor Personal Notes for this stage */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-medium text-slate-400 block">
                      My Notes for Stage {stage.id} (Saved in session):
                    </label>
                    <textarea
                      value={notes[stage.id] || ''}
                      onChange={(e) => setNotes({ ...notes, [stage.id]: e.target.value })}
                      placeholder="Add reminders, links, branch names, or questions for maintainers..."
                      rows={2}
                      className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-teal-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
