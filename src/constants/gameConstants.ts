/**
 * Game constants extracted from ContributionCalendar
 * Centralized configuration for game modes, achievements, and UI constants
 */

export enum GameDifficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
  Insane = 'insane',
}

export const DIFFICULTY_SETTINGS = {
  [GameDifficulty.Easy]: {
    baseSpeed: 0.1,
    pointMultiplier: 1,
    label: 'Easy',
    color: 'from-blue-700 to-blue-500',
    borderColor: 'border-blue-500',
    glowColor: 'shadow-[0_0_10px_rgba(59,130,246,0.3)]',
  },
  [GameDifficulty.Medium]: {
    baseSpeed: 0.3,
    pointMultiplier: 1.5,
    label: 'Medium',
    color: 'from-blue-600 to-indigo-500',
    borderColor: 'border-blue-400',
    glowColor: 'shadow-[0_0_10px_rgba(59,130,246,0.4)]',
  },
  [GameDifficulty.Hard]: {
    baseSpeed: 0.6,
    pointMultiplier: 2,
    label: 'Hard',
    color: 'from-indigo-600 to-purple-500',
    borderColor: 'border-indigo-400',
    glowColor: 'shadow-[0_0_10px_rgba(99,102,241,0.4)]',
  },
  [GameDifficulty.Insane]: {
    baseSpeed: 1.2,
    pointMultiplier: 3,
    label: 'Insane',
    color: 'from-red-600 to-amber-500',
    borderColor: 'border-red-500',
    glowColor: 'shadow-[0_0_12px_rgba(239,68,68,0.5)]',
  },
};

export const CELL_SIZE = 14; // 11px cell + 3px gap
export const VISIBLE_WIDTH = 500;
export const BASE_SPEED = 0.3;
export const MAX_SPEED = 4;
export const LEVEL_POINTS = [1, 3, 5, 10, 20];

export enum Achievement {
  FirstBlood = 'first-blood',
  ComboMaster = 'combo-master',
  SpeedRunner = 'speed-runner',
  PerfectWeek = 'perfect-week',
  Unstoppable = 'unstoppable',
  ThousandPoints = 'thousand-points',
  GoldenStreak = 'golden-streak',
  ModeMastery = 'mode-mastery',
}

export const ACHIEVEMENTS = {
  [Achievement.FirstBlood]: {
    label: 'First Blood',
    description: 'Score 10 points in a single game',
    icon: '🎯',
    condition: (score: number) => score >= 10,
  },
  [Achievement.ComboMaster]: {
    label: 'Combo Master',
    description: 'Reach a 50x combo multiplier',
    icon: '⚡',
    condition: (score: number, combo: number) => combo >= 50,
  },
  [Achievement.SpeedRunner]: {
    label: 'Speed Runner',
    description: 'Complete Hard difficulty in under 30 seconds',
    icon: '🚀',
    condition: (time: number, difficulty: GameDifficulty) =>
      difficulty === GameDifficulty.Hard && time < 30000,
  },
  [Achievement.PerfectWeek]: {
    label: 'Perfect Week',
    description: 'Break 7+ cells without missing',
    icon: '📅',
    condition: (combo: number) => combo >= 7,
  },
  [Achievement.Unstoppable]: {
    label: 'Unstoppable Force',
    description: 'Maintain 3x+ score multiplier for entire game',
    icon: '⭐',
    condition: (finalMultiplier: number) => finalMultiplier >= 3,
  },
  [Achievement.ThousandPoints]: {
    label: 'Thousand Points',
    description: 'Reach 1000 points total',
    icon: '🏆',
    condition: (score: number) => score >= 1000,
  },
  [Achievement.GoldenStreak]: {
    label: 'Golden Streak',
    description: 'Get 5 Perfect Games in a row',
    icon: '✨',
    condition: (streak: number) => streak >= 5,
  },
  [Achievement.ModeMastery]: {
    label: 'Mode Mastery',
    description: 'Earn top score on all 4 difficulty levels',
    icon: '👑',
    condition: (modesCompleted: number) => modesCompleted >= 4,
  },
};

export const LEVEL_COLORS = [
  'bg-slate-900/60',
  'bg-blue-950',
  'bg-blue-800',
  'bg-blue-600',
  'bg-blue-400',
];

export const LEVEL_GLOWS = [
  '',
  'shadow-[0_0_3px_rgba(59,130,246,0.1)]',
  'shadow-[0_0_5px_rgba(59,130,246,0.2)]',
  'shadow-[0_0_8px_rgba(59,130,246,0.35)]',
  'shadow-[0_0_10px_rgba(59,130,246,0.5)]',
];
