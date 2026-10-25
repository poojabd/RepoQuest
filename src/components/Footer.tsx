import React from 'react';
import { Compass, Github, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#06080d] py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/60">
          {/* Brand Column */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Repo<span className="text-teal-400">Quest</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Explore repositories. Discover issues. Start contributing. An open-source discovery platform designed for students and beginner developers.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Features</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => { onNavigate('explore'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-teal-300 transition-colors"
                >
                  Explore Repositories
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('analyzer'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-teal-300 transition-colors"
                >
                  AI Repository Analyzer
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('issues'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-teal-300 transition-colors"
                >
                  Beginner Issue Finder
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('roadmap'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-teal-300 transition-colors"
                >
                  Contribution Roadmap
                </button>
              </li>
            </ul>
          </div>

          {/* AI & Open Source */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Local AI Stack</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-300">Ollama Runtime</span> (localhost:11434)
              </li>
              <li>
                <span className="text-slate-300">Target Model:</span> Qwen3 (0.6B)
              </li>
              <li>
                <span className="text-slate-300">GitHub Public API:</span> REST v3
              </li>
              <li>
                <span className="text-slate-300">Architecture:</span> Zero-cloud privacy
              </li>
            </ul>
          </div>

          {/* Project Details */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Hackathon Project</h4>
            <p className="text-slate-400 leading-relaxed">
              Built for students, first-time open-source contributors, and hackathon competitors preparing their first pull request.
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-teal-400 font-medium">
              <Heart className="w-3.5 h-3.5 text-teal-400 fill-teal-400/20" />
              <span>Free & Open Access for Everyone</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} RepoQuest. Open-source under MIT License.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => { onNavigate('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-slate-300 transition-colors"
            >
              About & Setup
            </button>
            <span>·</span>
            <span>Windows / macOS / Linux Compatible</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
