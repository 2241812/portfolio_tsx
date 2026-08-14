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
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
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
      {/* 3D Minimalist Monochrome Avatar Container */}
      <motion.div
        animate={{
          rotateX: mousePos.y,
          rotateY: mousePos.x,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl p-1.5 overflow-hidden border border-zinc-800 bg-[#0d0f12] shadow-2xl transition-colors duration-300 group-hover:border-zinc-600"
      >
        {/* Grayscale Photo Frame */}
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-zinc-900">
          <Image
            src={src}
            alt={name}
            fill
            priority
            className="object-cover grayscale contrast-115 brightness-95 group-hover:contrast-120 group-hover:scale-105 transition-all duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
});

export default AsciiAvatar;