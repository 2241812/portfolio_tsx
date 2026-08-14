"use client";
import React, { useState, useRef, memo, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface HoloAvatarProps {
  src?: string;
  name?: string;
}

const AsciiAvatar = memo(function AsciiAvatar({
  src = "/profile.jpg",
  name = "Narciso III Javier",
}: HoloAvatarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle 3D Mouse Tilt
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setMousePos({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col items-center group select-none cursor-pointer"
      style={{ perspective: '800px' }}
    >
      {/* 3D Floating Holographic Avatar Container */}
      <motion.div
        animate={{
          rotateX: mousePos.y,
          rotateY: mousePos.x,
          scale: isHovered ? 1.03 : 1,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl cyber-glass-card p-2 overflow-hidden border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.25)] flex items-center justify-center bg-[#050914]"
      >
        {/* Animated Cyber Corner Brackets */}
        <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400 z-30" />
        <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400 z-30" />
        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400 z-30" />
        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400 z-30" />

        {/* Ambient Neon Holographic Rim Light */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/25 via-cyan-500/15 to-transparent pointer-events-none z-10" />

        {/* Hologram Photo Frame */}
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          <Image
            src={src}
            alt={name}
            fill
            priority
            className="object-cover contrast-105 brightness-105 group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040711]/70 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* HUD Top Tag */}
        <div className="absolute top-3 left-4 z-30 text-[9px] font-mono text-cyan-300 font-bold tracking-wider flex items-center gap-1.5 bg-[#040711]/80 px-2 py-0.5 rounded-full border border-cyan-500/30 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>CYBER_ID // VERIFIED</span>
        </div>

        {/* HUD Bottom Tag */}
        <div className="absolute bottom-3 right-4 z-30 text-[9px] font-mono text-slate-300 bg-[#040711]/80 px-2 py-0.5 rounded-full border border-slate-700/60 backdrop-blur-sm">
          3D_HOLOGRAM
        </div>
      </motion.div>
    </div>
  );
});

export default AsciiAvatar;