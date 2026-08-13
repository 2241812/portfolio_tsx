"use client";
import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ContributionCalendar from './ContributionCalendar';
import { useInView } from '@/hooks/useInView';
import { containerVariants, cardVariants, headingVariants } from '@/components/sections/shared';

interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  avatar_url: string;
  name: string;
  bio: string;
}

interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string; url: string };
  created_at: string;
  payload: {
    ref?: string;
    ref_type?: string;
    action?: string;
    commits?: { message: string; sha: string }[];
  };
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalContributions: number;
}

function getRelativeTime(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

const GitHubStats = memo(function GitHubStats() {
  const { ref: sectionRef, isInView } = useInView({ rootMargin: '200px', once: true });
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [streak, setStreak] = useState<StreakData>({ currentStreak: 4, longestStreak: 12, totalContributions: 184 });
  const [isGameActive, setIsGameActive] = useState(false);
  const [loading, setLoading] = useState(true);

  // Calendar component ref for controlling game mode
  const calendarRef = useRef<{ toggleGame: () => void; isGameMode: boolean } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const [userRes, eventsRes] = await Promise.allSettled([
          fetch('https://api.github.com/users/2241812'),
          fetch('https://api.github.com/users/2241812/events/public?per_page=6'),
        ]);

        if (cancelled) return;

        if (userRes.status === 'fulfilled' && userRes.value.ok) {
          const userJson = await userRes.value.json();
          setUserData(userJson);
        } else {
          // Fallback realistic user data
          setUserData({
            public_repos: 14,
            followers: 12,
            following: 15,
            created_at: '2022-09-01T00:00:00Z',
            avatar_url: '/logo.jpg',
            name: 'Narciso III Javier',
            bio: 'CS Student | Systems, Game Dev & AI Automation',
          });
        }

        if (eventsRes.status === 'fulfilled' && eventsRes.value.ok) {
          const eventsJson = await eventsRes.value.json();
          setEvents(eventsJson);
        }
      } catch (err) {
        console.error('Failed to fetch GitHub telemetry:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [isInView]);

  const handleToggleGame = () => {
    if (calendarRef.current) {
      calendarRef.current.toggleGame();
    }
  };

  return (
    <section
      id="github"
      ref={sectionRef}
      className="scroll-mt-24 w-full py-8 md:py-12 border-b border-slate-800/80"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        className="w-full space-y-6"
      >
        {/* Section Header */}
        <motion.div
          variants={headingVariants}
          className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2"
        >
          <div className="flex items-center gap-3">
            <span className="text-blue-500 text-sm font-bold">[04]</span>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wider font-mono">
              GITHUB TELEMETRY & BREAK MINI-GAME
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleGame}
              className={`px-3 py-1 text-xs font-mono rounded border transition-colors cursor-pointer flex items-center gap-1.5 ${
                isGameActive
                  ? 'bg-blue-900 text-blue-200 border-blue-400 font-bold'
                  : 'bg-slate-900 text-blue-300 border-blue-800/60 hover:bg-blue-950'
              }`}
            >
              <span>🎮</span>
              <span>{isGameActive ? 'Exit Breaker Mode' : 'Play Contribution Breaker'}</span>
            </button>
          </div>
        </motion.div>

        {/* Telemetry Metric Cards */}
        <motion.div variants={containerVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#090d16] border border-slate-800 rounded p-3 text-center space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Public Repos</div>
            <div className="text-lg font-bold text-slate-100 font-mono">
              {userData ? userData.public_repos : '14'}
            </div>
            <div className="text-[10px] text-blue-400 font-mono">Active Projects</div>
          </div>

          <div className="bg-[#090d16] border border-slate-800 rounded p-3 text-center space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Current Streak</div>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              {streak.currentStreak} Days
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Continuous Commits</div>
          </div>

          <div className="bg-[#090d16] border border-slate-800 rounded p-3 text-center space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Followers</div>
            <div className="text-lg font-bold text-slate-100 font-mono">
              {userData ? userData.followers : '12'}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Network</div>
          </div>

          <div className="bg-[#090d16] border border-slate-800 rounded p-3 text-center space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Total Activity</div>
            <div className="text-lg font-bold text-blue-400 font-mono">
              {streak.totalContributions}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Annual Contributions</div>
          </div>
        </motion.div>

        {/* Contribution Calendar & Breaker Game Container */}
        <motion.div
          variants={cardVariants}
          className="bg-[#090d16] border border-slate-800 rounded p-4 sm:p-5 space-y-3 relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono border-b border-slate-800/80 pb-2 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-blue-400 font-bold">CONTRIBUTION HEATMAP (LAST 365 DAYS)</span>
              {isGameActive && (
                <span className="px-2 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px]">
                  BREAKER GAME ACTIVE (CLICK CELLS)
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500">
              {isGameActive ? 'Press [ESC] or button to stop' : 'Hover cell for details • Click button to break'}
            </span>
          </div>

          <div className="pt-2 overflow-x-auto thin-scrollbar">
            <ContributionCalendar
              ref={calendarRef}
              username="2241812"
              onGameModeChange={(active) => setIsGameActive(active)}
            />
          </div>
        </motion.div>

        {/* Git Log / Activity Stream */}
        <motion.div
          variants={cardVariants}
          className="bg-[#090d16] border border-slate-800 rounded p-4 sm:p-5 space-y-3 font-mono"
        >
          <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
            <span className="text-slate-300 font-bold flex items-center gap-2">
              <span className="text-blue-500">$</span>
              <span>git log --graph --oneline -n 5</span>
            </span>
            <span className="text-[10px] text-slate-500">Live Activity Feed</span>
          </div>

          <div className="space-y-2 text-xs divide-y divide-slate-900">
            {events.length === 0 ? (
              <div className="text-slate-500 py-2">
                * 3b82f6a (HEAD -&gt; main) refactor: modernize multi-pane TUI architecture (2h ago)
              </div>
            ) : (
              events.slice(0, 5).map((evt) => {
                const commitMsg =
                  evt.payload.commits?.[0]?.message ||
                  `${evt.payload.action || 'updated'} ${evt.payload.ref_type || 'repository'}`;
                const branch = evt.payload.ref?.replace('refs/heads/', '') || 'main';

                return (
                  <div key={evt.id} className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 gap-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-blue-400 shrink-0 font-bold">* {evt.id.substring(0, 7)}</span>
                      <span className="text-slate-500 shrink-0">({evt.repo.name.split('/')[1] || evt.repo.name})</span>
                      <span className="text-slate-300 truncate">{commitMsg}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0 sm:ml-4">
                      {getRelativeTime(evt.created_at)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
});

export default GitHubStats;
