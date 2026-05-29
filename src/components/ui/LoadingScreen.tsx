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

    const duration = 3000;
    const intervalTime = 50;
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
      }, 600);
    }, 3000);

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
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 z-20" aria-hidden="true">
            <ErrorBoundary fallback={<div className="w-full h-full bg-neutral-950" />}>
              <Scene isSettled={false} />
            </ErrorBoundary>
          </div>

          <motion.div
            key="loading-top"
            initial={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            className="absolute top-0 left-0 w-full h-[15%] bg-gradient-to-b from-neutral-950 via-neutral-950 to-transparent z-10 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center"
            >
              <div className="font-mono text-xs md:text-sm tracking-[0.5em] text-cyan-500/60 uppercase mb-2">
                Initializing System
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full h-[55%] flex items-center justify-center pointer-events-none z-30"
          >
            <div className="absolute inset-x-2 sm:inset-x-8 md:inset-x-24 inset-y-4 border border-cyan-500/20 rounded-lg">
              <div className="absolute -top-1 -left-1 w-3 sm:w-4 h-3 sm:h-4 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute -top-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute -bottom-1 -left-1 w-3 sm:w-4 h-3 sm:h-4 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute -bottom-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 border-b-2 border-r-2 border-cyan-400" />
            </div>

            <div className="absolute inset-x-2 sm:inset-x-8 md:inset-x-24 inset-y-4 overflow-hidden pointer-events-none">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`h-line-${i}`}
                  className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
                  initial={{ top: `${25 + i * 25}%`, opacity: 0, scaleX: 0 }}
                  animate={{
                    opacity: [0, 0.6, 0],
                    scaleX: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.4,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "easeInOut"
                  }}
                />
              ))}
              {[0, 1].map((i) => (
                <motion.div
                  key={`v-line-${i}`}
                  className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"
                  initial={{ left: i === 0 ? '0%' : '100%' }}
                  animate={{
                    left: i === 0 ? ['0%', '50%'] : ['100%', '50%'],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                />
              ))}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-cyan-400/10 blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 h-full flex justify-center gap-8 overflow-hidden">
                {['<', '/', '>', '{', '}', '=', ';', '0', '1'].map((char, i) => (
                  <motion.span
                    key={`stream-${i}`}
                    className="font-mono text-cyan-400/30 text-xs"
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{
                      y: [100, -200],
                      opacity: [0, 0.5, 0],
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="absolute left-1 sm:left-2 md:left-12 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
              <span className="font-mono text-[8px] sm:text-[10px] md:text-xs tracking-[0.3em] text-cyan-500/40 uppercase whitespace-nowrap">
                3D Model
              </span>
            </div>
            <div className="absolute right-1 sm:right-2 md:right-12 top-1/2 -translate-y-1/2 rotate-90 origin-center">
              <span className="font-mono text-[8px] sm:text-[10px] md:text-xs tracking-[0.3em] text-cyan-500/40 uppercase whitespace-nowrap">
                Keyboard
              </span>
            </div>
          </motion.div>

          <motion.div
            key="loading-bottom"
            initial={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-neutral-950 via-neutral-950 to-transparent z-10 flex flex-col items-center justify-center gap-4 sm:gap-6 px-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center gap-3 sm:gap-4"
            >
              <div className="relative font-mono text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-widest text-neutral-800">
                LOADING...
                <div
                  className="absolute top-0 left-0 overflow-hidden text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] whitespace-nowrap"
                  style={{ width: `${loadProgress}%` }}
                >
                  LOADING...
                </div>
              </div>

              <div className="w-56 sm:w-72 md:w-80 h-1.5 sm:h-2 bg-neutral-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>

              <div className="font-mono text-xs text-neutral-500 tracking-wider">
                {loadingPhase === 'finished' ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-cyan-400"
                  >
                    SYSTEM READY
                  </motion.span>
                ) : (
                  <span>LOADING ASSETS... {Math.round(loadProgress)}%</span>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="font-mono text-xs sm:text-sm md:text-base text-cyan-500/40 tracking-wider text-center px-4"
            >
              TRY PRESSING KEYS ON YOUR KEYBOARD
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
