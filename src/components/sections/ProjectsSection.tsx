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
  Cpu,
  Columns,
  LayoutGrid,
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/StudioIcons';
import { ProjectVectorVisual } from '@/components/ui/ProjectVectorVisual';
import { ProjectPhysicsDeck, type DeckProjectItem } from '@/components/ui/ProjectPhysicsDeck';
import { GitHubTelemetryHUD } from '@/components/ui/GitHubTelemetryHUD';
import {
  containerVariants,
  cardVariants,
  headingVariants,
} from './shared';

const ALL_STUDIO_PROJECTS: DeckProjectItem[] = [
  {
    id: 'tether',
    rank: '01',
    title: 'Tether',
    tagline: 'Mobile Server Admin & SSH Client',
    category: 'SWE',
    icon: <Shield className="w-4 h-4 text-white" />,
    badge: 'MOBILE & INFRASTRUCTURE',
    tech: ['Flutter', 'Dart', 'SSH Socket', 'Terminal Ops'],
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
    id: 'geocradle',
    rank: '02',
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
    rank: '03',
    title: 'Campus Navigator CS312',
    tagline: 'Go Shortest-Path Routing Service',
    category: 'SYSTEMS',
    icon: <Terminal className="w-4 h-4 text-white" />,
    badge: 'MICROSERVICES & GRAPH',
    tech: ['Go', 'Docker Compose', 'Dijkstra', 'Node.js'],
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
    rank: '04',
    title: 'MultiTask ContextSwitch',
    tagline: 'Desktop Task Monitor & Window Switcher',
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
    rank: '05',
    title: 'Hand Sign Recognition CNN',
    tagline: 'Computer Vision Gesture Prototype',
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
    rank: '06',
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
  className?: string;
}

export const ProjectsSection = memo(function ProjectsSection({
  className = '',
}: ProjectsSectionProps = {}) {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'SWE' | 'SYSTEMS'>('ALL');
  const [viewMode, setViewMode] = useState<'DECK' | 'GRID'>('DECK');
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
    if (gridRef.current && viewMode === 'GRID') {
      const cards = gridRef.current.children;
      animate(cards, {
        opacity: [0, 1],
        translateY: [14, 0],
        ease: 'outExpo',
        duration: 450,
        delay: stagger(35),
      });
    }
  }, [selectedFilter, viewMode]);

  return (
    <section id="projects" className={`scroll-mt-20 w-full py-12 border-b border-white/10 ${className}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        className="w-full space-y-8"
      >
        {/* Studio Section Header with Filter & View Switcher */}
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

          {/* Right Controls: Filter Pills + View Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 p-1 bg-[#09090d] border border-white/10">
              {(['ALL', 'SWE', 'SYSTEMS'] as const).map((filter) => (
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
                    ? 'All'
                    : filter === 'SWE'
                    ? 'Software'
                    : 'Systems'}
                </button>
              ))}
            </div>

            {/* View Mode Toggle ([ SURF DECK ] / [ GRID ]) */}
            <div className="flex items-center gap-1 p-1 bg-[#09090d] border border-white/10">
              <button
                onClick={() => setViewMode('DECK')}
                className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'DECK'
                    ? 'bg-white text-black font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Horizontal Physics Deck"
              >
                <Columns className="w-3 h-3" />
                <span className="hidden sm:inline">Deck</span>
              </button>
              <button
                onClick={() => setViewMode('GRID')}
                className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'GRID'
                    ? 'bg-white text-black font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="3x2 Grid View"
              >
                <LayoutGrid className="w-3 h-3" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* View Mode 1: Horizontal Momentum Physics Deck ("Scroll to Surf") */}
        {viewMode === 'DECK' ? (
          <ProjectPhysicsDeck
            projects={filteredProjects}
            expandedProjectId={expandedProjectId}
            onToggleExpand={toggleExpand}
          />
        ) : (
          /* View Mode 2: Uniform Balanced 3-Column blkUI Grid */
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredProjects.map((proj) => {
              const isExpanded = expandedProjectId === proj.id;

              return (
                <motion.div
                  key={proj.id}
                  variants={cardVariants}
                  onMouseMove={handleMouseMove}
                  className="blk-card p-5 sm:p-6 flex flex-col justify-between h-full group relative"
                >
                  {/* blkUI 4-Corner Crosshairs */}
                  <span className="blk-crosshair-tl">+</span>
                  <span className="blk-crosshair-tr">+</span>
                  <span className="blk-crosshair-bl">+</span>
                  <span className="blk-crosshair-br">+</span>

                  <div className="kokonut-spotlight-layer" />

                  <div className="relative z-10 space-y-3.5">
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

                    {/* Bespoke Kinetic Vector Model / Animation */}
                    <ProjectVectorVisual projectId={proj.id} isCompact className="my-1" />

                    {/* Clean grounded description */}
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
                          className="px-2 py-0.5 bg-[#121218] text-zinc-300 border border-white/10 text-[10px] font-mono"
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
        )}

        {/* blkUI GitHub Telemetry HUD */}
        <GitHubTelemetryHUD />
      </motion.div>
    </section>
  );
});

export default ProjectsSection;
