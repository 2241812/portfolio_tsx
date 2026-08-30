'use client';

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col items-center justify-center p-6 text-center font-mono">
      <div className="border border-red-500/30 bg-red-950/20 p-8 max-w-md w-full space-y-4 shadow-2xl">
        <span className="text-xs uppercase tracking-widest text-red-400 font-bold">
          SYSTEM EXCEPTION // RUNTIME ERROR
        </span>
        <p className="text-xs text-zinc-400">
          {error.message || 'An unexpected rendering error occurred in the studio layout.'}
        </p>
        <button
          onClick={reset}
          className="w-full py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors cursor-pointer"
        >
          Re-initialize Session
        </button>
      </div>
    </div>
  );
}
