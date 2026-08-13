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
    id: 'multitask',
    rank: '#01',
    title: 'MultiTask_ContextSwitch',
    role: 'Python & Automation Developer',
    tech: ['Python', 'PyQt6', 'Process Polling', 'Win32 API', 'Automation'],
    description:
      'Engineered a desktop workflow automator that continuously monitors asynchronous web-based AI generation tasks, triggering real-time window focus switching and state alerts via a custom PyQt6 engine.',
    architecture: 'Background Poller ──► Event Trigger ──► PyQt6 Focus Switcher ──► OS Window Target',
    link: 'https://github.com/2241812/MultiTask_ContextSwitch',
    badge: 'FLAGSHIP AUTOMATION',
  },
  {
    id: 'campus-navigator',
    rank: '#02',
    title: 'WebDev_Campus-Navigator_CS312',
    role: 'Full-Stack & Systems Developer',
    tech: ['Go', 'Docker Compose', 'Node.js', 'PHP', 'Dijkstra Algorithm'],
    description:
      'Architected a containerized microservices platform for campus navigation. Deployed independent Go routing services, PHP/Node endpoints, and container isolation to calculate shortest paths via Dijkstra algorithm.',
    architecture: 'Client UI ──► Go Routing Service (Dijkstra) ──► Docker Compose Mesh ──► API Gateway',
    link: 'https://github.com/2241812/WebDev_Campus-Navigator_CS312',
    badge: 'MICROSERVICES & ALGORITHMS',
  },
  {
    id: 'hand-sign',
    rank: '#03',
    title: 'Basic Hand Sign Recognition System',
    role: 'AI & Computer Vision Prototype',
    tech: ['Python', 'CNN', 'Computer Vision', 'OpenCV', 'Colab'],
    description:
      'Constructed a convolutional neural network (CNN) image classification pipeline to interpret hand gestures from real-time webcam video feeds, benchmarking inference accuracy across multiple sign categories.',
    architecture: 'Webcam Stream ──► Frame Preprocessor ──► CNN Classifier ──► Gesture Output',
    link: 'https://colab.research.google.com/drive/1JtmdmGKfQzO4xnSUnl4rRVXulx5v6TJG?usp=sharing',
    badge: 'VISION & AI PIPELINE',
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
      className="scroll-mt-24 w-full py-8 md:py-12 border-b border-slate-800/80"
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
          className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2"
        >
          <div className="flex items-center gap-3">
            <span className="text-blue-500 text-sm font-bold">[02]</span>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wider font-mono">
              FEATURED PROJECTS & ARCHITECTURE
            </h2>
          </div>
          <span className="text-xs text-blue-400 font-mono">
            ★ TOP 3 HIGHLIGHTS & LIVE REPOSITORIES
          </span>
        </motion.div>

        {/* ── TOP 3 SPOTLIGHT SECTION ── */}
        <div className="space-y-4">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <span>┌─</span>
            <span className="text-slate-300 font-bold">FLAGSHIP PROJECTS SPOTLIGHT</span>
            <span>──────────────────────────────────────────────</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {TOP_PROJECTS.map((proj, idx) => (
              <motion.div
                key={proj.id}
                variants={cardVariants}
                className="bg-[#090d16] border border-slate-800 hover:border-blue-500/70 rounded p-4 sm:p-6 transition-all duration-200 group relative overflow-hidden shadow-lg"
              >
                {/* Subtle dark blue ambient gradient */}
                <div className="absolute top-0 right-0 w-64 h-32 bg-blue-600/5 group-hover:bg-blue-600/10 blur-2xl transition-all pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60 text-xs font-bold font-mono">
                        {proj.rank}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-blue-300 transition-colors font-mono">
                        {proj.title}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-mono">
                        {proj.badge}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 font-mono">
                      Role: <span className="text-slate-200 font-semibold">{proj.role}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono pt-1">
                      {proj.description}
                    </p>

                    {/* Architecture flow */}
                    <div className="pt-2">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-mono">
                        Pipeline / Architecture:
                      </div>
                      <div className="px-3 py-1.5 rounded bg-[#06090e] border border-slate-800/90 text-[11px] text-blue-300 font-mono overflow-x-auto whitespace-nowrap">
                        {proj.architecture}
                      </div>
                    </div>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {proj.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 text-[11px] font-mono"
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
                        className="px-3 py-2 rounded bg-blue-950 hover:bg-blue-900 border border-blue-700/60 text-blue-200 text-xs font-bold transition-colors font-mono flex items-center gap-1.5 justify-center"
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
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <span>┌─</span>
              <span className="text-slate-300 font-bold">ALL LIVE REPOSITORIES</span>
              <span>──────────────────────────────────────────────</span>
            </div>
            {reposLoading && (
              <span className="text-xs text-blue-400 font-mono animate-pulse">
                Fetching GitHub API...
              </span>
            )}
          </div>

          {reposLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-[#090d16] border border-slate-800 rounded p-4 space-y-2 animate-pulse"
                >
                  <div className="h-4 bg-slate-800 rounded w-1/3" />
                  <div className="h-3 bg-slate-800/60 rounded w-full" />
                  <div className="h-3 bg-slate-800/40 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : reposError ? (
            <div className="p-4 bg-red-950/20 border border-red-900/40 rounded text-xs text-red-400 font-mono flex items-center justify-between">
              <span>[!] GitHub sync failed (rate limit or network)</span>
              <button
                onClick={onRetry}
                className="px-3 py-1 bg-red-900/40 hover:bg-red-900/60 border border-red-700 rounded text-red-200 cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : pinnedRepos.length === 0 ? (
            <div className="p-4 bg-[#090d16] border border-slate-800 rounded text-xs text-slate-500 font-mono text-center">
              [No additional pinned repositories found]
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pinnedRepos.map((repo) => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#090d16] border border-slate-800/90 hover:border-blue-500/60 rounded p-4 transition-colors flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-blue-300 transition-colors font-mono">
                        {repo.name}
                      </span>
                      <span className="text-slate-500 text-xs">↗</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono line-clamp-2 leading-relaxed">
                      {repo.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-3 mt-2 border-t border-slate-900 text-[10px] text-slate-500 font-mono">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: langColors[repo.language] || '#3b82f6' }}
                        />
                        <span className="text-slate-400">{repo.language}</span>
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
