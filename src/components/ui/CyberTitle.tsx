"use client";
import React, { useState, useEffect, useCallback, useRef, memo } from 'react';

interface CyberTitleProps {
  text: string;
  className?: string;
}

const GLYPHS = "01$#_[]/\\*<>+-=~{}!%&";

const CyberTitle = memo(function CyberTitle({
  text,
  className = "",
}: CyberTitleProps) {
  const [displayText, setDisplayText] = useState(text);
  const isScramblingRef = useRef(false);

  const scramble = useCallback(() => {
    if (isScramblingRef.current) return;
    isScramblingRef.current = true;
    let iteration = 0;
    const totalIterations = text.length * 2.5;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration / 2.5) {
              return text[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );

      if (iteration >= totalIterations) {
        clearInterval(interval);
        setDisplayText(text);
        isScramblingRef.current = false;
      }
      iteration += 1;
    }, 30);
  }, [text]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scramble();
    }, 100);
    return () => clearTimeout(timer);
  }, [scramble]);

  return (
    <div
      onMouseEnter={scramble}
      className={`inline-flex flex-col cursor-pointer group select-none ${className}`}
      title="Hover to decode matrix"
    >
      <div className="flex items-center gap-2">
        <span className="text-cyan-400 font-bold font-mono text-sm sm:text-base group-hover:animate-spin">
          ⚡
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100 font-orbitron drop-shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:text-cyan-300 transition-colors">
          {displayText}
        </h1>
      </div>
      <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400/80 mt-1">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="tracking-widest">CYBER_ID // READY</span>
      </div>
    </div>
  );
});

export default CyberTitle;
