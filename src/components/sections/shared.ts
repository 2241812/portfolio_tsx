"use client";
import { Variants } from 'framer-motion';

// ── Shared Animation Variants ──
export const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
  },
};

export const headingVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

// ── Inline celebratory burst (Subtle Dark Blue & White) ──
export const fireConfetti = (() => {
  let container: HTMLDivElement | null = null;

  return () => {
    const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#ffffff', '#1e40af'];
    const count = 24;

    if (container) {
      container.remove();
    }

    container = document.createElement('div');
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden';
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      const size = Math.random() * 6 + 3;
      const x = Math.random() * 100;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const rotation = Math.random() * 360;
      const delay = Math.random() * 0.2;
      const duration = 1 + Math.random() * 0.8;
      const drift = (Math.random() - 0.5) * 150;

      el.style.cssText = `
        position:absolute;
        top:-10px;
        left:${x}%;
        width:${size}px;
        height:${size * 0.6}px;
        background:${color};
        border-radius:1px;
        transform:rotate(${rotation}deg);
        opacity:0.9;
      `;
      container.appendChild(el);

      el.animate(
        [
          { transform: `translateY(0) translateX(0) rotate(${rotation}deg)`, opacity: 1 },
          { transform: `translateY(${window.innerHeight + 20}px) translateX(${drift}px) rotate(${rotation + 360}deg)`, opacity: 0 },
        ],
        { duration: duration * 1000, delay: delay * 1000, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', fill: 'forwards' }
      );
    }

    setTimeout(() => {
      if (container) {
        container.remove();
        container = null;
      }
    }, 2200);
  };
})();

// ── Shared Types ──
export interface PinnedRepo {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  url: string;
}

export interface UnifiedProject {
  title: string;
  description: string;
  language?: string;
  url?: string;
  stars?: number;
  forks?: number;
  source: 'resume' | 'github';
  role?: string;
  featured?: boolean;
}

// ── Language Colors (TUI Balanced) ──
export const langColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#eab308',
  Python: '#3b82f6',
  Go: '#06b6d4',
  Rust: '#f97316',
  Java: '#d97706',
  'C++': '#ec4899',
  C: '#64748b',
  'C#': '#22c55e',
  PHP: '#6366f1',
  HTML: '#f43f5e',
  CSS: '#8b5cf6',
  Shell: '#10b981',
  Dockerfile: '#0ea5e9',
};

// ── Skill-to-Project Mapping ──
export const SKILL_KEYWORD_MAP: Record<string, string[]> = {
  'Python': ['python', 'pyqt6', 'automator', 'contextswitch'],
  'Go': ['go', 'golang', 'microservices'],
  'JavaScript (ES6+)': ['javascript', 'node.js', 'node', 'web'],
  'Node.js': ['node.js', 'node', 'javascript', 'express'],
  'PHP': ['php'],
  'C++': ['c++', 'computer vision', 'opencv'],
  'Java': ['java'],
  'HTML': ['html', 'web', 'frontend'],
  'CSS': ['css', 'tailwind', 'styling'],
  'Docker': ['docker', 'container', 'containerized'],
  'Docker Compose': ['docker compose', 'docker-compose'],
  'VSCode Remote Containers': ['remote containers', 'devcontainer'],
  'CI/CD Pipelines': ['ci/cd', 'pipeline', 'deploy'],
  'Git/GitHub': ['git', 'github'],
  'PyQt6': ['pyqt6', 'qt', 'desktop'],
  'AR Foundation': ['ar foundation', 'augmented reality', 'ar'],
  'AI Frameworks': ['ai', 'cnn', 'model', 'computer vision'],
};
