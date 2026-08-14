"use client";
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { containerVariants, cardVariants, headingVariants, langColors, type PinnedRepo } from './shared';

interface TopProject {
  id: string;
  rank: string;
  title: string;
  role: string;
  tech: string[];
  description: string;
  architecture: string;
  link?: string;
  badge: string;
}

const TOP_PROJECTS: TopProject[] = [
  {
    id: 'tether',
    rank: '#01',
    title: 'Tether',
    role: 'Mobile Systems & Security Architect',
    tech: ['Dart', 'Flutter', 'SSH', 'End-to-End Encryption', 'Server Administration'],
    description:
      'Your server in your pocket. Engineered a mobile-first remote server administration platform delivering one-tap encrypted connections, intuitive swipe-to-command controls, and end-to-end encrypted infrastructure management.',
    architecture: 'Mobile Client ──► Encrypted Tunnel / SSH ──► Daemon Agent ──► Remote Server Management',
    link: 'https://github.com/narcisoJavier/Tether',
    badge: 'MOBILE & ENCRYPTED INFRASTRUCTURE',
  },
  {
    id: 'geocradle',
    rank: '#02',
    title: 'geoCradle',
    role: 'Geospatial & Full-Stack Developer',
    tech: ['JavaScript', 'GeoJSON', 'Leaflet', 'GIS Mapping', 'Spatial Analysis'],
    description:
      'Interactive geospatial web map for exploring watersheds and administrative boundaries of the Cordillera Administrative Region (CAR), Philippines — engineered for DENR environmental analysis and spatial planning.',
    architecture: 'GeoJSON Spatial Layers ──► Web GIS Engine ──► Watershed / Admin Analysis ──► Client GIS Dashboard',
    link: 'https://github.com/narcisoJavier/geoCradle',
    badge: 'GEOSPATIAL & GIS ENGINE',
  },
  {
    id: 'campus-navigator',
    rank: '#03',
    title: 'WebDev_Campus-Navigator_CS312',
    role: 'Full-Stack & Systems Developer',
    tech: ['Go', 'Docker Compose', 'Node.js', 'PHP', 'Dijkstra Algorithm'],
    description:
      'Architected a containerized microservices platform for campus navigation. Deployed independent Go routing services, PHP/Node endpoints, and container isolation to calculate shortest paths via Dijkstra algorithm.',
    architecture: 'Client UI ──► Go Routing Service (Dijkstra) ──► Docker Compose Mesh ──► API Gateway',
    link: 'https://github.com/narcisoJavier/WebDev_Campus-Navigator_CS312',
    badge: 'MICROSERVICES & ALGORITHMS',
  },
];

interface ProjectsSectionProps {
  pinnedRepos: PinnedRepo[];
  reposLoading: boolean;
  reposError: boolean;
  onRetry: () => void;
}

