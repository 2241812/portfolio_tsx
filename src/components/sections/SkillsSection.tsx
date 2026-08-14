"use client";
import React, { memo, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { resumeData } from '@/data/resumeData';
import { useInView } from '@/hooks/useInView';
import { useGitHubAnalyzer } from '@/hooks/useGitHubAnalyzer';
import { mergeSkillsWithGitHub } from '@/utils/skillsAnalyzer';
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

const SkillsSection = memo(function SkillsSection({ allProjects }: SkillsSectionProps) {
  const { ref, isInView } = useInView({ rootMargin: '200px', once: true });
  const { analysis, isLoading: isLoadingGitHub } = useGitHubAnalyzer('narcisoJavier', isInView);

  const enhancedSkills = useMemo(() => {
    return mergeSkillsWithGitHub(analysis?.skills ?? []);
  }, [analysis]);

  const [activeSkill, setActiveSkill] = useState<string>('Python');

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
    'Core technical capability verified through active repository implementations and project deliverables.';

  return (
    <section
      id="skills"
      ref={ref}
      className="scroll-mt-24 w-full py-8 md:py-12 border-b border-blue-900/30"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        className="w-full space-y-6"
      >
        {/* Section Header */}
        <motion.div
          variants={headingVariants}
          className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-blue-900/30 pb-3 gap-2"
        >
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 text-sm font-bold font-orbitron">[03]</span>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wider font-orbitron">
              SKILLS MATRIX &amp; STACK INSPECTOR
            </h2>
          </div>
          <span className="text-xs text-cyan-400/80 font-mono">
            {isLoadingGitHub ? '// telemetry: analyzing github tree...' : '// status: 2-pane interactive inspector'}
          </span>
        </motion.div>

        {/* 2-Pane Split Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT PANE: Categorized Skill Tree (7 cols) */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-7 cyber-glass-card rounded-xl p-5 sm:p-6 space-y-5 relative"
          >
            <div className="cyber-bracket-tl" />
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs text-slate-400 font-mono">
              <span className="text-cyan-400 font-bold">┌─ STACK SELECTION MATRIX</span>
              <span className="text-[10px] text-slate-400">Click to inspect linked projects</span>
            </div>

            {Object.entries(enhancedSkills).map(([category, skills]) => (
              <div key={category} className="space-y-2.5">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">▶</span>
                  <span>{category}</span>
                </div>

                <div className="flex flex-wrap gap-2" role="group" aria-label={category}>
                  {skills.map((skill) => {
                    const isSelected = activeSkill === skill.name;
                    return (
                      <button
                        key={skill.name}
                        onClick={() => setActiveSkill(skill.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-150 cursor-pointer select-none flex items-center gap-2 ${
                          isSelected
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-400'
                            : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-200'
                        }`}
                      >
                        <span>{skill.name}</span>
                        {skill.verified && (skill.endorsements || 0) > 0 && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                              isSelected
                                ? 'bg-black/40 text-cyan-200'
                                : 'bg-slate-800 text-slate-400'
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

          {/* RIGHT PANE: Live Inspector / Matching Projects (5 cols) */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-5 cyber-glass-card rounded-xl p-5 sm:p-6 flex flex-col justify-between space-y-4 relative"
          >
            <div className="cyber-bracket-tl" />
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono">
                <span className="text-cyan-400 font-bold font-orbitron">INSPECTOR // {activeSkill}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                  ACTIVE_INSPECTOR
                </span>
              </div>

              {/* Definition */}
              <div className="p-3.5 rounded-lg bg-[#02050c] border border-cyan-900/40 text-xs text-slate-300 font-mono leading-relaxed shadow-inner">
                {activeDescription}
              </div>

              {/* Associated Deliverables */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center justify-between">
                  <span className="text-cyan-400">Linked Deliverables</span>
                  <span className="text-[10px] text-slate-400">
                    ({matchingProjects.length} found)
                  </span>
                </div>

                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 thin-scrollbar">
                  {matchingProjects.length === 0 ? (
                    <div className="p-3 text-center text-xs text-slate-400 font-mono bg-[#02050c] rounded-lg border border-slate-800">
                      Core competency across multiple workflows and academic modules.
                    </div>
                  ) : (
                    matchingProjects.map((proj) => (
                      <div
                        key={proj.title}
                        className="p-3 rounded-lg bg-[#02050c] border border-slate-800 hover:border-cyan-500/50 transition-colors text-xs font-mono space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-100">{proj.title}</span>
                          {proj.url && (
                            <a
                              href={proj.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 text-[11px] font-bold"
                            >
                              ↗
                            </a>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Quick Status Note */}
            <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 font-mono flex justify-between">
              <span>Stack analyzer: SWR synchronized</span>
              <span className="text-emerald-400 font-bold">● 100% verified</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
});

export default SkillsSection;
