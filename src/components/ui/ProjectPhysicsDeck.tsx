"use client";
import React, { useRef, useState, useEffect, useCallback, memo } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  AnimatePresence,
} from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/StudioIcons';
import { ProjectVectorVisual } from '@/components/ui/ProjectVectorVisual';

export interface DeckProjectItem {
  id: string;
  rank: string;
  title: string;
  tagline: string;
  category: 'SWE' | 'SYSTEMS';
  icon: React.ReactNode;
  tech: string[];
  description: string;
  highlights: string[];
  link?: string;
  demoLink?: string;
  badge: string;
  telemetry: {
    status: string;
    language: string;
    langColor: string;
  };
}

interface ProjectPhysicsDeckProps {
  projects: DeckProjectItem[];
  expandedProjectId: string | null;
  onToggleExpand: (id: string) => void;
}

export const ProjectPhysicsDeck = memo(function ProjectPhysicsDeck({
  projects,
  expandedProjectId,
  onToggleExpand,
}: ProjectPhysicsDeckProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxScroll, setMaxScroll] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Framer Motion Raw and Smoothed Motion Values
  const x = useMotionValue(0);
  const xVelocity = useVelocity(x);
  const smoothVelocity = useSpring(xVelocity, {
    damping: 30,
    stiffness: 280,
  });

  // Dynamic Velocity-Based Motion Skew and Tilt (Resting flat at 0°)
  const skewX = useTransform(smoothVelocity, [-1800, 0, 1800], [-3, 0, 3]);
  const rotateY = useTransform(smoothVelocity, [-1800, 0, 1800], [-4, 0, 4]);

  // Recalculate drag boundaries
  const updateConstraints = useCallback(() => {
    if (containerRef.current && trackRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const trackWidth = trackRef.current.scrollWidth;
      const overflow = Math.max(0, trackWidth - containerWidth);
      setMaxScroll(overflow);
    }
  }, []);

  useEffect(() => {
    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, [updateConstraints, projects]);

  // Track progress and update button states
  useEffect(() => {
    return x.on('change', (latestX) => {
      if (maxScroll <= 0) {
        setScrollProgress(0);
        setCanScrollLeft(false);
        setCanScrollRight(false);
        return;
      }
      const progress = Math.min(Math.max(-latestX / maxScroll, 0), 1);
      setScrollProgress(progress);
      setCanScrollLeft(latestX < -10);
      setCanScrollRight(latestX > -maxScroll + 10);
    });
  }, [x, maxScroll]);

  // Smooth Horizontal Trackpad / Shift-Wheel Handler (No vertical scroll hijacking)
  const handleWheel = (e: React.WheelEvent) => {
    if (maxScroll <= 0) return;
    // Only scroll horizontally if user is explicitly horizontal scrolling (trackpad deltaX) or holding Shift
    if (Math.abs(e.deltaX) > 0 || e.shiftKey) {
      const delta = Math.abs(e.deltaX) > 0 ? e.deltaX : e.deltaY;
      const currentX = x.get();
      const newX = Math.min(0, Math.max(-maxScroll, currentX - delta * 0.85));
      x.set(newX);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      stepScroll('left');
    } else if (e.key === 'ArrowRight') {
      stepScroll('right');
    }
  };

  // Step navigation buttons
  const stepScroll = (direction: 'left' | 'right') => {
    const cardWidth = 380;
    const currentX = x.get();
    const targetX =
      direction === 'left'
        ? Math.min(0, currentX + cardWidth)
        : Math.max(-maxScroll, currentX - cardWidth);
    x.set(targetX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    target.style.setProperty('--mouse-x', `${mouseX}px`);
    target.style.setProperty('--mouse-y', `${mouseY}px`);
  };

  const hasAnyExpanded = expandedProjectId !== null;

  return (
    <div
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="w-full space-y-4 select-none outline-none focus:ring-0"
    >
      {/* Top Deck Status & Surf Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-bold tracking-wider uppercase text-[11px]">
            SCROLL TO SURF // {projects.length} PROJECTS
          </span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="text-zinc-400 text-[10px] hidden sm:inline uppercase">
            [DRAG OR SWIPE]
          </span>
        </div>

        {/* Tactile Prev / Next Steppers & Progress */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-zinc-400">
            <span>SURF PROGRESS:</span>
            <div className="w-20 h-1 bg-white/10 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-75"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <span className="text-white font-bold">{Math.round(scrollProgress * 100)}%</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => stepScroll('left')}
              disabled={!canScrollLeft}
              className={`p-1.5 border transition-all cursor-pointer ${
                canScrollLeft
                  ? 'border-white/20 text-white hover:bg-white/10 active:scale-95'
                  : 'border-white/5 text-zinc-600 cursor-not-allowed'
              }`}
              title="Previous"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => stepScroll('right')}
              disabled={!canScrollRight}
              className={`p-1.5 border transition-all cursor-pointer ${
                canScrollRight
                  ? 'border-white/20 text-white hover:bg-white/10 active:scale-95'
                  : 'border-white/5 text-zinc-600 cursor-not-allowed'
              }`}
              title="Next"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main 3D Physics Momentum Deck Track */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        className="relative w-full overflow-hidden blk-deck-container py-3 cursor-grab active:cursor-grabbing select-none"
      >
        <motion.div
          ref={trackRef}
          style={{ x, skewX, rotateY }}
          drag="x"
          dragConstraints={{ left: -maxScroll, right: 0 }}
          dragElastic={0.08}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 35 }}
          className="flex gap-5 sm:gap-6 w-max select-none"
        >
          {projects.map((proj) => {
            const isExpanded = expandedProjectId === proj.id;
            const isDimmed = hasAnyExpanded && !isExpanded;

            return (
              <motion.div
                key={proj.id}
                onMouseMove={handleMouseMove}
                onClick={() => {
                  if (isDimmed) {
                    onToggleExpand(proj.id);
                  }
                }}
                className={`blk-card p-5 sm:p-6 w-[320px] sm:w-[380px] flex flex-col justify-between shrink-0 group relative select-none transition-all duration-300 ${
                  isExpanded
                    ? 'scale-[1.03] sm:scale-105 z-30 ring-1 ring-white/40 shadow-2xl shadow-black bg-black'
                    : isDimmed
                    ? 'opacity-30 blur-[2px] scale-95 filter grayscale-[40%] cursor-pointer hover:opacity-75'
                    : 'opacity-100 scale-100 z-10'
                }`}
              >
                {/* blkUI 4-Corner Crosshairs */}
                <span className="blk-crosshair-tl">+</span>
                <span className="blk-crosshair-tr">+</span>
                <span className="blk-crosshair-bl">+</span>
                <span className="blk-crosshair-br">+</span>

                {/* Subtle Radial Cursor Spotlight Layer */}
                <div className="kokonut-spotlight-layer" />

                <div className="relative z-10 space-y-3.5 pointer-events-auto">
                  {/* Top Corner Metadata Anchors */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 bg-white text-black font-bold text-[10px]">
                        [{proj.rank}]
                      </span>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                        {proj.badge}
                      </span>
                    </div>

                    {/* Corner Telemetry Pill */}
                    <div className="kokonut-telemetry-pill">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: proj.telemetry.langColor }}
                      />
                      <span>{proj.telemetry.language}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-300">{proj.telemetry.status}</span>
                    </div>
                  </div>

                  {/* Project Title & Tagline */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-white/5 border border-white/10 text-white shrink-0">
                        {proj.icon}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white font-display uppercase tracking-tight truncate">
                        {proj.title}
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-400 font-mono truncate">{proj.tagline}</p>
                  </div>

                  {/* Bespoke Kinetic Vector Model (Enlarges with high detail on Specs expansion) */}
                  <ProjectVectorVisual
                    projectId={proj.id}
                    isCompact={!isExpanded}
                    isExpanded={isExpanded}
                    className="my-1"
                  />

                  {/* Clean Grounded Description */}
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed line-clamp-2">
                    {proj.description}
                  </p>

                  {/* Expandable Technical Highlights Drawer */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden pt-2 border-t border-white/10 space-y-2"
                      >
                        <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                          Key Technical Highlights:
                        </div>
                        <ul className="space-y-1.5 text-xs text-zinc-300 font-sans">
                          {proj.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-white font-mono font-bold">›</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 bg-[#121218] text-zinc-300 border border-white/10 text-[10px] font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Bar */}
                <div className="relative z-10 pt-3.5 mt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
                  <div className="flex items-center gap-2">
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="blk-btn-secondary py-1.5 px-3 text-[10px]"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                        <span>Source</span>
                      </a>
                    )}

                    {proj.demoLink && (
                      <a
                        href={proj.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="blk-btn-primary py-1.5 px-3 text-[10px]"
                      >
                        <Sparkles className="w-3 h-3 text-black" />
                        <span>Colab</span>
                        <ExternalLink className="w-3 h-3 text-black" />
                      </a>
                    )}
                  </div>

                  {/* Expand Specs Drawer Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleExpand(proj.id);
                    }}
                    className="text-[11px] font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>{isExpanded ? 'Close Specs' : 'Specs'}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
});

export default ProjectPhysicsDeck;
