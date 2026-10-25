import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle, Terminal, RefreshCw, Copy, Check, Server, Sparkles } from 'lucide-react';
import { OllamaStatus } from '../types';
import { checkOllamaStatus } from '../services/api';

interface OllamaModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: OllamaStatus | null;
  onStatusUpdated: (newStatus: OllamaStatus) => void;
}

export const OllamaModal: React.FC<OllamaModalProps> = ({
  isOpen,
  onClose,
  status,
  onStatusUpdated,
}) => {
  const [checking, setChecking] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRefresh = async () => {
    setChecking(true);
    const newStatus = await checkOllamaStatus();
    onStatusUpdated(newStatus);
    setChecking(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const runCommand = `ollama run ${status?.targetModel || 'qwen3:0.6b'}`;
  const serveCommand = `$env:OLLAMA_ORIGINS="*"; ollama serve`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#090d16] border border-teal-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(20,184,166,0.15)] text-slate-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Local Ollama AI Integration
              </h3>
              <p className="text-xs text-slate-400">
                Modular connection to locally running open-weight model on Windows
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Indicator Box */}
        <div className={`p-4 rounded-xl border mb-6 ${
          status?.running 
            ? 'bg-teal-950/20 border-teal-500/40 text-teal-200' 
            : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {status?.running ? (
                <CheckCircle className="w-6 h-6 text-teal-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
              )}
              <div>
                <p className="font-semibold text-white">
                  {status?.running ? 'Ollama is Active and Connected' : 'Ollama is Offline / Unreachable'}
                </p>
                <p className="text-xs text-slate-300 mt-0.5">
                  Host: <code className="text-teal-300 bg-slate-900/80 px-1.5 py-0.5 rounded">{status?.host || 'http://localhost:11434'}</code>
                  {' · '}
                  Target Model: <code className="text-teal-300 bg-slate-900/80 px-1.5 py-0.5 rounded">{status?.targetModel || 'qwen3:0.6b'}</code>
                </p>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={checking}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
              {checking ? 'Checking...' : 'Test Connection'}
            </button>
          </div>

          {status?.running && status?.models?.length ? (
            <div className="mt-3 pt-3 border-t border-teal-500/20 text-xs">
              <span className="text-slate-400">Detected local models: </span>
              <span className="text-teal-300 font-mono">{status.models.join(', ')}</span>
            </div>
          ) : null}
        </div>

        {/* Windows Quick Setup Instructions */}
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-teal-400" />
            Quick Setup for Windows (PowerShell)
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            RepoQuest communicates with your locally running Ollama instance via the backend proxy. Follow these simple steps in Windows PowerShell to pull and run the target model:
          </p>

          {/* Step 1 */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Step 1: Download & run Qwen3 (0.6B) model</span>
              <button
                onClick={() => copyToClipboard(runCommand, 'step1')}
                className="flex items-center gap-1 text-teal-400 hover:text-teal-300"
              >
                {copiedCmd === 'step1' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCmd === 'step1' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <code className="block text-xs font-mono text-teal-300 select-all">
              {runCommand}
            </code>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Step 2: Allow local server origins (Windows PowerShell)</span>
              <button
                onClick={() => copyToClipboard(serveCommand, 'step2')}
                className="flex items-center gap-1 text-teal-400 hover:text-teal-300"
              >
                {copiedCmd === 'step2' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCmd === 'step2' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <code className="block text-xs font-mono text-teal-300 select-all">
              {serveCommand}
            </code>
          </div>
        </div>

        {/* Architecture Note */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2 text-white font-medium">
            <Sparkles className="w-4 h-4 text-teal-400" />
            Transparent Execution Architecture
          </div>
          <p>
            • When Ollama is active, RepoQuest sends structured prompts directly to <code className="text-teal-300">qwen3:0.6b</code>.
          </p>
          <p>
            • When Ollama is offline, RepoQuest performs <strong>deterministic heuristic extraction</strong> directly from live GitHub API data, so you are never left with broken UI or hallucinated responses.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium text-slate-900 bg-teal-400 hover:bg-teal-300 rounded-lg transition-colors font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
