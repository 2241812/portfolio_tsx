"use client";
import React, { useRef, memo, useImperativeHandle, forwardRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import KeyboardModel from './KeyboardModel';
import { useViewport } from '@/hooks/useViewport';

export interface ProjectileEvent {
  id: number;
  x: number;
  y: number;
  z: number;
  isCorrect: boolean;
  char: string;
}

export interface TypingArena3DHandle {
  spawnProjectile: (keyCode: string, isCorrect: boolean, char: string) => void;
}

interface TypingArena3DProps {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  timeOrWordsLeft: number | string;
  isTimeMode: boolean;
  streak: number;
  correctChars: number;
  incorrectChars: number;
  isActive: boolean;
}

const KEY_X_MAP: Record<string, number> = {
  'Digit1': -2.8, 'Digit2': -2.2, 'Digit3': -1.6, 'Digit4': -1.0, 'Digit5': -0.4, 'Digit6': 0.2, 'Digit7': 0.8, 'Digit8': 1.4, 'Digit9': 2.0, 'Digit0': 2.6,
  'KeyQ': -2.4, 'KeyW': -1.8, 'KeyE': -1.2, 'KeyR': -0.6, 'KeyT': 0.0, 'KeyY': 0.6, 'KeyU': 1.2, 'KeyI': 1.8, 'KeyO': 2.4, 'KeyP': 3.0,
  'KeyA': -2.2, 'KeyS': -1.6, 'KeyD': -1.0, 'KeyF': -0.4, 'KeyG': 0.2, 'KeyH': 0.8, 'KeyJ': 1.4, 'KeyK': 2.0, 'KeyL': 2.6,
  'KeyZ': -1.8, 'KeyX': -1.2, 'KeyC': -0.6, 'KeyV': 0.0, 'KeyB': 0.6, 'KeyN': 1.2, 'KeyM': 1.8,
  'Space': 0.0, 'Enter': 2.8, 'Backspace': 3.2
};

// 3D Particles Component
function ProjectileSystem({ eventsRef }: { eventsRef: React.MutableRefObject<ProjectileEvent[]> }) {
  const meshGroupRef = useRef<THREE.Group>(null);
  const activeParticles = useRef<{
    mesh: THREE.Mesh;
    sparkMeshes: THREE.Mesh[];
    vy: number;
    vx: number;
    vz: number;
    life: number;
    maxLife: number;
    exploded: boolean;
    isCorrect: boolean;
  }[]>([]);

  const geometry = useRef(new THREE.SphereGeometry(0.08, 8, 8));
  const sparkGeo = useRef(new THREE.BoxGeometry(0.04, 0.04, 0.04));

  useFrame((_, delta) => {
    if (!meshGroupRef.current) return;

    // Check for new spawn events
    if (eventsRef.current.length > 0) {
      eventsRef.current.forEach((ev) => {
        const color = ev.isCorrect ? new THREE.Color(0xffffff) : new THREE.Color(0xf43f5e);
        const mat = new THREE.MeshBasicMaterial({ color });
        const mesh = new THREE.Mesh(geometry.current, mat);
        mesh.position.set(ev.x, 0.8, ev.z);
        meshGroupRef.current?.add(mesh);

        // Spawn sparks for trail / explosion
        const sparkMeshes: THREE.Mesh[] = [];
        for (let i = 0; i < 4; i++) {
          const sMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 });
          const sMesh = new THREE.Mesh(sparkGeo.current, sMat);
          sMesh.position.copy(mesh.position);
          meshGroupRef.current?.add(sMesh);
          sparkMeshes.push(sMesh);
        }

        activeParticles.current.push({
          mesh,
          sparkMeshes,
          vx: (Math.random() - 0.5) * 0.4,
          vy: 4.2 + Math.random() * 0.8,
          vz: -1.2 + (Math.random() - 0.5) * 0.5,
          life: 0,
          maxLife: 0.65,
          exploded: false,
          isCorrect: ev.isCorrect,
        });
      });
      eventsRef.current = [];
    }

    // Update particles physics
    for (let i = activeParticles.current.length - 1; i >= 0; i--) {
      const p = activeParticles.current[i];
      p.life += delta;
      const progress = p.life / p.maxLife;

      p.mesh.position.x += p.vx * delta;
      p.mesh.position.y += p.vy * delta;
      p.mesh.position.z += p.vz * delta;

      // Scale down over time
      const s = Math.max(0, 1 - progress);
      p.mesh.scale.set(s, s, s);

      // Animate sparks
      p.sparkMeshes.forEach((spark, idx) => {
        const angle = (idx / p.sparkMeshes.length) * Math.PI * 2 + p.life * 4;
        spark.position.x = p.mesh.position.x + Math.cos(angle) * (0.15 + p.life * 0.3);
        spark.position.y = p.mesh.position.y - p.life * 0.4;
        spark.position.z = p.mesh.position.z + Math.sin(angle) * 0.15;
        (spark.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.8 - progress);
      });

      // Cleanup expired
      if (p.life >= p.maxLife) {
        meshGroupRef.current.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.sparkMeshes.forEach((sm) => {
          meshGroupRef.current?.remove(sm);
          sm.geometry.dispose();
        });
        activeParticles.current.splice(i, 1);
      }
    }
  });

  return <group ref={meshGroupRef} />;
}

