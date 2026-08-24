"use client";
import React, { useState, useEffect, useRef, memo } from 'react';
import { animate } from 'animejs';
import { ArrowUpRight, ChevronRight, Sparkles, Terminal, Shield, Globe } from 'lucide-react';
import { GithubIcon } from '@/components/ui/StudioIcons';
import { ProjectVectorVisual } from '@/components/ui/ProjectVectorVisual';

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

const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: 'tether',
    index: '01',
    title: 'Tether',
    subtitle: 'Mobile Server Admin & SSH Client',
    category: 'MOBILE // SYSTEMS',
    icon: <Shield className="w-4 h-4 text-white" />,
    tags: ['Flutter', 'Dart', 'SSH Socket', 'Terminal Ops'],
    description:
      'A mobile server administration tool built with Flutter & Dart. Enables one-tap encrypted SSH socket connections and remote terminal ops directly from your phone.',
    link: 'https://github.com/narcisoJavier/Tether',
  },
  {
    id: 'geocradle',
    index: '02',
    title: 'geoCradle',
    subtitle: 'Cordillera Watershed Web GIS Map',
    category: 'GEOSPATIAL // GIS',
    icon: <Globe className="w-4 h-4 text-white" />,
    tags: ['Leaflet.js', 'GeoJSON', 'JavaScript', 'DENR Analysis'],
    description:
      'An interactive web mapping application for environmental analysis, visualizing watershed boundaries and topographical zones across Northern Luzon.',
    link: 'https://github.com/narcisoJavier/geoCradle',
  },
  {
    id: 'campus-nav',
    index: '03',
    title: 'Campus Navigator CS312',
    subtitle: 'Go Shortest-Path Route Service',
    category: 'MICROSERVICES // GRAPH',
    icon: <Terminal className="w-4 h-4 text-white" />,
    tags: ['Go', 'Dijkstra Algorithm', 'Docker Compose', 'Node.js'],
    description:
      'A containerized Go microservice that calculates fast, optimal routes between campus buildings using Dijkstra\'s shortest-path graph algorithm.',
    link: 'https://github.com/narcisoJavier/WebDev_Campus-Navigator_CS312',
  },
  {
    id: 'multitask',
    index: '04',
    title: 'MultiTask ContextSwitch',
    subtitle: 'Desktop Task Monitor & Switcher',
    category: 'DESKTOP // OS AUTOMATION',
    icon: <Sparkles className="w-4 h-4 text-white" />,
    tags: ['Python', 'PyQt6', 'Process Monitor', 'OS Automation'],
    description:
      'A desktop productivity utility built with Python and PyQt6 that monitors background task execution and shifts window focus when jobs complete.',
    link: 'https://github.com/narcisoJavier/MultiTask_ContextSwitch',
  },
];

export const HeroShowcaseReel = memo(function HeroShowcaseReel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const lineProgressRef = useRef<HTMLDivElement>(null);

  const active = SHOWCASE_PROJECTS[currentIndex];

  // Auto slide progress
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SHOWCASE_PROJECTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

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
      animate(lineProgressRef.current, {
        width: ['0%', '100%'],
        ease: 'linear',
        duration: 6000,
      });
    }
  }, [currentIndex]);

  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="kokonut-card-glow p-6 sm:p-7 flex flex-col justify-between select-none shadow-2xl min-h-[480px]">
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
        </div>

        {/* Slide Indicator Selector */}
        <div className="flex items-center gap-1">
          {SHOWCASE_PROJECTS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
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
            <div className="p-1 bg-white/5 border border-white/10 text-white shrink-0">
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
