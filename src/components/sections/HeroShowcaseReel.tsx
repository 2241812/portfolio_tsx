"use client";
import React, { useState, useEffect, useRef, memo } from 'react';
import { animate } from 'animejs';
import { ArrowUpRight, ChevronRight, Sparkles, Terminal, Gamepad2, Shield, Globe } from 'lucide-react';
import { GithubIcon } from '@/components/ui/StudioIcons';

interface ShowcaseProject {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  category: 'SYSTEMS' | 'GAME_DEV' | 'INFRASTRUCTURE' | 'GEOSPATIAL';
  icon: React.ReactNode;
  tags: string[];
  metrics: { label: string; value: string }[];
  description: string;
  link?: string;
}

const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: 'tether',
    index: '01',
    title: 'Tether',
    subtitle: 'Mobile & Encrypted SSH Infrastructure',
    category: 'INFRASTRUCTURE',
    icon: <Shield className="w-4 h-4 text-emerald-400" />,
    tags: ['Go', 'TypeScript', 'Docker', 'SSH Tunnel', 'Tailscale'],
    metrics: [
      { label: 'Latency', value: '< 12ms' },
      { label: 'Security', value: 'E2E TLS' },
      { label: 'Platform', value: 'Cross-OS' },
    ],
    description:
      'Seamless mobile remote management and encrypted developer environments without exposing ports or relying on static IPs.',
    link: 'https://github.com/narcisoJavier/Tether',
  },
  {
    id: 'game-engine',
    index: '02',
    title: 'Project Madhouse',
    subtitle: 'Real-Time Spatial Combat & Mechanics Engine',
    category: 'GAME_DEV',
    icon: <Gamepad2 className="w-4 h-4 text-cyan-400" />,
    tags: ['Unity 3D', 'C#', 'Physics Loop', 'Spatial Logic', 'HLSL'],
    metrics: [
      { label: 'Framerate', value: '60 FPS' },
      { label: 'Architecture', value: 'OOP / ECS' },
      { label: 'Input Latency', value: 'Zero-Lag' },
    ],
    description:
      'High-velocity combat mechanics, kinematic player movement, and stateful weapon rigs built with player-centric feedback loops.',
    link: 'https://github.com/narcisoJavier',
  },
  {
    id: 'geocradle',
    index: '03',
    title: 'geoCradle',
    subtitle: 'DENR Geospatial & Watershed Map System',
    category: 'GEOSPATIAL',
    icon: <Globe className="w-4 h-4 text-blue-400" />,
    tags: ['Python', 'Leaflet.js', 'GeoJSON', 'FastAPI', 'PostGIS'],
    metrics: [
      { label: 'Layers', value: 'Multi-Tier' },
      { label: 'GIS Format', value: 'GeoJSON' },
      { label: 'Client', value: 'DENR Cordillera' },
    ],
    description:
      'Interactive geospatial data pipeline mapping watershed basins, river topography, and environmental hazard zones.',
    link: 'https://github.com/narcisoJavier',
  },
  {
    id: 'campus-nav',
    index: '04',
    title: 'Campus Navigator',
    subtitle: 'Distributed Go Routing & Shortest Path Service',
    category: 'SYSTEMS',
    icon: <Terminal className="w-4 h-4 text-amber-400" />,
    tags: ['Go', 'Dijkstra Algorithm', 'Docker', 'REST API', 'Redis'],
    metrics: [
      { label: 'Algorithm', value: 'Dijkstra O(V+E)' },
      { label: 'Routing', value: '< 2ms' },
      { label: 'Scale', value: 'Containerized' },
    ],
    description:
      'Distributed graph traversal microservice delivering real-time topological routing across academic facilities.',
    link: 'https://github.com/narcisoJavier',
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
        translateY: [12, 0],
        ease: 'outExpo',
        duration: 650,
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
    <div className="relative w-full bg-[#0a0a0f] border border-white/15 p-6 sm:p-8 flex flex-col justify-between select-none overflow-hidden group shadow-2xl">
      {/* Studio Corner Crosshairs */}
      <div className="studio-corner-tl" />
      <div className="studio-corner-br" />

      {/* Top Slide Header Strip */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs font-mono">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-white text-black font-bold uppercase text-[10px]">
            <Sparkles className="w-3 h-3 text-black" />
            SHOWCASE // 0{currentIndex + 1}
          </span>
          <span className="text-zinc-400 uppercase tracking-wider hidden sm:inline">
            {active.category}
          </span>
        </div>

        {/* Slide Indicator Selector */}
        <div className="flex items-center gap-1.5">
          {SHOWCASE_PROJECTS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-6 px-2 text-[10px] font-mono transition-all cursor-pointer flex items-center justify-center ${
                currentIndex === idx
                  ? 'bg-white text-black font-bold'
                  : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10'
              }`}
            >
              {item.index}
            </button>
          ))}
        </div>
      </div>

      {/* Main Slide Card Content */}
      <div ref={cardRef} className="my-5 sm:my-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white/5 border border-white/10">{active.icon}</div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase font-display tracking-tight">
              {active.title}
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">{active.subtitle}</span>
        </div>

        <p className="text-sm text-zinc-300 font-sans leading-relaxed">
          {active.description}
        </p>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {active.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-[#121218] border border-white/10 text-zinc-300 text-[11px] font-mono"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Architectural Metrics Strip */}
        <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-white/10">
          {active.metrics.map((m) => (
            <div key={m.label} className="p-2.5 bg-[#0e0e14] border border-white/5 space-y-0.5">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">{m.label}</div>
              <div className="text-xs font-bold text-white font-mono">{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Footer & Animated Progress Bar */}
      <div className="space-y-3 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between">
          <button
            onClick={scrollToProjects}
            className="text-xs font-mono text-white hover:text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer group/btn"
          >
            <span>View in Full Project Archive</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>

          {active.link && (
            <a
              href={active.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
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
