"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { animate, stagger } from 'animejs';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isSettled, setIsSettled] = useState(false);
  const [loadPercent, setLoadPercent] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Anime.js stroke path drawing on the 3D geometric SVG wireframe
    if (svgRef.current) {
      const paths = svgRef.current.querySelectorAll('path, line, polygon, circle');
      animate(paths, {
        strokeDashoffset: [200, 0],
        opacity: [0.2, 1],
        ease: 'outQuart',
        duration: 650,
        delay: stagger(40),
      });

      animate(svgRef.current, {
        rotate: [0, 45],
        scale: [0.92, 1.05],
        ease: 'outCubic',
        duration: 750,
      });
    }

    // 2. Fast, snappy loading counter
    const startTime = performance.now();
    const totalDuration = 700;

    let frameId: number;
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      setLoadPercent(Math.round(progress * 100));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        // Quick subtle burst
        if (coreRef.current) {
          animate(coreRef.current, {
            scale: [1, 1.15],
            opacity: [1, 0],
            ease: 'outExpo',
            duration: 250,
          });
        }

        setTimeout(() => {
          setIsSettled(true);
          onComplete();
        }, 120);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameId);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isSettled && (
        <motion.div
          key="studio-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-10 bg-[#08080a] text-white select-none pointer-events-none"
        >
          {/* Top Stamp */}
          <div className="w-full flex items-center justify-between text-[10px] font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              NARCISO III JAVIER
            </span>
            <span>BAGUIO CITY [16.40°N]</span>
          </div>

          {/* Center 3D Geometric Wireframe Core & Title */}
          <div ref={coreRef} className="flex flex-col items-center justify-center space-y-6">
            {/* Kinetic 3D Icosahedron / Geometric SVG Wireframe */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
              <svg
                ref={svgRef}
                viewBox="0 0 120 120"
                className="w-full h-full text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ strokeDasharray: 200, strokeDashoffset: 200 }}
              >
                {/* Outer Hexagonal Shield */}
                <polygon points="60,8 105,34 105,86 60,112 15,86 15,34" strokeOpacity="0.4" />
                {/* Inner Geometric Star Core */}
                <polygon points="60,24 92,42 92,78 60,96 28,78 28,42" strokeOpacity="0.8" />
                {/* 3D Axial Connecting Vectors */}
                <line x1="60" y1="8" x2="60" y2="112" strokeOpacity="0.5" />
                <line x1="15" y1="34" x2="105" y2="86" strokeOpacity="0.5" />
                <line x1="15" y1="86" x2="105" y2="34" strokeOpacity="0.5" />
                <line x1="60" y1="24" x2="60" y2="96" strokeWidth="1.5" />
                <line x1="28" y1="42" x2="92" y2="78" strokeWidth="1.5" />
                <line x1="28" y1="78" x2="92" y2="42" strokeWidth="1.5" />
                {/* Center Focal Nodes */}
                <circle cx="60" cy="60" r="3.5" fill="#ffffff" stroke="none" />
                <circle cx="60" cy="24" r="2" fill="#ffffff" stroke="none" />
                <circle cx="60" cy="96" r="2" fill="#ffffff" stroke="none" />
                <circle cx="28" cy="42" r="2" fill="#ffffff" stroke="none" />
                <circle cx="92" cy="42" r="2" fill="#ffffff" stroke="none" />
                <circle cx="28" cy="78" r="2" fill="#ffffff" stroke="none" />
                <circle cx="92" cy="78" r="2" fill="#ffffff" stroke="none" />
              </svg>
            </div>

            <div className="text-center space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold uppercase font-display tracking-tight text-white">
                NARCISO III JAVIER
              </h1>
              <p className="text-[11px] font-mono text-zinc-400 tracking-wider uppercase">
                Systems Architecture • Game Development
              </p>
            </div>
          </div>

          {/* Bottom Progress Bar & Percent */}
          <div className="w-full max-w-xs space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <span className="uppercase tracking-wider">INITIALIZING WORKSPACE</span>
              <span className="text-white font-bold">{loadPercent}%</span>
            </div>
            <div className="w-full h-[2px] bg-white/10 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-75"
                style={{ width: `${loadPercent}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
