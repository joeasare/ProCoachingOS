
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Fix for missing R3F types in this environment
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      line: any;
      lineLoop: any;
      lineSegments: any;
      pointLight: any;
      directionalLight: any;
      spotLight: any;
      ambientLight: any;
      fog: any;
      color: any;
      // Geometries
      planeGeometry: any;
      bufferGeometry: any;
      boxGeometry: any;
      sphereGeometry: any;
      cylinderGeometry: any;
      coneGeometry: any;
      circleGeometry: any;
      ringGeometry: any;
      torusKnotGeometry: any;
      icosahedronGeometry: any;
      // Materials
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      meshPhysicalMaterial: any;
      lineBasicMaterial: any;
      // Attributes
      float32BufferAttribute: any;
      // Catch-all removed to prevent duplicate index signature
    }
  }
  // Support for React 18+ JSX namespace
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        // Catch-all removed to prevent duplicate index signature
      }
    }
  }
}

const WireframeBall = ({ theme }: { theme: 'dark' | 'light' }) => {
  const meshRef = useRef<THREE.Group>(null);
  const wireColor = theme === 'dark' ? '#ffffff' : '#18181B';

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Core Sphere */}
      <mesh>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshBasicMaterial 
            color={theme === 'dark' ? "#000000" : "#ffffff"} 
            wireframe 
            transparent 
            opacity={0.05} // Very subtle inner structure
        />
      </mesh>
      
      {/* Outer Tactical Shell */}
      <mesh scale={1.2}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial
          color={wireColor}
          wireframe
          transparent
          opacity={0.3}
          roughness={0.0}
          metalness={1.0}
        />
      </mesh>

      {/* Orbiting Nodes */}
      {[...Array(4)].map((_, i) => (
        <mesh key={i} position={[Math.sin(i * 1.5) * 2.5, Math.cos(i * 1.5) * 2.5, 0]} rotation={[0, 0, i]}>
            <ringGeometry args={[0.02, 0.05, 32]} />
            <meshBasicMaterial color={wireColor} />
        </mesh>
      ))}
    </group>
  );
};

interface Landing3DProps {
    theme?: 'dark' | 'light';
}

const Landing3D = ({ theme = 'dark' }: Landing3DProps) => {
  const fogColor = theme === 'dark' ? '#000000' : '#F4F4F5';

  return (
    <div className="absolute inset-0 z-0 pointer-events-none mix-blend-difference">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <fog attach="fog" args={[fogColor, 5, 12]} />
        <Environment preset={theme === 'dark' ? "city" : "studio"} />
        <ambientLight intensity={0.5} />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <WireframeBall theme={theme} />
        </Float>
      </Canvas>
    </div>
  );
};

export default Landing3D;
