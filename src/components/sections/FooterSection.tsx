"use client";
import React, { memo } from 'react';
import { resumeData } from '@/data/resumeData';

const FooterSection = memo(function FooterSection() {
  return (
    <footer className="w-full bg-[#09090b]/90 backdrop-blur-md border-t border-zinc-800 py-8 px-4 font-mono text-xs text-zinc-500">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          <span className="text-zinc-400">narcisoiii.dev • Next.js 16 • React 19</span>
        </div>

        <div className="flex items-center gap-4 text-zinc-500">
          <a
            href="https://github.com/narcisoJavier"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
          <span>•</span>
          <a
            href={resumeData.personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <span>•</span>
          <a
            href={`mailto:${resumeData.personalInfo.email}`}
            className="hover:text-white transition-colors"
          >
            Email
          </a>
          <span>•</span>
          <a
            href="/break"
            className="hover:text-white transition-colors text-zinc-300 font-semibold"
          >
            Typing Break
          </a>
        </div>
      </div>
    </footer>
  );
});

export default FooterSection;