const TypingArena3D = forwardRef<TypingArena3DHandle, TypingArena3DProps>(function TypingArena3D(
  {
    wpm,
    rawWpm,
    accuracy,
    timeOrWordsLeft,
    isTimeMode,
    streak,
    correctChars,
    incorrectChars,
    isActive,
  },
  ref
) {
  const viewport = useViewport();
  const projectileEvents = useRef<ProjectileEvent[]>([]);
  const idCounter = useRef(0);

  useImperativeHandle(ref, () => ({
    spawnProjectile: (keyCode: string, isCorrect: boolean, char: string) => {
      const x = KEY_X_MAP[keyCode] ?? (Math.random() - 0.5) * 4;
      const z = -0.1 + (Math.random() - 0.5) * 0.4;
      projectileEvents.current.push({
        id: ++idCounter.current,
        x,
        y: 0.5,
        z,
        isCorrect,
        char,
      });
    },
  }));

  return (
    <div className="relative w-full h-[420px] sm:h-[460px] rounded-2xl overflow-hidden bg-[#101319]/95 border border-zinc-800 shadow-2xl">
      {/* Subtle monochrome ambient grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#272b35_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

      {/* ── 3D CANVAS (Keyboard + Particle Lasers) ── */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Canvas
          dpr={[1, 2]}
          frameloop="always"
          gl={{
            powerPreference: 'high-performance',
            antialias: true,
            alpha: true,
          }}
          onCreated={(state) => {
            state.gl.setClearColor(0x000000, 0);
          }}
        >
          <PerspectiveCamera
            makeDefault
            position={[0, 1.4, 3.2]}
            rotation={[-0.2, 0, 0]}
            fov={45}
          />
          <ambientLight intensity={0.5} color="#18181b" />
          <directionalLight position={[5, 10, 6]} intensity={1.8} color="#ffffff" />
          <directionalLight position={[-6, 6, -3]} intensity={0.7} color="#e4e4e7" />
          <pointLight position={[0, 3, 0]} intensity={1.2} color="#ffffff" distance={10} />

          <Environment preset="city" />

          <React.Suspense fallback={null}>
            <group position={[0, -0.05, 0]}>
              <KeyboardModel isSettled={true} modelScale={viewport.scale} />
              <ProjectileSystem eventsRef={projectileEvents} />
              <ContactShadows
                position={[0, -0.4, 0]}
                opacity={0.7}
                scale={15}
                blur={2}
                far={4}
                color="#000000"
              />
            </group>
          </React.Suspense>
        </Canvas>
      </div>

      {/* ── LEFT FLOATING SHOOTER HOLOGRAM HUD ── */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 pointer-events-auto select-none">
        <div className="relative w-44 sm:w-52 p-3.5 rounded-xl bg-[#0e1015]/90 backdrop-blur-md border border-zinc-800 shadow-xl space-y-2.5">
          {/* Tactical Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 text-[9px] font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 font-bold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>TAC_HUD // V1.0</span>
            </span>
            <span className="text-zinc-500">[LOCK]</span>
          </div>

          {/* WPM Main Metric */}
          <div className="space-y-0.5">
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center justify-between">
              <span>VELOCITY (WPM)</span>
              <span className="text-zinc-300 text-[9px] font-bold">LIVE</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
              {wpm}
            </div>
            <div className="text-[10px] font-mono text-zinc-500 flex justify-between">
              <span>RAW: {rawWpm}</span>
              <span>NET: {wpm}</span>
            </div>
          </div>

          {/* Accuracy Target Gauge */}
          <div className="space-y-1 pt-1 border-t border-zinc-800">
            <div className="flex justify-between text-[10px] font-mono text-zinc-400">
              <span>TARGET ACCURACY</span>
              <span className="font-bold text-white">
                {accuracy}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-200"
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT FLOATING SHOOTER HOLOGRAM HUD ── */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 pointer-events-auto select-none">
        <div className="relative w-44 sm:w-52 p-3.5 rounded-xl bg-[#0e1015]/90 backdrop-blur-md border border-zinc-800 shadow-xl space-y-2.5">
          {/* Tactical Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 text-[9px] font-mono text-zinc-400">
            <span className="font-bold tracking-wider">MISSION_DATA</span>
            <span className="text-zinc-300 font-bold">
              {isActive ? 'ENGAGED' : 'STANDBY'}
            </span>
          </div>

          {/* Time / Word Countdown */}
          <div className="space-y-0.5">
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              {isTimeMode ? 'COUNTDOWN' : 'TARGET WORDS'}
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
              {timeOrWordsLeft}
              {isTimeMode && <span className="text-base text-zinc-400 font-mono ml-1">s</span>}
            </div>
          </div>

          {/* Combo / Streak Meter */}
          <div className="pt-1 border-t border-zinc-800 space-y-1">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-zinc-400">STREAK MULTIPLIER</span>
              <span className="text-white font-bold font-mono">
                {streak}x
              </span>
            </div>
            <div className="flex justify-between text-[9px] font-mono text-zinc-500">
              <span>HIT: <strong className="text-zinc-200">{correctChars}</strong></span>
              <span>MISS: <strong className="text-rose-400">{incorrectChars}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM HUD TELEMETRY FOOTER ── */}
      <div className="absolute bottom-3 left-0 right-0 z-20 px-6 flex items-center justify-between text-[10px] font-mono text-zinc-500 pointer-events-none">
        <span className="hidden sm:inline">FIRING_SYSTEM: ACTIVE</span>
        <span className="text-zinc-400 font-bold mx-auto sm:mx-0">
          ⌨️ TYPE TO SHOOT KEYSTROKE PROJECTILES
        </span>
        <span className="hidden sm:inline">3D_RENDER: THREE.JS</span>
      </div>
    </div>
  );
});

export default memo(TypingArena3D);
