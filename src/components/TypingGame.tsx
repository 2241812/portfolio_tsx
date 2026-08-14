"use client";
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('@/components/3d/Scene'), {
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
}

interface TypingGameProps {
  testText?: string;
  onKeyPress?: (key: string) => void;
}

// Word pools for generated challenges
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
    'algorithm', 'architecture', 'automation', 'bandwidth', 'binary', 'browser', 'buffer', 'bytecode', 'cipher',
    'client', 'cloud', 'cluster', 'compiler', 'component', 'concurrency', 'container', 'crypto', 'database',
    'debugger', 'deployment', 'endpoint', 'engine', 'execution', 'framework', 'function', 'gateway', 'handler',
    'hardware', 'immutable', 'infrastructure', 'interface', 'iteration', 'kernel', 'latency', 'library', 'memory',
    'microservice', 'module', 'monitor', 'network', 'optimize', 'packet', 'pipeline', 'pointer', 'protocol',
    'queue', 'reactive', 'registry', 'rendering', 'repository', 'runtime', 'sandbox', 'schema', 'security',
    'server', 'session', 'socket', 'storage', 'stream', 'syntax', 'terminal', 'thread', 'variable', 'virtual'
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
  const targetWords = mode === 'words' ? value : Math.ceil(value * 2.5);
  
  const words: string[] = [];
  for (let i = 0; i < targetWords; i++) {
    words.push(wordPool[Math.floor(Math.random() * wordPool.length)]);
  }
  return words.join(' ');
};

