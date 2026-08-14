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
    color: 'from-zinc-800 to-zinc-600',
    borderColor: 'border-zinc-700',
    glowColor: 'shadow-[0_0_10px_rgba(255,255,255,0.05)]',
  },
  [GameDifficulty.Medium]: {
    baseSpeed: 0.3,
    pointMultiplier: 1.5,
    label: 'Medium',
    color: 'from-zinc-700 to-zinc-500',
    borderColor: 'border-zinc-500',
    glowColor: 'shadow-[0_0_10px_rgba(255,255,255,0.1)]',
  },
  [GameDifficulty.Hard]: {
    baseSpeed: 0.6,
    pointMultiplier: 2,
    label: 'Hard',
    color: 'from-zinc-600 to-zinc-400',
    borderColor: 'border-zinc-400',
    glowColor: 'shadow-[0_0_10px_rgba(255,255,255,0.15)]',
  },
  [GameDifficulty.Insane]: {
    baseSpeed: 1.2,
    pointMultiplier: 3,
    label: 'Insane',
    color: 'from-zinc-400 to-zinc-100',
    borderColor: 'border-zinc-200',
    glowColor: 'shadow-[0_0_12px_rgba(255,255,255,0.25)]',
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

export const ACHIEVEMENTS_CONFIG: Record<
  Achievement,
  {
    label: string;
    description: string;
    icon: string;
    condition: (...args: any[]) => boolean;
  }
> = {
  [Achievement.FirstBlood]: {
    label: 'First Blood',
    description: 'Break your first commit cell',
    icon: '⚡',
    condition: (cellsBroken: number) => cellsBroken >= 1,
  },
  [Achievement.ComboMaster]: {
    label: 'Combo Master',
    description: 'Achieve a 10x combo streak',
    icon: '🔥',
    condition: (combo: number) => combo >= 10,
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

export const ACHIEVEMENTS = ACHIEVEMENTS_CONFIG;

export const LEVEL_COLORS = [
  'bg-zinc-900/60',
  'bg-zinc-800',
  'bg-zinc-600',
  'bg-zinc-400',
  'bg-zinc-100',
];

export const LEVEL_GLOWS = [
  '',
  'shadow-[0_0_3px_rgba(255,255,255,0.05)]',
  'shadow-[0_0_5px_rgba(255,255,255,0.1)]',
  'shadow-[0_0_8px_rgba(255,255,255,0.2)]',
  'shadow-[0_0_10px_rgba(255,255,255,0.3)]',
];
