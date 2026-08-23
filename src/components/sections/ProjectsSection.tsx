"use client";
import React, { useState, memo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { animate, stagger } from 'animejs';
import {
  ExternalLink,
  ChevronRight,
  X,
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
  role: string;
  category: 'SWE' | 'GAME_DEV' | 'SYSTEMS' | 'AI';
  tech: string[];
  description: string;
  architecture: string;
  highlights: string[];
  link?: string;
  badge: string;
}

const ALL_STUDIO_PROJECTS: ProjectItem[] = [
  {
    id: 'tether',
    rank: '01',
    title: 'Tether',
    role: 'Mobile Systems & Security Developer',
    category: 'SWE',
    tech: ['Dart', 'Flutter', 'SSH', 'End-to-End Encryption', 'Server Administration'],
    description:
      'Engineered a mobile-first remote server administration tool delivering one-tap encrypted connections, intuitive swipe-to-command controls, and end-to-end encrypted terminal management.',
    architecture: 'Mobile Client ──► Encrypted Tunnel / SSH ──► Daemon Agent ──► Remote Server Management',
    highlights: [
      'One-tap encrypted SSH socket connections',
      'Swipe-to-command gesture controls for rapid sysadmin ops',
      'End-to-end encrypted session persistence and terminal multiplexing',
    ],
    link: 'https://github.com/narcisoJavier/Tether',
    badge: 'MOBILE & ENCRYPTED INFRASTRUCTURE',
  },
  {
    id: 'unity-game-projects',
    rank: '02',
    title: 'Unity 3D Game Projects',
    role: 'Game Developer (Learning & Prototyping)',
    category: 'GAME_DEV',
    tech: ['Unity 3D', 'C#', 'Physics Systems', 'Gameplay Mechanics', 'Player-Centric Design'],
    description:
      'Personal game development projects exploring Unity 3D mechanics and player-centric design through hands-on experimentation, custom physics controllers, and iterative gameplay prototyping.',
    architecture: 'Input System ──► Player Controller ──► Physics Engine ──► Game State Manager ──► Rendering Pipeline',
    highlights: [
      'Custom 3D character controller and responsive camera systems',
      'State-driven combat and interaction mechanics in Unity 3D',
      'Iterative level design focused on player ergonomics and feedback loops',
    ],
    badge: 'GAME ENGINE & INTERACTIVE 3D',
  },
  {
    id: 'geocradle',
    rank: '03',
    title: 'geoCradle',
    role: 'Geospatial & Full-Stack Developer',
    category: 'SWE',
    tech: ['JavaScript', 'GeoJSON', 'Leaflet', 'GIS Mapping', 'Spatial Analysis'],
    description:
      'Interactive web mapping platform for exploring watersheds and administrative boundaries of the Cordillera Administrative Region (CAR), Philippines — built for DENR environmental analysis and spatial planning.',
    architecture: 'GeoJSON Spatial Layers ──► Web GIS Engine ──► Watershed / Admin Analysis ──► Client GIS Dashboard',
    highlights: [
      'Multi-layered CAR watershed boundary exploration',
      'Client-side spatial queries and dynamic vector rendering',
      'Designed for environmental agencies (DENR) spatial planning workflows',
    ],
    link: 'https://github.com/narcisoJavier/geoCradle',
    badge: 'GEOSPATIAL & GIS ENGINE',
  },
  {
    id: 'campus-navigator',
    rank: '04',
    title: 'Campus Navigator CS312',
    role: 'Full-Stack & Systems Developer',
    category: 'SYSTEMS',
    tech: ['Go', 'Docker Compose', 'Node.js', 'PHP', 'Dijkstra Algorithm'],
    description:
      'Designed a containerized microservices web application using Docker, Go, Node.js, and PHP to handle scalable campus navigation requests powered by Dijkstra\'s shortest-path algorithm.',
    architecture: 'Client UI ──► Go Routing Service (Dijkstra) ──► Docker Compose Mesh ──► API Gateway',
    highlights: [
      'High-throughput Dijkstra path calculation in Go',
      'Independent containerized services via Docker Compose',
      'Polyglot service integration with PHP endpoints and Node proxy',
    ],
    link: 'https://github.com/narcisoJavier/WebDev_Campus-Navigator_CS312',
    badge: 'MICROSERVICES & ALGORITHMS',
  },
  {
    id: 'multitask-contextswitch',
    rank: '05',
    title: 'MultiTask ContextSwitch',
    role: 'Python & Systems Developer',
    category: 'SYSTEMS',
    tech: ['Python', 'PyQt6', 'Process Automation', 'UI Monitoring', 'Desktop Integration'],
    description:
      'Developed a Python-based workflow automator that monitors web-based AI generation statuses, with a PyQt6 focus-switching engine and robust process monitoring to manage real-time window focus and UI states.',
    architecture: 'Process Observer ──► AI Status Poller ──► PyQt6 Focus Switcher ──► OS Window Manager',
    highlights: [
      'Automated background status polling for active AI jobs',
      'Intelligent OS window switching without interrupting primary task flow',
      'Responsive desktop GUI engineered with PyQt6',
    ],
    link: 'https://github.com/narcisoJavier/MultiTask_ContextSwitch',
    badge: 'PROCESS AUTOMATION & DESKTOP',
  },
  {
    id: 'hand-sign-recognition',
    rank: '06',
    title: 'Hand Sign Recognition System',
    role: 'AI & Computer Vision Prototype',
    category: 'AI',
    tech: ['Python', 'CNN Architecture', 'Computer Vision', 'Image Classification'],
    description:
      'Built a computer vision prototype using a Convolutional Neural Network (CNN) model to interpret hand signs from a webcam feed. Developed as a learning project to explore AI and image classification.',
    architecture: 'Webcam Stream ──► Frame Preprocessing ──► CNN Classification Layer ──► Gesture Output',
    highlights: [
      'Custom CNN pipeline trained for gesture classification',
      'Real-time webcam inference and bounding box processing',
      'Exploration of neural architectures for edge vision tasks',
    ],
    link: 'https://colab.research.google.com/drive/1JtmdmGKfQzO4xnSUnl4rRVXulx5v6TJG?usp=sharing',
    badge: 'COMPUTER VISION & CNN',
  },
  {
    id: 'opencode-setup',
    rank: '07',
    title: 'OpenCode VSCode DevContainer',
    role: 'Developer Tooling & Infrastructure',
    category: 'SYSTEMS',
    tech: ['Docker', 'DevContainers', 'VSCode Remote', 'Environment Isolation'],
    description:
      'Created a setup guide and Docker-based configuration for running OpenCode inside a VSCode terminal using Remote Containers, providing an isolated and reproducible development sandbox.',
    architecture: 'Host Machine ──► Docker Remote Container ──► VSCode Dev Environment ──► Isolated Workspace',
    highlights: [
      'Zero-drift development sandbox via reproducible Dockerfiles',
      'Full VSCode Remote Containers extension integration',
      'Documented engineering workflows for isolated tooling',
    ],
    badge: 'CONTAINERIZATION & TOOLING',
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
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'SWE' | 'GAME_DEV' | 'SYSTEMS' | 'AI'>('ALL');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredProjects = ALL_STUDIO_PROJECTS.filter((p) => {
    if (selectedFilter === 'ALL') return true;
    return p.category === selectedFilter;
  });

  useEffect(() => {
    if (gridRef.current) {
      const cards = gridRef.current.children;
      animate(cards, {
        opacity: [0, 1],
        translateY: [16, 0],
        scale: [0.98, 1],
        ease: 'outExpo',
        duration: 550,
        delay: stagger(60),
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
              <span>02 // ARCHIVES</span>
              <span className="text-zinc-600">/</span>
              <span>ENGINEERING &amp; GAME CREATIONS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white uppercase font-display tracking-tight">
              Featured Projects &amp; Systems
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0d0d12] border border-white/10">
            {(['ALL', 'SWE', 'GAME_DEV', 'SYSTEMS', 'AI'] as const).map((filter) => (
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
                  ? 'All Projects'
                  : filter === 'GAME_DEV'
                  ? 'Game Dev'
                  : filter}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Architectural Bento Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredProjects.map((proj, idx) => {
            const isFeatured = idx === 0 || idx === 1;
            return (
              <motion.div
                key={proj.id}
                variants={cardVariants}
                className={`studio-card p-5 sm:p-6 flex flex-col justify-between group cursor-pointer ${
                  isFeatured ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'
                }`}
                onClick={() => setActiveModalProject(proj)}
              >
                <div className="studio-corner-tl" />
                <div className="studio-corner-br" />

                <div className="space-y-4">
                  {/* Top Stamp & Category */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-white text-black font-bold text-[10px]">
                        [{proj.rank}]
                      </span>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                        {proj.badge}
                      </span>
                    </div>

                    <div className="p-1 text-zinc-500 group-hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* Project Title & Role */}
                  <div>
                    <h3 className="text-lg sm:text-2xl font-bold text-white font-display uppercase tracking-tight group-hover:text-zinc-100 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono mt-1">
                      Role / Focus: <span className="text-zinc-200">{proj.role}</span>
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed line-clamp-3">
                    {proj.description}
                  </p>

                  {/* Architecture Diagram Snippet for Featured Items */}
                  {isFeatured && (
                    <div className="pt-1">
                      <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                        Architecture Pipeline:
                      </div>
                      <div className="p-2.5 bg-black/60 border border-white/5 font-mono text-[11px] text-zinc-300 overflow-x-auto whitespace-nowrap">
                        {proj.architecture}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Tech Pills & Inspect Action */}
                <div className="pt-5 mt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {proj.tech.slice(0, isFeatured ? 5 : 3).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 bg-[#14141a] text-zinc-300 border border-white/5 text-[10px] font-mono"
                      >
                        {t}
                      </span>
                    ))}
                    {proj.tech.length > (isFeatured ? 5 : 3) && (
                      <span className="px-1.5 py-0.5 text-zinc-500 text-[10px] font-mono">
                        +{proj.tech.length - (isFeatured ? 5 : 3)}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-zinc-400 group-hover:text-white flex items-center gap-1">
                    <span>Inspect</span>
                    <span>→</span>
                  </span>
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
                <div key={i} className="studio-card p-4 space-y-2 animate-pulse">
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
                  className="studio-card p-4 flex flex-col justify-between group cursor-pointer"
                >
                  <div className="studio-corner-tl" />
                  <div className="studio-corner-br" />

                  <div className="space-y-1.5">
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

                  <div className="flex items-center gap-4 pt-3 mt-2 border-t border-white/5 text-[10px] text-zinc-400 font-mono">
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

      {/* Interactive Project Detail Studio Modal */}
      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-[#0c0c11] border border-white/20 p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="studio-corner-tl" />
              <div className="studio-corner-br" />

              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                    PROJECT ARCHIVE // {activeModalProject.rank}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display uppercase tracking-tight mt-1">
                    {activeModalProject.title}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveModalProject(null)}
                  className="p-1.5 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-6 pt-5">
                <div>
                  <div className="text-xs font-mono text-zinc-400 uppercase">Target Role &amp; Focus</div>
                  <div className="text-sm font-semibold text-white font-mono mt-0.5">
                    {activeModalProject.role}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-mono text-zinc-400 uppercase">Overview</div>
                  <p className="text-sm text-zinc-300 font-sans leading-relaxed mt-1">
                    {activeModalProject.description}
                  </p>
                </div>

                <div>
                  <div className="text-xs font-mono text-zinc-400 uppercase mb-1.5">
                    Architecture &amp; Data Flow
                  </div>
                  <div className="p-3 bg-black/70 border border-white/10 font-mono text-xs text-zinc-300 overflow-x-auto">
                    {activeModalProject.architecture}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-mono text-zinc-400 uppercase mb-2">Key Engineering Highlights</div>
                  <ul className="space-y-2 text-xs sm:text-sm text-zinc-300 font-sans">
                    {activeModalProject.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-white font-mono font-bold">›</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-mono text-zinc-400 uppercase mb-2">Tech Stack</div>
                  <div className="flex flex-wrap gap-2">
                    {activeModalProject.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 bg-[#14141a] text-zinc-200 border border-white/10 text-xs font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  {activeModalProject.link ? (
                    <a
                      href={activeModalProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black font-bold font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <GithubIcon className="w-4 h-4" />
                      <span>View Source Repository</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs font-mono text-zinc-400">
                      [Internal Lab / Prototyping Repository]
                    </span>
                  )}

                  <button
                    onClick={() => setActiveModalProject(null)}
                    className="px-4 py-2.5 text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
});

export default ProjectsSection;
