"use client";
import React from 'react';
import Link from 'next/link';
import TypingGame from '@/components/TypingGame';
import { RESUME_TYPING_TEST } from '@/constants/typingGame';

export default function BreakPage() {
  return (
    <div className="min-h-screen bg-[#040711] text-slate-200 font-mono relative overflow-x-hidden">
      {/* Ambient Cyber Aurora Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none cyber-ambient-aurora" aria-hidden="true" />
      <div className="fixed inset-0 z-0 pointer-events-none cyber-grid-pattern opacity-20" aria-hidden="true" />

      {/* Top Header / Breadcrumbs */}
      <header className="relative z-30 w-full bg-[#040711]/90 backdrop-blur-xl border-b border-cyan-500/20 px-4 md:px-8 py-3 flex items-center justify-between text-xs shadow-lg">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 font-bold transition-all"
          >
            <span>←</span>
            <span>~/portfolio</span>
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300 font-bold">break_typing_engine.sh</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 font-bold font-orbitron flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
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
