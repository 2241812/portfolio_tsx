"use client";
import React, { useRef, memo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const COUNT = 160;
const POSITIONS = new Float32Array(COUNT * 3);
const LINE_COORDS: number[] = [];

for (let i = 0; i < COUNT; i++) {
  POSITIONS[i * 3] = (seededRandom(i * 3 + 1) - 0.5) * 22;
  POSITIONS[i * 3 + 1] = (seededRandom(i * 3 + 2) - 0.5) * 12;
  POSITIONS[i * 3 + 2] = (seededRandom(i * 3 + 3) - 0.5) * 10;
}

for (let i = 0; i < COUNT; i++) {
  for (let j = i + 1; j < COUNT; j++) {
    const dx = POSITIONS[i * 3] - POSITIONS[j * 3];
    const dy = POSITIONS[i * 3 + 1] - POSITIONS[j * 3 + 1];
    const dz = POSITIONS[i * 3 + 2] - POSITIONS[j * 3 + 2];
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist < 2.6) {
      LINE_COORDS.push(
        POSITIONS[i * 3], POSITIONS[i * 3 + 1], POSITIONS[i * 3 + 2],
        POSITIONS[j * 3], POSITIONS[j * 3 + 1], POSITIONS[j * 3 + 2]
      );
    }
  }
}

const LINE_POSITIONS = new Float32Array(LINE_COORDS);

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    const targetX = state.pointer.x * 0.35;
    const targetY = state.pointer.y * 0.25;

    pointsRef.current.rotation.y = THREE.MathUtils.lerp(
      pointsRef.current.rotation.y,
      t * 0.02 + targetX,
      0.04
    );
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(
      pointsRef.current.rotation.x,
      Math.sin(t * 0.015) * 0.03 - targetY,
      0.04
    );

    if (linesRef.current) {
      linesRef.current.rotation.y = pointsRef.current.rotation.y;
      linesRef.current.rotation.x = pointsRef.current.rotation.x;
    }
  });

  return (
    <group>
      {/* Particle Nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[POSITIONS, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          color="#ffffff"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Connectivity Lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[LINE_POSITIONS, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.12}
        />
      </lineSegments>
    </group>
  );
}

export const HeroThreeBackground = memo(function HeroThreeBackground() {
  const [hasWebGL, setHasWebGL] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        setHasWebGL(true);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
      {hasWebGL ? (
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.5} />
          <ParticleField />
        </Canvas>
      ) : (
        <div className="w-full h-full opacity-40 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.08),transparent_70%)]" />
      )}
    </div>
  );
});

export default HeroThreeBackground;
