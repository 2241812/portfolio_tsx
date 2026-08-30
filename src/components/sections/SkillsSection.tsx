'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { containerVariants, headingVariants, cardVariants, type UnifiedProject } from './shared';
import { ObsidianSkillGraph } from '@/components/ui/ObsidianSkillGraph';
import { resumeData } from '@/data/resumeData';
import { getProjectEvidence } from '@/data/projectEvidence';

interface SkillsSectionProps {
  allProjects?: UnifiedProject[];
}

const DEFAULT_PROJECTS: UnifiedProject[] = resumeData.projects.map((p) => ({
  title: p.title,
  description: p.description,
  source: 'resume' as const,
  role: p.role,
  language: getProjectEvidence(p.id)?.technologyTags[0] || 'TypeScript',
}));

export const SkillsSection = memo(function SkillsSection({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  allProjects = DEFAULT_PROJECTS,
}: SkillsSectionProps) {
  const { ref } = useInView({ rootMargin: '200px', once: true });

  return (
    <section id="skills" ref={ref} className="scroll-mt-20 w-full py-12 border-b border-white/10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        className="w-full space-y-6"
      >
        {/* Studio Section Header */}
        <motion.div
          variants={headingVariants}
          className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4"
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest">
              <span>03 // ARCHITECTURE &amp; RUNTIMES</span>
              <span className="text-zinc-600">/</span>
              <span>SYSTEM TOPOLOGY</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white uppercase font-display tracking-tight">
              Skills &amp; Architecture Graph
            </h2>
          </div>

          <span className="text-xs font-mono text-zinc-400">
            {`// Search or select a node to inspect evidence and connected work`}
          </span>
        </motion.div>

        {/* The Force-Directed Graph Engine */}
        <motion.div variants={cardVariants}>
          <ObsidianSkillGraph />
        </motion.div>
      </motion.div>
    </section>
  );
});

export default SkillsSection;
