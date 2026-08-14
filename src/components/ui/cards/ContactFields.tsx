"use client";
import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * GlitchSocialLink - Interactive social media link with glitch hover effect
 * Features: Custom callback on click, glitch animation on hover, accessible focus states
 */
export const GlitchSocialLink = memo(function GlitchSocialLink({
  href,
  icon,
  label,
  value,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  onClick?: () => void;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="group relative flex items-center gap-4 p-5 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-zinc-600 cursor-pointer overflow-hidden no-underline focus:outline-none focus:ring-2 focus:ring-zinc-400"
    >
      {/* Icon Container */}
      <div className="relative flex-shrink-0 w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:bg-zinc-800 group-hover:text-white transition-all duration-300">
        {icon}
      </div>

      {/* Text Content */}
      <div className="relative text-left">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
          {label}
        </span>
        <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors duration-300 block">
          {value}
        </span>
      </div>

      {/* Arrow Icon */}
      <svg
        className="relative ml-auto w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </motion.a>
  );
});

/**
 * CopyableField - Interactive field with copy-to-clipboard functionality
 * Features: Visual feedback on copy, fallback for older browsers, accessible buttons
 */
export const CopyableField = memo(function CopyableField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = value;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`group relative flex items-center gap-4 p-5 rounded-xl bg-zinc-950/80 border transition-all duration-300 cursor-pointer overflow-hidden ${
        copied ? 'border-white shadow-lg' : 'border-zinc-800 hover:border-zinc-600'
      }`}
    >
      {/* Icon Container */}
      <div
        className={`relative flex-shrink-0 w-12 h-12 rounded-lg border flex items-center justify-center transition-all duration-300 ${
          copied
            ? 'bg-zinc-800 border-zinc-700 text-white'
            : 'bg-zinc-900 border-zinc-800 text-zinc-400 group-hover:bg-zinc-800 group-hover:text-white'
        }`}
      >
        {icon}
      </div>

      {/* Text Content */}
      <div className="relative text-left flex-1 min-w-0">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
          {label}
        </span>
        <span
          className={`text-sm font-semibold transition-colors duration-300 block truncate ${
            copied ? 'text-white' : 'text-zinc-200 group-hover:text-white'
          }`}
        >
          {copied ? 'COPIED!' : value}
        </span>
      </div>

      {/* Copy Button */}
      <motion.button
        onClick={handleCopy}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={copied ? 'Copied' : `Copy ${label}`}
        className={`relative flex-shrink-0 w-8 h-8 rounded-md border flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-zinc-400 ${
          copied
            ? 'border-zinc-600 text-white bg-zinc-800'
            : 'border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-800'
        }`}
      >
        {copied ? (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        )}
      </motion.button>
    </motion.div>
  );
});
