"use client";
import React, { useState, useEffect, memo } from 'react';
import { useInView } from '@/hooks/useInView';
import { Terminal, Activity, ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/components/ui/StudioIcons';
import { fetchGitHubContributions } from '@/services/api';

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

interface ContributionDay {
  date: string;
  count: number;
  level: number;
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

export const GitHubTelemetryHUD = memo(function GitHubTelemetryHUD() {
  const { ref: containerRef, isInView } = useInView({ rootMargin: '200px', once: true });
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [totalContribs, setTotalContribs] = useState<number>(240);
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [userRes, eventsRes] = await Promise.allSettled([
          fetch('https://api.github.com/users/narcisoJavier'),
          fetch('https://api.github.com/users/narcisoJavier/events/public?per_page=6'),
        ]);

        if (cancelled) return;

        if (userRes.status === 'fulfilled' && userRes.value.ok) {
          const userJson = await userRes.value.json();
          setUserData(userJson);
        } else {
          setUserData({
            public_repos: 25,
            followers: 4,
            following: 8,
            created_at: '2022-09-01T00:00:00Z',
            avatar_url: '/logo.jpg',
            name: 'Narciso III Javier',
            bio: 'CS Student | Systems, Game Dev & AI Automation',
          });
        }

        if (eventsRes.status === 'fulfilled' && eventsRes.value.ok) {
          const eventsJson = await eventsRes.value.json();
          if (Array.isArray(eventsJson)) {
            setEvents(eventsJson);
          }
        }

        // Fetch contribution days
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setDate(today.getDate() - 364);
        const toDate = today.toISOString().split('T')[0];
        const fromDate = oneYearAgo.toISOString().split('T')[0];

        try {
          const data = await fetchGitHubContributions('narcisoJavier', fromDate, toDate);
          if (!cancelled && data?.contributions?.length) {
            const days: ContributionDay[] = data.contributions.map((c: { date: string; count: number }) => ({
              date: c.date,
              count: c.count,
              level: c.count === 0 ? 0 : c.count <= 2 ? 1 : c.count <= 5 ? 2 : c.count <= 8 ? 3 : 4,
            }));
            setContributions(days);
            setTotalContribs(days.reduce((s, d) => s + d.count, 0));
          } else if (!cancelled) {
            generatePlaceholderContributions();
          }
        } catch {
          if (!cancelled) generatePlaceholderContributions();
        }
      } catch {
        if (!cancelled) generatePlaceholderContributions();
      }
    }

    function generatePlaceholderContributions() {
      const placeholder: ContributionDay[] = [];
      const today = new Date();
      for (let i = 364; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const count = Math.random() > 0.65 ? Math.floor(Math.random() * 7) + 1 : 0;
        placeholder.push({
          date: d.toISOString().split('T')[0],
          count,
          level: count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4,
        });
      }
      setContributions(placeholder);
      setTotalContribs(placeholder.reduce((sum, d) => sum + d.count, 0));
    }

    if (isInView) {
      fetchData();
    }

    return () => {
      cancelled = true;
    };
  }, [isInView]);

  // Organize contributions into 52 weeks
  const weeks: ContributionDay[][] = [];
  let currentWeek: ContributionDay[] = [];
  contributions.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: '', count: 0, level: 0 });
    }
    weeks.push(currentWeek);
  }

  const levelStyles = [
    'bg-[#121218] border-white/5',   // level 0
    'bg-zinc-800 border-zinc-700',   // level 1
    'bg-zinc-600 border-zinc-500',   // level 2
    'bg-zinc-300 border-zinc-200',   // level 3
    'bg-white border-white',         // level 4
  ];

  return (
    <div ref={containerRef} className="w-full space-y-6 pt-4 select-none">
      {/* HUD Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white uppercase text-[11px]">TELEMETRY // GITHUB LIVE HUD</span>
          </div>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400 text-[10px] hidden sm:inline">
            USER: @narcisoJavier
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-zinc-400">BAGUIO CITY, PH [16.40°N]</span>
          <span className="text-zinc-600">•</span>
          <a
            href="https://github.com/narcisoJavier"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-white hover:text-zinc-300 transition-colors"
          >
            <GithubIcon className="w-3 h-3" />
            <span>Profile</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* 4 Brutalist Metric Tiles (blkUI Bento Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Tile 1: Annual Contributions */}
        <div className="blk-card p-4 space-y-1.5 relative group">
          <span className="blk-crosshair-tl">+</span>
          <span className="blk-crosshair-tr">+</span>
          <span className="blk-crosshair-bl">+</span>
          <span className="blk-crosshair-br">+</span>
          <div className="kokonut-spotlight-layer" />

          <div className="relative z-10 space-y-1">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              ANNUAL ACTIVITY
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {totalContribs}
              </span>
              <span className="text-[11px] font-mono text-emerald-400"> ▂▃▅▇█▅▃ </span>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono">Yearly Git Contributions</div>
          </div>
        </div>

        {/* Tile 2: Public Repositories */}
        <div className="blk-card p-4 space-y-1.5 relative group">
          <span className="blk-crosshair-tl">+</span>
          <span className="blk-crosshair-tr">+</span>
          <span className="blk-crosshair-bl">+</span>
          <span className="blk-crosshair-br">+</span>
          <div className="kokonut-spotlight-layer" />

          <div className="relative z-10 space-y-1">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              PUBLIC REPOSITORIES
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {userData?.public_repos ?? 25}
            </div>
            <div className="text-[10px] text-zinc-400 font-mono">6 Featured // 19 Tooling</div>
          </div>
        </div>

        {/* Tile 3: Primary Stack Ratio */}
        <div className="blk-card p-4 space-y-1.5 relative group">
          <span className="blk-crosshair-tl">+</span>
          <span className="blk-crosshair-tr">+</span>
          <span className="blk-crosshair-bl">+</span>
          <span className="blk-crosshair-br">+</span>
          <div className="kokonut-spotlight-layer" />

          <div className="relative z-10 space-y-1">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              PRIMARY ECOSYSTEM
            </div>
            <div className="text-sm font-bold text-white font-mono pt-1 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00ADD8]" /> Go
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00B4AB]" /> Dart
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#3572A5]" /> Python
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono">Systems &amp; Architecture</div>
          </div>
        </div>

        {/* Tile 4: Recent Cadence */}
        <div className="blk-card p-4 space-y-1.5 relative group">
          <span className="blk-crosshair-tl">+</span>
          <span className="blk-crosshair-tr">+</span>
          <span className="blk-crosshair-bl">+</span>
          <span className="blk-crosshair-br">+</span>
          <div className="kokonut-spotlight-layer" />

          <div className="relative z-10 space-y-1">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              ACTIVITY CADENCE
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ACTIVE
            </div>
            <div className="text-[10px] text-zinc-400 font-mono">
              {events[0] ? `Last commit ${getRelativeTime(events[0].created_at)}` : 'Continuous Updates'}
            </div>
          </div>
        </div>
      </div>

      {/* 52-Week Contribution Matrix with Interactive Tooltips */}
      <div className="blk-card p-5 sm:p-6 space-y-4 relative group">
        <span className="blk-crosshair-tl">+</span>
        <span className="blk-crosshair-tr">+</span>
        <span className="blk-crosshair-bl">+</span>
        <span className="blk-crosshair-br">+</span>
        <div className="kokonut-spotlight-layer" />

        <div className="relative z-10 flex flex-wrap items-center justify-between border-b border-white/10 pb-3 text-xs font-mono gap-2">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-white" />
            <span className="text-white font-bold uppercase tracking-wider">
              52-WEEK ACTIVITY MATRIX ({totalContribs} COMMITS)
            </span>
          </div>

          {/* Legend and Hover Tooltip Value */}
          <div className="flex items-center gap-4 text-[10px] text-zinc-400 font-mono">
            {hoveredDay && hoveredDay.date && (
              <span className="text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 border border-emerald-500/30">
                {hoveredDay.date}: {hoveredDay.count} commits
              </span>
            )}
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              {levelStyles.map((style, idx) => (
                <div key={idx} className={`w-2.5 h-2.5 border ${style}`} />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Heatmap Grid Matrix */}
        <div className="relative z-10 overflow-x-auto pb-2">
          <div className="flex gap-[3px] min-w-[740px]">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[3px]">
                {week.map((day, dIdx) => (
                  <div
                    key={day.date || `${wIdx}-${dIdx}`}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`w-[11px] h-[11px] border transition-all cursor-pointer hover:scale-125 hover:z-20 ${
                      levelStyles[day.level] || levelStyles[0]
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Terminal Commit Stream */}
      <div className="blk-card p-5 sm:p-6 space-y-3 font-mono relative group select-text">
        <span className="blk-crosshair-tl">+</span>
        <span className="blk-crosshair-tr">+</span>
        <span className="blk-crosshair-bl">+</span>
        <span className="blk-crosshair-br">+</span>
        <div className="kokonut-spotlight-layer" />

        <div className="relative z-10 flex items-center justify-between text-xs border-b border-white/10 pb-3">
          <span className="text-white font-bold flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>LIVE TERMINAL // RECENT GIT COMMITS</span>
          </span>
          <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            POLLING API
          </span>
        </div>

        <div className="relative z-10 space-y-2 text-xs divide-y divide-white/5">
          {events.length === 0 ? (
            <div className="text-zinc-400 py-2 font-mono flex items-center gap-2">
              <span className="text-zinc-400 font-bold">* 72cd1ef</span>
              <span className="text-zinc-500">[larp-portfolio-vc]</span>
              <span className="text-zinc-200">feat: add bespoke kinetic vector animations and fix showcase reel uniformity</span>
            </div>
          ) : (
            events.slice(0, 5).map((evt) => {
              const commitMsg =
                evt.payload.commits?.[0]?.message ||
                `${evt.payload.action || 'updated'} ${evt.payload.ref_type || 'repository'}`;
              const sha = evt.payload.commits?.[0]?.sha?.substring(0, 7) || evt.id.substring(0, 7);
              const repoName = evt.repo.name.split('/')[1] || evt.repo.name;

              return (
                <div
                  key={evt.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between pt-2.5 gap-1.5 hover:bg-white/[0.02] px-1 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0 font-mono">
                    <span className="text-white font-bold shrink-0">
                      * {sha}
                    </span>
                    <span className="text-zinc-400 shrink-0 font-bold">
                      [{repoName}]
                    </span>
                    <span className="text-zinc-300 truncate">{commitMsg}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 shrink-0 font-mono sm:ml-4">
                    {getRelativeTime(evt.created_at)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
});

export default GitHubTelemetryHUD;
