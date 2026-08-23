"use client";
import React, { memo, useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { animate } from 'animejs';
import { resumeData } from '@/data/resumeData';
import { useInView } from '@/hooks/useInView';
import { useGitHubAnalyzer } from '@/hooks/useGitHubAnalyzer';
import { mergeSkillsWithGitHub } from '@/utils/skillsAnalyzer';
import {
  Layers,
  Terminal,
  Gamepad2,
  ExternalLink,
  Code2,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import {
  containerVariants,
  cardVariants,
  headingVariants,
  SKILL_KEYWORD_MAP,
  type UnifiedProject,
} from './shared';

interface SkillsSectionProps {
  allProjects: UnifiedProject[];
}

export const SkillsSection = memo(function SkillsSection({ allProjects }: SkillsSectionProps) {
  const { ref, isInView } = useInView({ rootMargin: '200px', once: true });
  const { analysis, isLoading: isLoadingGitHub } = useGitHubAnalyzer('narcisoJavier', isInView);

  const enhancedSkills = useMemo(() => {
    return mergeSkillsWithGitHub(analysis?.skills ?? []);
  }, [analysis]);

  const [activeSkill, setActiveSkill] = useState<string>('Go');
  const inspectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inspectorRef.current) {
      animate(inspectorRef.current, {
        opacity: [0.5, 1],
        translateY: [8, 0],
        ease: 'outExpo',
        duration: 400,
      });
    }
  }, [activeSkill]);

  // Filter matching projects for the active skill
  const matchingProjects = useMemo(() => {
    if (!activeSkill) return [];
    const keywords = SKILL_KEYWORD_MAP[activeSkill] || [activeSkill.toLowerCase()];

    return allProjects.filter((project) => {
      const titleLower = project.title.toLowerCase();
      const descLower = project.description.toLowerCase();
      const roleLower = (project.role || '').toLowerCase();
      const langLower = (project.language || '').toLowerCase();

      return keywords.some(
        (kw) =>
          titleLower.includes(kw) ||
          descLower.includes(kw) ||
          roleLower.includes(kw) ||
          langLower.includes(kw)
      );
    });
  }, [activeSkill, allProjects]);

  const activeDescription =
    (resumeData.skillDescriptions as Record<string, string>)[activeSkill] ||
    'Core technical capability verified through active repository implementations, engine scripting, and systems architecture deliverables.';

  const categoryIcons: Record<string, React.ReactNode> = {
    'Programming Languages': <Code2 className="w-3.5 h-3.5 text-white" />,
    'Frameworks & Libraries': <Layers className="w-3.5 h-3.5 text-white" />,
    'DevOps & Infrastructure': <Terminal className="w-3.5 h-3.5 text-white" />,
    'Core Competencies': <Gamepad2 className="w-3.5 h-3.5 text-white" />,
  };

  return (
    <section id="skills" ref={ref} className="scroll-mt-20 w-full py-12 border-b border-white/10">
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
              <span>03 // MATRIX</span>
              <span className="text-zinc-600">/</span>
              <span>TECHNICAL CAPABILITIES &amp; RUNTIMES</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white uppercase font-display tracking-tight">
              Skills &amp; Technology Matrix
            </h2>
          </div>

          <span className="text-xs font-mono text-zinc-400">
            {isLoadingGitHub ? '// syncing telemetry...' : '// 2-pane interactive stack inspector'}
          </span>
        </motion.div>

        {/* 2-Pane Split Architectural Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT PANE: Categorized Skill Tree */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-7 studio-card p-5 sm:p-6 space-y-6"
          >
            <div className="studio-corner-tl" />
            <div className="studio-corner-br" />

            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono">
              <span className="text-white font-bold uppercase tracking-wider">
                Select Skill to Inspect
              </span>
              <span className="text-[11px] text-zinc-400">
                {Object.values(enhancedSkills).flat().length} Total Capabilities
              </span>
            </div>

            {Object.entries(enhancedSkills).map(([category, skills]) => (
              <div key={category} className="space-y-2.5">
                <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-2">
                  {categoryIcons[category] || <Sliders className="w-3.5 h-3.5 text-white" />}
                  <span>{category}</span>
                </div>

                <div className="flex flex-wrap gap-2" role="group" aria-label={category}>
                  {skills.map((skill) => {
                    const isSelected = activeSkill === skill.name;
                    return (
                      <button
                        key={skill.name}
                        onClick={() => setActiveSkill(skill.name)}
                        className={`px-3 py-1.5 text-xs font-mono transition-all duration-150 cursor-pointer select-none flex items-center gap-2 ${
                          isSelected
                            ? 'bg-white text-black font-bold shadow-md'
                            : 'bg-[#121218] text-zinc-300 border border-white/10 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        <span>{skill.name}</span>
                        {skill.verified && (skill.endorsements || 0) > 0 && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-none font-mono ${
                              isSelected
                                ? 'bg-black text-white font-bold'
                                : 'bg-black/60 text-zinc-400'
                            }`}
                            title={`Referenced in ${skill.endorsements} repository(ies)`}
                          >
                            {skill.endorsements}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>

          {/* RIGHT PANE: Live Inspector / Matching Projects */}
          <motion.div
            ref={inspectorRef}
            variants={cardVariants}
            className="lg:col-span-5 studio-card p-5 sm:p-6 flex flex-col justify-between space-y-5"
          >
            <div className="studio-corner-tl" />
            <div className="studio-corner-br" />

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 bg-white text-black font-bold uppercase">
                    ACTIVE
                  </span>
                  <span className="text-white font-bold text-sm uppercase tracking-wider">
                    {activeSkill}
                  </span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-zinc-400" />
              </div>

              {/* Technical Definition */}
              <div className="p-4 bg-black/60 border border-white/10 text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                {activeDescription}
              </div>

              {/* Linked Projects Deliverables */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-mono uppercase tracking-wider text-zinc-300 flex items-center justify-between">
                  <span className="text-zinc-400">Linked Projects</span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    ({matchingProjects.length} found)
                  </span>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {matchingProjects.length === 0 ? (
                    <div className="p-3 text-center text-xs text-zinc-500 font-mono bg-black/40 border border-white/5">
                      Applied across multiple systems and foundational coursework.
                    </div>
                  ) : (
                    matchingProjects.map((proj) => (
                      <div
                        key={proj.title}
                        className="p-3 bg-[#111116] border border-white/10 hover:border-white/30 transition-colors text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white font-mono">{proj.title}</span>
                          {proj.url && (
                            <a
                              href={proj.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-zinc-400 hover:text-white"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Telemetry Status */}
            <div className="pt-3 border-t border-white/10 text-[10px] text-zinc-500 font-mono flex justify-between">
              <span>SYNC: SWR CACHED</span>
              <span className="text-zinc-300 font-bold">● VERIFIED STACK</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
});

export default SkillsSection;
