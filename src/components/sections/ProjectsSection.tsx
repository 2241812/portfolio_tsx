"use client";
import React, { useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shield, Globe, Terminal, Cpu, Layers } from 'lucide-react';
import { ProjectPhysicsDeck, type DeckProjectItem } from '@/components/ui/ProjectPhysicsDeck';
import { AnimeTelemetryCard } from '@/components/ui/AnimeTelemetryCard';
import {
  containerVariants,
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
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const toggleExpand = useCallback((id: string) => {
    setExpandedProjectId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <section id="projects" className={`scroll-mt-20 w-full py-12 border-b border-white/10 ${className}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        className="w-full space-y-8"
      >
        {/* Studio Section Header with Title & Top-Right Anime.js Telemetry Card */}
        <motion.div
          variants={headingVariants}
          className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-white/10 pb-5 gap-4"
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest">
              <span>02 // WORKS &amp; ARCHIVES</span>
              <span className="text-zinc-600">/</span>
              <span>PROJECTS &amp; TELEMETRY</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white uppercase font-display tracking-tight">
              Featured Projects &amp; Code
            </h2>
          </div>

          {/* Top-Right Header Anime.js Telemetry HUD Card */}
          <div className="shrink-0">
            <AnimeTelemetryCard />
          </div>
        </motion.div>

        {/* Sole Dedicated Horizontal Momentum Physics Deck */}
        <ProjectPhysicsDeck
          projects={ALL_STUDIO_PROJECTS}
          expandedProjectId={expandedProjectId}
          onToggleExpand={toggleExpand}
        />
      </motion.div>
    </section>
  );
});

export default ProjectsSection;
