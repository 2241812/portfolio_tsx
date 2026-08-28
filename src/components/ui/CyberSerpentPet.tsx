'use client';

import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useWebMCPListener } from '@/lib/webmcpEvents';
import { Sparkles, Terminal, X, ChevronUp } from 'lucide-react';

export const CyberSerpentPet = memo(function CyberSerpentPet() {
  const { activeToolCall } = useWebMCPListener();
  const prefersReducedMotion = useReducedMotion();
  const [speechText, setSpeechText] = useState<string | null>(
    'Hi. I am the Cyber Serpent. Tap me when you want the console.'
  );
  const [isAwake, setIsAwake] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [clickReaction, setClickReaction] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [roamOffset, setRoamOffset] = useState(0);
  const [roamDuration, setRoamDuration] = useState(4);
  const [isFacingLeft, setIsFacingLeft] = useState(false);
  const lastRoamOffsetRef = useRef(0);

  // Initial welcome message timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setSpeechText(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  // A small, irregular blink gives the companion a living idle rhythm.
  useEffect(() => {
    if (prefersReducedMotion) return;

    let blinkTimer: ReturnType<typeof setTimeout>;
    let openTimer: ReturnType<typeof setTimeout>;
    const blink = () => {
      setIsBlinking(true);
      openTimer = setTimeout(() => setIsBlinking(false), 140);
      blinkTimer = setTimeout(blink, 2600 + Math.random() * 2600);
    };

    blinkTimer = setTimeout(blink, 2200);
    return () => {
      clearTimeout(blinkTimer);
      clearTimeout(openTimer);
    };
  }, [prefersReducedMotion]);

  // Wander slowly across the lower edge like a small desk companion. The
  // right-side anchor keeps the pet in the viewport while the travel range
  // leaves room for the speech bubble on both desktop and mobile.
  useEffect(() => {
    if (prefersReducedMotion || isMinimized) {
      lastRoamOffsetRef.current = 0;
      return;
    }

    let roamTimer: ReturnType<typeof setTimeout>;
    let isCancelled = false;

    const chooseNextStop = () => {
      if (isCancelled || typeof window === 'undefined') return;

      const isMobile = window.innerWidth < 640;
      const sidePadding = isMobile ? 32 : 48;
      const speechWidth = isMobile ? 220 : 250;
      const maxTravel = Math.max(0, window.innerWidth - speechWidth - sidePadding);
      const previousOffset = lastRoamOffsetRef.current;
      const nextOffset = -Math.round(Math.random() * maxTravel);

      setIsFacingLeft(nextOffset < previousOffset);
      setRoamDuration(Math.min(8, Math.max(3.5, Math.abs(nextOffset - previousOffset) / 120)));
      lastRoamOffsetRef.current = nextOffset;
      setRoamOffset(nextOffset);
      roamTimer = setTimeout(chooseNextStop, 8000 + Math.random() * 3500);
    };

    roamTimer = setTimeout(chooseNextStop, 2200);
    return () => {
      isCancelled = true;
      clearTimeout(roamTimer);
    };
  }, [isMinimized, prefersReducedMotion]);

  const effectiveRoamOffset = prefersReducedMotion || isMinimized ? 0 : roamOffset;

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
        get_telemetry: '> Kinetic telemetry stream synced for Baguio City...',
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
        setSpeechText('> Opening the console. I will keep watch.');
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
    <motion.div
      className="fixed bottom-4 right-4 sm:right-6 z-40 select-none flex flex-col items-end pointer-events-none"
      animate={{ x: effectiveRoamOffset }}
      transition={{
        x: { duration: prefersReducedMotion || isMinimized ? 0 : roamDuration, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      {/* Interactive Speech / Thought Bubble */}
      <AnimatePresence>
        {speechText && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="pointer-events-auto mb-1.5 max-w-[220px] sm:max-w-[250px] p-2.5 bg-black/95 backdrop-blur-md border border-emerald-400/40 shadow-2xl text-xs font-mono text-white relative rounded-2xl rounded-br-sm"
          >
            {/* Corner Crosshairs */}
            <span className="absolute -top-1 -left-1 text-[9px] text-emerald-400 font-bold">+</span>
            <span className="absolute -top-1 -right-1 text-[9px] text-emerald-400 font-bold">+</span>
            <span className="absolute -bottom-1 -left-1 text-[9px] text-emerald-400 font-bold">+</span>
            <span className="absolute -bottom-1 -right-1 text-[9px] text-emerald-400 font-bold">+</span>

            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 mb-1.5 text-[9px] text-zinc-400">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <Terminal className="w-3 h-3" />
                <span>CYBER SERPENT</span>
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

      {/* Pet controls are siblings so the interactive button has no nested buttons. */}
      <div className="relative group">
        {/* Minimize helper button on top right */}
        <button
          type="button"
          onClick={() => setIsMinimized(true)}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#14141c] hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/20 rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 transition-opacity cursor-pointer z-20"
          title="Minimize Serpent Pet"
          aria-label="Minimize Cyber Serpent pet"
        >
          ×
        </button>

        {/* Cyber Serpent Container */}
        <motion.button
          type="button"
          animate={{
            y: prefersReducedMotion ? 0 : isAwake ? [0, -6, 0] : [0, -3, 0],
            rotate: prefersReducedMotion ? 0 : clickReaction ? [0, -3, 3, 0] : 0,
            scale: clickReaction ? 1.08 : 1,
          }}
          transition={{
            y: { duration: isAwake ? 1.8 : 3.2, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'easeInOut' },
            rotate: { duration: 0.35 },
            scale: { duration: 0.2 },
          }}
          className="pointer-events-auto relative group appearance-none border-0 bg-transparent p-0 text-inherit cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 focus-visible:outline-offset-4"
          onClick={handleClickPet}
          aria-label="Open WebMCP agent console and inquiry hub"
          title="WebMCP Cyber Serpent // Open Agent Screen & Dispatch Hub"
        >
        {/* Card Frame */}
        <div
          className={`w-24 h-24 sm:w-28 sm:h-28 rounded-[38%] bg-gradient-to-br from-[#161621] via-[#09090e] to-[#071c1a] backdrop-blur-md border p-2 flex items-center justify-center relative shadow-2xl transition-all duration-300 ${
            isAwake
              ? 'border-emerald-400/70 shadow-emerald-950/50 shadow-lg'
              : 'border-white/20 hover:border-white/50'
          }`}
        >
          {/* SVG Cyber Serpent companion with a readable face and coiled body */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full overflow-visible"
            style={{ transform: isFacingLeft ? 'scaleX(-1)' : undefined }}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ambient companion glow */}
            <circle
              cx="50"
              cy="48"
              r="27"
              fill={isAwake ? '#10b981' : '#ffffff'}
              fillOpacity={isAwake ? '0.14' : '0.04'}
              className="transition-colors duration-500"
            />

            {/* Face */}
            <path
              d="M 38 42 C 39 31, 48 25, 59 27 C 70 29, 76 38, 73 49 C 70 59, 61 65, 50 62 C 40 59, 36 52, 38 42 Z"
              fill="#0a0a10"
              stroke={isAwake ? '#34d399' : '#ffffff'}
              strokeOpacity={isAwake ? 0.95 : 0.55}
              strokeWidth="1.4"
              className="transition-colors duration-300"
            />
            <g opacity={isBlinking ? 0.15 : 1} className="transition-opacity duration-100">
              <circle cx="49" cy="43" r="3" fill={isAwake ? '#34d399' : '#ffffff'} />
              <circle cx="65" cy="42" r="3" fill={isAwake ? '#34d399' : '#ffffff'} />
              <circle cx="50" cy="42" r="1" fill="#071c1a" />
              <circle cx="66" cy="41" r="1" fill="#071c1a" />
            </g>
            <path
              d="M 52 53 C 56 56, 61 56, 64 52"
              stroke={isAwake ? '#34d399' : '#ffffff'}
              strokeOpacity="0.8"
              strokeWidth="1.4"
              strokeLinecap="round"
              className="transition-colors duration-300"
            />

            {/* Dashed Coiled Chain-Snake Body */}
            {/* Segment 1: Outer lower loop */}
            <motion.path
              d="M 32 82 C 38 88, 48 80, 56 78 C 66 76, 76 74, 78 64 C 80 56, 74 54, 68 56"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeDasharray="5 3"
              strokeLinecap="round"
              animate={prefersReducedMotion ? undefined : { strokeDashoffset: [0, -32] }}
              transition={{ duration: 3, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'linear' }}
              strokeOpacity={isAwake ? 0.95 : 0.8}
            />

            {/* Segment 2: Left upward coil */}
            <motion.path
              d="M 32 82 C 24 74, 20 62, 22 50 C 24 38, 30 30, 42 24 C 48 20, 56 20, 64 24"
              stroke="#ffffff"
              strokeWidth="2.4"
              strokeDasharray="5 3"
              strokeLinecap="round"
              animate={prefersReducedMotion ? undefined : { strokeDashoffset: [0, -32] }}
              transition={{ duration: 3.2, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'linear' }}
              strokeOpacity={isAwake ? 1 : 0.85}
            />

            {/* Segment 3: Upper head & serpent coil */}
            <motion.path
              d="M 64 24 C 74 28, 80 34, 76 42 C 72 48, 62 46, 56 40 C 52 34, 58 26, 68 28 C 76 30, 82 36, 80 44"
              stroke={isAwake ? '#34d399' : '#ffffff'}
              strokeWidth="2.4"
              strokeDasharray="4 2.5"
              strokeLinecap="round"
              animate={prefersReducedMotion ? undefined : { strokeDashoffset: [0, -32] }}
              transition={{ duration: 2.8, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'linear' }}
              className="transition-colors duration-300"
            />

            {/* Forked Tongue */}
            <motion.path
              d="M 74 44 L 78 50 M 78 50 L 76 54 M 78 50 L 82 53"
              stroke={isAwake ? '#34d399' : '#ffffff'}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={prefersReducedMotion ? undefined : { opacity: isAwake ? [1, 0.4, 1] : [0.7, 0.2, 0.7] }}
              transition={{ duration: 0.6, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
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

          {/* Quick interaction hint */}
          <div className="absolute -bottom-2 px-1.5 py-0.5 bg-black border border-white/20 text-[8px] font-mono text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-400/50 transition-colors uppercase flex items-center gap-0.5">
            <Sparkles className="w-2 h-2 text-emerald-400" />
            <span>TAP TO OPEN</span>
          </div>
        </div>
          </motion.button>
      </div>
    </motion.div>
  );
});

export default CyberSerpentPet;
