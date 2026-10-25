import React, { useState } from 'react';
import { Menu, X, Cpu, Compass } from 'lucide-react';
import { OllamaStatus } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  ollamaStatus: OllamaStatus | null;
  onOpenOllamaModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  ollamaStatus,
  onOpenOllamaModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore Repositories' },
    { id: 'analyzer', label: 'Repository Analyzer' },
    { id: 'issues', label: 'Find Issues' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07090e]/90 backdrop-blur-md border-b border-teal-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark (Single text element with styled accent) */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group shrink-0 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:border-teal-400 transition-colors">
              <Compass className="w-5 h-5 text-teal-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-teal-300 transition-colors whitespace-nowrap">
              Repo<span className="text-teal-400">Quest</span>
            </span>
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`whitespace-nowrap transition-colors relative py-1 focus:outline-none ${
                  activeTab === link.id
                    ? 'text-teal-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {link.label}
                {activeTab === link.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-400 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: Ollama Status button + Primary Action */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Interactive Ollama status indicator */}
            <button
              onClick={onOpenOllamaModal}
              title="Click to check Ollama local AI status or configure settings"
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded-lg border transition-all ${
                ollamaStatus?.running
                  ? 'bg-teal-950/30 border-teal-500/40 text-teal-300 hover:bg-teal-900/40'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:border-teal-500/30 hover:text-slate-200'
              }`}
            >
              <Cpu className={`w-3.5 h-3.5 ${ollamaStatus?.running ? 'text-teal-400' : 'text-slate-500'}`} />
              <span className="whitespace-nowrap">
                {ollamaStatus?.running ? 'Ollama: qwen3:0.6b' : 'Ollama: Offline'}
              </span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleNavClick('explore')}
              className="px-4 py-2 text-xs font-semibold text-slate-900 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors whitespace-nowrap shadow-[0_0_15px_rgba(45,212,191,0.2)]"
            >
              Start Exploring
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenOllamaModal}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-teal-400"
              title="Ollama Status"
            >
              <Cpu className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#090d16] border-b border-teal-500/20 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === link.id
                  ? 'bg-teal-500/10 text-teal-400 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenOllamaModal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center px-4 py-2 text-xs font-mono rounded-lg bg-slate-900 border border-slate-700 text-teal-300"
            >
              {ollamaStatus?.running ? 'Ollama AI: Connected (qwen3:0.6b)' : 'Ollama AI: Offline (Configure)'}
            </button>
            <button
              onClick={() => handleNavClick('explore')}
              className="w-full text-center px-4 py-2 text-xs font-semibold text-slate-900 bg-teal-400 rounded-lg"
            >
              Start Exploring
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
