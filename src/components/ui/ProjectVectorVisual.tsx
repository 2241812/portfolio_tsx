"use client";
import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface ProjectVectorVisualProps {
  projectId: string;
  className?: string;
  isCompact?: boolean;
  isExpanded?: boolean;
}

export const ProjectVectorVisual = memo(function ProjectVectorVisual({
  projectId,
  className = '',
  isCompact = false,
  isExpanded = false,
}: ProjectVectorVisualProps) {
  const heightClass = isExpanded
    ? 'h-44 sm:h-52 transition-all duration-300'
    : isCompact
    ? 'h-24 sm:h-28 transition-all duration-300'
    : 'h-32 sm:h-36 transition-all duration-300';

  // 1. Tether: Mobile Encrypted SSH Socket & Data Packets
  if (projectId === 'tether') {
    return (
      <div className={`relative w-full ${heightClass} bg-black/50 border border-white/10 rounded overflow-hidden flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 320 120" className="w-full h-full text-white" fill="none">
          {/* Subtle Grid Background */}
          <defs>
            <pattern id="tether-grid" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="tether-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00B4AB" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#00B4AB" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <rect width="320" height="120" fill="url(#tether-grid)" />

          {/* Left Node: Mobile Device Terminal */}
          <g transform="translate(30, 25)">
            <rect width="50" height="70" rx="6" stroke="#ffffff" strokeWidth="1.2" fill="#0c0c12" strokeOpacity="0.8" />
            <rect x="8" y="10" width="34" height="42" rx="2" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" fill="#14141d" />
            <line x1="12" y1="20" x2="26" y2="20" stroke="#00B4AB" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="12" y1="26" x2="36" y2="26" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
            <line x1="12" y1="32" x2="30" y2="32" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
            <circle cx="25" cy="60" r="2.5" fill="#ffffff" fillOpacity="0.5" />
            <text x="25" y="80" fill="#a1a1aa" fontSize="6.5" fontFamily="monospace" textAnchor="middle">SSH CLIENT</text>
          </g>

          {/* Right Node: Remote Server Rack */}
          <g transform="translate(240, 25)">
            <rect width="52" height="70" rx="3" stroke="#ffffff" strokeWidth="1.2" fill="#0c0c12" strokeOpacity="0.8" />
            {/* Server Trays */}
            <rect x="5" y="8" width="42" height="14" rx="1.5" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" fill="#14141d" />
            <circle cx="12" cy="15" r="1.5" fill="#00B4AB" />
            <circle cx="17" cy="15" r="1.5" fill="#ffffff" fillOpacity="0.6" />
            <line x1="24" y1="15" x2="40" y2="15" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />

            <rect x="5" y="27" width="42" height="14" rx="1.5" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" fill="#14141d" />
            <circle cx="12" cy="34" r="1.5" fill="#00B4AB" />
            <circle cx="17" cy="34" r="1.5" fill="#ffffff" fillOpacity="0.6" />
            <line x1="24" y1="34" x2="36" y2="34" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />

            <rect x="5" y="46" width="42" height="14" rx="1.5" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" fill="#14141d" />
            <circle cx="12" cy="53" r="1.5" fill="#00B4AB" />
            <circle cx="17" cy="53" r="1.5" fill="#ffffff" fillOpacity="0.6" />
            <line x1="24" y1="53" x2="38" y2="53" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />

            <text x="26" y="80" fill="#a1a1aa" fontSize="6.5" fontFamily="monospace" textAnchor="middle">SYSADMIN HOST</text>
          </g>

          {/* Encrypted Tunnel Path */}
          <path
            d="M 80 60 C 130 30, 190 30, 240 60"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            fill="none"
          />
          <path
            d="M 80 60 C 130 90, 190 90, 240 60"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            fill="none"
          />

          {/* Core Encrypted Data Stream */}
          <path
            d="M 80 60 L 240 60"
            stroke="url(#tether-grad)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Animated Data Packets */}
          <motion.circle
            cx={80}
            cy={60}
            r="3"
            fill="#00B4AB"
            animate={{
              cx: [80, 240],
              cy: [60, 60],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.circle
            cx={240}
            cy={60}
            r="2.5"
            fill="#ffffff"
            animate={{
              cx: [240, 80],
              cy: [60, 60],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.4,
              delay: 1.1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Center Encryption Badge */}
          <g transform="translate(135, 48)">
            <rect width="50" height="24" rx="4" fill="#08080c" stroke="#00B4AB" strokeWidth="0.8" />
            <text x="25" y="11" fill="#00B4AB" fontSize="6" fontFamily="monospace" textAnchor="middle" fontWeight="bold">ENCRYPTED</text>
            <text x="25" y="19" fill="#ffffff" fontSize="5.5" fontFamily="monospace" textAnchor="middle">PORT :22</text>
          </g>
        </svg>
      </div>
    );
  }

  // 2. geoCradle: Cordillera Watershed Topographic GIS Contours
  if (projectId === 'geocradle') {
    return (
      <div className={`relative w-full ${heightClass} bg-black/50 border border-white/10 rounded overflow-hidden flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 320 120" className="w-full h-full text-white" fill="none">
          <defs>
            <pattern id="geo-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="geo-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f1e05a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <rect width="320" height="120" fill="url(#geo-grid)" />

          {/* Contour Layer 1 (Base Basin) */}
          <path
            d="M 20 95 Q 80 110, 150 90 T 300 85"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            fill="none"
          />

          {/* Contour Layer 2 */}
          <path
            d="M 30 75 Q 90 95, 160 70 T 290 65"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1.2"
            fill="none"
          />

          {/* Contour Layer 3 */}
          <path
            d="M 50 55 Q 110 80, 170 50 T 270 45"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.2"
            fill="none"
          />

          {/* Contour Layer 4 (Ridge Peak) */}
          <path
            d="M 80 40 Q 130 60, 190 35 T 240 30"
            stroke="#f1e05a"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            fill="none"
          />

          {/* River Drainage Stream Line */}
          <motion.path
            d="M 200 20 Q 170 50, 150 75 T 100 110"
            stroke="#00ADD8"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Baguio / Cordillera Central Coordinate Pin */}
          <g transform="translate(150, 48)">
            <motion.circle
              cx="0"
              cy="0"
              r="7"
              stroke="#f1e05a"
              strokeWidth="0.8"
              fill="none"
              animate={{ r: [3, 10], opacity: [1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <circle cx="0" cy="0" r="3" fill="#f1e05a" />
            <rect x="8" y="-10" width="76" height="16" rx="2" fill="#08080c" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            <text x="46" y="1" fill="#ffffff" fontSize="6" fontFamily="monospace" textAnchor="middle">16.40°N, 120.59°E</text>
          </g>

          {/* Top Left GIS Layer Tag */}
          <g transform="translate(15, 12)">
            <rect width="90" height="15" rx="2" fill="#08080c" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
            <text x="45" y="10" fill="#a1a1aa" fontSize="5.5" fontFamily="monospace" textAnchor="middle">CORDILLERA WATERSHED</text>
          </g>
        </svg>
      </div>
    );
  }

  // 3. Campus Navigator: Dijkstra Graph Theory Shortest-Path Network
  if (projectId === 'campus-nav') {
    return (
      <div className={`relative w-full ${heightClass} bg-black/50 border border-white/10 rounded overflow-hidden flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 320 120" className="w-full h-full text-white" fill="none">
          <defs>
            <pattern id="campus-grid" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="320" height="120" fill="url(#campus-grid)" />

          {/* Graph Edges (Background Graph Network) */}
          <line x1="45" y1="60" x2="110" y2="25" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
          <line x1="45" y1="60" x2="110" y2="95" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
          <line x1="110" y1="25" x2="200" y2="35" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
          <line x1="110" y1="95" x2="200" y2="85" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
          <line x1="110" y1="25" x2="110" y2="95" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="200" y1="35" x2="200" y2="85" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="200" y1="35" x2="275" y2="60" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
          <line x1="200" y1="85" x2="275" y2="60" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />

          {/* Animated Dijkstra Shortest Path Beam: Node A -> Node C (top) -> Node D -> Target */}
          <motion.path
            d="M 45 60 L 110 25 L 200 35 L 275 60"
            stroke="#00ADD8"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Graph Nodes */}
          {/* Node A (Start) */}
          <g transform="translate(45, 60)">
            <circle cx="0" cy="0" r="10" fill="#08080c" stroke="#00ADD8" strokeWidth="1.5" />
            <text x="0" y="3" fill="#ffffff" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SRC</text>
            <text x="0" y="20" fill="#a1a1aa" fontSize="5.5" fontFamily="monospace" textAnchor="middle">MAIN GATE</text>
          </g>

          {/* Node B (Lower Branch) */}
          <g transform="translate(110, 95)">
            <circle cx="0" cy="0" r="8" fill="#08080c" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <text x="0" y="2.5" fill="#a1a1aa" fontSize="6.5" fontFamily="monospace" textAnchor="middle">N1</text>
            <text x="0" y="-12" fill="#71717a" fontSize="5" fontFamily="monospace" textAnchor="middle">w: 48m</text>
          </g>

          {/* Node C (Shortest Path Branch) */}
          <g transform="translate(110, 25)">
            <circle cx="0" cy="0" r="9" fill="#08080c" stroke="#00ADD8" strokeWidth="1.4" />
            <text x="0" y="2.5" fill="#ffffff" fontSize="6.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">N2</text>
            <text x="0" y="-13" fill="#00ADD8" fontSize="5.5" fontFamily="monospace" textAnchor="middle">opt: 22m</text>
          </g>

          {/* Node D (Intermediate) */}
          <g transform="translate(200, 35)">
            <circle cx="0" cy="0" r="9" fill="#08080c" stroke="#00ADD8" strokeWidth="1.4" />
            <text x="0" y="2.5" fill="#ffffff" fontSize="6.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">N3</text>
            <text x="0" y="-13" fill="#00ADD8" fontSize="5.5" fontFamily="monospace" textAnchor="middle">opt: 35m</text>
          </g>

          {/* Node E (Lower Intermediate) */}
          <g transform="translate(200, 85)">
            <circle cx="0" cy="0" r="8" fill="#08080c" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <text x="0" y="2.5" fill="#a1a1aa" fontSize="6.5" fontFamily="monospace" textAnchor="middle">N4</text>
          </g>

          {/* Target Node */}
          <g transform="translate(275, 60)">
            <circle cx="0" cy="0" r="11" fill="#08080c" stroke="#00ADD8" strokeWidth="1.6" />
            <motion.circle
              cx="0"
              cy="0"
              r="14"
              stroke="#00ADD8"
              strokeWidth="0.8"
              fill="none"
              animate={{ r: [11, 16], opacity: [1, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            <text x="0" y="3" fill="#00ADD8" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">DEST</text>
            <text x="0" y="21" fill="#a1a1aa" fontSize="5.5" fontFamily="monospace" textAnchor="middle">ENGG LAB</text>
          </g>

          {/* Path Metric Chip */}
          <g transform="translate(130, 95)">
            <rect width="60" height="15" rx="2" fill="#08080c" stroke="#00ADD8" strokeWidth="0.8" />
            <text x="30" y="10" fill="#00ADD8" fontSize="6" fontFamily="monospace" textAnchor="middle">DIJKSTRA MIN: 57m</text>
          </g>
        </svg>
      </div>
    );
  }

  // 4. MultiTask ContextSwitch: Desktop Background Process Monitor
  if (projectId === 'multitask' || projectId === 'multitask-contextswitch') {
    return (
      <div className={`relative w-full ${heightClass} bg-black/50 border border-white/10 rounded overflow-hidden flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 320 120" className="w-full h-full text-white" fill="none">
          <defs>
            <pattern id="task-grid" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="320" height="120" fill="url(#task-grid)" />

          {/* Central Process Observer Wheel */}
          <g transform="translate(160, 60)">
            <circle cx="0" cy="0" r="42" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="0" cy="0" r="32" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
            <motion.circle
              cx="0"
              cy="0"
              r="32"
              stroke="#3572A5"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="60 140"
              fill="none"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            {/* Center OS Window Switch Icon */}
            <rect x="-14" y="-12" width="28" height="24" rx="3" fill="#0c0c14" stroke="#ffffff" strokeWidth="1.2" />
            <line x1="-14" y1="-5" x2="14" y2="-5" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            <circle cx="-9" cy="-8.5" r="1" fill="#ef4444" />
            <circle cx="-5" cy="-8.5" r="1" fill="#f59e0b" />
            <circle cx="-1" cy="-8.5" r="1" fill="#10b981" />
            <text x="0" y="8" fill="#3572A5" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">PyQt6</text>
          </g>

          {/* Left Process Node (Task Running) */}
          <g transform="translate(45, 45)">
            <rect width="70" height="30" rx="3" fill="#08080c" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            <text x="35" y="12" fill="#ffffff" fontSize="6.5" fontFamily="monospace" textAnchor="middle">BACKGROUND JOB</text>
            <circle cx="15" cy="21" r="2.5" fill="#f59e0b" />
            <text x="40" y="23" fill="#f59e0b" fontSize="6" fontFamily="monospace">POLLING...</text>
          </g>

          {/* Right Process Node (Focus Switched) */}
          <g transform="translate(205, 45)">
            <rect width="70" height="30" rx="3" fill="#08080c" stroke="#3572A5" strokeWidth="0.8" />
            <text x="35" y="12" fill="#ffffff" fontSize="6.5" fontFamily="monospace" textAnchor="middle">TARGET WINDOW</text>
            <circle cx="15" cy="21" r="2.5" fill="#10b981" />
            <text x="40" y="23" fill="#10b981" fontSize="6" fontFamily="monospace">FOCUS GAINED</text>
          </g>

          {/* Connector Lines */}
          <line x1="115" y1="60" x2="128" y2="60" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="192" y1="60" x2="205" y2="60" stroke="#3572A5" strokeWidth="1.2" />
        </svg>
      </div>
    );
  }

  // 5. Hand Sign CNN: Computer Vision Skeleton Grid & Bounding Box
  if (projectId === 'hand-sign-recognition') {
    return (
      <div className={`relative w-full ${heightClass} bg-black/50 border border-white/10 rounded overflow-hidden flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 320 120" className="w-full h-full text-white" fill="none">
          <defs>
            <pattern id="vision-grid" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="320" height="120" fill="url(#vision-grid)" />

          {/* Camera Frame Corners */}
          <path d="M 30 25 L 30 15 L 45 15" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M 290 25 L 290 15 L 275 15" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M 30 95 L 30 105 L 45 105" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M 290 95 L 290 105 L 275 105" stroke="#ffffff" strokeWidth="1.5" />

          {/* Vision Bounding Box */}
          <g transform="translate(100, 20)">
            <rect width="120" height="80" rx="3" stroke="#3572A5" strokeWidth="1.2" strokeDasharray="4 2" fill="none" />
            {/* Gesture Skeleton Landmark Nodes */}
            <circle cx="60" cy="70" r="3" fill="#ffffff" />
            <circle cx="45" cy="50" r="2.5" fill="#3572A5" />
            <circle cx="55" cy="35" r="2.5" fill="#3572A5" />
            <circle cx="65" cy="32" r="2.5" fill="#3572A5" />
            <circle cx="75" cy="36" r="2.5" fill="#3572A5" />
            <circle cx="85" cy="45" r="2.5" fill="#3572A5" />

            {/* Skeleton Bones */}
            <line x1="60" y1="70" x2="45" y2="50" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            <line x1="60" y1="70" x2="55" y2="35" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            <line x1="60" y1="70" x2="65" y2="32" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            <line x1="60" y1="70" x2="75" y2="36" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            <line x1="60" y1="70" x2="85" y2="45" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />

            {/* Classification HUD Pill */}
            <rect x="5" y="5" width="85" height="14" rx="2" fill="#08080c" stroke="#3572A5" strokeWidth="0.8" />
            <text x="47" y="14" fill="#3572A5" fontSize="6" fontFamily="monospace" textAnchor="middle" fontWeight="bold">CNN CONF: 98.4%</text>
          </g>

          {/* Left Scan Line / Status */}
          <text x="35" y="28" fill="#a1a1aa" fontSize="6" fontFamily="monospace">CAM_STREAM : LIVE</text>
          <text x="35" y="38" fill="#71717a" fontSize="5.5" fontFamily="monospace">FPS: 30 // 720p</text>
        </svg>
      </div>
    );
  }

  // 6. OpenCode Setup: Docker Container Isometric Sandbox
  if (projectId === 'opencode-setup') {
    return (
      <div className={`relative w-full ${heightClass} bg-black/50 border border-white/10 rounded overflow-hidden flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 320 120" className="w-full h-full text-white" fill="none">
          <defs>
            <pattern id="docker-grid" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="320" height="120" fill="url(#docker-grid)" />

          {/* Isometric 3D Container Cube */}
          <g transform="translate(160, 60)">
            {/* Top Face */}
            <polygon points="0,-32 38,-12 0,8 -38,-12" stroke="#ffffff" strokeWidth="1.2" fill="#14141f" strokeOpacity="0.8" />
            {/* Left Face */}
            <polygon points="-38,-12 0,8 0,38 -38,18" stroke="#ffffff" strokeWidth="1.2" fill="#0c0c14" strokeOpacity="0.8" />
            {/* Right Face */}
            <polygon points="0,8 38,-12 38,18 0,38" stroke="#ffffff" strokeWidth="1.2" fill="#08080c" strokeOpacity="0.8" />

            {/* Inner Container Layer Slits */}
            <line x1="-38" y1="-2" x2="0" y2="18" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            <line x1="-38" y1="8" x2="0" y2="28" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            <line x1="0" y1="18" x2="38" y2="-2" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            <line x1="0" y1="28" x2="38" y2="8" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />

            {/* Docker Whale / Container Badge in Center Top */}
            <circle cx="0" cy="-12" r="3" fill="#384d54" />
          </g>

          {/* Left Host Machine Tag */}
          <g transform="translate(30, 45)">
            <rect width="75" height="30" rx="3" fill="#08080c" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
            <text x="37" y="13" fill="#a1a1aa" fontSize="6.5" fontFamily="monospace" textAnchor="middle">HOST MACHINE</text>
            <text x="37" y="23" fill="#71717a" fontSize="5.5" fontFamily="monospace" textAnchor="middle">VSCode Remote</text>
          </g>

          {/* Right Sandbox Runtime Tag */}
          <g transform="translate(215, 45)">
            <rect width="75" height="30" rx="3" fill="#08080c" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
            <text x="37" y="13" fill="#ffffff" fontSize="6.5" fontFamily="monospace" textAnchor="middle">DOCKER CONTAINER</text>
            <text x="37" y="23" fill="#384d54" fontSize="5.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">ZERO DRIFT</text>
          </g>
        </svg>
      </div>
    );
  }

  return null;
});

export default ProjectVectorVisual;
