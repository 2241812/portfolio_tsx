"use client";
import React, { useEffect, useRef, memo } from 'react';
import { animate, stagger } from 'animejs';
import HeroShowcaseReel from '@/components/sections/HeroShowcaseReel';
import HeroThreeBackground from '@/components/3d/HeroThreeBackground';
import { ArrowDownRight, FileText, Mail, Code2, Gamepad2 } from 'lucide-react';

export const HeroSection = memo(function HeroSection() {
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgeStripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Anime.js kinetic text entrance for name lines
    if (line1Ref.current && line2Ref.current) {
      animate([line1Ref.current, line2Ref.current], {
        opacity: [0, 1],
        translateY: [32, 0],
        ease: 'outExpo',
        duration: 1000,
        delay: stagger(150, { start: 200 }),
      });
    }

    if (subtitleRef.current) {
      animate(subtitleRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        ease: 'outExpo',
        duration: 800,
        delay: 500,
      });
    }

    if (badgeStripRef.current) {
      const cards = badgeStripRef.current.children;
      animate(cards, {
        opacity: [0, 1],
        translateY: [15, 0],
        ease: 'outExpo',
        duration: 800,
        delay: stagger(100, { start: 650 }),
      });
    }
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative w-full pt-6 pb-12 sm:pt-10 sm:pb-16 overflow-hidden">
      {/* 3D WebGL Constellation / Particle Background */}
      <HeroThreeBackground />

      {/* Studio Header Meta Bar (No GPA) */}
      <div className="relative z-10 flex flex-wrap items-center justify-between border-b border-white/10 pb-4 mb-8 text-[11px] font-mono text-zinc-400 gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white text-black font-bold uppercase tracking-wider text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            STUDIO // 2026
          </span>
          <span className="text-zinc-400">BAGUIO CITY, PH [16.40°N]</span>
        </div>

        <div className="flex items-center gap-3 text-zinc-400">
          <span>CREATIVE TECHNOLOGIST</span>
          <span className="text-zinc-600">/</span>
          <span className="text-white font-medium">SWE &amp; GAME DEV</span>
        </div>
      </div>

      {/* Main Studio Hero Layout Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Fixed Headline & Studio Profile */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-white/10 bg-[#0d0d12] text-zinc-400 text-xs font-mono">
              <Code2 className="w-3.5 h-3.5 text-white" />
              <span>SYSTEMS ARCHITECTURE</span>
              <span className="text-zinc-600">/</span>
              <Gamepad2 className="w-3.5 h-3.5 text-white" />
              <span>GAME DEV</span>
            </div>

            {/* Display Headline in Syne (Epic Pro styling) - Fixed 2-line layout */}
            <h1 className="font-display uppercase tracking-tight text-white leading-[0.92] select-none">
              <span
                ref={line1Ref}
                className="block text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-extrabold"
              >
                NARCISO III
              </span>
              <span
                ref={line2Ref}
                className="block text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-extrabold text-zinc-300"
              >
                JAVIER
              </span>
            </h1>

            <p
              ref={subtitleRef}
              className="text-sm sm:text-base text-zinc-400 max-w-xl font-sans leading-relaxed pt-2"
            >
              Computer Science student engineering scalable distributed backends, Docker
              microservices in Go, and real-time interactive game experiences with Unity 3D &amp;
              C++. Focused on systems architecture and player-centric mechanics.
            </p>
          </div>

          {/* Metrics & Focus Bento Strip */}
          <div ref={badgeStripRef} className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
            <div className="studio-card p-3.5">
              <div className="studio-corner-tl" />
              <div className="studio-corner-br" />
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Focus</div>
              <div className="text-xs sm:text-sm font-bold text-white font-mono mt-1">
                Systems &amp; Game Dev
              </div>
            </div>

            <div className="studio-card p-3.5">
              <div className="studio-corner-tl" />
              <div className="studio-corner-br" />
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Core Stack</div>
              <div className="text-xs sm:text-sm font-bold text-white font-mono mt-1">
                Go • Python • C++
              </div>
            </div>

            <div className="studio-card p-3.5">
              <div className="studio-corner-tl" />
              <div className="studio-corner-br" />
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Engine</div>
              <div className="text-xs sm:text-sm font-bold text-white font-mono mt-1">
                Unity 3D • Docker
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => scrollToSection('projects')}
              className="px-5 py-3 bg-white hover:bg-zinc-200 text-black font-bold font-mono text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <span>Explore Projects</span>
              <ArrowDownRight className="w-4 h-4" />
            </button>

            <a
              href="/api/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-[#111116] hover:bg-[#181820] text-zinc-200 border border-white/10 hover:border-white/30 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-zinc-400" />
              <span>Resume PDF</span>
            </a>

            <button
              onClick={() => scrollToSection('contact')}
              className="px-4 py-3 bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white border border-transparent hover:border-white/10 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Studio Showcase Canvas */}
        <div className="lg:col-span-6 relative flex flex-col justify-center">
          <HeroShowcaseReel />
        </div>
      </div>
    </section>
  );
});

export default HeroSection;
