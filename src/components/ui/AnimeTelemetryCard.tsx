"use client";
import React, { useEffect, useRef, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { animate, stagger } from 'animejs';
import { useInView } from '@/hooks/useInView';
import { Activity, GitCommit, Terminal, ExternalLink, Cpu } from 'lucide-react';
import { useGitHubActivity } from '@/hooks/useGitHubData';

export const AnimeTelemetryCard = memo(function AnimeTelemetryCard() {
  const { ref: containerRef, isInView } = useInView({ rootMargin: '100px', once: true });
  const [isHovered, setIsHovered] = useState(false);
  const commitCountRef = useRef<HTMLSpanElement>(null);
  const repoCountRef = useRef<HTMLSpanElement>(null);
  const waveBarsRef = useRef<SVGGElement>(null);

  // Real-time GitHub Activity fallback
  const { events } = useGitHubActivity('narcisoJavier', isInView);

  const latestCommit = events?.[0]?.payload?.commits?.[0]?.message || 'feat: spotlight emphasis & enlarged vector animations';
  const latestSha = events?.[0]?.payload?.commits?.[0]?.sha?.substring(0, 7) || '64dbc35';
  const latestRepo = events?.[0]?.repo?.name?.split('/')[1] || 'larp-portfolio-vc';

  useEffect(() => {
    if (!isInView) return;

    // 1. Number count-up animations using Anime.js
    const countObj = { commits: 0, repos: 0 };

    animate(countObj, {
      commits: 240,
      repos: 25,
      duration: 1600,
      ease: 'outExpo',
      onUpdate: () => {
        if (commitCountRef.current) {
          commitCountRef.current.textContent = `${Math.round(countObj.commits)}+`;
        }
        if (repoCountRef.current) {
          repoCountRef.current.textContent = `${Math.round(countObj.repos)}`;
        }
      },
    });

    // 2. Continuous kinetic equalizer wave animation using Anime.js
    if (waveBarsRef.current) {
      const bars = waveBarsRef.current.querySelectorAll('rect');
      animate(bars, {
        scaleY: [
          () => 0.2 + Math.random() * 0.3,
          () => 0.7 + Math.random() * 0.3,
          () => 0.3 + Math.random() * 0.4,
          () => 0.8 + Math.random() * 0.2,
        ],
        transformOrigin: 'bottom',
        duration: 1200,
        ease: 'easeInOutSine',
        delay: stagger(90),
        loop: true,
        alternate: true,
      });
    }
  }, [isInView]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative select-none"
    >
      {/* Primary Card */}
      <div className="blk-card p-3 sm:p-3.5 w-full sm:w-auto min-w-[280px] sm:min-w-[340px] flex items-center justify-between gap-4 relative cursor-pointer group transition-colors duration-200 hover:border-white/30">
        {/* blkUI Corner Crosshairs */}
        <span className="blk-crosshair-tl">+</span>
        <span className="blk-crosshair-tr">+</span>
        <span className="blk-crosshair-bl">+</span>
        <span className="blk-crosshair-br">+</span>
        <div className="kokonut-spotlight-layer" />

        {/* Left: Metrics */}
        <div className="relative z-10 flex items-center gap-4 sm:gap-6 font-mono divide-x divide-white/10">
          {/* Metric 1: Commits */}
          <div className="space-y-0.5">
            <div className="text-[9px] text-zinc-400 uppercase tracking-widest flex items-center gap-1">
              <Activity className="w-2.5 h-2.5 text-emerald-400" />
              <span>COMMITS</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span ref={commitCountRef} className="text-lg sm:text-xl font-extrabold text-white">
                240+
              </span>
              <span className="text-[9px] text-zinc-400">/ 2026</span>
            </div>
          </div>

          {/* Metric 2: Repos */}
          <div className="pl-4 sm:pl-6 space-y-0.5">
            <div className="text-[9px] text-zinc-400 uppercase tracking-widest">REPOSITORIES</div>
            <div className="flex items-baseline gap-1">
              <span ref={repoCountRef} className="text-lg sm:text-xl font-extrabold text-white">
                25
              </span>
              <span className="text-[9px] text-zinc-400">PUBLIC</span>
            </div>
          </div>
        </div>

        {/* Right: Anime.js Kinetic Equalizer Wave Visual */}
        <div className="relative z-10 flex flex-col items-end gap-1 shrink-0">
          <div className="text-[8px] font-mono text-zinc-400 tracking-wider flex items-center gap-1">
            <span>TELEMETRY</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <svg width="48" height="24" viewBox="0 0 48 24" fill="none" className="overflow-visible">
            <g ref={waveBarsRef}>
              <rect x="0" y="2" width="3" height="20" rx="1" fill="#ffffff" fillOpacity="0.4" />
              <rect x="6" y="2" width="3" height="20" rx="1" fill="#00ADD8" fillOpacity="0.8" />
              <rect x="12" y="2" width="3" height="20" rx="1" fill="#ffffff" fillOpacity="0.6" />
              <rect x="18" y="2" width="3" height="20" rx="1" fill="#00B4AB" fillOpacity="0.9" />
              <rect x="24" y="2" width="3" height="20" rx="1" fill="#3572A5" fillOpacity="0.8" />
              <rect x="30" y="2" width="3" height="20" rx="1" fill="#ffffff" fillOpacity="0.5" />
              <rect x="36" y="2" width="3" height="20" rx="1" fill="#00ADD8" fillOpacity="0.7" />
              <rect x="42" y="2" width="3" height="20" rx="1" fill="#ffffff" fillOpacity="0.3" />
            </g>
          </svg>
        </div>
      </div>

      {/* Expanded Hover Telemetry Intelligence Drawer */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full right-0 mt-2 z-50 w-[300px] sm:w-[380px] blk-card p-4 sm:p-5 space-y-3.5 bg-black/95 backdrop-blur-md border border-white/20 shadow-2xl shadow-black select-text"
          >
            {/* Popover Corner Crosshairs */}
            <span className="blk-crosshair-tl">+</span>
            <span className="blk-crosshair-tr">+</span>
            <span className="blk-crosshair-bl">+</span>
            <span className="blk-crosshair-br">+</span>

            {/* Header / Origin Status */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[10px] font-mono">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                TELEMETRY INTEL // ACTIVE
              </span>
              <span className="text-zinc-400">BAGUIO CITY [16.40°N]</span>
            </div>

            {/* Latest Commit Stream */}
            <div className="space-y-1.5 font-mono">
              <div className="text-[9px] text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <GitCommit className="w-3 h-3 text-white" />
                <span>LATEST VERIFIED COMMIT</span>
              </div>
              <div className="p-2 bg-[#0d0d12] border border-white/10 text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">* {latestSha}</span>
                  <span className="text-zinc-400">[{latestRepo}]</span>
                </div>
                <div className="text-zinc-300 text-[11px] truncate">{latestCommit}</div>
              </div>
            </div>

            {/* Systems Ecosystem Ratio */}
            <div className="space-y-1.5 font-mono">
              <div className="text-[9px] text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Cpu className="w-3 h-3 text-white" />
                <span>ARCHITECTURE ECOSYSTEM</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <div className="p-1.5 bg-[#0d0d12] border border-white/10 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00ADD8]" />
                  <span className="text-white font-bold">Go</span>
                  <span className="text-zinc-400 text-[9px]">Routing</span>
                </div>
                <div className="p-1.5 bg-[#0d0d12] border border-white/10 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00B4AB]" />
                  <span className="text-white font-bold">Dart</span>
                  <span className="text-zinc-400 text-[9px]">Mobile SSH</span>
                </div>
                <div className="p-1.5 bg-[#0d0d12] border border-white/10 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3572A5]" />
                  <span className="text-white font-bold">Python</span>
                  <span className="text-zinc-400 text-[9px]">PyQt6 &amp; CNN</span>
                </div>
                <div className="p-1.5 bg-[#0d0d12] border border-white/10 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#384d54]" />
                  <span className="text-white font-bold">Docker</span>
                  <span className="text-zinc-400 text-[9px]">DevContainers</span>
                </div>
              </div>
            </div>

            {/* Direct Profile Action Link */}
            <a
              href="https://github.com/narcisoJavier"
              target="_blank"
              rel="noopener noreferrer"
              className="blk-btn-secondary w-full py-1.5 text-[10px] flex items-center justify-center gap-2 mt-2"
            >
              <Terminal className="w-3 h-3 text-white" />
              <span>Explore GitHub Repository Hub</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default AnimeTelemetryCard;
