"use client";
import { memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import KeyboardModel from './KeyboardModel';
import { useViewport } from '@/hooks/useViewport';

interface SceneProps {
  isSettled: boolean;
}

const Scene = memo(function Scene({ isSettled }: SceneProps) {
  const viewport = useViewport();
  
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        dpr={[1, 2]}
        frameloop={isSettled ? "demand" : "always"}
        gl={{ 
          powerPreference: 'high-performance',
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={(state) => {
          state.gl.setClearColor(0x000000, 0);
          const canvas = state.gl.domElement;
          if (canvas) {
            canvas.addEventListener(
              'webglcontextlost',
              (event) => {
                event.preventDefault();
              },
              false
            );
          }
        }}
        style={{ pointerEvents: 'auto' }}
      >
        {/* Responsive camera position */}
        <PerspectiveCamera 
          makeDefault 
          position={[0, 2 * viewport.scale, 5 * viewport.scale]} 
          fov={45 + (1 - viewport.scale) * 20} 
        />
        
        {/* Subtle Cyber Neon Ambient & Directional Lighting */}
        <ambientLight intensity={0.3} color="#0c1933" />
        <directionalLight position={[5, 10, 5]} intensity={1.2} color="#f8fafc" />
        <directionalLight position={[-5, 5, -5]} intensity={0.7} color="#06b6d4" />
        <pointLight position={[0, 3, 0]} intensity={0.8} color="#3b82f6" distance={10} />
        
        <Environment preset="city" />
        
        <KeyboardModel isSettled={isSettled} modelScale={viewport.scale} />
        <ContactShadows 
          position={[0, -0.5, 0]} 
          opacity={0.85} 
          scale={20 * viewport.scale} 
          blur={2} 
          far={5}
          color="#0e2a5e"
        />
      </Canvas>
    </div>
  );
});

export default Scene;
