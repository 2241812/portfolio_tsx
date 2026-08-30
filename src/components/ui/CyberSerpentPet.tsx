'use client';

import React, { memo } from 'react';
import { Bot, Radio, ArrowUpRight } from 'lucide-react';
import { useWebMCPListener } from '@/lib/webmcpEvents';

/**
 * Minimal WebMCP entry point.
 *
 * This deliberately stays a button rather than pretending to be a literal pet:
 * it is the human-facing trigger for the WebMCP agent console and its live
 * activity state.
 */
export const CyberSerpentPet = memo(function CyberSerpentPet() {
  const { activeToolCall } = useWebMCPListener();
  const isActive = Boolean(activeToolCall);

  const handleOpenConsole = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('webmcp:open-simulator'));
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-40 select-none sm:right-6">
      <button
        type="button"
        onClick={handleOpenConsole}
        className={`pointer-events-auto group flex min-h-11 items-center gap-2.5 border px-3 py-2 text-left font-mono shadow-2xl transition-[background-color,border-color,box-shadow,transform] active:scale-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 focus-visible:outline-offset-4 ${
          isActive
            ? 'border-emerald-300/80 bg-[#071512] text-emerald-100 shadow-emerald-950/60'
            : 'border-white/20 bg-[#09090d]/95 text-white hover:border-emerald-400/60 hover:bg-[#101b18]'
        }`}
        aria-label={isActive ? 'WebMCP tool activity is active. Open the agent console.' : 'Open WebMCP agent console and inquiry hub'}
        title="Open WebMCP Agent Hub"
      >
        <span
          aria-hidden="true"
          className={`relative flex h-7 w-7 shrink-0 items-center justify-center border ${
            isActive ? 'border-emerald-300/70 bg-emerald-400/15' : 'border-white/20 bg-white/5'
          }`}
        >
          <Bot className={`h-4 w-4 ${isActive ? 'text-emerald-300' : 'text-zinc-200'}`} strokeWidth={1.7} />
          <span className="absolute -bottom-1 -right-1 flex h-3 w-3 items-center justify-center bg-[#09090d]">
            <Radio className={`h-2.5 w-2.5 ${isActive ? 'text-emerald-300' : 'text-zinc-500'}`} strokeWidth={2} />
          </span>
        </span>

        <span className="flex min-w-0 flex-col leading-none">
          <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.16em]">
            <span>WEBMCP</span>
          </span>
          <span className="mt-1 text-[9px] uppercase tracking-[0.12em] text-zinc-400 group-hover:text-emerald-300">
            {isActive ? 'Tool active' : 'Open agent hub'}
          </span>
        </span>

        <ArrowUpRight className="ml-1 h-3.5 w-3.5 shrink-0 text-zinc-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-300" />
      </button>
    </div>
  );
});

export default CyberSerpentPet;
