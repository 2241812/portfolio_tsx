"use client";
import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { TuiSectionId } from '@/hooks/useTuiNavigation';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: TuiSectionId) => void;
}

interface CommandItem {
  cmd: string;
  desc: string;
  action: () => void;
  badge?: string;
}

export const CommandPalette = memo(function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
}: CommandPaletteProps) {
  const [input, setInput] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const commands: CommandItem[] = [
    {
      cmd: ':projects',
      desc: 'Jump to Top 3 Featured Projects & Repositories',
      badge: '★ TOP 3',
      action: () => {
        onNavigate('projects');
        onClose();
      },
    },
    {
      cmd: ':skills',
      desc: 'Open Skills Matrix & Verified Stack Explorer',
      action: () => {
        onNavigate('skills');
        onClose();
      },
    },
    {
      cmd: ':about',
      desc: 'Display System Info & Background Profile',
      action: () => {
        onNavigate('overview');
        onClose();
      },
    },
    {
      cmd: ':stats',
      desc: 'Inspect GitHub Telemetry & Contribution Breaker',
      action: () => {
        onNavigate('github');
        onClose();
      },
    },
    {
      cmd: ':logs',
      desc: 'View Live Documentation & Gists',
      action: () => {
        onNavigate('gists');
        onClose();
      },
    },
    {
      cmd: ':contact',
      desc: 'Open Contact & Communication Protocols',
      action: () => {
        onNavigate('contact');
        onClose();
      },
    },
    {
      cmd: ':break',
      desc: 'Launch Terminal Typing Challenge Minigame (/break)',
      badge: 'GAME',
      action: () => {
        onClose();
        router.push('/break');
      },
    },
    {
      cmd: ':resume',
      desc: 'View & Download Formal Curriculum Vitae (PDF)',
      action: () => {
        window.open('/Javier, Narciso III C._Resume_.pdf', '_blank');
        onClose();
      },
    },
    {
      cmd: ':admin',
      desc: 'Open Local Content Configuration Utility (/admin)',
      action: () => {
        onClose();
        router.push('/admin');
      },
    },
  ];

  const filteredCommands = commands.filter(
    (c) =>
      c.cmd.toLowerCase().includes(input.toLowerCase()) ||
      c.desc.toLowerCase().includes(input.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setInput('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filteredCommands.length || 1)) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl bg-[#101216] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden font-mono z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#14161b] border-b border-zinc-800 text-xs text-zinc-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-zinc-200">CLI COMMAND PALETTE</span>
              </span>
              <span>[ESC] CLOSE</span>
            </div>

            {/* Input Line */}
            <div className="flex items-center px-4 py-3 border-b border-zinc-800 bg-[#0c0d10]">
              <span className="text-zinc-400 font-bold mr-2">:</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type command or search (e.g. projects, skills, break)..."
                className="w-full bg-transparent text-zinc-100 placeholder:text-zinc-600 text-sm focus:outline-none"
              />
            </div>

            {/* Command Results List */}
            <div className="max-h-72 overflow-y-auto p-1 divide-y divide-zinc-900">
              {filteredCommands.length === 0 ? (
                <div className="p-4 text-center text-xs text-zinc-500">
                  No command match for &quot;{input}&quot;
                </div>
              ) : (
                filteredCommands.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.cmd}
                      onClick={() => item.action()}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-800 text-white border-l-2 border-white'
                          : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`font-bold ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                          {item.cmd}
                        </span>
                        <span className="text-zinc-500 text-[11px] truncate">{item.desc}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-semibold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-3.5 py-2 bg-[#0c0d10] border-t border-zinc-800 text-[10px] text-zinc-500">
              <span>[↑/↓] Navigate</span>
              <span>[Enter] Execute</span>
              <span>[Tab] Complete</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

export default CommandPalette;
