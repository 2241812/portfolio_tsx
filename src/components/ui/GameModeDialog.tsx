'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { GameDifficulty, DIFFICULTY_SETTINGS, Achievement } from '@/constants/gameConstants';
import { GameStats } from '@/hooks/useGameStats';

interface GameModeDialogProps {
  isOpen: boolean;
  onSelectDifficulty: (difficulty: GameDifficulty) => void;
  onClose: () => void;
  stats: GameStats;
  achievements: Achievement[];
}

const GameModeDialog = memo(function GameModeDialog({
  isOpen,
  onSelectDifficulty,
  onClose,
  stats,
  achievements,
}: GameModeDialogProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-[#121215] border border-zinc-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Solo Tabs */}
        <div className="flex gap-2 mb-6 border-b border-zinc-800">
          <button className="px-4 py-2 text-sm text-white border-b-2 border-white font-medium font-mono">
            Select Mode
          </button>
        </div>

        {/* Difficulty Selection */}
        <div className="space-y-3 mb-6">
          {Object.entries(DIFFICULTY_SETTINGS).map(([difficulty, settings]) => {
            const bestScore = stats.bestScores[difficulty as GameDifficulty] || 0;
            const isNew = bestScore === 0;

            return (
              <motion.button
                key={difficulty}
                className="w-full p-3 rounded-lg border border-zinc-800 hover:border-zinc-600 bg-zinc-900/60 font-mono text-sm transition-all"
                onClick={() => {
                  onSelectDifficulty(difficulty as GameDifficulty);
                  onClose();
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-left font-bold text-zinc-100">{settings.label}</div>
                    <div className="text-xs text-zinc-500 text-left">
                      Speed: {(settings.baseSpeed * 100).toFixed(0)}% | Multiplier: {settings.pointMultiplier}x
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${isNew ? 'text-zinc-600' : 'text-white'}`}>
                      {bestScore || '-'}
                    </div>
                    {isNew && <div className="text-[10px] text-zinc-600">Locked</div>}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="bg-zinc-900/40 rounded-lg p-4 mb-6 border border-zinc-800">
          <div className="text-xs text-zinc-500 font-mono mb-3">LIFETIME STATS</div>
          <div className="grid grid-cols-2 gap-4 text-sm font-mono">
            <div>
              <div className="text-zinc-500">Games</div>
              <div className="text-white font-bold">{stats.totalGamesPlayed}</div>
            </div>
            <div>
              <div className="text-zinc-500">Avg Score</div>
              <div className="text-white font-bold">{stats.averageScore}</div>
            </div>
            <div>
              <div className="text-zinc-500">Total Points</div>
              <div className="text-white font-bold">{stats.totalPointsEarned}</div>
            </div>
            <div>
              <div className="text-zinc-500">Best Combo</div>
              <div className="text-white font-bold">{stats.highestCombo}x</div>
            </div>
          </div>
        </div>

        {/* Achievements Preview */}
        {achievements.length > 0 && (
          <div className="bg-zinc-900/40 rounded-lg p-4 mb-6 border border-zinc-800">
            <div className="text-xs text-zinc-500 font-mono mb-3">
              ACHIEVEMENTS ({achievements.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {achievements.slice(0, 5).map((ach) => (
                <div
                  key={ach}
                  className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm text-white"
                  title={ach}
                >
                  ✓
                </div>
              ))}
              {achievements.length > 5 && (
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-white">
                  +{achievements.length - 5}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3 font-mono">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSelectDifficulty(GameDifficulty.Medium);
              onClose();
            }}
            className="flex-1 px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-sm font-bold text-black transition-colors cursor-pointer"
          >
            Quick Start
          </button>
        </div>

        {/* Keyboard Hints */}
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <div className="text-[10px] text-zinc-500 font-mono space-y-1">
            <div>Press <span className="text-zinc-300">1-4</span> for difficulty</div>
            <div>Press <span className="text-zinc-300">SPACE</span> to start</div>
            <div>Press <span className="text-zinc-300">ESC</span> to quit</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

export default GameModeDialog;
