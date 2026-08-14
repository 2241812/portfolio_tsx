"use client";
import React from 'react';
import Link from 'next/link';
import TypingGame from '@/components/TypingGame';
import { RESUME_TYPING_TEST } from '@/constants/typingGame';

export default function BreakPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 font-mono relative overflow-x-hidden">
      {/* Ambient Monochrome Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none cyber-ambient-aurora" aria-hidden="true" />
      <div className="fixed inset-0 z-0 pointer-events-none cyber-grid-pattern opacity-20" aria-hidden="true" />

      {/* Top Header / Breadcrumbs */}
      <header className="relative z-30 w-full bg-[#101216]/90 backdrop-blur-xl border-b border-zinc-800 px-4 md:px-8 py-3 flex items-center justify-between text-xs shadow-lg">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 font-bold transition-all"
          >
            <span>←</span>
            <span>~/portfolio</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-200 font-bold">break_typing_engine.sh</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-200 border border-zinc-700 font-bold font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>SPEED_ARENA // v2.0</span>
          </span>
        </div>
      </header>

      <main className="relative z-20 max-w-6xl mx-auto px-4 py-6 md:py-10">
        <TypingGame testText={RESUME_TYPING_TEST} />
      </main>
    </div>
  );
}
