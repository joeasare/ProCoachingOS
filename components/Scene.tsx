import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

// Fix for missing R3F types in this environment
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      torusKnotGeometry: any;
      meshPhysicalMaterial: any;
      meshBasicMaterial: any;
      ambientLight: any;
      spotLight: any;
    }
  }
}

const FloatingObject = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle undulation on X axis
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh scale={1.8}>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <meshPhysicalMaterial
          color="#1a1a1a"
          roughness={0.1}
          metalness={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {/* Wireframe Overlay */}
      <mesh scale={1.82}>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe={true}
          transparent={true}
          opacity={0.1}
        />
      </mesh>
    </group>
  );
};

const Scene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-60">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <Environment preset="studio" />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <PresentationControls
          global={false} 
          cursor={true}
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
        >
          <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <FloatingObject />
          </Float>
        </PresentationControls>

        <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2.5} far={4} color="#000000" />
      </Canvas>
    </div>
  );
};

export default Scene;