const ProjectsSection = memo(function ProjectsSection({
  pinnedRepos,
  reposLoading,
  reposError,
  onRetry,
}: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      className="scroll-mt-24 w-full py-8 md:py-12 border-b border-blue-900/30"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        className="w-full space-y-8"
      >
        {/* Section Header */}
        <motion.div
          variants={headingVariants}
          className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-blue-900/30 pb-3 gap-2"
        >
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 text-sm font-bold font-orbitron">[02]</span>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wider font-orbitron">
              FEATURED PROJECTS &amp; ARCHITECTURE
            </h2>
          </div>
          <span className="text-xs text-cyan-400 font-mono">
            ★ TOP 3 HIGHLIGHTS &amp; LIVE REPOSITORIES
          </span>
        </motion.div>

        {/* ── TOP 3 SPOTLIGHT SECTION ── */}
        <div className="space-y-4">
          <div className="text-[11px] font-mono text-cyan-400/80 uppercase tracking-wider flex items-center gap-2">
            <span>┌─</span>
            <span className="text-slate-200 font-bold">FLAGSHIP ARCHITECTURES</span>
            <span>──────────────────────────────────────────────</span>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {TOP_PROJECTS.map((proj) => (
              <motion.div
                key={proj.id}
                variants={cardVariants}
                className="cyber-glass-card rounded-xl p-5 sm:p-7 relative overflow-hidden group shadow-xl"
              >
                <div className="cyber-bracket-tl" />
                <div className="cyber-bracket-br" />

                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-bl from-cyan-500/15 via-blue-600/5 to-transparent blur-3xl pointer-events-none group-hover:from-cyan-500/25 transition-all" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-5">
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold font-orbitron shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                        {proj.rank}
                      </span>
                      <h3 className="text-base sm:text-xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors font-orbitron">
                        {proj.title}
                      </h3>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800 font-mono">
                        {proj.badge}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 font-mono">
                      Target Role: <span className="text-slate-200 font-semibold">{proj.role}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono pt-1">
                      {proj.description}
                    </p>

                    {/* Architecture flow */}
                    <div className="pt-2">
                      <div className="text-[10px] text-cyan-400 uppercase tracking-wider mb-1 font-mono font-bold">
                        Pipeline / Architecture Flow:
                      </div>
                      <div className="px-3.5 py-2 rounded-lg bg-[#02050c] border border-cyan-900/40 text-[11px] text-cyan-300 font-mono overflow-x-auto whitespace-nowrap shadow-inner">
                        {proj.architecture}
                      </div>
                    </div>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {proj.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded bg-slate-900/90 text-slate-300 border border-slate-800 text-[11px] font-mono hover:border-cyan-500/60 transition-colors"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  {proj.link && (
                    <div className="shrink-0 flex md:flex-col gap-2 pt-2 md:pt-0">
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold transition-all font-mono flex items-center gap-2 justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
                      >
                        <span>Inspect Repo</span>
                        <span>↗</span>
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── ADDITIONAL LIVE REPOSITORIES ── */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-mono text-cyan-400/80 uppercase tracking-wider flex items-center gap-2">
              <span>┌─</span>
              <span className="text-slate-200 font-bold">ALL LIVE REPOSITORIES</span>
              <span>──────────────────────────────────────────────</span>
            </div>
            {reposLoading && (
              <span className="text-xs text-cyan-400 font-mono animate-pulse">
                Fetching GitHub API...
              </span>
            )}
          </div>

          {reposLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="cyber-glass-card rounded-lg p-4 space-y-2 animate-pulse"
                >
                  <div className="h-4 bg-slate-800 rounded w-1/3" />
                  <div className="h-3 bg-slate-800/60 rounded w-full" />
                  <div className="h-3 bg-slate-800/40 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : reposError ? (
            <div className="p-4 bg-red-950/20 border border-red-900/40 rounded text-xs text-red-400 font-mono flex items-center justify-between">
              <span>[!] GitHub sync fallback active</span>
              <button
                onClick={onRetry}
                className="px-3 py-1 bg-red-900/40 hover:bg-red-900/60 border border-red-700 rounded text-red-200 cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : pinnedRepos.length === 0 ? (
            <div className="p-4 cyber-glass-card rounded text-xs text-slate-400 font-mono text-center">
              [Repositories loaded from GitHub profile @narcisoJavier]
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pinnedRepos.map((repo) => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-glass-card rounded-lg p-4 transition-all flex flex-col justify-between group cursor-pointer relative"
                >
                  <div className="cyber-bracket-tl" />
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors font-mono">
                        {repo.name}
                      </span>
                      <span className="text-cyan-400 text-xs">↗</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono line-clamp-2 leading-relaxed">
                      {repo.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-3 mt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: langColors[repo.language] || '#3b82f6' }}
                        />
                        <span className="text-slate-300">{repo.language}</span>
                      </span>
                    )}
                    <span>★ {repo.stars}</span>
                    <span>⑂ {repo.forks}</span>
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
