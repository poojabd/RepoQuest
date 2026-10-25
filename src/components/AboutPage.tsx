import React, { useState } from 'react';
import { 
  Sparkles, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  Copy, 
  Check, 
  ExternalLink 
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-widest mb-1.5">
          <Sparkles className="w-4 h-4" />
          <span>PROJECT MISSION & ARCHITECTURE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          ABOUT <span className="text-teal-400">REPOQUEST</span>
        </h1>
        <p className="text-base text-slate-300 mt-2 max-w-3xl leading-relaxed">
          RepoQuest was built to eliminate the anxiety and intimidation beginner developers face when trying to make their first open-source contributions.
        </p>
      </div>

      {/* The Core Problem & Our Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* The Problem */}
        <div className="p-6 rounded-2xl bg-[#090d16] border border-red-500/20 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-red-400">
            THE PROBLEM
          </div>
          <h3 className="text-xl font-bold text-white">
            Why Open Source Feels Intimidating
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            GitHub was engineered for experienced practitioners. Beginners often face:
          </p>
          <ul className="space-y-2 text-xs text-slate-400 list-disc list-inside">
            <li>Cryptic folder structures and massive codebases with zero orientation.</li>
            <li>Dense README files loaded with technical jargon and undocumented prerequisites.</li>
            <li>Difficulty finding genuine first-timer issues (labels like "good first issue" are often abandoned or surprisingly complex).</li>
            <li>Fear of submitting an incorrect pull request and facing public criticism.</li>
          </ul>
        </div>

        {/* Our Solution */}
        <div className="p-6 rounded-2xl bg-[#090d16] border border-teal-500/30 space-y-4 shadow-[0_0_30px_rgba(20,184,166,0.1)]">
          <div className="text-xs font-bold uppercase tracking-wider text-teal-400">
            OUR SOLUTION
          </div>
          <h3 className="text-xl font-bold text-white">
            How RepoQuest Empowers Newcomers
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            RepoQuest provides an approachable, mentor-like layer on top of GitHub:
          </p>
          <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
            <li><strong>AI Repository Analyzer:</strong> Converts repository structures and READMEs into beginner-friendly explanations.</li>
            <li><strong>File Purpose Mapping:</strong> Identifies which files exist and explains what role they serve.</li>
            <li><strong>Beginner Issue Finder:</strong> Analyzes open tickets and explains what problem needs solving in 5 practical points.</li>
            <li><strong>Interactive Roadmap:</strong> Guides users step-by-step through forks, local branches, tests, and clean PR submissions.</li>
          </ul>
        </div>
      </div>

      {/* Target Audience */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">
          Who Is RepoQuest Designed For?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-teal-300">College Students</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Students preparing for internships or software engineering careers who want real public portfolio contributions.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-teal-300">Self-Taught Developers</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bootcamp grads and learners transitioning from solo toy tutorials to collaborating on team codebases.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-teal-300">Hackathon Participants</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Teams looking for reliable open-source dependencies or seeking open bounties and issues during sprint events.
            </p>
          </div>
        </div>
      </div>

      {/* Local AI Architecture with Ollama */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#090d16] border border-teal-500/30 space-y-6">
        <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>LOCAL AI ARCHITECTURE</span>
        </div>
        <h2 className="text-2xl font-bold text-white">
          Powered by Local Open-Weight AI (Ollama + Qwen3)
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Unlike apps that force you to buy expensive cloud subscriptions or compromise your code privacy, RepoQuest is architected from the ground up to pair with a lightweight, locally running model on your computer:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-xs font-bold text-white">100% Free & Open-Source</div>
            <p className="text-xs text-slate-400">
              Runs on open weights using Ollama. No subscription, credit card, or recurring fees.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-xs font-bold text-white">Privacy First</div>
            <p className="text-xs text-slate-400">
              Your inquiries and code analysis stay on your local Windows laptop without tracking.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-xs font-bold text-white">Ultra-Lightweight (0.6B)</div>
            <p className="text-xs text-slate-400">
              <code className="text-teal-300">qwen3:0.6b</code> consumes less than 1GB of RAM and runs smoothly on standard modern laptops without requiring dedicated GPUs.
            </p>
          </div>
        </div>

        {/* Windows PowerShell Setup Commands */}
        <div className="pt-4 space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-teal-400" />
            Quick Windows PowerShell Setup
          </h4>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span># Run the model locally in Ollama</span>
              <button
                onClick={() => copyToClipboard('ollama run qwen3:0.6b', 'about1')}
                className="text-teal-400 hover:text-teal-300 flex items-center gap-1"
              >
                {copiedCmd === 'about1' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd === 'about1' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-teal-300 select-all">ollama run qwen3:0.6b</div>

            <div className="flex items-center justify-between text-slate-400 pt-2 border-t border-slate-800">
              <span># Allow local web app requests (PowerShell)</span>
              <button
                onClick={() => copyToClipboard('$env:OLLAMA_ORIGINS="*"; ollama serve', 'about2')}
                className="text-teal-400 hover:text-teal-300 flex items-center gap-1"
              >
                {copiedCmd === 'about2' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd === 'about2' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-teal-300 select-all">$env:OLLAMA_ORIGINS="*"; ollama serve</div>
          </div>
        </div>
      </div>
    </div>
  );
};
