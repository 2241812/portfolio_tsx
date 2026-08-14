"use client";
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { TypingArena3DHandle } from '@/components/3d/TypingArena3D';

const TypingArena3D = dynamic(() => import('@/components/3d/TypingArena3D'), {
  ssr: false,
});

interface TypingStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  charsTyped: number;
  correctChars: number;
  incorrectChars: number;
  wordsTyped: number;
  timeElapsed: number;
  streak: number;
}

interface TypingGameProps {
  testText?: string;
  onKeyPress?: (key: string) => void;
}

// Monkeytype-style common words
const WORD_POOLS = {
  easy: [
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he',
    'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
    'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about',
    'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
    'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then',
    'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our',
    'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
  ],
  medium: [
    'work', 'large', 'home', 'need', 'high', 'fact', 'public', 'here', 'should', 'very', 'like', 'few',
    'hold', 'from', 'again', 'would', 'feel', 'much', 'house', 'give', 'look', 'through', 'only', 'nation',
    'turn', 'could', 'take', 'order', 'have', 'since', 'this', 'begin', 'all', 'program', 'system', 'build',
    'develop', 'network', 'code', 'deploy', 'design', 'service', 'stream', 'layer', 'schema', 'module',
    'server', 'client', 'memory', 'runtime', 'thread', 'crypto', 'packet', 'router', 'cluster', 'matrix'
  ],
  hard: [
    'asynchronous', 'authentication', 'benchmarking', 'cryptography', 'declarative', 'deterministic',
    'differential', 'distributed', 'encapsulation', 'idempotent', 'infrastructure', 'instantiation',
    'interoperability', 'linearizability', 'microarchitectural', 'multithreading', 'orchestration',
    'parallelization', 'polymorphism', 'probabilistic', 'rasterization', 'reconciliation', 'synchronization',
    'telemetry', 'transformation', 'vectorization', 'vulnerability', 'webassembly', 'zero-knowledge'
  ],
};

const generateTestText = (mode: 'duration' | 'words', difficulty: 'easy' | 'medium' | 'hard', value: number): string => {
  const wordPool = WORD_POOLS[difficulty];
  const targetWords = mode === 'words' ? value : Math.ceil(value * 2.2);
  
  const words: string[] = [];
  for (let i = 0; i < targetWords; i++) {
    words.push(wordPool[Math.floor(Math.random() * wordPool.length)]);
  }
  return words.join(' ');
};

