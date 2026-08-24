"use client";
import React, { useState, memo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { animate, stagger } from 'animejs';
import {
  ExternalLink,
  ChevronDown,
  Sparkles,
  Layers,
  Terminal,
  Shield,
  Globe,
  Gamepad2,
  Cpu,
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/StudioIcons';
import {
  containerVariants,
  cardVariants,
  headingVariants,
  langColors,
  type PinnedRepo,
} from './shared';

interface ProjectItem {
  id: string;
  rank: string;
  title: string;
  tagline: string;
  category: 'ALL' | 'SWE' | 'GAME_DEV' | 'SYSTEMS';
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

const ALL_STUDIO_PROJECTS: ProjectItem[] = [
  {
    id: 'tether',
    rank: '01',
    title: 'Tether',
    tagline: 'Mobile Server Admin & SSH Client',
    category: 'SWE',
    icon: <Shield className="w-4 h-4 text-white" />,
    badge: 'MOBILE & INFRASTRUCTURE',
    tech: ['Flutter', 'Dart', 'SSH Socket', 'Terminal Management'],
    description:
      'A mobile server administration tool built with Flutter & Dart. Enables one-tap encrypted SSH connections, swipe-to-run sysadmin commands, and remote terminal management directly from your phone.',
    highlights: [
      'Encrypted SSH socket connectivity directly on mobile',
      'Configurable swipe gesture commands for fast remote tasks',
      'Session state persistence and terminal output logging',
    ],
    link: 'https://github.com/narcisoJavier/Tether',
    telemetry: {
      status: 'Open Source',
      language: 'Dart',
      langColor: '#00B4AB',
    },
  },
  {
    id: 'unity-game',
    rank: '02',
    title: 'Unity 3D Game Prototypes',
    tagline: 'Physics Mechanics & Player Controller',
    category: 'GAME_DEV',
    icon: <Gamepad2 className="w-4 h-4 text-white" />,
    badge: 'GAME DEVELOPMENT',
    tech: ['Unity 3D', 'C#', 'Kinetic Physics', 'State Machines'],
    description:
      'Hands-on experimental projects in Unity 3D exploring responsive 3D character controllers, kinetic physics loops, state-driven combat animations, and player feedback systems.',
    highlights: [
      'Custom physics-based movement controller and dynamic camera',
      'State machine architecture for combat and weapon states',
      'Focus on player ergonomics, game feel, and collision response',
    ],
    link: 'https://github.com/narcisoJavier',
    telemetry: {
      status: 'Active Lab',
      language: 'C#',
      langColor: '#178600',
    },
  },
  {
    id: 'geocradle',
    rank: '03',
    title: 'geoCradle',
    tagline: 'Cordillera Watershed Web GIS Map',
    category: 'SWE',
    icon: <Globe className="w-4 h-4 text-white" />,
    badge: 'GEOSPATIAL & GIS',
    tech: ['Leaflet.js', 'GeoJSON', 'JavaScript', 'GIS Mapping'],
    description:
      'An interactive web mapping application developed for DENR environmental analysis. Visualizes administrative boundaries, watershed basins, and topography across Northern Luzon.',
    highlights: [
      'Interactive multi-layer Cordillera watershed mapping',
      'Dynamic client-side GeoJSON boundary rendering',
      'Built for environmental planning and watershed zone exploration',
    ],
    link: 'https://github.com/narcisoJavier/geoCradle',
    telemetry: {
      status: 'Verified',
      language: 'JavaScript',
      langColor: '#f1e05a',
    },
  },
  {
    id: 'campus-nav',
    rank: '04',
    title: 'Campus Navigator CS312',
    tagline: 'Go Shortest-Path Routing Service',
    category: 'SYSTEMS',
    icon: <Terminal className="w-4 h-4 text-white" />,
    badge: 'MICROSERVICES & ALGORITHMS',
    tech: ['Go', 'Docker Compose', 'Dijkstra Algorithm', 'Node.js'],
    description:
      'A containerized web microservice that calculates optimal walking paths across academic buildings using Dijkstra’s shortest-path algorithm, packaged with Docker Compose.',
    highlights: [
      'High-performance graph routing calculations implemented in Go',
      'Containerized multi-service mesh via Docker Compose',
      'Academic campus facility graph representation',
    ],
    link: 'https://github.com/narcisoJavier/WebDev_Campus-Navigator_CS312',
    telemetry: {
      status: 'Academic Project',
      language: 'Go',
      langColor: '#00ADD8',
    },
  },
  {
    id: 'multitask-contextswitch',
    rank: '05',
    title: 'MultiTask ContextSwitch',
    tagline: 'Desktop Background Task Monitor & Switcher',
    category: 'SYSTEMS',
    icon: <Cpu className="w-4 h-4 text-white" />,
    badge: 'DESKTOP AUTOMATION',
    tech: ['Python', 'PyQt6', 'Process Monitoring', 'OS Automation'],
    description:
      'A desktop productivity utility built with Python and PyQt6. Tracks the execution status of background processes and automatically shifts window focus when jobs complete.',
    highlights: [
      'Background process observer with real-time state tracking',
      'Non-intrusive window focus management on task completion',
      'Clean desktop GUI built with PyQt6',
    ],
    link: 'https://github.com/narcisoJavier/MultiTask_ContextSwitch',
    telemetry: {
      status: 'Tooling',
      language: 'Python',
      langColor: '#3572A5',
    },
  },
  {
    id: 'hand-sign-recognition',
    rank: '06',
    title: 'Hand Sign Recognition CNN',
    tagline: 'Computer Vision Prototype',
    category: 'SYSTEMS',
    icon: <Layers className="w-4 h-4 text-white" />,
    badge: 'COMPUTER VISION',
    tech: ['Python', 'CNN Model', 'OpenCV', 'Google Colab'],
    description:
      'A convolutional neural network (CNN) prototype built in Python on Google Colab to classify basic hand gesture signs from webcam feeds as an exploration in image classification.',
    highlights: [
      'Custom CNN model architecture for gesture classification',
      'Webcam frame preprocessing and inference pipeline',
      'Interactive Jupyter/Colab experimentation notebook',
    ],
    link: 'https://colab.research.google.com/drive/1JtmdmGKfQzO4xnSUnl4rRVXulx5v6TJG?usp=sharing',
    demoLink: 'https://colab.research.google.com/drive/1JtmdmGKfQzO4xnSUnl4rRVXulx5v6TJG?usp=sharing',
    telemetry: {
      status: 'Colab Notebook',
      language: 'Python',
      langColor: '#3572A5',
    },
  },
  {
    id: 'opencode-setup',
    rank: '07',
    title: 'OpenCode DevContainer Setup',
    tagline: 'Isolated Docker Development Sandbox',
    category: 'SYSTEMS',
    icon: <Terminal className="w-4 h-4 text-white" />,
    badge: 'CONTAINERIZATION',
    tech: ['Docker', 'DevContainers', 'VSCode Remote', 'Linux'],
    description:
      'A reproducible Docker configuration and setup guide for running OpenCode inside VSCode Remote Containers, ensuring a zero-drift, isolated developer workspace.',
    highlights: [
      'Isolated environment via reproducible Dockerfile configuration',
      'Seamless VSCode Remote Containers extension integration',
      'Documented setup guide for clean development workflows',
    ],
    link: 'https://github.com/narcisoJavier',
    telemetry: {
      status: 'DevOps Config',
      language: 'Docker',
      langColor: '#384d54',
    },
  },
];

interface ProjectsSectionProps {
  pinnedRepos: PinnedRepo[];
  reposLoading: boolean;
  reposError: boolean;
  onRetry: () => void;
}

export const ProjectsSection = memo(function ProjectsSection({
  pinnedRepos,
  reposLoading,
  reposError,
  onRetry,
}: ProjectsSectionProps) {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'SWE' | 'GAME_DEV' | 'SYSTEMS'>('ALL');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredProjects = ALL_STUDIO_PROJECTS.filter((p) => {
    if (selectedFilter === 'ALL') return true;
    return p.category === selectedFilter;
  });

  const toggleExpand = useCallback((id: string) => {
    setExpandedProjectId((prev) => (prev === id ? null : id));
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty('--mouse-x', `${x}px`);
    target.style.setProperty('--mouse-y', `${y}px`);
  };

  useEffect(() => {
    if (gridRef.current) {
      const cards = gridRef.current.children;
      animate(cards, {
        opacity: [0, 1],
        translateY: [14, 0],
        ease: 'outExpo',
        duration: 500,
        delay: stagger(50),
      });
    }
  }, [selectedFilter]);

  return (
    <section id="projects" className="scroll-mt-20 w-full py-12 border-b border-white/10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        className="w-full space-y-8"
      >
        {/* Studio Section Header */}
        <motion.div
          variants={headingVariants}
          className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4"
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest">
              <span>02 // WORKS &amp; ARCHIVES</span>
              <span className="text-zinc-600">/</span>
              <span>PROJECTS, TELEMETRY &amp; SYSTEMS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white uppercase font-display tracking-tight">
              Featured Projects &amp; Code
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-[#0d0d12] border border-white/10">
            {(['ALL', 'SWE', 'GAME_DEV', 'SYSTEMS'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1 text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  selectedFilter === filter
                    ? 'bg-white text-black font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {filter === 'ALL'
                  ? 'All Works'
                  : filter === 'GAME_DEV'
                  ? 'Game Dev'
                  : filter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Kokonut UI Interactive Bento Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredProjects.map((proj, idx) => {
            const isExpanded = expandedProjectId === proj.id;
            const isFeatured = idx === 0 || idx === 1;

            return (
              <motion.div
                key={proj.id}
                variants={cardVariants}
                onMouseMove={handleMouseMove}
                className={`kokonut-card-glow p-5 sm:p-6 flex flex-col justify-between group ${
                  isFeatured ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'
                }`}
              >
                <div className="studio-corner-tl" />
                <div className="studio-corner-br" />
                <div className="kokonut-spotlight-layer" />

                <div className="relative z-10 space-y-4">
                  {/* Card Header: Stamp, Category & Integrated Telemetry Pill */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 bg-white text-black font-bold text-[10px]">
                        [{proj.rank}]
                      </span>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                        {proj.badge}
                      </span>
                    </div>

                    {/* Integrated Telemetry Pill */}
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

                  {/* Title & Tagline */}
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-white/5 border border-white/10 text-white">
                        {proj.icon}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white font-display uppercase tracking-tight">
                        {proj.title}
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-400 font-mono mt-1">
                      {proj.tagline}
                    </p>
                  </div>

                  {/* Clean 2-3 sentence grounded description */}
                  <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Expandable Key Takeaways Drawer */}
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

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 bg-[#14141a] text-zinc-300 border border-white/10 text-[10px] font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Bar */}
                <div className="relative z-10 pt-4 mt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="kokonut-btn-secondary"
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
                        className="kokonut-btn-primary"
                      >
                        <Sparkles className="w-3 h-3 text-black" />
                        <span>Colab</span>
                        <ExternalLink className="w-3 h-3 text-black" />
                      </a>
                    )}
                  </div>

                  {/* Expand Specs Drawer Toggle */}
                  <button
                    onClick={() => toggleExpand(proj.id)}
                    className="text-[11px] font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide Specs' : 'Specs'}</span>
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
        </div>

        {/* Live GitHub Repositories Strip */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <GithubIcon className="w-3.5 h-3.5 text-white" />
              <span>LIVE GITHUB REPOSITORIES [@narcisoJavier]</span>
            </div>
            {reposLoading && (
              <span className="text-[11px] font-mono text-zinc-400 animate-pulse">
                Syncing GitHub API...
              </span>
            )}
          </div>

          {reposLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="kokonut-card-glow p-4 space-y-2 animate-pulse">
                  <div className="h-4 bg-zinc-800 rounded w-1/3" />
                  <div className="h-3 bg-zinc-800/60 rounded w-full" />
                </div>
              ))}
            </div>
          ) : reposError ? (
            <div className="p-4 bg-[#0e0e13] border border-white/10 text-xs text-zinc-400 font-mono flex items-center justify-between">
              <span>[!] Live GitHub sync cached.</span>
              <button
                onClick={onRetry}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-[11px] cursor-pointer"
              >
                Retry Fetch
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pinnedRepos.map((repo) => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="kokonut-card-glow p-4 flex flex-col justify-between group cursor-pointer"
                >
                  <div className="studio-corner-tl" />
                  <div className="studio-corner-br" />
                  <div className="kokonut-spotlight-layer" />

                  <div className="relative z-10 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-zinc-200 font-mono">
                        {repo.name}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-[11px] text-zinc-400 font-sans line-clamp-2">
                      {repo.description || 'Repository maintained by Narciso Javier.'}
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center gap-4 pt-3 mt-2 border-t border-white/5 text-[10px] text-zinc-400 font-mono">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: langColors[repo.language] || '#ffffff' }}
                        />
                        <span className="text-zinc-300">{repo.language}</span>
                      </span>
                    )}
                    <span>★ {repo.stars} stars</span>
                    <span>⑂ {repo.forks} forks</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
});

export default ProjectsSection;
