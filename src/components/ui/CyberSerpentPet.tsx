'use client';

import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebMCPListener } from '@/lib/webmcpEvents';
import { Sparkles, Terminal, X, ChevronUp } from 'lucide-react';

export const CyberSerpentPet = memo(function CyberSerpentPet() {
  const { activeToolCall } = useWebMCPListener();
  const [speechText, setSpeechText] = useState<string | null>(
    'WebMCP Agent Active. Click me to inspect tools!'
  );
  const [isAwake, setIsAwake] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [clickReaction, setClickReaction] = useState(false);

  // Initial welcome message timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setSpeechText(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  // React dynamically whenever a WebMCP tool is called
  useEffect(() => {
    if (!activeToolCall) return;

    const wakeTimer = setTimeout(() => {
      setIsAwake(true);
      const thoughts: Record<string, string> = {
        get_portfolio_overview: '> Auditing full systems profile & specializations...',
        get_profile: '> Loading declared credentials & engineering statement...',
        get_skills: '> Scanning Go, Dart, Python, and Docker competencies...',
        get_projects: '> Cross-referencing project archive & architecture proofs...',
        get_project_details: `> Deep-diving into project specifications...`,
        get_education: '> Reading declared Saint Louis University BS CS information...',
        get_github_stats: '> Querying public GitHub activity...',
        search_portfolio: `> WebMCP query: "${activeToolCall.summary || 'searching'}"...`,
        send_inquiry: '> Sending inquiry through the configured email service...',
        download_resume: '> Serving the available PDF resume artifact...',
        get_telemetry: '> Kinetic telemetry stream synced [Baguio City 16.40°N]...',
      };

      const message = thoughts[activeToolCall.tool] || `> Executed ${activeToolCall.tool}()`;
      setSpeechText(message);
    }, 10);

    const hideTimer = setTimeout(() => {
      setSpeechText(null);
      setIsAwake(false);
    }, 5500);

    return () => {
      clearTimeout(wakeTimer);
      clearTimeout(hideTimer);
    };
  }, [activeToolCall]);

  const handleClickPet = () => {
    setClickReaction(true);
    setSpeechText('> Launching WebMCP Agent Console & Recruiter Screen!');
    setTimeout(() => setClickReaction(false), 600);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('webmcp:open-simulator'));
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 sm:right-6 z-40 select-none">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#09090d] hover:bg-[#15151c] text-white border border-white/20 text-[10px] font-mono shadow-xl transition-all cursor-pointer"
          title="Restore WebMCP Cyber Serpent"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>SERPENT PET</span>
          <ChevronUp className="w-3 h-3 text-zinc-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:right-6 z-40 select-none flex flex-col items-end pointer-events-none">
      {/* Interactive Speech / Thought Bubble */}
      <AnimatePresence>
        {speechText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="pointer-events-auto mb-2 max-w-[260px] sm:max-w-[300px] p-3 bg-black/95 backdrop-blur-md border border-emerald-400/40 shadow-2xl text-xs font-mono text-white relative rounded-none"
          >
            {/* Corner Crosshairs */}
            <span className="absolute -top-1 -left-1 text-[9px] text-emerald-400 font-bold">+</span>
            <span className="absolute -top-1 -right-1 text-[9px] text-emerald-400 font-bold">+</span>
            <span className="absolute -bottom-1 -left-1 text-[9px] text-emerald-400 font-bold">+</span>
            <span className="absolute -bottom-1 -right-1 text-[9px] text-emerald-400 font-bold">+</span>

            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 mb-1.5 text-[9px] text-zinc-400">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <Terminal className="w-3 h-3" />
                <span>AGENT SERPENT</span>
              </span>
              <button
                onClick={() => setSpeechText(null)}
                className="text-zinc-500 hover:text-white cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <p className="text-[11px] text-zinc-200 leading-snug font-mono">
              {speechText}
            </p>

            {/* Bubble arrow pointing down to pet */}
            <div className="absolute -bottom-2 right-8 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-emerald-400/60" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cyber Serpent Container */}
      <motion.div
        animate={{
          y: isAwake ? [0, -6, 0] : [0, -3, 0],
          scale: clickReaction ? 1.08 : 1,
        }}
        transition={{
          y: { duration: isAwake ? 1.8 : 3.2, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: 0.2 },
        }}
        className="pointer-events-auto relative group cursor-pointer"
        onClick={handleClickPet}
        role="button"
        tabIndex={0}
        aria-label="Open WebMCP agent console and inquiry hub"
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClickPet();
          }
        }}
        title="WebMCP Cyber Serpent // Open Agent Screen & Dispatch Hub"
      >
        {/* Card Frame */}
        <div
          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#09090e]/95 backdrop-blur-md border p-2 flex items-center justify-center relative shadow-2xl transition-all duration-300 ${
            isAwake
              ? 'border-emerald-400/70 shadow-emerald-950/50 shadow-lg'
              : 'border-white/20 hover:border-white/50'
          }`}
        >
          {/* Minimize helper button on top right */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(true);
            }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#14141c] hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/20 rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20"
            title="Minimize Serpent Pet"
          >
            ×
          </button>

          {/* SVG Vector Recreation of Cyber Serpent around Terminal */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ambient Background Glow for Terminal */}
            <circle
              cx="50"
              cy="55"
              r="24"
              fill={isAwake ? '#10b981' : '#ffffff'}
              fillOpacity={isAwake ? '0.14' : '0.04'}
              className="transition-colors duration-500"
            />

            {/* Inner Terminal Screen Box */}
            <rect
              x="36"
              y="44"
              width="28"
              height="24"
              rx="4"
              stroke={isAwake ? '#34d399' : '#ffffff'}
              strokeWidth="1.8"
              strokeDasharray="4 2"
              fill="#060609"
              fillOpacity="0.9"
              className="transition-colors duration-300"
            />

            {/* Terminal Prompt '> _' */}
            <text
              x="42"
              y="60"
              fill={isAwake ? '#34d399' : '#ffffff'}
              fontSize="12"
              fontFamily="monospace"
              fontWeight="bold"
              className="transition-colors duration-300"
            >
              &gt;
            </text>
            <motion.rect
              x="53"
              y="59"
              width="6"
              height="1.5"
              fill={isAwake ? '#34d399' : '#ffffff'}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
            />

            {/* Dashed Coiled Chain-Snake Body */}
            {/* Segment 1: Outer lower loop */}
            <motion.path
              d="M 32 82 C 38 88, 48 80, 56 78 C 66 76, 76 74, 78 64 C 80 56, 74 54, 68 56"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeDasharray="5 3"
              strokeLinecap="round"
              animate={{ strokeDashoffset: [0, -32] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              strokeOpacity={isAwake ? 0.95 : 0.8}
            />

            {/* Segment 2: Left upward coil */}
            <motion.path
              d="M 32 82 C 24 74, 20 62, 22 50 C 24 38, 30 30, 42 24 C 48 20, 56 20, 64 24"
              stroke="#ffffff"
              strokeWidth="2.4"
              strokeDasharray="5 3"
              strokeLinecap="round"
              animate={{ strokeDashoffset: [0, -32] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
              strokeOpacity={isAwake ? 1 : 0.85}
            />

            {/* Segment 3: Upper head & serpent coil */}
            <motion.path
              d="M 64 24 C 74 28, 80 34, 76 42 C 72 48, 62 46, 56 40 C 52 34, 58 26, 68 28 C 76 30, 82 36, 80 44"
              stroke={isAwake ? '#34d399' : '#ffffff'}
              strokeWidth="2.4"
              strokeDasharray="4 2.5"
              strokeLinecap="round"
              animate={{ strokeDashoffset: [0, -32] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
              className="transition-colors duration-300"
            />

            {/* Snake Eye 1 (Left) */}
            <circle
              cx="63"
              cy="34"
              r="1.8"
              fill={isAwake ? '#34d399' : '#ffffff'}
              className="transition-colors duration-300"
            />

            {/* Snake Eye 2 (Right) */}
            <circle
              cx="75"
              cy="36"
              r="1.8"
              fill={isAwake ? '#34d399' : '#ffffff'}
              className="transition-colors duration-300"
            />

            {/* Forked Tongue */}
            <motion.path
              d="M 74 44 L 78 50 M 78 50 L 76 54 M 78 50 L 82 53"
              stroke={isAwake ? '#34d399' : '#ffffff'}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ opacity: isAwake ? [1, 0.4, 1] : [0.7, 0.2, 0.7] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
              className="transition-colors duration-300"
            />
          </svg>

          {/* Active Pulse Aura */}
          {isAwake && (
            <span className="absolute -top-1 -left-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          )}

          {/* Quick Click Me Tag */}
          <div className="absolute -bottom-2 px-1.5 py-0.5 bg-black border border-white/20 text-[8px] font-mono text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-400/50 transition-colors uppercase flex items-center gap-0.5">
            <Sparkles className="w-2 h-2 text-emerald-400" />
            <span>AGENT PET</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

export default CyberSerpentPet;
