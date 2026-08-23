"use client";
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import LoadingScreen from '@/components/ui/LoadingScreen';
import Sections from '@/components/ui/Sections';
import StudioTopNav from '@/components/ui/StudioTopNav';

export default function Home() {
  const [isSettled, setIsSettled] = useState(false);

  const handleLoadingComplete = useCallback(() => {
    setIsSettled(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-200 selection:bg-white selection:text-black overflow-x-hidden studio-grid-bg relative">
      {/* Studio Preloader */}
      <LoadingScreen onComplete={handleLoadingComplete} />

      {isSettled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col min-h-screen"
        >
          {/* Studio Top Navigation Bar (with ScrollSpy & Telemetry) */}
          <StudioTopNav />

          {/* Main Studio Content Area */}
          <main id="main-content" className="relative z-20 flex-1 flex flex-col pt-2 sm:pt-4">
            <Sections />
          </main>
        </motion.div>
      )}
    </div>
  );
}
