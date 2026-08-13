"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

const Scene = dynamic(() => import('@/components/3d/Scene'), {
  ssr: false,
});

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [loadingPhase, setLoadingPhase] = useState<'typing' | 'finished' | 'settled'>('typing');
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    if (loadingPhase !== 'typing') {
      setLoadProgress(100);
      return;
    }

    const duration = 2000;
    const intervalTime = 40;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setLoadProgress((currentStep / steps) * 100);

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, intervalTime);

    const timer = setTimeout(() => {
      setLoadingPhase('finished');
      setTimeout(() => {
        setLoadingPhase('settled');
      }, 400);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [loadingPhase]);

  useEffect(() => {
    if (loadingPhase !== 'settled') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [loadingPhase]);

  useEffect(() => {
    if (loadingPhase === 'settled') {
      onComplete();
    }
  }, [loadingPhase, onComplete]);

  return (
    <AnimatePresence>
      {loadingPhase !== 'settled' && (
        <motion.div
          key="loading-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#06090e] font-mono"
        >
          <div className="absolute inset-0 z-20" aria-hidden="true">
            <ErrorBoundary fallback={<div className="w-full h-full bg-[#06090e]" />}>
              <Scene isSettled={false} />
            </ErrorBoundary>
          </div>

          <motion.div
            key="loading-top"
            initial={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0, transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } }}
            className="absolute top-0 left-0 w-full h-[15%] bg-gradient-to-b from-[#06090e] via-[#06090e] to-transparent z-10 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-center"
            >
              <div className="font-mono text-xs tracking-[0.3em] text-blue-400 uppercase mb-1">
                SYSTEM BOOT // POSIX ENVIRONMENT
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            key="loading-bottom"
            initial={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0, transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } }}
            className="absolute bottom-0 left-0 w-full h-[25%] bg-gradient-to-t from-[#06090e] via-[#06090e] to-transparent z-10 flex flex-col items-center justify-center pb-8"
          >
            <div className="w-64 max-w-xs space-y-2">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span>INITIALIZING TUI</span>
                </span>
                <span className="text-blue-400 font-bold">{Math.round(loadProgress)}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1 bg-slate-900 border border-slate-800 rounded overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500 rounded"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>

              <div className="text-[10px] text-slate-600 text-center">
                Press [:] or [?] anytime for command mode
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
