"use client";
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '@/components/ui/TopBar';
import Sections from '@/components/ui/Sections';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ChatWidget from '@/components/ChatWidget';
import CommandPalette from '@/components/tui/CommandPalette';
import ShortcutsModal from '@/components/tui/ShortcutsModal';
import { useTuiNavigation } from '@/hooks/useTuiNavigation';
import { resumeData } from '@/data/resumeData';

export default function Home() {
  const [isSettled, setIsSettled] = useState(false);
  const {
    activeSection,
    setActiveSection,
    isCommandOpen,
    setIsCommandOpen,
    isHelpOpen,
    setIsHelpOpen,
  } = useTuiNavigation();

  const handleLoadingComplete = useCallback(() => {
    setIsSettled(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#06090e] text-slate-200 font-mono relative selection:bg-blue-950 selection:text-blue-200 overflow-x-hidden">
      {/* Ambient Dark Blue Lighting */}
      <div className="fixed inset-0 z-0 pointer-events-none tui-ambient-glow" aria-hidden="true" />

      {/* Boot Loading Screen */}
      <LoadingScreen onComplete={handleLoadingComplete} />

      {isSettled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 flex flex-col min-h-screen"
        >
          {/* Top TUI Header Bar */}
          <TopBar
            isSettled={true}
            activeSection={activeSection}
            onNavigate={setActiveSection}
            onOpenCommand={() => setIsCommandOpen(true)}
            onOpenHelp={() => setIsHelpOpen(true)}
          />

          <main id="main-content" className="relative z-20 flex-1 flex flex-col pt-16 pb-12">
            {/* Minimalist TUI Hero Banner */}
            <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-4">
              <div className="bg-[#090d16] border border-slate-800 rounded p-4 sm:p-6 relative overflow-hidden shadow-lg">
                {/* Subtle dark blue ambient light */}
                <div className="absolute top-0 right-0 w-80 h-40 bg-blue-600/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  {/* Top Prompt Line */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 border-b border-slate-800/80 pb-3 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 font-bold">$</span>
                      <span className="text-slate-300">whoami &amp;&amp; cat /etc/motd</span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      SESSION: POSIX-TUI • PRESS [?] FOR SHORTCUTS
                    </span>
                  </div>

                  {/* Hero Title & Identity */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-1">
                    <div className="space-y-1.5">
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-100 font-mono">
                        {resumeData.personalInfo.name}
                      </h1>
                      <p className="text-xs sm:text-sm text-blue-400 font-mono">
                        {resumeData.personalInfo.title} • Systems Architecture &amp; AI Automation
                      </p>
                    </div>

                    {/* Quick Command Action Chips */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      <button
                        onClick={() => setActiveSection('projects')}
                        className="px-3 py-1.5 rounded bg-blue-950/80 hover:bg-blue-900 border border-blue-700/60 text-blue-300 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span>★ Top 3 Projects</span>
                        <kbd className="text-[10px] text-blue-400/80">[2]</kbd>
                      </button>
                      <button
                        onClick={() => setActiveSection('skills')}
                        className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Skills Matrix</span>
                        <kbd className="text-[10px] text-slate-500">[3]</kbd>
                      </button>
                      <button
                        onClick={() => setIsCommandOpen(true)}
                        className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span className="text-blue-400 font-bold">:</span>
                        <span>CLI Prompt</span>
                        <kbd className="text-[10px] text-slate-500">[:]</kbd>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Modular TUI Sections */}
            <Sections />
          </main>

          {/* Bottom Vim / Tmux Statusline */}
          <div className="fixed bottom-0 left-0 w-full z-40 bg-[#06090e]/95 backdrop-blur border-t border-slate-800 px-4 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-3">
              <span className="px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">
                NORMAL
              </span>
              <span className="hidden sm:inline text-slate-500">utf-8</span>
              <span className="hidden md:inline text-slate-600">|</span>
              <span className="text-slate-300">
                active: <span className="text-blue-400 font-bold">{activeSection}</span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-slate-500">
              <span className="hidden lg:inline">[j/k] Navigate</span>
              <span className="hidden lg:inline">[1-6] Jump</span>
              <button
                onClick={() => setIsCommandOpen(true)}
                className="hover:text-blue-400 cursor-pointer"
              >
                [:] Command
              </button>
              <button
                onClick={() => setIsHelpOpen(true)}
                className="hover:text-blue-400 cursor-pointer"
              >
                [?] Help
              </button>
            </div>
          </div>

          {/* Interactive AI Chat Terminal */}
          <ChatWidget />

          {/* Interactive Command Palette */}
          <CommandPalette
            isOpen={isCommandOpen}
            onClose={() => setIsCommandOpen(false)}
            onNavigate={(id) => setActiveSection(id)}
          />

          {/* Shortcuts Help Cheat Sheet Modal */}
          <ShortcutsModal
            isOpen={isHelpOpen}
            onClose={() => setIsHelpOpen(false)}
          />
        </motion.div>
      )}
    </div>
  );
}
