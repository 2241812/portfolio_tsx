"use client";
import React, { memo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TUI_NAV_ITEMS, TuiSectionId } from '@/hooks/useTuiNavigation';

interface TopBarProps {
  isSettled?: boolean;
  activeSection?: TuiSectionId;
  onNavigate?: (id: TuiSectionId) => void;
  onOpenCommand?: () => void;
  onOpenHelp?: () => void;
}

const TopBar = memo(function TopBar({
  isSettled = true,
  activeSection = 'overview',
  onNavigate,
  onOpenCommand,
  onOpenHelp,
}: TopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [time, setTime] = useState('');
  const router = useRouter();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (id: TuiSectionId) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const lenis = (window as unknown as { lenis?: { scrollTo: (target: HTMLElement | string | number, options?: Record<string, unknown>) => void } }).lenis;
        if (lenis) {
          lenis.scrollTo(element, { offset: -80, duration: 1.2 });
        } else {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 font-mono transition-all duration-300 ${
          isSettled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="w-full bg-[#0c0d10]/90 backdrop-blur-xl border-b border-zinc-800/80 px-4 md:px-8 py-2.5 flex items-center justify-between shadow-lg">
          {/* Left: Terminal Breadcrumb / Prompt */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('overview')}
              className="flex items-center gap-2 text-left group cursor-pointer"
              title="Return to overview"
            >
              <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <span className="text-xs text-zinc-400 group-hover:text-white transition-colors font-mono">
                <span className="text-white font-bold">narciso</span>@<span className="text-zinc-300">portfolio</span>:
                <span className="text-zinc-400">~/narcisoiii.dev</span>
                <span className="text-zinc-600 ml-1 hidden sm:inline">(main)</span>
              </span>
            </button>
            <span className="hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse" />
              <span>LIVE</span>
            </span>
          </div>

          {/* Center: Desktop Navigation Bar */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Main Navigation">
            {TUI_NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1 text-xs transition-all duration-150 rounded-lg cursor-pointer select-none flex items-center gap-1.5 font-mono ${
                    isActive
                      ? 'bg-zinc-800 text-white font-bold border border-zinc-700 shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
                  }`}
                >
                  <span className="text-zinc-600 text-[10px]">[{item.key}]</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 font-semibold">
                      ★
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Actions & Tools */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={onOpenCommand}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white transition-all cursor-pointer shadow-sm font-mono"
              title="Open command palette (:)"
            >
              <span className="text-zinc-400 font-bold">:</span>
              <span>cmd</span>
              <kbd className="text-[10px] text-zinc-500 ml-1">[:]</kbd>
            </button>

            <button
              onClick={() => router.push('/break')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white transition-all cursor-pointer shadow-sm font-mono"
              title="Launch typing challenge (/break)"
            >
              <span>⌨️</span>
              <span className="hidden lg:inline">break</span>
              <kbd className="text-[10px] text-zinc-500 ml-1">[b]</kbd>
            </button>

            <button
              onClick={onOpenHelp}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all cursor-pointer font-mono"
              title="Shortcuts (?)"
            >
              <span>?</span>
            </button>

            {/* Live Clock */}
            <span className="hidden xl:inline text-[11px] text-zinc-400 border-l border-zinc-800 pl-3 font-mono">
              {time}
            </span>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '[X]' : '[MENU]'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#101216] border-b border-zinc-800 px-4 py-4 space-y-2 text-xs">
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2">
              SECTIONS
            </div>
            {TUI_NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between p-2 rounded text-left cursor-pointer ${
                  activeSection === item.id
                    ? 'bg-zinc-800 text-white border border-zinc-700 font-bold'
                    : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500">[{item.key}]</span>
                  <span>{item.label}</span>
                </div>
                <span className="text-[10px] text-zinc-500">{item.desc}</span>
              </button>
            ))}
            <div className="pt-2 border-t border-zinc-800 flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push('/break');
                }}
                className="flex-1 py-1.5 px-2 text-center rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
              >
                ⌨️ Typing Game
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCommand?.();
                }}
                className="flex-1 py-1.5 px-2 text-center rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
              >
                : Commands
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
});

export default TopBar;