const TypingGame = memo(function TypingGame({ testText: initialTestText, onKeyPress }: TypingGameProps) {
  const router = useRouter();

  // Settings
  const [mode, setMode] = useState<'duration' | 'words'>('duration');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [duration, setDuration] = useState(30);
  const [wordCount, setWordCount] = useState(50);
  const [showKeyboard3D, setShowKeyboard3D] = useState(true);

  // Text & Input State
  const [testText, setTestText] = useState(() => initialTestText || generateTestText('duration', 'medium', 30));
  const [input, setInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

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
  });

  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabPressedRef = useRef(false);

  // Focus input automatically on mount
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
      });

      // Auto-finish if duration limit reached
      if (mode === 'duration' && timeElapsedSec >= duration) {
        setIsFinished(true);
        setIsActive(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, input, testText, isFinished, mode, duration]);

  // Auto-scroll to active word
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
    setStats({
      wpm: 0,
      rawWpm: 0,
      accuracy: 100,
      charsTyped: 0,
      correctChars: 0,
      incorrectChars: 0,
      wordsTyped: 0,
      timeElapsed: 0,
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

  // Keyboard shortcut listener (Tab + Enter or Escape to restart)
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

      if (onKeyPress) {
        onKeyPress(e.key);
      }
    },
    [isActive, onKeyPress, handleReset]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;

    if (newInput.length > testText.length) {
      if (inputRef.current) inputRef.current.value = input;
      return;
    }

    setInput(newInput);

    // Auto-finish on completion
    if (newInput.length === testText.length) {
      setIsFinished(true);
      setIsActive(false);
    }
  };

  const handleBoxClick = () => {
    inputRef.current?.focus();
  };

  const progress = Math.min(100, (input.length / testText.length) * 100);
  const words = testText.split(' ');
  const inputWords = input.split(' ');

  return (
    <div className="w-full space-y-6">
      {/* ── TOP CONFIGURATION CONTROL PILL ── */}
      <div className="cyber-glass-card rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-4 border border-cyan-500/30 shadow-lg">
        {/* Mode & Value Selector */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          {/* Mode Switcher */}
          <div className="flex items-center bg-black/40 rounded-lg p-1 border border-slate-800">
            <button
              onClick={() => {
                setMode('duration');
                handleReset();
              }}
              className={`px-3 py-1 rounded-md transition-all font-bold cursor-pointer ${
                mode === 'duration'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ⏱ Time
            </button>
            <button
              onClick={() => {
                setMode('words');
                handleReset();
              }}
              className={`px-3 py-1 rounded-md transition-all font-bold cursor-pointer ${
                mode === 'words'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📝 Words
            </button>
          </div>

          {/* Value Pills */}
          <div className="flex items-center bg-black/40 rounded-lg p-1 border border-slate-800">
            {mode === 'duration' ? (
              [15, 30, 60].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    setDuration(sec);
                    handleReset();
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all font-bold cursor-pointer ${
                    duration === sec
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {sec}s
                </button>
              ))
            ) : (
              [25, 50, 100].map((wc) => (
                <button
                  key={wc}
                  onClick={() => {
                    setWordCount(wc);
                    handleReset();
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all font-bold cursor-pointer ${
                    wordCount === wc
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {wc}
                </button>
              ))
            )}
          </div>

          {/* Difficulty */}
          <div className="flex items-center bg-black/40 rounded-lg p-1 border border-slate-800">
            {(['easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  setDifficulty(diff);
                  handleReset();
                }}
                className={`px-2.5 py-1 rounded-md capitalize font-bold transition-all cursor-pointer ${
                  difficulty === diff
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Action Shortcuts & Restart */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKeyboard3D(!showKeyboard3D)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
              showKeyboard3D
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle 3D Mechanical Keyboard"
          >
            ⌨️ 3D Model: {showKeyboard3D ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={handleReset}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
            title="Restart test (Tab + Enter or Esc)"
          >
            <span>↻ Reset</span>
            <kbd className="text-[10px] bg-black/30 px-1 rounded text-cyan-200">Esc</kbd>
          </button>
        </div>
      </div>

      {/* ── LIVE HUD METRICS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* WPM */}
        <div className="cyber-glass-card rounded-xl p-3.5 sm:p-4 text-center relative overflow-hidden">
          <div className="text-[10px] text-cyan-400/80 font-mono uppercase tracking-wider">SPEED (WPM)</div>
          <div className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-orbitron drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            {stats.wpm}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Raw: {stats.rawWpm}</div>
        </div>

        {/* ACCURACY */}
        <div className="cyber-glass-card rounded-xl p-3.5 sm:p-4 text-center relative overflow-hidden">
          <div className="text-[10px] text-cyan-400/80 font-mono uppercase tracking-wider">ACCURACY</div>
          <div
            className={`text-2xl sm:text-4xl font-extrabold font-orbitron ${
              stats.accuracy >= 98
                ? 'text-emerald-400'
                : stats.accuracy >= 90
                ? 'text-cyan-300'
                : 'text-amber-400'
            }`}
          >
            {stats.accuracy}%
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Errors: {stats.incorrectChars}
          </div>
        </div>

        {/* TIME / WORDS LEFT */}
        <div className="cyber-glass-card rounded-xl p-3.5 sm:p-4 text-center relative overflow-hidden">
          <div className="text-[10px] text-cyan-400/80 font-mono uppercase tracking-wider">
            {mode === 'duration' ? 'TIME REMAINING' : 'WORDS TYPED'}
          </div>
          <div className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-orbitron">
            {mode === 'duration' ? `${Math.max(0, duration - stats.timeElapsed)}s` : `${stats.wordsTyped} / ${wordCount}`}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Elapsed: {stats.timeElapsed}s
          </div>
        </div>

        {/* PROGRESS */}
        <div className="cyber-glass-card rounded-xl p-3.5 sm:p-4 text-center relative overflow-hidden">
          <div className="text-[10px] text-cyan-400/80 font-mono uppercase tracking-wider">COMPLETION</div>
          <div className="text-2xl sm:text-4xl font-extrabold text-cyan-400 font-orbitron">
            {Math.round(progress)}%
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            {stats.correctChars} / {testText.length} chars
          </div>
        </div>
      </div>

      {/* ── TYPING ARENA ── */}
      <div
        onClick={handleBoxClick}
        className="cyber-glass-card rounded-2xl p-6 sm:p-8 border border-cyan-500/30 cursor-text group relative overflow-hidden shadow-2xl"
      >
        <div className="cyber-bracket-tl" />
        <div className="cyber-bracket-br" />

        {/* Top Status & Tip */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3 mb-4 font-mono">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
            <span className="text-slate-200 font-bold">
              {isActive ? 'RECORDING KEYSTROKES...' : 'READY // START TYPING TO BEGIN'}
            </span>
          </div>
          <span className="text-slate-500 hidden sm:inline">
            Tab + Enter or Esc to restart
          </span>
        </div>

        {/* Words Container */}
        <div
          ref={scrollContainerRef}
          className="h-44 sm:h-52 overflow-y-auto overflow-x-hidden text-2xl sm:text-3xl md:text-4xl font-mono leading-relaxed text-slate-600 px-2 select-none"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)',
            scrollBehavior: 'smooth',
          }}
        >
          {words.map((word, wordIdx) => {
            const isCurrentWord =
              wordIdx === inputWords.length - 1 && input.length > 0 && !input.endsWith(' ');

            return (
              <span
                key={wordIdx}
                data-active={isCurrentWord}
                className={`inline-block mr-3 transition-colors ${
                  wordIdx < inputWords.length - 1
                    ? 'text-cyan-200'
                    : isCurrentWord
                    ? 'text-cyan-100 font-semibold'
                    : 'text-slate-600'
                }`}
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
                      className={`relative transition-all duration-75 ${
                        isCurrent
                          ? 'bg-cyan-500/50 text-cyan-100 border-b-2 border-cyan-400 animate-pulse font-bold'
                          : typeof inputChar !== 'undefined'
                          ? isCorrect
                            ? 'text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.6)]'
                            : 'text-rose-400 bg-rose-950/60 rounded font-bold'
                          : 'text-slate-600'
                      }`}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </div>

        {/* Interactive Click Tip Overlay when inactive */}
        {!isActive && !isFinished && input.length === 0 && (
          <div className="text-center text-xs font-mono text-cyan-400/70 pt-4 animate-pulse">
            Click here or press any key to engage typing test...
          </div>
        )}
      </div>

      {/* ── 3D MECHANICAL KEYBOARD ── */}
      {showKeyboard3D && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full h-64 sm:h-80 rounded-2xl cyber-glass-card p-2 overflow-hidden border border-cyan-500/20 relative shadow-xl"
        >
          <div className="absolute top-3 left-4 z-20 text-[10px] font-mono text-cyan-400 font-bold bg-[#040711]/80 px-2.5 py-1 rounded-full border border-cyan-500/30">
            3D_KEYBOARD // REALTIME_INPUT_ENGINE
          </div>
          <Scene isSettled={true} />
        </motion.div>
      )}

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

      {/* ── RESULTS MODAL ── */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4"
            onClick={handleReset}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="cyber-glass-card rounded-2xl p-6 sm:p-10 text-center w-full max-w-xl border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.3)] space-y-6 relative"
            >
              <div className="cyber-bracket-tl" />
              <div className="cyber-bracket-br" />

              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white text-2xl shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                ⚡
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 uppercase tracking-wider font-orbitron">
                  CHALLENGE COMPLETE!
                </h2>
                <p className="text-xs text-cyan-400/80 font-mono mt-1">
                  Speed metrics synchronized and calculated
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="bg-[#02050c] p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">NET WPM</div>
                  <div className="text-2xl font-bold text-cyan-400 font-orbitron">{stats.wpm}</div>
                </div>

                <div className="bg-[#02050c] p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">ACCURACY</div>
                  <div className="text-2xl font-bold text-emerald-400 font-orbitron">{stats.accuracy}%</div>
                </div>

                <div className="bg-[#02050c] p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">RAW WPM</div>
                  <div className="text-2xl font-bold text-slate-200 font-orbitron">{stats.rawWpm}</div>
                </div>

                <div className="bg-[#02050c] p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">TIME</div>
                  <div className="text-2xl font-bold text-slate-200 font-orbitron">{stats.timeElapsed}s</div>
                </div>
              </div>

              {/* Character Details */}
              <div className="bg-[#02050c] p-3.5 rounded-lg border border-slate-800 text-xs font-mono flex justify-around text-slate-300">
                <span>Correct: <strong className="text-emerald-400">{stats.correctChars}</strong></span>
                <span>Incorrect: <strong className="text-rose-400">{stats.incorrectChars}</strong></span>
                <span>Total Chars: <strong className="text-cyan-300">{stats.charsTyped}</strong></span>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 font-mono">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                >
                  ↻ Try Again (Esc)
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs transition-all cursor-pointer"
                >
                  ← Back to Portfolio
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
