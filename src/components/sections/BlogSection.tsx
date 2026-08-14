"use client";
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { containerVariants, cardVariants, headingVariants } from './shared';
import { useInView } from '@/hooks/useInView';
import { useGistData } from '@/hooks/useGistData';

const BlogSection = memo(function BlogSection() {
  const { ref, isInView } = useInView({ rootMargin: '200px', once: true });
  const { gists, isLoading, isError, error, retry } = useGistData('narcisoJavier', isInView);

  // Filter for gists that have markdown files or specific descriptions to act as "blogs"
  const blogGists = gists
    .filter(
      (gist) =>
        Object.values(gist.files).some(
          (file) => file.language === 'Markdown' || file.type === 'text/markdown'
        ) || gist.description.toLowerCase().includes('blog')
    )
    .slice(0, 4);

  return (
    <section
      id="gists"
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
            <span className="text-cyan-400 text-sm font-bold font-orbitron">[05]</span>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wider font-orbitron">
              DOCUMENTATION, NOTES &amp; GISTS
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {isLoading ? '// telemetry: fetching gists...' : '// status: live markdown reader'}
          </span>
        </motion.div>

        {isError ? (
          <div className="w-full bg-red-950/20 border border-red-900/40 rounded p-6 flex flex-col items-center justify-center font-mono">
            <span className="text-red-400 text-xs mb-1">ERR_GIST_FETCH_FAILED</span>
            <span className="text-slate-500 text-[11px] mb-3">{error}</span>
            <button
              onClick={retry}
              className="px-4 py-1.5 text-xs text-red-200 border border-red-700 bg-red-900/40 rounded hover:bg-red-900/60 transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : blogGists.length === 0 && !isLoading ? (
          <div className="w-full bg-[#090d16] border border-slate-800 rounded p-6 text-center font-mono">
            <span className="text-slate-400 text-xs">
              {gists.length > 0
                ? `Found ${gists.length} public gist(s).`
                : 'No external gists detected. Technical notes are published to GitHub repositories.'}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogGists.map((gist) => {
              const fileKey = Object.keys(gist.files)[0];
              const file = gist.files[fileKey];
              const date = new Date(gist.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <motion.a
                  key={gist.id}
                  href={gist.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={cardVariants}
                  className="cyber-glass-card rounded p-4 transition-all flex flex-col justify-between group cursor-pointer font-mono relative"
                >
                  <div className="cyber-bracket-tl" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="text-[11px] text-cyan-400 font-bold"># {gist.id.substring(0, 7)}</span>
                      <span>{date}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {gist.description || file.filename || `Gist ${gist.id.substring(0, 7)}`}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-800/80 text-xs">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                      {file.language || 'Markdown'}
                    </span>
                    <span className="text-cyan-400 group-hover:text-cyan-300 text-xs flex items-center gap-1 font-bold">
                      <span>Read Document</span>
                      <span>↗</span>
                    </span>
                  </div>
                </motion.a>
              );
            })}
          </div>
        )}
      </motion.div>
    </section>
  );
});

export default BlogSection;