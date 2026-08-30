'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  X,
  Search,
} from 'lucide-react';
import { getProjectEvidence } from '@/data/projectEvidence';
import { useWebMCPListener } from '@/lib/webmcpEvents';
import { useInView } from '@/hooks/useInView';

export type DomainCategory =
  | 'distributed'
  | 'mobile'
  | 'geospatial'
  | 'automation'
  | 'devops';

export interface GraphNode {
  id: string;
  label: string;
  type: 'project' | 'skill';
  domain: DomainCategory;
  x: number;
  y: number;
  vx: number;
  vy: number;
  anchorX: number;
  anchorY: number;
  radius: number;
  baseRadius: number;
  color: string;
  glowColor: string;
  textColor: string;
  description?: string;
  verifiedClaims?: string[];
  projectLink?: string;
  connectedCount: number;
  isDragging?: boolean;
}

export interface GraphLink {
  source: string;
  target: string;
  distance: number;
  strength: number;
  color: string;
}

type FilterView = 'all' | 'projects' | 'distributed' | 'mobile' | 'geospatial' | 'automation' | 'devops';

export const DOMAIN_CONFIG: Record<
  DomainCategory,
  { label: string; tag: string; color: string; anchor: { x: number; y: number } }
> = {
  distributed: {
    label: 'Distributed Systems & Go',
    tag: '// DISTRIBUTED SYSTEMS',
    color: '#00ADD8', // Go Cyan
    anchor: { x: 200, y: -120 },
  },
  mobile: {
    label: 'Mobile & Mesh Networking',
    tag: '// MOBILE & MESH',
    color: '#10b981', // Emerald
    anchor: { x: 190, y: 140 },
  },
  geospatial: {
    label: 'Geospatial GIS & Web',
    tag: '// GEOSPATIAL GIS',
    color: '#84cc16', // Lime
    anchor: { x: -190, y: 140 },
  },
  automation: {
    label: 'Desktop Automation & AI',
    tag: '// AUTOMATION & AI',
    color: '#d946ef', // Magenta
    anchor: { x: -200, y: -120 },
  },
  devops: {
    label: 'DevOps & Container Nexus',
    tag: '// DEVOPS & CONTAINERS',
    color: '#38bdf8', // Sky Blue
    anchor: { x: 0, y: 15 },
  },
};

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const ObsidianSkillGraph = memo(function ObsidianSkillGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref: inViewRef, isInView } = useInView({ rootMargin: '100px', once: true });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [filterView, setFilterView] = useState<FilterView>('all');
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.95 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // WebMCP Integration
  const { highlightedSkills } = useWebMCPListener();

  // Decoupled Dimensions
  const dimensionsRef = useRef<{ width: number; height: number; dpr: number }>({
    width: 800,
    height: 580,
    dpr: 1,
  });

  // ── Construct Obsidian Graph Model ──
  const { initialNodes, initialLinks } = useMemo(() => {
    const nodesMap = new Map<string, GraphNode>();
    const links: GraphLink[] = [];

    const addNode = (
      id: string,
      label: string,
      type: 'project' | 'skill',
      domain: DomainCategory,
      radius: number,
      color: string,
      options?: {
        description?: string;
        verifiedClaims?: string[];
        projectLink?: string;
        seedOffset?: number;
      }
    ) => {
      const anchor = DOMAIN_CONFIG[domain].anchor;
      const seed = (options?.seedOffset || 1) * 43 + id.length;
      // Start in organic initial positions around their domain cluster anchors
      const spreadX = (seededRandom(seed) - 0.5) * (type === 'project' ? 20 : 100);
      const spreadY = (seededRandom(seed + 1) - 0.5) * (type === 'project' ? 20 : 100);

      nodesMap.set(id, {
        id,
        label,
        type,
        domain,
        anchorX: anchor.x,
        anchorY: anchor.y,
        x: anchor.x + spreadX,
        y: anchor.y + spreadY,
        vx: 0,
        vy: 0,
        radius,
        baseRadius: radius,
        color,
        glowColor: color,
        textColor: '#f8fafc',
        description: options?.description,
        verifiedClaims: options?.verifiedClaims,
        projectLink: options?.projectLink,
        connectedCount: 0,
      });
    };

    const addLink = (source: string, target: string, color: string, distance = 80, strength = 0.5) => {
      links.push({
        source,
        target,
        distance,
        strength,
        color,
      });
    };

    // ── 1. CLUSTER: Distributed Systems & Go Backend ──
    const navEvidence = getProjectEvidence('campus-nav');
    addNode(
      'campus-nav',
      'Campus Navigator CS312',
      'project',
      'distributed',
      18,
      '#00ADD8',
      {
        description: 'Docker Compose campus navigation system with Go shortest-path Dijkstra algorithms and multi-service routing.',
        verifiedClaims: navEvidence?.verifiedClaims,
        projectLink: 'https://github.com/narcisoJavier/WebDev_Campus-Navigator_CS312',
        seedOffset: 1,
      }
    );
    addNode('skill-go', 'Go (Golang)', 'skill', 'distributed', 9, '#00ADD8', { description: 'Statically typed systems language for concurrent microservices.', seedOffset: 2 });
    addNode('skill-nodejs', 'Node.js', 'skill', 'distributed', 8, '#22c55e', { description: 'JavaScript runtime for lightweight API gateways.', seedOffset: 3 });
    addNode('skill-php', 'PHP', 'skill', 'distributed', 8, '#a78bfa', { description: 'Backend service integration in multi-tier web stacks.', seedOffset: 4 });
    addNode('skill-dijkstra', 'Dijkstra Routing', 'skill', 'distributed', 8, '#f59e0b', { description: 'Graph pathfinding and shortest route calculations.', seedOffset: 5 });
    addNode('skill-systems', 'Systems Programming', 'skill', 'distributed', 8, '#38bdf8', { description: 'Concurrent network communication and memory safety.', seedOffset: 6 });

    addLink('campus-nav', 'skill-go', '#00ADD8');
    addLink('campus-nav', 'skill-nodejs', '#22c55e');
    addLink('campus-nav', 'skill-php', '#a78bfa');
    addLink('campus-nav', 'skill-dijkstra', '#f59e0b');
    addLink('campus-nav', 'skill-systems', '#38bdf8');

    // ── 2. CLUSTER: Mobile & Mesh Networking ──
    const tetherEvidence = getProjectEvidence('tether');
    addNode(
      'tether',
      'Tether',
      'project',
      'mobile',
      18,
      '#10b981',
      {
        description: 'Android Flutter app combining Dart SSH client, VT100 terminal, SFTP, port forwarding, and embedded Tailscale networking.',
        verifiedClaims: tetherEvidence?.verifiedClaims,
        projectLink: 'https://github.com/narcisoJavier/Tether',
        seedOffset: 7,
      }
    );
    addNode('skill-flutter', 'Flutter', 'skill', 'mobile', 10, '#0284c7', { description: 'Cross-platform mobile UI toolkit.', seedOffset: 8 });
    addNode('skill-dart', 'Dart', 'skill', 'mobile', 9, '#00B4AB', { description: 'Client-side socket programming and terminal rendering.', seedOffset: 9 });
    addNode('skill-tailscale', 'Tailscale Mesh', 'skill', 'mobile', 8, '#8b5cf6', { description: 'WireGuard-backed mesh VPN network orchestration.', seedOffset: 10 });
    addNode('skill-ssh', 'SSH / SFTP', 'skill', 'mobile', 8, '#10b981', { description: 'Encrypted socket terminals and file synchronization.', seedOffset: 11 });

    addLink('tether', 'skill-flutter', '#0284c7');
    addLink('tether', 'skill-dart', '#00B4AB');
    addLink('tether', 'skill-tailscale', '#8b5cf6');
    addLink('tether', 'skill-ssh', '#10b981');
    addLink('tether', 'skill-systems', '#38bdf8');

    // ── 3. CLUSTER: Geospatial GIS & Full-Stack Web ──
    const geoEvidence = getProjectEvidence('geocradle');
    addNode(
      'geocradle',
      'geoCradle',
      'project',
      'geospatial',
      18,
      '#84cc16',
      {
        description: 'React/Vite single-page GIS web application for exploring watersheds and administrative boundaries across the Cordillera region.',
        verifiedClaims: geoEvidence?.verifiedClaims,
        projectLink: 'https://github.com/narcisoJavier/geoCradle',
        seedOffset: 12,
      }
    );
    addNode('skill-leaflet', 'Leaflet.js', 'skill', 'geospatial', 9, '#84cc16', { description: 'Interactive web mapping and vector tile rendering.', seedOffset: 13 });
    addNode('skill-gis', 'Geospatial (GIS)', 'skill', 'geospatial', 9, '#84cc16', { description: 'GeoJSON topography, PMTiles, and watershed boundary layers.', seedOffset: 14 });
    addNode('skill-js', 'JavaScript (ES6+)', 'skill', 'geospatial', 8, '#f59e0b', { description: 'Modern asynchronous web standards and DOM interactions.', seedOffset: 15 });
    addNode('skill-nextjs', 'Next.js / React', 'skill', 'geospatial', 9, '#06b6d4', { description: 'Server-rendered React architecture and fast clients.', seedOffset: 16 });

    addLink('geocradle', 'skill-leaflet', '#84cc16');
    addLink('geocradle', 'skill-gis', '#84cc16');
    addLink('geocradle', 'skill-js', '#f59e0b');
    addLink('geocradle', 'skill-nextjs', '#06b6d4');

    // ── 4. CLUSTER: Desktop Automation & AI Tooling ──
    const multitaskEvidence = getProjectEvidence('multitask-contextswitch');
    const handEvidence = getProjectEvidence('hand-sign-recognition');

    addNode(
      'multitask-contextswitch',
      'MultiTask ContextSwitch',
      'project',
      'automation',
      17,
      '#10b981',
      {
        description: 'Python desktop application using PyQt6 and Windows APIs to monitor AI model generation states and orchestrate target windows.',
        verifiedClaims: multitaskEvidence?.verifiedClaims,
        projectLink: 'https://github.com/narcisoJavier/MultiTask_ContextSwitch',
        seedOffset: 17,
      }
    );
    addNode(
      'hand-sign-recognition',
      'Hand Sign CNN',
      'project',
      'automation',
      17,
      '#d946ef',
      {
        description: 'Python computer vision pipeline using a convolutional neural network for real-time gesture classification in Colab.',
        verifiedClaims: handEvidence?.verifiedClaims,
        projectLink: 'https://colab.research.google.com/drive/1JtmdmGKfQzO4xnSUnl4rRVXulx5v6TJG',
        seedOffset: 18,
      }
    );

    addNode('skill-python', 'Python', 'skill', 'automation', 10, '#38bdf8', { description: 'Core language for automation scripts and computer vision pipelines.', seedOffset: 19 });
    addNode('skill-pyqt', 'PyQt6', 'skill', 'automation', 8, '#10b981', { description: 'Desktop GUI toolkit for system tray and window focus management.', seedOffset: 20 });
    addNode('skill-automation', 'Desktop Automation', 'skill', 'automation', 8, '#10b981', { description: 'Windows APIs, process hooks, and state monitoring.', seedOffset: 21 });
    addNode('skill-cpp', 'C++ / Algorithms', 'skill', 'automation', 8, '#818cf8', { description: 'Low-level performance algorithms and data structures.', seedOffset: 22 });
    addNode('skill-unity', 'Unity 3D', 'skill', 'automation', 8, '#ec4899', { description: 'Physics loops, collision detection, and character ergonomics.', seedOffset: 23 });

    addLink('multitask-contextswitch', 'skill-python', '#38bdf8');
    addLink('multitask-contextswitch', 'skill-pyqt', '#10b981');
    addLink('multitask-contextswitch', 'skill-automation', '#10b981');
    addLink('hand-sign-recognition', 'skill-python', '#38bdf8');
    addLink('hand-sign-recognition', 'skill-cpp', '#818cf8');
    addLink('skill-unity', 'skill-cpp', '#ec4899');

    // ── 5. CLUSTER: DevOps, Tooling & Container Nexus ──
    const opencodeEvidence = getProjectEvidence('opencode-setup');
    addNode(
      'opencode-setup',
      'OpenCode DevContainer',
      'project',
      'devops',
      17,
      '#38bdf8',
      {
        description: 'Docker and VS Code Dev Containers guide for running isolated terminal workspaces with reproducible configurations.',
        verifiedClaims: opencodeEvidence?.verifiedClaims,
        projectLink: 'https://github.com/narcisoJavier/OpenCode-VSCode-Setup',
        seedOffset: 24,
      }
    );
    addNode('skill-docker', 'Docker & Compose', 'skill', 'devops', 9, '#2496ed', { description: 'Multi-service containerization and isolated networks.', seedOffset: 25 });
    addNode('skill-devcontainers', 'DevContainers', 'skill', 'devops', 8, '#3b82f6', { description: 'Reproducible non-root container environments.', seedOffset: 26 });
    addNode('skill-linux', 'Linux / Bash', 'skill', 'devops', 8, '#eab308', { description: 'Shell automation, daemon management, and system scripts.', seedOffset: 27 });
    addNode('skill-git', 'Git & GitHub', 'skill', 'devops', 8, '#f97316', { description: 'Version control and continuous collaborative workflows.', seedOffset: 28 });

    addLink('opencode-setup', 'skill-docker', '#2496ed');
    addLink('opencode-setup', 'skill-devcontainers', '#3b82f6');
    addLink('opencode-setup', 'skill-linux', '#eab308');
    addLink('opencode-setup', 'skill-git', '#f97316');

    // Inter-cluster bridges (Container infrastructure connecting to Go and Flutter)
    addLink('campus-nav', 'skill-docker', '#2496ed', 110, 0.3);
    addLink('tether', 'skill-git', '#f97316', 110, 0.3);
    addLink('geocradle', 'skill-git', '#f97316', 110, 0.3);

    // Count connections
    links.forEach((l) => {
      const s = nodesMap.get(l.source);
      const t = nodesMap.get(l.target);
      if (s) s.connectedCount++;
      if (t) t.connectedCount++;
    });

    return {
      initialNodes: Array.from(nodesMap.values()),
      initialLinks: links,
    };
  }, []);

  const nodesRef = useRef<GraphNode[]>(initialNodes);
  const linksRef = useRef<GraphLink[]>(initialLinks);
  const draggedNodeRef = useRef<GraphNode | null>(null);
  const isDraggingCanvasRef = useRef(false);
  const pointerDownPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const transformRef = useRef(transform);

  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

  // Handle Canvas Resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateDimensions = () => {
      const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      const width = canvas.clientWidth || 800;
      const height = canvas.clientHeight || 580;
      dimensionsRef.current = { width, height, dpr };

      const targetW = Math.round(width * dpr);
      const targetH = Math.round(height * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(canvas);
    window.addEventListener('resize', updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // WebMCP sync
  useEffect(() => {
    if (!highlightedSkills || highlightedSkills.length === 0) return;
    const q = highlightedSkills[0].toLowerCase();
    const match = nodesRef.current.find(
      (n) => n.label.toLowerCase().includes(q) || q.includes(n.label.toLowerCase()) || n.id.includes(q)
    );
    if (match) {
      setSelectedNodeId(match.id);
      setTransform((prev) => ({
        ...prev,
        x: -match.x * prev.scale,
        y: -match.y * prev.scale,
      }));
    }
  }, [highlightedSkills]);

  // ── Obsidian Force Physics & Canvas Render Loop (60 FPS) ──
  useEffect(() => {
    if (!isInView) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      if (document.hidden) {
        animId = requestAnimationFrame(render);
        return;
      }

      const { width, height, dpr } = dimensionsRef.current;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2 + transformRef.current.x;
      const cy = height / 2 + transformRef.current.y;
      const scale = transformRef.current.scale;

      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      const nodes = nodesRef.current;
      const links = linksRef.current;
      const nodesMap = new Map(nodes.map((n) => [n.id, n]));

      // ── 1. Force Simulation Step (Verlet / Hooke's Elasticity) ──
      const kRepulsion = 900;
      const kClusterGravity = 0.0015;
      const kCenterGravity = 0.0003;

      // Repulsion between all nodes
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const distSq = Math.max(dx * dx + dy * dy, 1);
          const dist = Math.sqrt(distSq);

          if (dist < 320) {
            const force = (kRepulsion / distSq) * (n1.type === 'project' || n2.type === 'project' ? 1.5 : 1.0);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (!n1.isDragging) {
              n1.vx -= fx;
              n1.vy -= fy;
            }
            if (!n2.isDragging) {
              n2.vx += fx;
              n2.vy += fy;
            }
          }
        }

        // Domain Cluster Anchor Gravity + Global Centering
        if (!n1.isDragging) {
          n1.vx += (n1.anchorX - n1.x) * kClusterGravity - n1.x * kCenterGravity;
          n1.vy += (n1.anchorY - n1.y) * kClusterGravity - n1.y * kCenterGravity;
        }
      }

      // Spring Links (Hooke's Law with equal & opposite forces)
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const source = nodesMap.get(link.source);
        const target = nodesMap.get(link.target);
        if (!source || !target) continue;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.hypot(dx, dy) || 1;
        const diff = dist - link.distance;
        const force = diff * link.strength * 0.04;

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (!source.isDragging) {
          source.vx += fx;
          source.vy += fy;
        }
        if (!target.isDragging) {
          target.vx -= fx;
          target.vy -= fy;
        }
      }

      // Position update with fluid damping
      const damping = 0.89;
      nodes.forEach((n) => {
        if (!n.isDragging) {
          n.vx *= damping;
          n.vy *= damping;
          n.x += n.vx;
          n.y += n.vy;
        }
      });

      // ── 2. Identify Active / Connected Subgraph ──
      const activeId = hoveredNodeId || selectedNodeId;
      const connectedNodeIds = new Set<string>();
      if (activeId) {
        connectedNodeIds.add(activeId);
        links.forEach((l) => {
          if (l.source === activeId) connectedNodeIds.add(l.target);
          if (l.target === activeId) connectedNodeIds.add(l.source);
        });
      }

      // Filter check
      const isNodeInFilter = (node: GraphNode) => {
        if (filterView === 'all') return true;
        if (filterView === 'projects') return node.type === 'project';
        return node.domain === filterView;
      };

      const isNodeMatchingSearch = (node: GraphNode) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return node.label.toLowerCase().includes(q) || node.description?.toLowerCase().includes(q);
      };

      // ── 3. Render Obsidian Links (Clean Vector Lines) ──
      links.forEach((link) => {
        const source = nodesMap.get(link.source);
        const target = nodesMap.get(link.target);
        if (!source || !target) return;

        const inFilter = isNodeInFilter(source) && isNodeInFilter(target);
        if (!inFilter) return;

        const isDirect = activeId && (link.source === activeId || link.target === activeId);
        const isConnected =
          !activeId || (connectedNodeIds.has(link.source) && connectedNodeIds.has(link.target));

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);

        if (isDirect) {
          ctx.strokeStyle = link.color;
          ctx.lineWidth = 2.0 / scale;
          ctx.globalAlpha = 0.95;
        } else if (isConnected) {
          ctx.strokeStyle = link.color;
          ctx.lineWidth = 1.2 / scale;
          ctx.globalAlpha = activeId ? 0.7 : 0.4;
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 0.8 / scale;
          ctx.globalAlpha = 0.18;
        }

        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // ── 4. Render Obsidian Nodes (Minimalist Solid & Halos) ──
      nodes.forEach((node) => {
        const inFilter = isNodeInFilter(node);
        if (!inFilter) return;

        const matchesSearch = isNodeMatchingSearch(node);
        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredNodeId === node.id;
        const isDirect = activeId === node.id;
        const isConnected = !activeId || connectedNodeIds.has(node.id);
        const isProject = node.type === 'project';

        const radius = isSelected || isHovered ? node.baseRadius * 1.25 : node.baseRadius;
        const alpha = matchesSearch
          ? isDirect
            ? 1.0
            : isConnected
            ? activeId
              ? 0.95
              : 1.0
            : 0.25
          : 0.15;

        ctx.globalAlpha = alpha;

        // Outer Glow Halo for Selected, Hovered, or Projects
        if (isSelected || isHovered || isProject) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + (isSelected ? 8 : isHovered ? 6 : 4), 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(node.color, isSelected ? 0.35 : isHovered ? 0.25 : 0.12);
          ctx.fill();
        }

        // Main Node Disc (Obsidian solid node)
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isProject ? '#0d1117' : node.color;
        ctx.fill();

        // Node Ring / Border
        ctx.strokeStyle = node.color;
        ctx.lineWidth = isSelected ? 2.5 / scale : isProject ? 2.0 / scale : 1.2 / scale;
        ctx.stroke();

        // Center Core for Project Nodes
        if (isProject) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.fill();
        }

        // Node Typography Label (Obsidian clean text)
        const showLabel = isProject || isSelected || isHovered || isConnected || scale > 1.1;
        if (showLabel) {
          ctx.font = `${isProject ? 'bold 11px' : '10px'} var(--font-geist-mono), monospace`;
          const text = node.label;
          const textMetrics = ctx.measureText(text);
          const textWidth = textMetrics.width;
          const textHeight = 12 / scale;
          const textY = node.y + radius + 11 / scale;

          // Crisp translucent badge backing for legibility
          ctx.fillStyle = 'rgba(10, 12, 18, 0.85)';
          ctx.fillRect(
            node.x - textWidth / 2 - 3 / scale,
            textY - textHeight / 2 - 1 / scale,
            textWidth + 6 / scale,
            textHeight + 2 / scale
          );

          ctx.fillStyle = isSelected || isHovered ? '#ffffff' : isConnected ? '#e2e8f0' : '#94a3b8';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, node.x, textY);
        }

        ctx.globalAlpha = 1;
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [filterView, hoveredNodeId, selectedNodeId, searchQuery, isInView]);

  // ── Coordinates and Hit-Testing ──
  const screenToWorld = useCallback((screenX: number, screenY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = screenX - rect.left;
    const y = screenY - rect.top;
    const cx = canvas.clientWidth / 2 + transformRef.current.x;
    const cy = canvas.clientHeight / 2 + transformRef.current.y;
    return {
      x: (x - cx) / transformRef.current.scale,
      y: (y - cy) / transformRef.current.scale,
    };
  }, []);

  const findNodeAtPosition = useCallback((worldX: number, worldY: number) => {
    for (let i = nodesRef.current.length - 1; i >= 0; i--) {
      const node = nodesRef.current[i];
      const dist = Math.hypot(node.x - worldX, node.y - worldY);
      if (dist <= node.baseRadius * 1.5 + 4) {
        return node;
      }
    }
    return null;
  }, []);

  // ── Mouse & Touch Event Handlers (Tactile Obsidian Drag & Pan) ──
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    const { x, y } = screenToWorld(e.clientX, e.clientY);
    const hitNode = findNodeAtPosition(x, y);

    if (hitNode) {
      draggedNodeRef.current = hitNode;
      hitNode.isDragging = true;
      hitNode.vx = 0;
      hitNode.vy = 0;
    } else {
      isDraggingCanvasRef.current = true;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const { x, y } = screenToWorld(e.clientX, e.clientY);

    if (draggedNodeRef.current) {
      // Pull node and physics in real time
      draggedNodeRef.current.x = x;
      draggedNodeRef.current.y = y;
      draggedNodeRef.current.vx = 0;
      draggedNodeRef.current.vy = 0;
    } else if (isDraggingCanvasRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      setTransform((prev) => ({
        ...prev,
        x: prev.x + dx,
        y: prev.y + dy,
      }));
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    } else {
      const hitNode = findNodeAtPosition(x, y);
      setHoveredNodeId(hitNode ? hitNode.id : null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const distMoved = Math.hypot(
      e.clientX - pointerDownPosRef.current.x,
      e.clientY - pointerDownPosRef.current.y
    );

    // If click without drag, select/deselect
    if (distMoved < 6) {
      const { x, y } = screenToWorld(e.clientX, e.clientY);
      const hitNode = findNodeAtPosition(x, y);
      if (hitNode) {
        setSelectedNodeId(hitNode.id);
      } else {
        setSelectedNodeId(null);
      }
    }

    if (draggedNodeRef.current) {
      draggedNodeRef.current.isDragging = false;
      draggedNodeRef.current = null;
    }
    isDraggingCanvasRef.current = false;
  };

  // Zoom via wheel (Centered on cursor or center)
  const handleWheel = (e: React.WheelEvent) => {
    // Only prevent default if Ctrl is held or in fullscreen, avoiding scroll hijacking
    if (e.ctrlKey || e.metaKey || isFullscreen) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      setTransform((prev) => ({
        ...prev,
        scale: Math.max(0.4, Math.min(2.5, prev.scale * zoomFactor)),
      }));
    }
  };

  const handleResetView = () => {
    setTransform({ x: 0, y: 0, scale: 0.95 });
    setSelectedNodeId(null);
    setFilterView('all');
    setSearchQuery('');
  };

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return initialNodes.find((n) => n.id === selectedNodeId) || null;
  }, [initialNodes, selectedNodeId]);

  return (
    <div ref={inViewRef} className="w-full space-y-3">
      {/* Domain Discipline Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {(
            [
              { id: 'all', label: 'ALL TOPOLOGY' },
              { id: 'projects', label: 'PROJECT DELIVERABLES' },
              { id: 'distributed', label: 'DISTRIBUTED SYSTEMS' },
              { id: 'mobile', label: 'MOBILE & MESH' },
              { id: 'geospatial', label: 'GEOSPATIAL & GIS' },
              { id: 'automation', label: 'AUTOMATION & AI' },
              { id: 'devops', label: 'DEVOPS & CONTAINERS' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterView(tab.id)}
              className={`px-3 py-1 text-[11px] transition-all cursor-pointer ${
                filterView === tab.id
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search, Zoom & Reset Toolbar */}
        <div className="flex items-center gap-2">
          {/* Quick Node Search */}
          <div className="relative hidden sm:flex items-center">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search node..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/50 border border-white/10 text-[11px] font-mono pl-8 pr-2.5 py-1 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-white/30 w-36"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-zinc-500 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 text-zinc-400">
            <button
              onClick={() => setTransform((p) => ({ ...p, scale: Math.min(2.5, p.scale * 1.15) }))}
              className="p-1.5 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              title="Zoom In"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTransform((p) => ({ ...p, scale: Math.max(0.4, p.scale * 0.85) }))}
              className="p-1.5 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              title="Zoom Out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetView}
              className="p-1.5 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              title="Reset Graph Position"
              aria-label="Reset position"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsFullscreen((p) => !p)}
              className="p-1.5 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Obsidian Canvas Container */}
      <div
        ref={containerRef}
        className={`relative w-full border border-white/15 bg-[#0a0a10] overflow-hidden select-none transition-all duration-300 ${
          isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : 'h-[520px] sm:h-[580px]'
        }`}
      >
        <span className="blk-crosshair-tl">+</span>
        <span className="blk-crosshair-tr">+</span>
        <span className="blk-crosshair-bl">+</span>
        <span className="blk-crosshair-br">+</span>

        {/* Ambient Subtle Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06),transparent_70%)]" />

        {/* HTML5 Canvas Physics Graph */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onWheel={handleWheel}
          className="w-full h-full cursor-grab active:cursor-grabbing touch-none block"
        />

        {/* Floating Node Inspector Card */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-3 right-3 sm:top-3 sm:bottom-auto w-[calc(100%-1.5rem)] sm:w-80 bg-[#0c0d14]/95 backdrop-blur-xl border border-white/20 p-4 shadow-2xl z-20 font-mono text-xs text-white space-y-3"
            >
              <div className="flex items-start justify-between border-b border-white/10 pb-2.5">
                <div className="space-y-0.5">
                  <span
                    className="text-[9px] uppercase tracking-wider font-bold block"
                    style={{ color: selectedNode.color }}
                  >
                    {selectedNode.type === 'project'
                      ? '★ PROJECT DELIVERABLE'
                      : '⚪ RUNTIME CAPABILITY'}
                    {' • '}
                    {DOMAIN_CONFIG[selectedNode.domain]?.label}
                  </span>
                  <h4 className="text-sm font-bold text-white uppercase font-display">{selectedNode.label}</h4>
                </div>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="text-zinc-400 hover:text-white p-1 text-xs cursor-pointer"
                  title="Close Inspector"
                  aria-label="Close inspector"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[11px] font-sans text-zinc-300 leading-relaxed">{selectedNode.description}</p>

              {/* Verified Evidence Claims */}
              {selectedNode.verifiedClaims && selectedNode.verifiedClaims.length > 0 && (
                <div className="space-y-1.5 pt-1 border-t border-white/10">
                  <span className="text-[9px] uppercase text-zinc-400 font-bold block">
                    GROUNDED EVIDENCE ({selectedNode.verifiedClaims.length} CLAIMS):
                  </span>
                  <ul className="space-y-1 text-[10px] font-sans text-zinc-300 list-disc pl-3">
                    {selectedNode.verifiedClaims.slice(0, 2).map((claim, idx) => (
                      <li key={idx} className="leading-snug">
                        {claim}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Connected Links Footer */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                <span className="text-zinc-400 font-mono">{selectedNode.connectedCount} Connected Link(s)</span>
                {selectedNode.projectLink && (
                  <a
                    href={selectedNode.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-white hover:text-emerald-400 font-bold transition-colors"
                  >
                    <span>View Repository</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

export default ObsidianSkillGraph;
