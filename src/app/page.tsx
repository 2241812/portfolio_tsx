"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import LenisProvider from '@/components/ui/LenisProvider';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '@/components/ui/TopBar';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import Sections from '@/components/ui/Sections';
import MatrixRain from '@/components/ui/MatrixRain';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ParticleBurst, { ParticleBurstRef } from '@/components/ui/ParticleBurst';
import ChatWidget from '@/components/ChatWidget';
import TypingTitle from '@/components/ui/TypingTitle';
import { resumeData } from '@/data/resumeData';

export default function Home() {
  const [isSettled, setIsSettled] = useState(false);
  const burstRef = useRef<ParticleBurstRef>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setIsSettled(true);
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-0 bg-grid pointer-events-none opacity-50" aria-hidden="true" />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black pointer-events-none" aria-hidden="true" />

      {!prefersReducedMotion && <MatrixRain />}

      <LoadingScreen onComplete={handleLoadingComplete} />

      {isSettled && (
        <LenisProvider>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative font-sans text-neutral-300 min-h-screen z-10"
          >
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-cyan-600/10 blur-[150px] rounded-[100%] pointer-events-none z-0" aria-hidden="true" />

            <TopBar isSettled={true} />

            <main id="main-content" className="relative z-20 flex flex-col w-full" role="main">
              <section id="home" className="min-h-[100vh] flex flex-col items-center justify-center py-32 pointer-events-none">
                <div className="pointer-events-auto w-full max-w-5xl flex flex-col items-center gap-24 px-6 mt-20">

                  <div className="flex flex-col items-center gap-8 w-full">
                    <motion.h1
                      className="text-[10vw] md:text-[7rem] lg:text-[9rem] font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-700 drop-shadow-[0_0_40px_rgba(34,211,238,0.3)] whitespace-nowrap text-center leading-none"
                      initial={{ opacity: 0, filter: 'blur(20px)', scale: 0.9 }}
                      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                      style={{ fontFamily: 'var(--font-orbitron)' }}
                    >
                      {resumeData.personalInfo.name}
                    </motion.h1>

                    <motion.div
                      initial={{ opacity: 0, letterSpacing: "0em" }}
                      animate={{ opacity: 1, letterSpacing: "0.5em" }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
                      className="text-center"
                    >
                      <TypingTitle
                        jobTitles={resumeData.personalInfo.titleAnimated}
                        className="text-base sm:text-lg md:text-2xl"
                      />
                    </motion.div>
                  </div>

                </div>
              </section>

              <Sections />
            </main>
            <ParticleBurst ref={burstRef} />
          </motion.div>
        </LenisProvider>
      )}

      <AnimatePresence>
        {isSettled && <ChatWidget />}
      </AnimatePresence>
    </>
  );
}