const TypingGame = memo(function TypingGame({ testText: initialTestText, onKeyPress }: TypingGameProps) {
  const router = useRouter();
  const arena3DRef = useRef<TypingArena3DHandle>(null);

  // Settings
  const [mode, setMode] = useState<'duration' | 'words'>('duration');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [duration, setDuration] = useState(30);
  const [wordCount, setWordCount] = useState(50);

  // Text & Input State
  const [testText, setTestText] = useState(() => initialTestText || generateTestText('duration', 'medium', 30));
  const [input, setInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [streak, setStreak] = useState(0);

  // Live Stats
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    rawWpm: 0,
    accuracy: 100,
    charsTyped: 0,
    correctChars: 0,
    incorrectChars: 0,
    wordsTyped: 0,
    timeElapsed: 0,
    streak: 0,
  });

  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabPressedRef = useRef(false);

  // Focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Update timer & calculate metrics
  useEffect(() => {
    if (!isActive || isFinished) return;

    timerRef.current = setInterval(() => {
      if (!startTimeRef.current) return;

      const timeElapsedSec = (Date.now() - startTimeRef.current) / 1000;
      const timeElapsedMin = timeElapsedSec / 60;

      let correctChars = 0;
      let incorrectChars = 0;
      for (let i = 0; i < input.length; i++) {
        if (input[i] === testText[i]) {
          correctChars++;
        } else {
          incorrectChars++;
        }
      }

      const totalChars = input.length;
      const wpm = timeElapsedMin > 0 ? Math.round((correctChars / 5) / timeElapsedMin) : 0;
      const rawWpm = timeElapsedMin > 0 ? Math.round((totalChars / 5) / timeElapsedMin) : 0;
      const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
      const wordsTyped = input.trim().split(/\s+/).filter((w) => w.length > 0).length;

      setStats({
        wpm: Math.max(0, wpm),
        rawWpm: Math.max(0, rawWpm),
        accuracy,
        charsTyped: totalChars,
        correctChars,
        incorrectChars,
        wordsTyped,
        timeElapsed: Math.floor(timeElapsedSec),
        streak,
      });

      // Auto-finish on duration expiry
      if (mode === 'duration' && timeElapsedSec >= duration) {
        setIsFinished(true);
        setIsActive(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, input, testText, isFinished, mode, duration, streak]);

  // Auto-scroll to active line
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeWord = scrollContainerRef.current.querySelector('[data-active="true"]');
      if (activeWord) {
        const offset = (activeWord as HTMLElement).offsetTop;
        const containerHeight = scrollContainerRef.current.clientHeight;
        scrollContainerRef.current.scrollTo({
          top: Math.max(0, offset - containerHeight / 2),
          behavior: 'smooth',
        });
      }
    }
  }, [input]);

  // Restart / Reset game
  const handleReset = useCallback(() => {
    const newText = generateTestText(mode, difficulty, mode === 'duration' ? duration : wordCount);
    setTestText(newText);
    setInput('');
    setIsActive(false);
    setIsFinished(false);
    setStreak(0);
    setStats({
      wpm: 0,
      rawWpm: 0,
      accuracy: 100,
      charsTyped: 0,
      correctChars: 0,
      incorrectChars: 0,
      wordsTyped: 0,
      timeElapsed: 0,
      streak: 0,
    });
    startTimeRef.current = null;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  }, [mode, difficulty, duration, wordCount]);

  // Keyboard shortcut listener
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        tabPressedRef.current = true;
        return;
      }

      if ((e.key === 'Enter' && tabPressedRef.current) || e.key === 'Escape') {
        e.preventDefault();
        tabPressedRef.current = false;
        handleReset();
        return;
      }

      if (e.key !== 'Tab') {
        tabPressedRef.current = false;
      }

      // Start timer on first non-modifier keystroke
      if (!isActive && !['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'Escape', 'CapsLock'].includes(e.key)) {
        setIsActive(true);
        startTimeRef.current = Date.now();
      }

      // Trigger 3D projectile from the pressed key
      if (e.key.length === 1 || e.key === 'Space' || e.key === 'Enter') {
        const nextIndex = input.length;
        const expectedChar = testText[nextIndex];
        const isCorrect = e.key === expectedChar || (e.key === ' ' && expectedChar === ' ');
        
        if (isCorrect) {
          setStreak((s) => s + 1);
        } else {
          setStreak(0);
        }

        arena3DRef.current?.spawnProjectile(e.code, isCorrect, e.key);
      }

      if (onKeyPress) {
        onKeyPress(e.key);
      }
    },
    [isActive, onKeyPress, handleReset, input.length, testText]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;

    if (newInput.length > testText.length) {
      if (inputRef.current) inputRef.current.value = input;
      return;
    }

    setInput(newInput);

    if (newInput.length === testText.length) {
      setIsFinished(true);
      setIsActive(false);
    }
  };

  const words = testText.split(' ');
  const inputWords = input.split(' ');
  const timeOrWordsLeft =
    mode === 'duration' ? Math.max(0, duration - stats.timeElapsed) : `${stats.wordsTyped} / ${wordCount}`;

  return (
    <div className="w-full space-y-8 select-none">
      {/* ── MONKEYTYPE MINIMALIST TOP CONTROL BAR ── */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-4 px-4 py-1.5 rounded-full bg-[#181a1f] text-xs font-mono text-zinc-500 border border-zinc-800 shadow-md">
          {/* Mode */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMode('duration');
                handleReset();
              }}
              className={`transition-colors cursor-pointer ${
                mode === 'duration' ? 'text-white font-bold' : 'hover:text-zinc-300'
              }`}
            >
              time
            </button>
            <span>/</span>
            <button
              onClick={() => {
                setMode('words');
                handleReset();
              }}
              className={`transition-colors cursor-pointer ${
                mode === 'words' ? 'text-white font-bold' : 'hover:text-zinc-300'
              }`}
            >
              words
            </button>
          </div>

          <span className="text-zinc-700">|</span>

          {/* Values */}
          <div className="flex items-center gap-2">
            {mode === 'duration' ? (
              [15, 30, 60].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    setDuration(sec);
                    handleReset();
                  }}
                  className={`transition-colors cursor-pointer ${
                    duration === sec ? 'text-white font-bold' : 'hover:text-zinc-300'
                  }`}
                >
                  {sec}
                </button>
              ))
            ) : (
              [10, 25, 50, 100].map((wc) => (
                <button
                  key={wc}
                  onClick={() => {
                    setWordCount(wc);
                    handleReset();
                  }}
                  className={`transition-colors cursor-pointer ${
                    wordCount === wc ? 'text-white font-bold' : 'hover:text-zinc-300'
                  }`}
                >
                  {wc}
                </button>
              ))
            )}
          </div>

          <span className="text-zinc-700">|</span>

          {/* Difficulty */}
          <div className="flex items-center gap-2">
            {(['easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  setDifficulty(diff);
                  handleReset();
                }}
                className={`capitalize transition-colors cursor-pointer ${
                  difficulty === diff ? 'text-white font-bold' : 'hover:text-zinc-300'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MONKEYTYPE TEXT ARENA ── */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="relative max-w-4xl mx-auto px-4 py-8 cursor-text"
      >
        <div
          ref={scrollContainerRef}
          className="h-36 sm:h-44 overflow-hidden text-2xl sm:text-3xl font-mono leading-relaxed tracking-wider text-[#646669] select-none"
        >
          {words.map((word, wordIdx) => {
            const isCurrentWord =
              wordIdx === inputWords.length - 1 && input.length > 0 && !input.endsWith(' ');

            return (
              <span
                key={wordIdx}
                data-active={isCurrentWord}
                className="inline-block mr-3 mb-1 relative"
              >
                {word.split('').map((char, charIdx) => {
                  let globalCharIdx = 0;
                  for (let i = 0; i < wordIdx; i++) {
                    globalCharIdx += words[i].length + 1;
                  }
                  globalCharIdx += charIdx;

                  const inputChar = input[globalCharIdx];
                  const isCorrect = inputChar === char;
                  const isCurrent = globalCharIdx === input.length;

                  return (
                    <span
                      key={charIdx}
                      className={`relative transition-colors duration-75 ${
                        typeof inputChar !== 'undefined'
                          ? isCorrect
                            ? 'text-[#d1d0c5]'
                            : 'text-[#ca4754]'
                          : 'text-[#646669]'
                      }`}
                    >
                      {/* Smooth White Caret */}
                      {isCurrent && (
                        <span className="absolute -left-[2px] top-1 bottom-1 w-[2.5px] bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                      )}
                      {char}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </div>

        {/* Minimalist Monkeytype Restart Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleReset}
            className="text-zinc-500 hover:text-white transition-colors p-2 text-lg cursor-pointer"
            title="Restart test (Tab + Enter or Esc)"
          >
            ↻
          </button>
        </div>
      </div>

      {/* ── 3D MECHANICAL KEYBOARD & FLOATING SHOOTER HOLOGRAM HUD ── */}
      <div className="w-full max-w-5xl mx-auto">
        <TypingArena3D
          ref={arena3DRef}
          wpm={stats.wpm}
          rawWpm={stats.rawWpm}
          accuracy={stats.accuracy}
          timeOrWordsLeft={timeOrWordsLeft}
          isTimeMode={mode === 'duration'}
          streak={streak}
          correctChars={stats.correctChars}
          incorrectChars={stats.incorrectChars}
          isActive={isActive}
        />
      </div>

      {/* Hidden Native Input */}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          if (isActive) inputRef.current?.focus();
        }}
        tabIndex={0}
        className="fixed top-0 left-0 opacity-0 w-px h-px pointer-events-auto -z-10 border-none outline-none"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        aria-label="Typing test input"
      />

      {/* ── TACTICAL MISSION RESULTS MODAL ── */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={handleReset}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="p-6 sm:p-8 rounded-2xl bg-[#121216] border border-zinc-800 text-center w-full max-w-lg shadow-2xl space-y-6"
            >
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-zinc-400 font-bold tracking-widest uppercase">
                  DEBRIEF // COMPLETE
                </div>
                <h2 className="text-3xl font-extrabold text-white font-mono">
                  {stats.wpm} <span className="text-base text-zinc-400 font-mono">WPM</span>
                </h2>
              </div>

              {/* Stats Breakdown */}
              <div className="grid grid-cols-3 gap-3 font-mono text-left">
                <div className="p-3 bg-[#18181c] rounded-xl border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">ACCURACY</div>
                  <div className="text-xl font-bold text-white font-mono">{stats.accuracy}%</div>
                </div>
                <div className="p-3 bg-[#18181c] rounded-xl border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">RAW SPEED</div>
                  <div className="text-xl font-bold text-zinc-300 font-mono">{stats.rawWpm}</div>
                </div>
                <div className="p-3 bg-[#18181c] rounded-xl border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">MAX STREAK</div>
                  <div className="text-xl font-bold text-white font-mono">{stats.streak}x</div>
                </div>
              </div>

              <div className="p-3 bg-[#18181c] rounded-xl border border-zinc-800 text-xs font-mono flex justify-around text-zinc-400">
                <span>Correct: <strong className="text-zinc-200">{stats.correctChars}</strong></span>
                <span>Misses: <strong className="text-zinc-400">{stats.incorrectChars}</strong></span>
                <span>Total: <strong className="text-white">{stats.charsTyped}</strong></span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center pt-2 font-mono">
                <button
                  onClick={handleReset}
                  className="px-5 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-all cursor-pointer shadow-sm"
                >
                  ↻ Next Test (Esc)
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="px-5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold text-xs transition-all cursor-pointer"
                >
                  ← Portfolio
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default TypingGame;
