"use client";
import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { useLenis } from 'lenis/react';
import { animate } from 'animejs';
import { ArrowUpRight, ChevronRight, Sparkles, Terminal, Shield, Globe } from 'lucide-react';
import { GithubIcon } from '@/components/ui/StudioIcons';
import { ProjectVectorVisual } from '@/components/ui/ProjectVectorVisual';
import { resumeData } from '@/data/resumeData';
import { getProjectEvidence } from '@/data/projectEvidence';

interface ShowcaseProject {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  category: string;
  icon: React.ReactNode;
  tags: string[];
  description: string;
  link?: string;
}

const SHOWCASE_PRESENTATION: Record<string, Omit<ShowcaseProject, 'id' | 'title' | 'tags' | 'description' | 'link'>> = {
  tether: {
    index: '01',
    subtitle: 'Mobile Server Admin & SSH Client',
    category: 'MOBILE // SYSTEMS',
    icon: <Shield className="w-4 h-4 text-white" />,
  },
  geocradle: {
    index: '02',
    subtitle: 'Cordillera Watershed Web GIS Map',
    category: 'GEOSPATIAL // GIS',
    icon: <Globe className="w-4 h-4 text-white" />,
  },
  'campus-nav': {
    index: '03',
    subtitle: 'Go Shortest-Path Route Service',
    category: 'MICROSERVICES // GRAPH',
    icon: <Terminal className="w-4 h-4 text-white" />,
  },
  'multitask-contextswitch': {
    index: '04',
    subtitle: 'Desktop Task Monitor & Switcher',
    category: 'DESKTOP // OS AUTOMATION',
    icon: <Sparkles className="w-4 h-4 text-white" />,
  },
};

const SHOWCASE_PROJECTS: ShowcaseProject[] = Object.entries(SHOWCASE_PRESENTATION).map(([id, presentation]) => {
  const project = resumeData.projects.find((entry) => entry.id === id);
  const evidence = getProjectEvidence(id);

  if (!project) {
    throw new Error(`Missing showcase project data for ${id}`);
  }

  return {
    ...presentation,
    id: project.id,
    title: project.title,
    tags: evidence?.technologyTags || [],
    description: project.description,
    link: project.link,
  };
});

export const HeroShowcaseReel = memo(function HeroShowcaseReel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const lineProgressRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  const active = SHOWCASE_PROJECTS[currentIndex];

  // Auto slide progress
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SHOWCASE_PROJECTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Anime.js transition on slide change
  useEffect(() => {
    if (cardRef.current) {
      animate(cardRef.current, {
        opacity: [0.4, 1],
        translateY: [8, 0],
        ease: 'outExpo',
        duration: 450,
      });
    }

    if (lineProgressRef.current) {
      lineProgressRef.current.style.width = '0%';
      if (!isPaused) {
        animate(lineProgressRef.current, {
          width: ['0%', '100%'],
          ease: 'linear',
          duration: 6000,
        });
      }
    }
  }, [currentIndex, isPaused]);

  const scrollToProjects = useCallback(() => {
    const el = document.getElementById('projects');
    if (el) {
      if (lenis) {
        lenis.scrollTo(el, { offset: -60, duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [lenis]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured Projects Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      className="kokonut-card-glow p-6 sm:p-7 flex flex-col justify-between select-none shadow-2xl min-h-[480px]"
    >
      <div className="studio-corner-tl" />
      <div className="studio-corner-br" />
      <div className="kokonut-spotlight-layer" />

      {/* Top Slide Header: Clean, Uniform Typography */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold tracking-wider text-[11px]">
            FEATURED // 0{currentIndex + 1} OF 04
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400 text-[10px] tracking-wider uppercase hidden sm:inline">
            {active.category}
          </span>
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={isPaused ? 'Resume auto-rotating showcase' : 'Pause auto-rotating showcase'}
            className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-white/20 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            {isPaused ? '▶ PLAY' : '❚❚ PAUSE'}
          </button>
        </div>

        {/* Slide Indicator Selector */}
        <div className="flex items-center gap-1">
          {SHOWCASE_PROJECTS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Show featured project ${item.title}`}
              aria-pressed={currentIndex === idx}
              className={`h-5 px-2 text-[10px] font-mono transition-all cursor-pointer flex items-center justify-center ${
                currentIndex === idx
                  ? 'bg-white text-black font-bold'
                  : 'text-zinc-400 hover:text-white bg-white/5'
              }`}
            >
              {item.index}
            </button>
          ))}
        </div>
      </div>

      {/* Main Slide Card Content with Kinetic Vector Preview */}
      <div ref={cardRef} className="relative z-10 my-4 space-y-3.5 flex-1 flex flex-col justify-between">
        {/* Bespoke Interactive Kinetic Vector Visualizer */}
        <ProjectVectorVisual projectId={active.id} isCompact />

        {/* Project Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex-none border border-white/10 bg-white/5 p-1 text-white">
              {active.icon}
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white uppercase font-display tracking-tight truncate">
              {active.title}
            </h3>
          </div>
          <p className="text-xs font-mono text-zinc-400 truncate">{active.subtitle}</p>
        </div>

        {/* Grounded Description with fixed min-height for uniformity */}
        <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed line-clamp-2 min-h-[40px]">
          {active.description}
        </p>

        {/* Tech Stack Badges with uniform height */}
        <div className="flex flex-wrap gap-1.5 pt-1 min-h-[26px]">
          {active.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-[#14141a] border border-white/10 text-zinc-300 text-[10px] font-mono"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Action Footer & Animated Progress Bar */}
      <div className="relative z-10 space-y-2.5 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between">
          <button
            onClick={scrollToProjects}
            className="text-xs font-mono text-white hover:text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer group/btn"
          >
            <span>Explore All Projects</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>

          {active.link && (
            <a
              href={active.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>Source</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Auto Progress Bar Line */}
        <div className="w-full h-0.5 bg-white/10 overflow-hidden">
          <div ref={lineProgressRef} className="h-full bg-white transition-all" />
        </div>
      </div>
    </div>
  );
});

export default HeroShowcaseReel;
