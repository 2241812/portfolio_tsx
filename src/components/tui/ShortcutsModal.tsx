"use client";
import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUT_GROUPS = [
  {
    title: 'Navigation',
    shortcuts: [
      { key: 'j / ↓', desc: 'Scroll / move down to next section' },
      { key: 'k / ↑', desc: 'Scroll / move up to previous section' },
      { key: '1 - 6', desc: 'Jump directly to Section 01 - 06' },
      { key: 'Tab', desc: 'Cycle focus across interactive panes' },
    ],
  },
  {
    title: 'Actions & Utilities',
    shortcuts: [
      { key: ': or /', desc: 'Open Command Palette prompt' },
      { key: 'b', desc: 'Launch Break Typing Challenge (/break)' },
      { key: '?', desc: 'Toggle keyboard shortcuts menu' },
      { key: 'Esc', desc: 'Close dialogs, command prompt, or unfocus' },
    ],
  },
];

export const ShortcutsModal = memo(function ShortcutsModal({
  isOpen,
  onClose,
}: ShortcutsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-lg bg-[#101216] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden font-mono z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#14161b] border-b border-zinc-800 text-xs">
              <span className="text-zinc-200 font-bold flex items-center gap-2">
                <span>⌨️</span> KEYBOARD BINDINGS
              </span>
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                [ESC]
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-6 text-xs text-zinc-300">
              {SHORTCUT_GROUPS.map((group) => (
                <div key={group.title}>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2 border-b border-zinc-800 pb-1">
                    {group.title}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {group.shortcuts.map((s) => (
                      <div
                        key={s.key}
                        className="flex items-center justify-between py-1 px-2.5 rounded bg-zinc-900/60 border border-zinc-800"
                      >
                        <span className="text-zinc-400">{s.desc}</span>
                        <kbd className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 text-[11px] font-bold">
                          {s.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-[#0c0d10] border-t border-zinc-800 text-[10px] text-zinc-500 text-center">
              Press [ESC] or click outside to dismiss
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

export default ShortcutsModal;
