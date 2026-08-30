"use client";
import React, { useState, useEffect, memo, useCallback } from 'react';
import { useLenis } from 'lenis/react';
import { resumeData } from '@/data/resumeData';
import { GithubIcon, LinkedinIcon } from '@/components/ui/StudioIcons';
import { ArrowUpRight } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  number: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'hero', label: 'Overview', number: '00' },
  { id: 'about', label: 'Profile', number: '01' },
  { id: 'projects', label: 'Works', number: '02' },
  { id: 'contact', label: 'Dispatch', number: '03' },
];

export const StudioTopNav = memo(function StudioTopNav() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [currentTime, setCurrentTime] = useState<string>('');
  const lenis = useLenis();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Manila',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' PHT'
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 200;
      const sections = NAV_ITEMS.map((item) => document.getElementById(item.id));

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec && sec.offsetTop <= scrollY) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    if (id === 'hero') {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
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
    <header className="sticky top-0 z-50 w-full bg-[#08080a]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-12 py-3 transition-all">
      <div className="w-full max-w-[1720px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Mark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => scrollTo('hero')}
            className="text-sm font-extrabold tracking-tight text-white uppercase font-display hover:text-zinc-300 transition-colors cursor-pointer text-left"
          >
            {resumeData.personalInfo.name}
          </button>
        </div>

        {/* Center: Clean 4-Section Studio Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0e0e13] p-1 border border-white/10">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-3.5 py-1.5 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-[10px] opacity-60 font-mono">
                  {item.number}
                </span>
                <span className="uppercase tracking-wider text-[11px]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right: Telemetry & Actions */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 font-mono text-xs">
          {/* PHT Clock & Coordinates */}
          <div className="hidden xl:flex items-center gap-2 text-zinc-400 text-[11px]">
            <span className="flex items-center gap-1">
              <span>{currentTime || '12:00:00 PHT'}</span>
            </span>
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-500">16.40°N // 120.59°E</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-1">
            <a
              href={resumeData.personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
              title="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href={resumeData.personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
              title="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          </div>

          {/* Inquire Action Button */}
          <button
            onClick={() => scrollTo('contact')}
            className="kokonut-btn-primary py-1.5 px-3 text-xs"
          >
            <span>Inquire</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Navigation Strip */}
      <div className="flex md:hidden overflow-x-auto no-scrollbar gap-1 pt-2.5 mt-2 border-t border-white/5">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`px-3 py-1 text-[11px] font-mono whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-white text-black font-bold'
                  : 'text-zinc-400 hover:text-white bg-white/5'
              }`}
            >
              <span className="text-[9px] opacity-60">{item.number}</span>
              <span className="uppercase">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
});

export default StudioTopNav;
