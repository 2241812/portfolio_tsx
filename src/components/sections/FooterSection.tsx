"use client";
import React, { memo } from 'react';
import { resumeData } from '@/data/resumeData';

const FooterSection = memo(function FooterSection() {
  return (
    <footer className="w-full bg-[#040711]/90 backdrop-blur-md border-t border-blue-900/30 py-8 px-4 font-mono text-xs text-slate-400">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse" />
          <span className="text-slate-300">narcisoiii.dev • Cyber-Luxe Architecture • Next.js 16</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <a
            href="https://github.com/narcisoJavier"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-300 transition-colors"
          >
            GitHub
          </a>
          <span>•</span>
          <a
            href={resumeData.personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-300 transition-colors"
          >
            LinkedIn
          </a>
          <span>•</span>
          <a
            href={`mailto:${resumeData.personalInfo.email}`}
            className="hover:text-cyan-300 transition-colors"
          >
            Email
          </a>
          <span>•</span>
          <a
            href="/break"
            className="hover:text-cyan-300 transition-colors text-cyan-400 font-semibold"
          >
            Typing Break
          </a>
        </div>
      </div>
    </footer>
  );
});

export default FooterSection;
