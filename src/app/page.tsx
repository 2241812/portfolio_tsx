"use client";
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
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
    <div className="min-h-screen bg-[#09090b] text-zinc-200 font-mono relative selection:bg-zinc-800 selection:text-white overflow-x-hidden cyber-grid-pattern">
      {/* Ambient Monochrome Glow */}
      <div className="cyber-ambient-aurora" aria-hidden="true" />

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
            {/* Minimalist Monochrome Hero Banner */}
            <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-4">
              <div className="cyber-glass-card rounded-xl p-5 sm:p-8 relative overflow-hidden shadow-2xl">
                {/* Minimalist Corner Brackets */}
                <div className="cyber-bracket-tl" />
                <div className="cyber-bracket-br" />

                <div className="relative z-10 space-y-5">
                  {/* Top Prompt Line */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-3 gap-2">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-zinc-200 font-bold">$</span>
                      <span className="text-zinc-300">whoami &amp;&amp; cat /etc/motd</span>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono tracking-wider">
                      TERMINAL // PRESS [?] FOR SHORTCUTS
                    </span>
                  </div>

                  {/* Hero Title & Identity */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-1">
                    <div className="space-y-1.5">
                      <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-mono">
                        {resumeData.personalInfo.name}
                      </h1>
                      <p className="text-xs sm:text-sm text-zinc-400 font-mono flex items-center gap-2">
                        <span className="text-zinc-200 font-semibold">{resumeData.personalInfo.title}</span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-400">Systems Architecture &amp; Automation</span>
                      </p>
                    </div>

                    {/* Quick Command Action Chips */}
                    <div className="flex flex-wrap gap-2 text-xs font-mono">
                      <button
                        onClick={() => setActiveSection('projects')}
                        className="px-3.5 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
                      >
                        <span>★ Top 3 Projects</span>
                        <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-800">[2]</kbd>
                      </button>
                      <button
                        onClick={() => setActiveSection('skills')}
                        className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 transition-all cursor-pointer flex items-center gap-2"
                      >
                        <span>Skills Matrix</span>
                        <kbd className="text-[10px] px-1 rounded bg-black/40 text-zinc-500">[3]</kbd>
                      </button>
                      <button
                        onClick={() => setIsCommandOpen(true)}
                        className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 transition-all cursor-pointer flex items-center gap-2"
                      >
                        <span className="text-zinc-400 font-bold">:</span>
                        <span>CLI Prompt</span>
                        <kbd className="text-[10px] px-1 rounded bg-black/40 text-zinc-500">[:]</kbd>
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
          <div className="fixed bottom-0 left-0 w-full z-40 bg-[#0c0d10]/95 backdrop-blur border-t border-zinc-800 px-4 py-1.5 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <div className="flex items-center gap-3">
              <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 text-[10px] font-bold">
                NORMAL
              </span>
              <span className="hidden sm:inline text-zinc-500">utf-8</span>
              <span className="hidden md:inline text-zinc-700">|</span>
              <span className="text-zinc-300">
                active: <span className="text-white font-bold">{activeSection}</span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-zinc-500">
              <span className="hidden lg:inline">[j/k] Navigate</span>
              <span className="hidden lg:inline">[1-6] Jump</span>
              <button
                onClick={() => setIsCommandOpen(true)}
                className="hover:text-white cursor-pointer"
              >
                [:] Command
              </button>
              <button
                onClick={() => setIsHelpOpen(true)}
                className="hover:text-white cursor-pointer"
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
