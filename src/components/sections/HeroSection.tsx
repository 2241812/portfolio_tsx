"use client";
import React, { useEffect, useRef, memo, useCallback } from 'react';
import { useLenis } from 'lenis/react';
import { animate, stagger } from 'animejs';
import HeroShowcaseReel from '@/components/sections/HeroShowcaseReel';
import HeroThreeBackground from '@/components/3d/HeroThreeBackground';
import { ArrowDownRight, FileText, Mail, Code2, Gamepad2 } from 'lucide-react';

export const HeroSection = memo(function HeroSection() {
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgeStripRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    // Anime.js kinetic text entrance for name lines
    if (line1Ref.current && line2Ref.current) {
      animate([line1Ref.current, line2Ref.current], {
        opacity: [0, 1],
        translateY: [28, 0],
        ease: 'outExpo',
        duration: 900,
        delay: stagger(120, { start: 150 }),
      });
    }

    if (subtitleRef.current) {
      animate(subtitleRef.current, {
        opacity: [0, 1],
        translateY: [16, 0],
        ease: 'outExpo',
        duration: 750,
        delay: 450,
      });
    }

    if (badgeStripRef.current) {
      const cards = badgeStripRef.current.children;
      animate(cards, {
        opacity: [0, 1],
        translateY: [12, 0],
        ease: 'outExpo',
        duration: 750,
        delay: stagger(80, { start: 550 }),
      });
    }
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      if (lenis) {
        lenis.scrollTo(el, { offset: -60, duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [lenis]);

  return (
    <section id="hero" className="relative w-full pt-6 pb-12 sm:pt-10 sm:pb-16 overflow-hidden">
      {/* 3D WebGL Constellation / Particle Background */}
      <HeroThreeBackground />

      {/* Header Meta Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between border-b border-white/10 pb-4 mb-8 text-[11px] font-mono text-zinc-400 gap-3">
        <div className="flex items-center gap-3">
          <span className="text-zinc-400">BAGUIO CITY, PH [16.40°N, 120.59°E]</span>
        </div>

        <div className="flex items-center gap-3 text-zinc-400">
          <span>SAINT LOUIS UNIVERSITY &apos;27</span>
          <span className="text-zinc-600">/</span>
          <span className="text-white font-medium">SYSTEMS &amp; GAME DEV</span>
        </div>
      </div>

      {/* Main Studio Hero Layout Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Headline & Bio */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-white/10 bg-[#0d0d12] text-zinc-400 text-xs font-mono">
              <Code2 className="w-3.5 h-3.5 text-white" />
              <span>SYSTEMS &amp; GO</span>
              <span className="text-zinc-600">/</span>
              <Gamepad2 className="w-3.5 h-3.5 text-white" />
              <span>GAME MECHANICS</span>
            </div>

            {/* Display Headline in Syne */}
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
              className="text-sm sm:text-base text-zinc-300 max-w-xl font-sans leading-relaxed pt-2"
            >
              Computer Science student building real software — from mobile SSH server tools and
              containerized Go routing microservices to interactive physics mechanics in Unity 3D.
              Passionate about clean systems and player-centric design.
            </p>
          </div>

          {/* Metrics & Focus Bento Strip */}
          <div ref={badgeStripRef} className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
            <div className="kokonut-card-glow p-3.5">
              <div className="studio-corner-tl" />
              <div className="studio-corner-br" />
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Track</div>
              <div className="text-xs sm:text-sm font-bold text-white font-mono mt-1">
                Systems &amp; Game Dev
              </div>
            </div>

            <div className="kokonut-card-glow p-3.5">
              <div className="studio-corner-tl" />
              <div className="studio-corner-br" />
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Core Stack</div>
              <div className="text-xs sm:text-sm font-bold text-white font-mono mt-1">
                Go • Python • C++
              </div>
            </div>

            <div className="kokonut-card-glow p-3.5">
              <div className="studio-corner-tl" />
              <div className="studio-corner-br" />
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Engines</div>
              <div className="text-xs sm:text-sm font-bold text-white font-mono mt-1">
                Unity 3D • Docker
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => scrollToSection('projects')}
              className="kokonut-btn-primary"
            >
              <span>Explore Works</span>
              <ArrowDownRight className="w-3.5 h-3.5" />
            </button>

            <a
              href="/api/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="kokonut-btn-secondary"
            >
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              <span>Resume PDF</span>
            </a>

            <button
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2 text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Dispatch</span>
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Kokonut Showcase Spotlight */}
        <div className="lg:col-span-6 relative flex flex-col justify-center">
          <HeroShowcaseReel />
        </div>
      </div>
    </section>
  );
});

export default HeroSection;
