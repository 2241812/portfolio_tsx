"use client";
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { containerVariants, cardVariants, headingVariants } from './shared';
import { useInView } from '@/hooks/useInView';
import { useGistData } from '@/hooks/useGistData';
import { FileText, ExternalLink, BookOpen } from 'lucide-react';

export const BlogSection = memo(function BlogSection() {
  const { ref, isInView } = useInView({ rootMargin: '200px', once: true });
  const { gists, isLoading, isError, error, retry } = useGistData('narcisoJavier', isInView);

  const blogGists = gists
    .filter(
      (gist) =>
        Object.values(gist.files).some(
          (file) => file.language === 'Markdown' || file.type === 'text/markdown'
        ) || gist.description.toLowerCase().includes('blog')
    )
    .slice(0, 4);

  return (
    <section id="notes" ref={ref} className="scroll-mt-20 w-full py-12 border-b border-white/10">
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
              <span>05 // WRITING &amp; NOTES</span>
              <span className="text-zinc-600">/</span>
              <span>TECHNICAL DOCUMENTATION &amp; GISTS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white uppercase font-display tracking-tight">
              Publications &amp; Notes
            </h2>
          </div>

          <span className="text-xs font-mono text-zinc-400">
            {isLoading ? '// fetching gists...' : '// live markdown archives'}
          </span>
        </motion.div>

        {isError ? (
          <div className="studio-card p-6 flex flex-col items-center justify-center font-mono text-center">
            <span className="text-zinc-400 text-xs mb-1">GIST_SYNC_OFFLINE</span>
            <span className="text-zinc-500 text-[11px] mb-3">{error}</span>
            <button
              onClick={retry}
              className="px-4 py-1.5 text-xs text-black bg-white font-bold cursor-pointer"
            >
              Retry Sync
            </button>
          </div>
        ) : blogGists.length === 0 && !isLoading ? (
          <div className="studio-card p-6 text-center font-mono">
            <span className="text-zinc-400 text-xs">
              {gists.length > 0
                ? `Found ${gists.length} public gist(s).`
                : 'Technical notes and architectural documentation are maintained in repository READMEs.'}
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
                  className="studio-card p-5 flex flex-col justify-between group cursor-pointer"
                >
                  <div className="studio-corner-tl" />
                  <div className="studio-corner-br" />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                      <span className="text-white font-bold"># {gist.id.substring(0, 7)}</span>
                      <span>{date}</span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-zinc-200 line-clamp-2 font-display">
                      {gist.description || file.filename || `Gist ${gist.id.substring(0, 7)}`}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/5 text-xs font-mono">
                    <span className="text-[10px] px-2 py-0.5 bg-[#14141a] text-zinc-300 border border-white/10">
                      {file.language || 'Markdown'}
                    </span>
                    <span className="text-zinc-400 group-hover:text-white flex items-center gap-1">
                      <span>Read Note</span>
                      <ExternalLink className="w-3 h-3" />
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