/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ExplorePage } from './components/ExplorePage';
import { AnalyzerPage } from './components/AnalyzerPage';
import { IssuesPage } from './components/IssuesPage';
import { RoadmapPage } from './components/RoadmapPage';
import { AboutPage } from './components/AboutPage';
import { Footer } from './components/Footer';
import { OllamaModal } from './components/OllamaModal';
import { OllamaStatus } from './types';
import { checkOllamaStatus } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus | null>(null);
  const [isOllamaModalOpen, setIsOllamaModalOpen] = useState<boolean>(false);
  const [selectedRepoUrl, setSelectedRepoUrl] = useState<string>('');
  const [activeRoadmapRepo, setActiveRoadmapRepo] = useState<string>('');
  const [activeRoadmapIssue, setActiveRoadmapIssue] = useState<string>('');

  // Initial check for local Ollama server
  useEffect(() => {
    const fetchStatus = async () => {
      const status = await checkOllamaStatus();
      setOllamaStatus(status);
    };
    fetchStatus();
  }, []);

  const handleNavigateToAnalyzer = (repoUrl: string) => {
    setSelectedRepoUrl(repoUrl);
    setActiveTab('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToRoadmap = (repoName: string) => {
    setActiveRoadmapRepo(repoName);
    setActiveTab('roadmap');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddIssueToRoadmap = (issueTitle: string, repoName: string) => {
    setActiveRoadmapIssue(issueTitle);
    if (repoName) {
      setActiveRoadmapRepo(repoName);
    }
    setActiveTab('roadmap');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ollamaStatus={ollamaStatus}
        onOpenOllamaModal={() => setIsOllamaModalOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HeroSection
            onNavigate={setActiveTab}
            onSelectRepoForAnalysis={handleNavigateToAnalyzer}
            ollamaStatus={ollamaStatus}
            onOpenOllamaModal={() => setIsOllamaModalOpen(true)}
          />
        )}

        {activeTab === 'explore' && (
          <ExplorePage onAnalyzeRepo={handleNavigateToAnalyzer} />
        )}

        {activeTab === 'analyzer' && (
          <AnalyzerPage
            initialRepoUrl={selectedRepoUrl}
            onNavigateToRoadmap={handleNavigateToRoadmap}
            ollamaStatus={ollamaStatus}
            onOpenOllamaModal={() => setIsOllamaModalOpen(true)}
          />
        )}

        {activeTab === 'issues' && (
          <IssuesPage
            onAddIssueToRoadmap={handleAddIssueToRoadmap}
            ollamaStatus={ollamaStatus}
            onOpenOllamaModal={() => setIsOllamaModalOpen(true)}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapPage
            activeRepo={activeRoadmapRepo}
            activeIssue={activeRoadmapIssue}
          />
        )}

        {activeTab === 'about' && <AboutPage />}
      </main>

      {/* Footer */}
      <Footer onNavigate={setActiveTab} />

      {/* Ollama Diagnostics and Setup Modal */}
      <OllamaModal
        isOpen={isOllamaModalOpen}
        onClose={() => setIsOllamaModalOpen(false)}
        status={ollamaStatus}
        onStatusUpdated={(newStatus) => setOllamaStatus(newStatus)}
      />
    </div>
  );
}
