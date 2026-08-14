"use client";
import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface AsciiAvatarProps {
  src?: string;
  name?: string;
}

const ASCII_RAMP = "@%#*+=-:. ";

const AsciiAvatar = memo(function AsciiAvatar({
  src = "/profile.jpg",
  name = "Narciso III Javier",
}: AsciiAvatarProps) {
  const [mode, setMode] = useState<'ascii' | 'photo'>('ascii');
  const [asciiText, setAsciiText] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate ASCII matrix from image
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const width = 48;
      const height = 48;
      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      let asciiStr = '';
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
          const charIdx = Math.floor((brightness / 255) * (ASCII_RAMP.length - 1));
          asciiStr += ASCII_RAMP[charIdx];
        }
        asciiStr += '\n';
      }
      setAsciiText(asciiStr);
    };
  }, [src]);

  // Handle 3D Mouse Tilt
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
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
      className="relative flex flex-col items-center group select-none"
      style={{ perspective: '800px' }}
    >
      {/* 3D Floating Avatar Container */}
      <motion.div
        animate={{
          rotateX: mousePos.y,
          rotateY: mousePos.x,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-xl cyber-glass-card p-1.5 overflow-hidden border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.2)] flex items-center justify-center bg-[#050914]"
      >
        {/* Animated Cyber Corner Brackets */}
        <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-cyan-400 z-30" />
        <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-cyan-400 z-30" />
        <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-cyan-400 z-30" />
        <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-cyan-400 z-30" />

        {/* Ambient Neon Backlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-cyan-500/10 to-transparent pointer-events-none z-10" />

        {/* Scanline Sweep Line */}
        <div className="absolute inset-0 cyber-scanlines opacity-40 pointer-events-none z-20" />
        <motion.div
          animate={{ y: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent z-20 pointer-events-none shadow-[0_0_12px_rgba(6,182,212,0.8)]"
        />

        {/* MODE 1: Animated ASCII Matrix Art */}
        {mode === 'ascii' && (
          <div className="w-full h-full flex items-center justify-center p-2 bg-[#02050c] rounded-lg overflow-hidden">
            {asciiText ? (
              <pre className="font-mono text-[5.5px] sm:text-[6.5px] leading-[5.5px] sm:leading-[6.5px] text-cyan-400 tracking-[1.5px] whitespace-pre select-none font-bold text-center drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]">
                {asciiText}
              </pre>
            ) : (
              <div className="text-[10px] text-cyan-400/80 animate-pulse font-mono">
                [GENERATING_ASCII_MATRIX...]
              </div>
            )}
          </div>
        )}

        {/* MODE 2: Hologram Photo Mode */}
        {mode === 'photo' && (
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <Image
              src={src}
              alt={name}
              fill
              priority
              className="object-cover contrast-110 brightness-105"
            />
            <div className="absolute inset-0 bg-cyan-950/20 mix-blend-color pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040711] via-transparent to-transparent opacity-60" />
          </div>
        )}

        {/* HUD Top Tag */}
        <div className="absolute top-2 left-3 z-30 text-[9px] font-mono text-cyan-400/90 font-bold tracking-wider flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>CYBER_ID // {mode.toUpperCase()}</span>
        </div>

        {/* HUD Bottom Status */}
        <div className="absolute bottom-2 right-3 z-30 text-[9px] font-mono text-slate-400 tracking-wider">
          60FPS • 48x48
        </div>
      </motion.div>

      {/* Interactive Mode Switcher Pill */}
      <div className="mt-3 flex items-center gap-2 bg-[#090d18] border border-cyan-500/30 rounded-full p-1 shadow-[0_0_15px_rgba(6,182,212,0.15)] text-[11px] font-mono">
        <button
          onClick={() => setMode('ascii')}
          className={`px-3 py-1 rounded-full transition-all cursor-pointer font-bold ${
            mode === 'ascii'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]'
              : 'text-slate-400 hover:text-cyan-300'
          }`}
        >
          [👾 ASCII MATRIX]
        </button>
        <button
          onClick={() => setMode('photo')}
          className={`px-3 py-1 rounded-full transition-all cursor-pointer font-bold ${
            mode === 'photo'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]'
              : 'text-slate-400 hover:text-cyan-300'
          }`}
        >
          [📷 HOLO PHOTO]
        </button>
      </div>
    </div>
  );
});

export default AsciiAvatar;