"use client";
import React from 'react';
import Link from 'next/link';
import TypingGame from '@/components/TypingGame';
import { RESUME_TYPING_TEST } from '@/constants/typingGame';

export default function BreakPage() {
  return (
    <div className="min-h-screen bg-[#06090e] text-slate-200 font-mono relative overflow-x-hidden">
      {/* Subtle Dark Blue Ambient Lighting */}
      <div className="fixed inset-0 z-0 pointer-events-none tui-ambient-glow" aria-hidden="true" />

      {/* Top Header / Breadcrumbs */}
      <header className="relative z-30 w-full bg-[#090d16]/90 backdrop-blur border-b border-slate-800 px-4 md:px-8 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-bold transition-colors"
          >
            <span>←</span>
            <span>~/portfolio</span>
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300">break_typing_engine.sh</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <span className="text-[11px] px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-900 font-bold">
            MONKEYTYPE CLI
          </span>
        </div>
      </header>

      <main className="relative z-20 max-w-6xl mx-auto px-4 py-8">
        <TypingGame testText={RESUME_TYPING_TEST} />
      </main>
    </div>
  );
}
