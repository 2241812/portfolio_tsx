"use client";
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { resumeData } from '@/data/resumeData';

const FooterSection = memo(function FooterSection() {
  return (
    <footer className="w-full bg-[#06090e] border-t border-slate-800 py-8 px-4 font-mono text-xs text-slate-500">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>narcisoiii.dev • Posix Terminal UI • Next.js 16</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <a
            href="https://github.com/2241812"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            GitHub
          </a>
          <span>•</span>
          <a
            href={resumeData.personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            LinkedIn
          </a>
          <span>•</span>
          <a
            href={`mailto:${resumeData.personalInfo.email}`}
            className="hover:text-blue-400 transition-colors"
          >
            Email
          </a>
          <span>•</span>
          <a
            href="/break"
            className="hover:text-blue-400 transition-colors text-blue-300 font-semibold"
          >
            Typing Break
          </a>
        </div>
      </div>
    </footer>
  );
});

export default FooterSection;
