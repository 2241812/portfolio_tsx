"use client";
import React, { memo, useState, useEffect } from 'react';
import Link from 'next/link';
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
        element.scrollIntoView({ behavior: 'smooth' });
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
        <div className="w-full bg-[#06090e]/95 backdrop-blur-md border-b border-slate-800 px-4 md:px-8 py-2.5 flex items-center justify-between">
          {/* Left: Terminal Breadcrumb / Prompt */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('overview')}
              className="flex items-center gap-2 text-left group cursor-pointer"
              title="Return to overview"
            >
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              <span className="text-xs text-slate-400 group-hover:text-blue-400 transition-colors">
                <span className="text-blue-400 font-bold">narciso</span>@<span className="text-slate-200">portfolio</span>:
                <span className="text-blue-300">~/narcisoiii.dev</span>
                <span className="text-slate-500 ml-1 hidden sm:inline">(main)</span>
              </span>
            </button>
            <span className="hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/40 text-[10px] text-blue-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
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
                  className={`px-2.5 py-1 text-xs transition-all duration-150 rounded cursor-pointer select-none flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-950/80 text-blue-300 border border-blue-700/60 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <span className="text-slate-500 text-[10px]">[{item.key}]</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-blue-900 text-blue-200 font-semibold">
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
              className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-blue-600 hover:text-blue-300 transition-colors cursor-pointer"
              title="Open command palette (:)"
            >
              <span className="text-blue-400 font-bold">:</span>
              <span>cmd</span>
              <kbd className="text-[10px] text-slate-500 ml-1">[:]</kbd>
            </button>

            <button
              onClick={() => router.push('/break')}
              className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-blue-600 hover:text-blue-300 transition-colors cursor-pointer"
              title="Launch typing challenge (/break)"
            >
              <span>⌨️</span>
              <span className="hidden lg:inline">break</span>
              <kbd className="text-[10px] text-slate-500 ml-1">[b]</kbd>
            </button>

            <button
              onClick={onOpenHelp}
              className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors cursor-pointer"
              title="Shortcuts (?)"
            >
              <span>?</span>
            </button>

            {/* Live Clock */}
            <span className="hidden xl:inline text-[11px] text-slate-500 border-l border-slate-800 pl-3">
              {time}
            </span>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-blue-400 hover:text-blue-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '[X]' : '[MENU]'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#090d16] border-b border-slate-800 px-4 py-4 space-y-2 text-xs">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
              SECTIONS
            </div>
            {TUI_NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between p-2 rounded text-left ${
                  activeSection === item.id
                    ? 'bg-blue-950/80 text-blue-300 border border-blue-700/60 font-bold'
                    : 'text-slate-300 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">[{item.key}]</span>
                  <span>{item.label}</span>
                </div>
                <span className="text-[10px] text-slate-500">{item.desc}</span>
              </button>
            ))}
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push('/break');
                }}
                className="flex-1 py-1.5 px-2 text-center rounded bg-slate-900 border border-slate-800 text-blue-300"
              >
                ⌨️ Typing Game
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCommand?.();
                }}
                className="flex-1 py-1.5 px-2 text-center rounded bg-slate-900 border border-slate-800 text-slate-300"
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
