"use client";
import React, { memo } from 'react';
import { resumeData } from '@/data/resumeData';
import { ArrowUp } from 'lucide-react';

export const FooterSection = memo(function FooterSection() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#08080a] border-t border-white/10 py-10 px-4 font-mono text-xs text-zinc-400">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 bg-white" />
            <span className="text-white font-bold uppercase tracking-wider">
              {resumeData.personalInfo.name} &apos;//&apos; STUDIO
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans">
            Computer Science • Saint Louis University &apos;27 • Baguio City, Philippines
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 text-zinc-400 text-xs">
          <a
            href={resumeData.personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
          <span>/</span>
          <a
            href={resumeData.personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <span>/</span>
          <a
            href={`mailto:${resumeData.personalInfo.email}`}
            className="hover:text-white transition-colors"
          >
            Email
          </a>
          <span>/</span>
          <button
            onClick={scrollToTop}
            className="text-zinc-200 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
});

export default FooterSection;
