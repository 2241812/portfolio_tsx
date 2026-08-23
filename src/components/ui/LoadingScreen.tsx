"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    const duration = 1200;
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min((currentStep / steps) * 100, 100);
      setLoadProgress(nextProgress);

      if (currentStep >= steps) {
        clearInterval(interval);
        setTimeout(() => {
          setIsSettled(true);
          onComplete();
        }, 200);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isSettled && (
        <motion.div
          key="studio-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between p-8 sm:p-12 bg-[#08080a] text-white select-none pointer-events-none"
        >
          {/* Top Stamp */}
          <div className="w-full flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>NARCISO III JAVIER // STUDIO</span>
            <span>CAR // PH [16.40°N]</span>
          </div>

          {/* Center Brand Title in Syne */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight uppercase font-display">
              NARCISO JAVIER
            </h1>
            <p className="text-xs sm:text-sm font-mono text-zinc-400 tracking-widest uppercase">
              Systems Architecture • Game Development
            </p>
          </div>

          {/* Bottom Progress Bar & Percent */}
          <div className="w-full max-w-sm space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <span className="uppercase tracking-widest">INITIALIZING STUDIO WORKSPACE</span>
              <span className="text-white font-bold">{Math.round(loadProgress)}%</span>
            </div>
            <div className="w-full h-0.5 bg-zinc-900 border border-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-white"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
