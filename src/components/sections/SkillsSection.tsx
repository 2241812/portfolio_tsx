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
  const { analysis, isLoading: isLoadingGitHub } = useGitHubAnalyzer('2241812', isInView);

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
      className="scroll-mt-24 w-full py-8 md:py-12 border-b border-slate-800/80"
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
          className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2"
        >
          <div className="flex items-center gap-3">
            <span className="text-blue-500 text-sm font-bold">[03]</span>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wider font-mono">
              SKILLS MATRIX & STACK INSPECTOR
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {isLoadingGitHub ? '// analyzing github tree...' : '// 2-pane interactive inspector'}
          </span>
        </motion.div>

        {/* 2-Pane Split Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT PANE: Categorized Skill Tree (7 cols) */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-7 bg-[#090d16] border border-slate-800 rounded p-4 sm:p-5 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 text-xs text-slate-400 font-mono">
              <span>┌─ STACK SELECTION</span>
              <span className="text-[10px] text-slate-500">Click or focus to inspect</span>
            </div>

            {Object.entries(enhancedSkills).map(([category, skills]) => (
              <div key={category} className="space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
                  <span className="text-blue-500">▶</span>
                  <span>{category}</span>
                </div>

                <div className="flex flex-wrap gap-1.5" role="group" aria-label={category}>
                  {skills.map((skill) => {
                    const isSelected = activeSkill === skill.name;
                    return (
                      <button
                        key={skill.name}
                        onClick={() => setActiveSkill(skill.name)}
                        className={`px-2.5 py-1 rounded text-xs font-mono transition-all duration-150 cursor-pointer select-none flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-blue-950 text-blue-200 border border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.2)] font-bold'
                            : 'bg-[#06090e] text-slate-400 border border-slate-800 hover:border-slate-600 hover:text-slate-200'
                        }`}
                      >
                        <span>{skill.name}</span>
                        {skill.verified && (skill.endorsements || 0) > 0 && (
                          <span
                            className={`text-[9px] px-1 rounded ${
                              isSelected
                                ? 'bg-blue-800 text-blue-100'
                                : 'bg-slate-900 text-slate-500'
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
            className="lg:col-span-5 bg-[#090d16] border border-slate-800 rounded p-4 sm:p-5 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 text-xs font-mono">
                <span className="text-blue-400 font-bold">INSPECTOR: {activeSkill}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-900">
                  ACTIVE
                </span>
              </div>

              {/* Definition */}
              <div className="p-3 rounded bg-[#06090e] border border-slate-800/80 text-xs text-slate-300 font-mono leading-relaxed">
                {activeDescription}
              </div>

              {/* Associated Deliverables */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center justify-between">
                  <span>Linked Projects</span>
                  <span className="text-[10px] text-slate-500">
                    ({matchingProjects.length} found)
                  </span>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1 thin-scrollbar">
                  {matchingProjects.length === 0 ? (
                    <div className="p-3 text-center text-xs text-slate-500 font-mono bg-[#06090e] rounded border border-slate-900">
                      Core competency across multiple workflows and academic modules.
                    </div>
                  ) : (
                    matchingProjects.map((proj) => (
                      <div
                        key={proj.title}
                        className="p-2.5 rounded bg-[#06090e] border border-slate-800/80 text-xs font-mono space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">{proj.title}</span>
                          {proj.url && (
                            <a
                              href={proj.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-[11px]"
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
            <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono flex justify-between">
              <span>Stack analyzer: SWR synchronized</span>
              <span className="text-emerald-400">● 100% verified</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
});

export default SkillsSection;
