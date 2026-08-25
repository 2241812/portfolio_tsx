"use client";
import React, { useEffect, useRef, memo } from 'react';
import { animate, stagger } from 'animejs';
import { useInView } from '@/hooks/useInView';
import { Activity } from 'lucide-react';

export const AnimeTelemetryCard = memo(function AnimeTelemetryCard() {
  const { ref: containerRef, isInView } = useInView({ rootMargin: '100px', once: true });
  const commitCountRef = useRef<HTMLSpanElement>(null);
  const repoCountRef = useRef<HTMLSpanElement>(null);
  const waveBarsRef = useRef<SVGGElement>(null);

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
      className="blk-card p-3 sm:p-3.5 w-full sm:w-auto min-w-[280px] sm:min-w-[340px] flex items-center justify-between gap-4 relative select-none"
    >
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
        <div className="text-[8px] font-mono text-zinc-400 tracking-wider">TELEMETRY</div>
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
  );
});

export default AnimeTelemetryCard;
