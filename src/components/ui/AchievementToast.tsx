'use client';

import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement, ACHIEVEMENTS } from '@/constants/gameConstants';

interface AchievementToastProps {
  achievements: Achievement[];
  onDismiss: () => void;
}

interface ToastItem {
  key: string;
  achievement: Achievement;
}

const AchievementToast = memo(function AchievementToast({
  achievements,
  onDismiss,
}: AchievementToastProps) {
  const [visibleToasts, setVisibleToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);
  const currentKeysRef = useRef(new Set<string>());

  useEffect(() => {
    if (achievements.length === 0) {
      setVisibleToasts([]);
      return;
    }

    const toAdd: ToastItem[] = [];
    for (const a of achievements) {
      const key = `${a}-${counterRef.current}`;
      counterRef.current++;
      if (!currentKeysRef.current.has(key)) {
        toAdd.push({ key, achievement: a });
        currentKeysRef.current.add(key);
      }
    }

    if (toAdd.length > 0) {
      setVisibleToasts(prev => [...prev, ...toAdd]);
    }
  }, [achievements]);

  const dismissToast = useCallback((key: string) => {
    setVisibleToasts(prev => {
      const next = prev.filter(t => t.key !== key);
      currentKeysRef.current.delete(key);
      if (next.length === 0) {
        setTimeout(() => onDismiss(), 100);
      }
      return next;
    });
  }, [onDismiss]);

  return (
    <div className="fixed bottom-20 right-6 z-40 flex flex-col gap-2">
      <AnimatePresence>
        {visibleToasts.map(({ key, achievement }, idx) => {
          const data = ACHIEVEMENTS[achievement];
          if (!data) return null;

          return (
            <AutoDismissToast
              key={key}
              data={data}
              idx={idx}
              onDismiss={() => dismissToast(key)}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
});

const AutoDismissToast = memo(function AutoDismissToast({
  data,
  idx,
  onDismiss,
}: {
  data: { icon: string; label: string; description: string };
  idx: number;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000 + idx * 200);
    return () => clearTimeout(timer);
  }, [onDismiss, idx]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{
        opacity: 1,
        x: 0,
        transition: { delay: idx * 0.15 },
      }}
      exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
      className="bg-[#18181c]/95 border border-zinc-700 rounded-xl px-4 py-3 backdrop-blur-md shadow-2xl cursor-pointer"
      onClick={onDismiss}
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">{data.icon}</div>
        <div>
          <div className="text-sm font-bold text-white font-mono">{data.label}</div>
          <div className="text-xs text-zinc-400 font-mono">{data.description}</div>
        </div>
      </div>
    </motion.div>
  );
});

export default AchievementToast;
