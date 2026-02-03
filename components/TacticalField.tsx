import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, useCursor, OrbitControls, Html, Line, Cylinder, Circle } from '@react-three/drei';
import * as THREE from 'three';
import { 
    PenTool, MousePointer2, Triangle, Circle as CircleIcon, Camera, Trash2, 
    Film, Play, Pause, Plus, SkipBack, Save, FastForward, Rewind, Target, Flame, Share2, Type
} from 'lucide-react';

// Fix for missing R3F types in this environment
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      planeGeometry: any;
      meshStandardMaterial: any;
      line: any;
      bufferGeometry: any;
      float32BufferAttribute: any;
      lineBasicMaterial: any;
      ringGeometry: any;
      meshBasicMaterial: any;
      cylinderGeometry: any;
      coneGeometry: any;
      sphereGeometry: any;
      circleGeometry: any;
      color: any;
      fog: any;
      ambientLight: any;
      spotLight: any;
    }
  }
}

// --- Constants & Types ---

const UMD_RED = '#E03A3E';
const UMD_GOLD = '#FFD520';
const UMD_BLACK = '#111111';
const GRASS_COLOR = '#0f1f15';
const LINE_COLOR = '#ffffff';

const OPPONENTS = {
    PSU: { name: 'Penn State', color: '#041E42', abbr: 'PSU' },
    RUT: { name: 'Rutgers', color: '#cc0033', abbr: 'RUT' },
    IND: { name: 'Indiana', color: '#990000', abbr: 'IND' },
};

type PlayerStatus = 'Fit' | 'Injured' | 'Resting';
type ToolType = 'select' | 'draw' | 'cone' | 'ball' | 'text' | 'animate';
type LayerType = 'none' | 'xg' | 'heatmap' | 'network';

interface PlayerData {
  id: string;
  number?: number;
  name?: string;
  pos: [number, number, number];
  color: string;
  type: 'home' | 'away';
  status: PlayerStatus;
}

interface TacticalObject {
    id: string;
    type: 'cone' | 'ball';
    pos: [number, number, number];
    color?: string;
}

interface TextObject {
    id: string;
    text: string;
    pos: [number, number, number];
    color: string;
    fontSize?: number;
}

interface Keyframe {
    id: string;
    players: PlayerData[];
    objects: TacticalObject[];
    texts: TextObject[];
    lines: THREE.Vector3[][];
    duration: number; // Duration to reach this frame from previous
}

interface TacticalFieldProps {
    preview?: boolean;
    opponentColor?: string;
    onMatchSelect?: (matchId: string) => void;
    weather?: 'Clear' | 'Rain' | 'Fog';
    simulationMode?: boolean;
    isPlaying?: boolean;
    simMinute?: number;
}

// --- Data & Formations ---

const FORMATIONS: Record<string, { home: [number, number, number][], away: [number, number, number][] }> = {
  '4-3-3 Attack': {
    home: [[0, 0, 48], [-15, 0, 30], [5, 0, 35], [-5, 0, 35], [15, 0, 30], [0, 0, 15], [-10, 0, 5], [10, 0, 5], [-15, 0, -15], [0, 0, -20], [15, 0, -15]],
    away: [[0, 0, -48], [-15, 0, -35], [-5, 0, -35], [5, 0, -35], [15, 0, -35], [-10, 0, -20], [10, 0, -20], [-15, 0, -10], [0, 0, -10], [15, 0, -10], [0, 0, -5]]
  },
  '4-4-2 Flat': {
    home: [[0, 0, 48], [-18, 0, 32], [-6, 0, 35], [6, 0, 35], [18, 0, 32], [-15, 0, 10], [-5, 0, 10], [5, 0, 10], [15, 0, 10], [-6, 0, -10], [6, 0, -10]],
    away: [[0, 0, -48], [-15, 0, -35], [-5, 0, -35], [5, 0, -35], [15, 0, -35], [-15, 0, -20], [-5, 0, -20], [5, 0, -20], [15, 0, -20], [-6, 0, -10], [6, 0, -10]]
  },
  '3-5-2': {
    home: [[0, 0, 48], [-12, 0, 35], [0, 0, 35], [12, 0, 35], [-20, 0, 20], [20, 0, 20], [0, 0, 15], [-10, 0, 5], [10, 0, 5], [-6, 0, -15], [6, 0, -15]],
    away: [[0, 0, -48], [-12, 0, -35], [0, 0, -35], [12, 0, -35], [-20, 0, -20], [20, 0, -20], [0, 0, -15], [-10, 0, -5], [10, 0, -5], [-6, 0, 15], [6, 0, 15]]
  },
  '4-2-3-1': {
    home: [[0, 0, 48], [-18, 0, 35], [-6, 0, 35], [6, 0, 35], [18, 0, 35], [-8, 0, 20], [8, 0, 20], [-15, 0, 5], [0, 0, 5], [15, 0, 5], [0, 0, -15]],
    away: [[0, 0, -48], [-18, 0, -35], [-6, 0, -35], [6, 0, -35], [18, 0, -35], [-8, 0, -20], [8, 0, -20], [-15, 0, -5], [0, 0, -5], [15, 0, -5], [0, 0, 15]]
  },
  '3-4-3': {
    home: [[0, 0, 48], [-12, 0, 35], [0, 0, 35], [12, 0, 35], [-20, 0, 15], [-6, 0, 15], [6, 0, 15], [20, 0, 15], [-15, 0, -10], [0, 0, -10], [15, 0, -10]],
    away: [[0, 0, -48], [-12, 0, -35], [0, 0, -35], [12, 0, -35], [-20, 0, -15], [-6, 0, -15], [6, 0, -15], [20, 0, -15], [-15, 0, 10], [0, 0, 10], [15, 0, 10]]
  }
};

const DEFAULT_SQUAD = [
    { num: 7, name: 'Luckey', pos: 'GK' }, { num: 6, name: 'Abramson', pos: 'DEF' }, { num: 13, name: 'DeMartino', pos: 'DEF' }, { num: 23, name: 'Turnage', pos: 'DEF' }, { num: 28, name: 'Bulava', pos: 'DEF' }, 
    { num: 22, name: 'McIntyre', pos: 'MID' }, { num: 20, name: 'Davitian', pos: 'MID' }, { num: 8, name: 'Lenhard', pos: 'MID' }, 
    { num: 47, name: 'Egeland', pos: 'FWD' }, { num: 14, name: 'Smith', pos: 'FWD' }, { num: 2, name: 'Morales', pos: 'FWD' },
];

// --- 3D Components ---

const Pitch = ({ onPointerMove, onPointerDown, onPointerUp, activeTool }: any) => {
  const [hovered, setHover] = useState(false);
  useCursor(hovered && activeTool !== 'select' && activeTool !== 'animate', activeTool === 'draw' ? 'crosshair' : activeTool === 'text' ? 'text' : 'copy', 'auto');

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh 
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        onPointerMove={onPointerMove} 
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        receiveShadow
        position={[0, 0, -0.01]}
      >
        <planeGeometry args={[74, 110]} />
        <meshStandardMaterial color={GRASS_COLOR} roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Field Markings */}
      <group position={[0, 0, 0.02]}>
         <line>
            <bufferGeometry>
                <float32BufferAttribute attach="attributes-position" count={5} itemSize={3} array={new Float32Array([-34, -52.5, 0, 34, -52.5, 0, 34, 52.5, 0, -34, 52.5, 0, -34, -52.5, 0])} />
            </bufferGeometry>
            <lineBasicMaterial color={LINE_COLOR} linewidth={2} transparent opacity={0.4} />
         </line>
         <line>
            <bufferGeometry>
                <float32BufferAttribute attach="attributes-position" count={2} itemSize={3} array={new Float32Array([-34, 0, 0, 34, 0, 0])} />
            </bufferGeometry>
            <lineBasicMaterial color={LINE_COLOR} linewidth={2} transparent opacity={0.4} />
         </line>
         <mesh>
            <ringGeometry args={[9, 9.15, 64]} />
            <meshBasicMaterial color={LINE_COLOR} side={THREE.DoubleSide} transparent opacity={0.4} />
         </mesh>
         <line>
            <bufferGeometry>
                <float32BufferAttribute attach="attributes-position" count={4} itemSize={3} array={new Float32Array([-20, 52.5, 0, -20, 36, 0, 20, 36, 0, 20, 52.5, 0])} />
            </bufferGeometry>
            <lineBasicMaterial color={LINE_COLOR} linewidth={2} transparent opacity={0.4} />
         </line>
         <line>
            <bufferGeometry>
                <float32BufferAttribute attach="attributes-position" count={4} itemSize={3} array={new Float32Array([-20, -52.5, 0, -20, -36, 0, 20, -36, 0, 20, -52.5, 0])} />
            </bufferGeometry>
            <lineBasicMaterial color={LINE_COLOR} linewidth={2} transparent opacity={0.4} />
         </line>
      </group>
    </group>
  );
};

const PlayerMarker = ({ position, number, name, color, status, onPointerDown, isSelected, targetPosition, isAnimating }: any) => {
  const [hovered, setHover] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  useCursor(hovered, 'grab', 'auto');

  useFrame((state, delta) => {
      if (groupRef.current) {
          const target = targetPosition ? new THREE.Vector3(...targetPosition) : new THREE.Vector3(...position);
          const speed = isAnimating ? 10 : 3;
          groupRef.current.position.lerp(target, delta * speed); 
      }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Hit Box */}
      <mesh 
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }} 
        onPointerOut={() => setHover(false)}
        onPointerDown={onPointerDown}
        visible={false}
      >
        <cylinderGeometry args={[2, 2, 4, 8]} />
      </mesh>

      <group position={[0, 0.1, 0]}>
        {(hovered || isSelected) && !isAnimating && (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
                <ringGeometry args={[0.6, 0.8, 32]} />
                <meshBasicMaterial color={isSelected ? UMD_GOLD : 'white'} opacity={0.8} transparent />
            </mesh>
        )}
        
        <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.5, 0.5, 0.2, 32]} />
            <meshStandardMaterial color="#222" />
        </mesh>
        
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
            <meshStandardMaterial 
                color={color} 
                emissive={color}
                emissiveIntensity={0.2}
            />
        </mesh>
        
        {number && (
            <Text
                position={[0, 0.22, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={0.25}
                color={color === UMD_BLACK ? "white" : "black"}
                anchorX="center"
                anchorY="middle"
                fontWeight={800}
            >
                {number}
            </Text>
        )}
      </group>

      {/* Floating Label */}
      {name && (hovered || isSelected) && !isAnimating && (
        <Html position={[0, 1.5, 0]} center pointerEvents="none" zIndexRange={[100, 0]}>
           <div className="bg-black/80 backdrop-blur-md px-2 py-1 rounded border border-white/20 shadow-xl flex flex-col items-center">
             <span className="text-[10px] text-white font-bold whitespace-nowrap">{name}</span>
             <span className="text-[8px] text-neutral-400 uppercase">{status}</span>
           </div>
        </Html>
      )}
    </group>
  );
};

const ObjectMarker = ({ type, position, isSelected, onPointerDown, isAnimating }: any) => {
    const [hovered, setHover] = useState(false);
    const groupRef = useRef<THREE.Group>(null);
    useCursor(hovered, 'grab', 'auto');

    useFrame((state, delta) => {
        if (groupRef.current && position) {
             const target = new THREE.Vector3(...position);
             const speed = isAnimating ? 10 : 3;
             groupRef.current.position.lerp(target, delta * speed);
        }
    });

    return (
        <group ref={groupRef} position={position} 
            onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
            onPointerOut={() => setHover(false)}
            onPointerDown={onPointerDown}
        >
            {type === 'cone' && (
                <mesh position={[0, 0.25, 0]} castShadow>
                    <coneGeometry args={[0.3, 0.5, 16]} />
                    <meshStandardMaterial color="orange" emissive="orange" emissiveIntensity={0.5} />
                </mesh>
            )}
            {type === 'ball' && (
                <mesh position={[0, 0.2, 0]} castShadow>
                    <sphereGeometry args={[0.2, 32, 32]} />
                    <meshStandardMaterial color="white" roughness={0.5} />
                </mesh>
            )}
            {isSelected && !isAnimating && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                    <ringGeometry args={[0.4, 0.5, 32]} />
                    <meshBasicMaterial color={UMD_GOLD} />
                </mesh>
            )}
        </group>
    );
};

const TextMarker = ({ id, text, position, isSelected, onPointerDown, isAnimating, activeTool, onUpdateText }: any) => {
    const [hovered, setHover] = useState(false);
    const groupRef = useRef<THREE.Group>(null);
    useCursor(hovered, 'text', 'auto');

    useFrame((state, delta) => {
        if (groupRef.current && position) {
             const target = new THREE.Vector3(...position);
             const speed = isAnimating ? 10 : 3;
             groupRef.current.position.lerp(target, delta * speed);
        }
    });

    const handleClick = (e: any) => {
        if (activeTool === 'text') {
            e.stopPropagation();
            const newText = prompt("Update label:", text);
            if (newText) {
                onUpdateText(id, newText);
            }
        } else {
            onPointerDown(e);
        }
    }

    return (
        <group ref={groupRef} position={position}
            onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
            onPointerOut={() => setHover(false)}
            onPointerDown={handleClick}
        >
             <Text
                position={[0, 0.2, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={2}
                color="white"
                anchorX="center"
                anchorY="middle"
                fontWeight={700}
                fillOpacity={hovered || isSelected ? 1 : 0.8}
            >
                {text}
            </Text>
            {isSelected && !isAnimating && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                     <planeGeometry args={[text.length * 1.5, 3]} />
                     <meshBasicMaterial color={UMD_GOLD} opacity={0.2} transparent />
                </mesh>
            )}
        </group>
    );
};

const DrawnLines = ({ lines }: { lines: THREE.Vector3[][] }) => (
    <group position={[0, 0.2, 0]}>
        {lines.map((line, i) => (
            <Line
                key={i}
                points={line}
                color={UMD_GOLD}
                lineWidth={3}
                transparent
                opacity={0.8}
            />
        ))}
    </group>
);

// --- VISUALIZATION LAYERS ---

const XGLayer = () => {
    return (
        <group position={[0, 0.2, 0]}>
            {/* Penalty Spot Area - High xG */}
            <Cylinder args={[3, 3, 0.1, 32]} position={[0, 0, -42]} rotation={[0, 0, 0]}>
                <meshBasicMaterial color={UMD_GOLD} opacity={0.3} transparent depthWrite={false} />
            </Cylinder>
            <Text position={[0, 1, -42]} rotation={[-Math.PI/2, 0, 0]} fontSize={1} color="white">0.76 xG</Text>

            {/* Top of Box - Med xG */}
            <Cylinder args={[6, 6, 0.1, 32]} position={[0, 0, -32]}>
                <meshBasicMaterial color={UMD_RED} opacity={0.2} transparent depthWrite={false} />
            </Cylinder>
            <Text position={[0, 1, -32]} rotation={[-Math.PI/2, 0, 0]} fontSize={1} color="white">0.32 xG</Text>
            
            {/* Wide Area - Low xG */}
             <Cylinder args={[4, 4, 0.1, 32]} position={[15, 0, -25]}>
                <meshBasicMaterial color="blue" opacity={0.15} transparent depthWrite={false} />
            </Cylinder>
            <Text position={[15, 1, -25]} rotation={[-Math.PI/2, 0, 0]} fontSize={1} color="white">0.05 xG</Text>
        </group>
    );
};

const HeatmapLayer = () => {
    return (
        <group position={[0, 0.15, 0]} rotation={[-Math.PI/2, 0, 0]}>
            {/* Simulated Heatmap Blobs (Pressing Triggers) */}
            <mesh position={[-10, -20, 0]}>
                <circleGeometry args={[8, 32]} />
                <meshBasicMaterial color={UMD_RED} opacity={0.4} transparent depthWrite={false} />
            </mesh>
             <mesh position={[10, -25, 0]}>
                <circleGeometry args={[6, 32]} />
                <meshBasicMaterial color={UMD_RED} opacity={0.3} transparent depthWrite={false} />
            </mesh>
             <mesh position={[0, -35, 0]}>
                <circleGeometry args={[12, 32]} />
                <meshBasicMaterial color="orange" opacity={0.2} transparent depthWrite={false} />
            </mesh>
        </group>
    );
};

const PassNetworkLayer = ({ players }: { players: PlayerData[] }) => {
    // Calculate topology based on distance between home players
    const homePlayers = players.filter(p => p.type === 'home');
    const connections: THREE.Vector3[][] = [];

    // Simple proximity-based network logic
    for (let i = 0; i < homePlayers.length; i++) {
        for (let j = i + 1; j < homePlayers.length; j++) {
            const p1 = new THREE.Vector3(...homePlayers[i].pos);
            const p2 = new THREE.Vector3(...homePlayers[j].pos);
            if (p1.distanceTo(p2) < 25) { // Threshold for connection
                connections.push([p1, p2]);
            }
        }
    }

    return (
        <group position={[0, 0.5, 0]}>
            {connections.map((line, i) => (
                <Line
                    key={i}
                    points={line}
                    color="white"
                    opacity={0.15}
                    transparent
                    lineWidth={1}
                />
            ))}
            {/* Nodes */}
            {homePlayers.map(p => (
                 <mesh key={p.id} position={[p.pos[0], 0, p.pos[2]]} rotation={[-Math.PI/2, 0, 0]}>
                    <ringGeometry args={[1, 1.2, 32]} />
                    <meshBasicMaterial color="white" opacity={0.5} transparent />
                 </mesh>
            ))}
        </group>
    )
}

const CinematicCamera = () => {
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        state.camera.position.x = Math.sin(t * 0.1) * 60;
        state.camera.position.z = Math.cos(t * 0.1) * 60;
        state.camera.lookAt(0, 0, 0);
    });
    return null;
};

// --- Overlay Components ---

interface ToolButtonProps {
    icon: any;
    isActive: boolean;
    onClick: () => void;
    label: string;
}

const ToolButton: React.FC<ToolButtonProps> = ({ icon: Icon, isActive, onClick, label }) => (
    <button
        onClick={onClick}
        className={`p-3 rounded-xl flex items-center justify-center transition-all group relative ${
            isActive ? 'bg-primary text-white shadow-lg' : 'hover:bg-white/10 text-neutral-400 hover:text-white'
        }`}
        title={label}
    >
        <Icon size={20} />
        {/* Tooltip */}
        <span className="absolute left-full ml-2 px-2 py-1 bg-black/90 text-white text-[10px] font-bold uppercase tracking-wider rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-white/10">
            {label}
        </span>
    </button>
);

interface LayerButtonProps {
    icon: any;
    isActive: boolean;
    onClick: () => void;
    color: string;
    label: string;
}

const LayerButton: React.FC<LayerButtonProps> = ({ icon: Icon, isActive, onClick, color, label }) => {
    let activeClass = '';
    if (color === 'blue') activeClass = 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]';
    else if (color === 'red') activeClass = 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]';
    else if (color === 'emerald') activeClass = 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]';
    else activeClass = 'bg-primary text-white';

    return (
        <button
            onClick={onClick}
            className={`p-3 rounded-xl flex items-center justify-center transition-all group relative ${
                isActive ? activeClass : 'hover:bg-white/10 text-neutral-400 hover:text-white'
            }`}
        >
            <Icon size={20} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-black/90 text-white text-[10px] font-bold uppercase tracking-wider rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-white/10">
                {label}
            </span>
        </button>
    );
};

interface ActionButtonProps {
    icon: any;
    onClick: () => void;
    label: string;
    danger?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, onClick, label, danger }) => (
    <button
        onClick={onClick}
        className={`p-3 rounded-xl flex items-center justify-center transition-all group relative ${
            danger ? 'hover:bg-red-500/20 text-neutral-400 hover:text-red-500' : 'hover:bg-white/10 text-neutral-400 hover:text-white'
        }`}
    >
        <Icon size={20} />
        <span className="absolute left-full ml-2 px-2 py-1 bg-black/90 text-white text-[10px] font-bold uppercase tracking-wider rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-white/10">
            {label}
        </span>
    </button>
);

const ToolBar = ({ activeTool, setTool, activeLayer, setLayer, onClear, onScreenshot }: any) => (
    <div className="absolute top-1/2 left-6 -translate-y-1/2 flex flex-col gap-4 pointer-events-auto z-50">
        {/* Tools Group */}
        <div className="bg-black/90 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl flex flex-col gap-2">
            <ToolButton icon={MousePointer2} isActive={activeTool === 'select'} onClick={() => setTool('select')} label="Select" />
            <ToolButton icon={PenTool} isActive={activeTool === 'draw'} onClick={() => setTool('draw')} label="Draw" />
            <ToolButton icon={Triangle} isActive={activeTool === 'cone'} onClick={() => setTool('cone')} label="Cone" />
            <ToolButton icon={CircleIcon} isActive={activeTool === 'ball'} onClick={() => setTool('ball')} label="Ball" />
            <ToolButton icon={Type} isActive={activeTool === 'text'} onClick={() => setTool('text')} label="Text" />
        </div>
        {/* Layers Group */}
        <div className="bg-black/90 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl flex flex-col gap-2">
            <LayerButton icon={Target} isActive={activeLayer === 'xg'} onClick={() => setLayer(activeLayer === 'xg' ? 'none' : 'xg')} color="blue" label="xG" />
            <LayerButton icon={Flame} isActive={activeLayer === 'heatmap'} onClick={() => setLayer(activeLayer === 'heatmap' ? 'none' : 'heatmap')} color="red" label="Heat" />
            <LayerButton icon={Share2} isActive={activeLayer === 'network'} onClick={() => setLayer(activeLayer === 'network' ? 'none' : 'network')} color="emerald" label="Net" />
        </div>
        {/* Actions Group */}
        <div className="bg-black/90 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl flex flex-col gap-2">
            <ToolButton icon={Film} isActive={activeTool === 'animate'} onClick={() => setTool('animate')} label="Animate" />
            <div className="h-px bg-white/10 w-full my-1" />
            <ActionButton icon={Trash2} onClick={onClear} label="Clear" danger />
            <ActionButton icon={Camera} onClick={onScreenshot} label="Snap" />
        </div>
    </div>
);

// --- Animation UI Overlay ---
// (Kept similar to previous, but only shown in 'animate' tool mode)
const AnimationTimeline = ({ 
    keyframes, 
    addKeyframe, 
    activeKeyframeIndex, 
    restoreKeyframe,
    isPlaying,
    setIsPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    clearKeyframes
}: any) => {
    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto flex flex-col items-center gap-4 w-full max-w-2xl px-4">
             {/* Controls */}
             <div className="flex items-center gap-4 bg-black/90 backdrop-blur-xl px-8 py-4 rounded-full border border-white/10 shadow-2xl">
                <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    disabled={keyframes.length < 2}
                    className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)]"
                >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                </button>
                <div className="h-8 w-px bg-white/10" />
                <button 
                    onClick={addKeyframe}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-primary transition-colors"
                >
                    <Plus size={16} /> Capture Frame
                </button>
                <div className="h-8 w-px bg-white/10" />
                <button 
                    onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : playbackSpeed === 2 ? 0.5 : 1)}
                    className="text-xs font-mono font-bold text-neutral-400 hover:text-white w-8 text-center"
                >
                    {playbackSpeed}x
                </button>
                <div className="h-8 w-px bg-white/10" />
                <button 
                    onClick={clearKeyframes}
                    className="text-neutral-400 hover:text-red-500 transition-colors"
                    title="Clear Animation"
                >
                    <Trash2 size={16} />
                </button>
             </div>
             {/* Timeline Strip */}
             <div className="flex items-center gap-2 bg-black/90 backdrop-blur-xl p-2 rounded-2xl border border-white/10 overflow-x-auto max-w-full shadow-2xl">
                 {keyframes.length === 0 && (
                     <span className="text-[10px] text-neutral-500 px-4 py-1">No frames captured. Position players then click 'Capture'.</span>
                 )}
                 {keyframes.map((frame: Keyframe, i: number) => (
                     <React.Fragment key={frame.id}>
                        <button 
                            onClick={() => restoreKeyframe(i)}
                            className={`relative min-w-[32px] h-8 rounded-lg flex items-center justify-center text-[10px] font-bold border transition-all ${
                                activeKeyframeIndex === i 
                                ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(225,29,72,0.2)]' 
                                : 'bg-white/5 border-transparent text-neutral-400 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            {i + 1}
                            {activeKeyframeIndex === i && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_5px_rgba(225,29,72,0.8)]" />
                            )}
                        </button>
                        {i < keyframes.length - 1 && <div className="w-4 h-0.5 bg-white/5" />}
                     </React.Fragment>
                 ))}
             </div>
        </div>
    );
};


// --- Simulation Components (Preview Only) ---

// Simulated Ball that moves between players
const SimulatedGame = ({ players, isPlaying = true, simMinute = 0 }: { players: PlayerData[], isPlaying?: boolean, simMinute?: number }) => {
    const ballRef = useRef<THREE.Mesh>(null);
    const targetRef = useRef<THREE.Vector3 | null>(null);
    const speedRef = useRef(20); // Ball speed

    useEffect(() => {
        if (ballRef.current && players.length > 0) {
             ballRef.current.position.set(0, 0.5, 0);
        }
    }, [players]);

    // Reset ball logic when game restarts
    useEffect(() => {
        if (simMinute === 0 && ballRef.current) {
            ballRef.current.position.set(0, 0.5, 0);
            targetRef.current = null;
        }
    }, [simMinute]);

    useFrame((state, delta) => {
        if (!ballRef.current || players.length === 0) return;
        if (!isPlaying) return; // Stop movement if paused

        // If no target, pick a random player
        if (!targetRef.current) {
            const randomPlayer = players[Math.floor(Math.random() * players.length)];
            const t = new THREE.Vector3(randomPlayer.pos[0], 0.5, randomPlayer.pos[2]);
            // Add some randomness to pass (not perfectly to feet)
            t.x += (Math.random() - 0.5) * 2;
            t.z += (Math.random() - 0.5) * 2;
            targetRef.current = t;
        }

        // Move ball to target
        const ballPos = ballRef.current.position;
        const direction = new THREE.Vector3().subVectors(targetRef.current, ballPos).normalize();
        const distance = ballPos.distanceTo(targetRef.current);

        if (distance < 0.5) {
            // Reached target
            targetRef.current = null;
        } else {
            // Move
            ballRef.current.position.add(direction.multiplyScalar(speedRef.current * delta));
            // Add arc (fake physics)
            ballRef.current.position.y = 0.5 + Math.sin((distance / 20) * Math.PI) * 2;
            if(ballRef.current.position.y < 0.2) ballRef.current.position.y = 0.2;
        }
    });

    return (
        <mesh ref={ballRef} castShadow>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshStandardMaterial color="white" emissive="#ccc" emissiveIntensity={0.2} roughness={0.2} />
        </mesh>
    );
}

// --- Animation Controller ---
interface AnimationControllerProps {
    isPlaying: boolean;
    playbackSpeed: number;
    keyframes: Keyframe[];
    setPlayers: React.Dispatch<React.SetStateAction<PlayerData[]>>;
    setObjects: React.Dispatch<React.SetStateAction<TacticalObject[]>>;
    setTexts: React.Dispatch<React.SetStateAction<TextObject[]>>;
    onFinish: () => void;
}

// (Handles keyframe interpolation in manual animate mode)
const AnimationController = ({ isPlaying, playbackSpeed, keyframes, setPlayers, setObjects, setTexts, onFinish }: AnimationControllerProps) => {
    const timeRef = useRef(0);
    const durationPerSegment = 2; // seconds between keyframes

    useFrame((state, delta) => {
        if (!isPlaying || keyframes.length < 2) return;

        timeRef.current += delta * playbackSpeed;
        
        const totalDuration = (keyframes.length - 1) * durationPerSegment;
        
        if (timeRef.current >= totalDuration) {
            timeRef.current = 0; // Loop or stop
            return;
        }

        const segmentIndex = Math.floor(timeRef.current / durationPerSegment);
        const nextSegmentIndex = Math.min(segmentIndex + 1, keyframes.length - 1);
        const alpha = (timeRef.current % durationPerSegment) / durationPerSegment;

        const startFrame = keyframes[segmentIndex];
        const endFrame = keyframes[nextSegmentIndex];

        if (!startFrame || !endFrame) return;

        // Interpolate Players
        setPlayers(prevPlayers => prevPlayers.map(p => {
            const startPos = startFrame.players.find(sp => sp.id === p.id)?.pos;
            const endPos = endFrame.players.find(ep => ep.id === p.id)?.pos;
            if (startPos && endPos) {
                const vStart = new THREE.Vector3(...startPos);
                const vEnd = new THREE.Vector3(...endPos);
                const vCurrent = new THREE.Vector3().lerpVectors(vStart, vEnd, alpha);
                return { ...p, pos: [vCurrent.x, vCurrent.y, vCurrent.z] };
            }
            return p;
        }));

        // Interpolate Objects
        setObjects(prevObjects => prevObjects.map(o => {
            const startPos = startFrame.objects.find(so => so.id === o.id)?.pos;
            const endPos = endFrame.objects.find(eo => eo.id === o.id)?.pos;
            if (startPos && endPos) {
                const vStart = new THREE.Vector3(...startPos);
                const vEnd = new THREE.Vector3(...endPos);
                const vCurrent = new THREE.Vector3().lerpVectors(vStart, vEnd, alpha);
                return { ...o, pos: [vCurrent.x, vCurrent.y, vCurrent.z] };
            }
            return o;
        }));

        // Interpolate Texts
        setTexts(prevTexts => prevTexts.map(t => {
            const startPos = startFrame.texts.find(st => st.id === t.id)?.pos;
            const endPos = endFrame.texts.find(et => et.id === t.id)?.pos;
            if (startPos && endPos) {
                const vStart = new THREE.Vector3(...startPos);
                const vEnd = new THREE.Vector3(...endPos);
                const vCurrent = new THREE.Vector3().lerpVectors(vStart, vEnd, alpha);
                return { ...t, pos: [vCurrent.x, vCurrent.y, vCurrent.z] };
            }
            return t;
        }));
    });

    return null;
};

// --- Main Component ---

const TacticalField: React.FC<TacticalFieldProps> = ({ 
    preview = false, 
    opponentColor, 
    weather = 'Clear', 
    simulationMode = false, 
    isPlaying = true, 
    simMinute = 0 
}) => {
  const [activeFormation, setActiveFormation] = useState('4-3-3 Attack');
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [objects, setObjects] = useState<TacticalObject[]>([]);
  const [texts, setTexts] = useState<TextObject[]>([]);
  
  const [tool, setTool] = useState<ToolType>('select');
  const [activeLayer, setActiveLayer] = useState<LayerType>('none');
  const [lines, setLines] = useState<THREE.Vector3[][]>([]);
  const [currentLine, setCurrentLine] = useState<THREE.Vector3[]>([]);
  
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Animation State (Manual Keyframes)
  const [keyframes, setKeyframes] = useState<Keyframe[]>([]);
  const [activeKeyframeIndex, setActiveKeyframeIndex] = useState<number>(-1);
  const [isKeyframePlaying, setIsKeyframePlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const controlsRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initial Setup
  useEffect(() => {
    // Generate Players
    const home = DEFAULT_SQUAD.map((p, i) => ({
        id: `h${i}`, number: p.num, name: p.name, pos: [0,0,0] as [number, number, number], color: i===0 ? UMD_BLACK : UMD_RED, type: 'home' as const, status: 'Fit' as PlayerStatus
    }));
    
    const opColor = opponentColor || OPPONENTS.PSU.color;
    const opponentFormation = FORMATIONS['4-4-2 Flat'].away;
    const opponent = opponentFormation.map((pos, i) => ({
        id: `a${i}`, number: i+1, name: '', pos: [0,0,0] as [number, number, number], color: opColor, type: 'away' as const, status: 'Fit' as PlayerStatus
    }));

    // Position Home Team
    const layout = FORMATIONS[activeFormation];
    const positionedHome = home.map((p, i) => ({ ...p, pos: layout.home[i] || p.pos }));
    const positionedAway = opponent.map((p, i) => ({ ...p, pos: layout.away[i] || p.pos }));

    setPlayers([...positionedHome, ...positionedAway]);
    
    // Only reset objects if not just changing colors (which happens in preview)
    if (!preview && !simulationMode) {
        setLines([]);
        setObjects([]);
        setTexts([]);
        setKeyframes([]);
    }
  }, [activeFormation, opponentColor, preview, simulationMode]);

  // Keyframe Logic
  const addKeyframe = () => {
      const newKeyframe: Keyframe = {
          id: Math.random().toString(),
          players: JSON.parse(JSON.stringify(players)),
          objects: JSON.parse(JSON.stringify(objects)),
          texts: JSON.parse(JSON.stringify(texts)),
          lines: [],
          duration: 2
      };
      setKeyframes([...keyframes, newKeyframe]);
      setActiveKeyframeIndex(keyframes.length);
  };

  const restoreKeyframe = (index: number) => {
      const frame = keyframes[index];
      if (frame) {
          setPlayers(JSON.parse(JSON.stringify(frame.players)));
          setObjects(JSON.parse(JSON.stringify(frame.objects)));
          setTexts(JSON.parse(JSON.stringify(frame.texts)));
          setActiveKeyframeIndex(index);
          setIsKeyframePlaying(false);
      }
  };

  const clearKeyframes = () => {
      setKeyframes([]);
      setActiveKeyframeIndex(-1);
      setIsKeyframePlaying(false);
  };

  // Canvas Interactions
  const handlePointerDown = (e: any) => {
      if (isKeyframePlaying || simulationMode) return; // Disable interaction during playback or simulation

      e.stopPropagation();
      const point = e.point;
      
      if (tool === 'draw') {
          setCurrentLine([point]);
          if (controlsRef.current) controlsRef.current.enabled = false;
      } else if (tool === 'cone') {
          setObjects(prev => [...prev, { id: Math.random().toString(), type: 'cone', pos: [point.x, point.y, point.z] }]);
          setTool('select');
      } else if (tool === 'ball') {
          setObjects(prev => [...prev, { id: Math.random().toString(), type: 'ball', pos: [point.x, point.y, point.z] }]);
          setTool('select');
      } else if (tool === 'text') {
            const text = prompt("Enter label text:", "Label");
            if (text) {
                setTexts(prev => [...prev, { id: `t-${Math.random()}`, text, pos: [point.x, point.y, point.z], color: 'white' }]);
            }
      } else {
          setSelectedId(null);
      }
  };

  const handlePointerMove = (e: any) => {
      if (isKeyframePlaying || simulationMode) return;

      if (tool === 'draw' && currentLine.length > 0) {
          setCurrentLine(prev => [...prev, e.point]);
      } else if (draggingId && (tool === 'select' || tool === 'animate' || tool === 'text')) {
          const { x, z } = e.point;
          const cx = Math.max(-36, Math.min(36, x));
          const cz = Math.max(-54, Math.min(54, z));

          if (draggingId.startsWith('h') || draggingId.startsWith('a')) {
              setPlayers(prev => prev.map(p => p.id === draggingId ? { ...p, pos: [cx, 0, cz] } : p));
          } else if (texts.find(t => t.id === draggingId)) {
              setTexts(prev => prev.map(t => t.id === draggingId ? { ...t, pos: [cx, 0, cz] } : t));
          } else {
              setObjects(prev => prev.map(o => o.id === draggingId ? { ...o, pos: [cx, 0, cz] } : o));
          }
      }
  };

  const handlePointerUp = () => {
      if (tool === 'draw' && currentLine.length > 0) {
          setLines(prev => [...prev, currentLine]);
          setCurrentLine([]);
      }
      setDraggingId(null);
      if (controlsRef.current) controlsRef.current.enabled = true;
  };

  const handleObjectDown = (id: string, e: any) => {
      if (isKeyframePlaying || simulationMode) return;
      if (tool === 'select' || tool === 'animate' || tool === 'text') {
          e.stopPropagation();
          setDraggingId(id);
          setSelectedId(id);
          if (controlsRef.current) controlsRef.current.enabled = false;
      }
  };

  const handleUpdateText = (id: string, newText: string) => {
      setTexts(prev => prev.map(t => t.id === id ? { ...t, text: newText } : t));
  };

  const handleScreenshot = () => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
          const link = document.createElement('a');
          link.setAttribute('download', 'tactics_board.png');
          link.setAttribute('href', canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'));
          link.click();
      }
  };

  const handleClear = () => {
      setLines([]);
      setObjects([]);
      setTexts([]);
      setKeyframes([]);
      const layout = FORMATIONS[activeFormation];
      setPlayers(prev => prev.map((p, i) => {
          if (p.type === 'home') return { ...p, pos: layout.home[parseInt(p.id.substring(1))] || p.pos };
          return p; 
      }));
  };

  return (
    <div className="w-full h-full bg-[#080808] relative select-none group overflow-hidden">
      
      {/* UI Layer - Only render if NOT in preview mode and NOT in simulation mode */}
      {!preview && !simulationMode && (
        <>
            <ToolBar 
                activeTool={tool} 
                setTool={setTool} 
                activeLayer={activeLayer}
                setLayer={setActiveLayer}
                onClear={handleClear} 
                onScreenshot={handleScreenshot} 
            />
            
            <div className="absolute top-4 left-24 right-4 z-10 flex gap-4 items-start pointer-events-none">
                <div className="pointer-events-auto bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-lg flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${tool === 'draw' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : tool === 'animate' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                    <span className="text-white text-[10px] font-bold uppercase tracking-widest">
                        {tool === 'draw' ? 'Drawing Mode' : tool === 'animate' ? 'Animation Studio' : tool === 'text' ? 'Text Mode' : 'Interactive Mode'}
                    </span>
                </div>
                
                {activeLayer !== 'none' && (
                     <div className="pointer-events-auto bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-lg animate-in fade-in slide-in-from-top-2">
                        <span className="text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            Layer: <span className="text-primary shadow-primary/50 drop-shadow-sm">{activeLayer === 'xg' ? 'Expected Goals' : activeLayer === 'heatmap' ? 'Pressing Map' : 'Network Topology'}</span>
                        </span>
                    </div>
                )}
            </div>

            {/* Bottom Controls - Hide if Animation Mode is Active */}
            {tool !== 'animate' && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-auto flex gap-2 w-full max-w-4xl px-4 justify-center">
                    <div className="flex gap-1.5 bg-black/80 backdrop-blur-xl p-1.5 rounded-full border border-white/10 overflow-x-auto no-scrollbar max-w-full shadow-2xl">
                        {Object.keys(FORMATIONS).map(f => (
                            <button 
                                key={f}
                                onClick={() => setActiveFormation(f)}
                                className={`px-4 py-2 rounded-full text-[10px] uppercase font-bold transition-all whitespace-nowrap ${
                                    activeFormation === f 
                                    ? 'bg-white text-black shadow-lg scale-105' 
                                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Animation Controls */}
            {tool === 'animate' && (
                <AnimationTimeline 
                    keyframes={keyframes}
                    addKeyframe={addKeyframe}
                    activeKeyframeIndex={activeKeyframeIndex}
                    restoreKeyframe={restoreKeyframe}
                    isPlaying={isKeyframePlaying}
                    setIsPlaying={setIsKeyframePlaying}
                    playbackSpeed={playbackSpeed}
                    setPlaybackSpeed={setPlaybackSpeed}
                    clearKeyframes={clearKeyframes}
                />
            )}
        </>
      )}

      {/* 3D Scene */}
      <Canvas shadows camera={{ position: [0, 65, 45], fov: 40 }} className="cursor-grab active:cursor-grabbing" ref={canvasRef as any} gl={{ preserveDrawingBuffer: true }}>
        <color attach="background" args={['#080808']} />
        
        {/* Weather Effects */}
        {weather === 'Fog' ? (
            <fog attach="fog" args={['#080808', 5, 60]} />
        ) : weather === 'Rain' ? (
            <fog attach="fog" args={['#080808', 20, 90]} />
        ) : (
            <fog attach="fog" args={['#080808', 40, 160]} />
        )}
        <ambientLight intensity={weather === 'Clear' ? 1.5 : 0.8} />
        
        <spotLight position={[20, 50, 20]} angle={0.5} penumbra={1} intensity={1} castShadow />
        
        {/* Camera Logic: Preview forces Cinematic, Simulation Mode + Preview=false allows orbit, Normal interactive allows orbit */}
        {preview && !simulationMode ? (
            <CinematicCamera />
        ) : (
            <OrbitControls 
                ref={controlsRef}
                minPolarAngle={0} 
                maxPolarAngle={Math.PI / 2.5} 
                minDistance={20}
                maxDistance={120}
                enableDamping={true}
                dampingFactor={0.08}
            />
        )}

        {/* Live Simulation Layer (Ball Movement) */}
        {(preview || simulationMode) && (
            <SimulatedGame players={players} isPlaying={isPlaying} simMinute={simMinute} />
        )}

        {/* Manual Animation Logic */}
        <AnimationController 
            isPlaying={isKeyframePlaying}
            playbackSpeed={playbackSpeed}
            keyframes={keyframes}
            setPlayers={setPlayers}
            setObjects={setObjects}
            setTexts={setTexts}
            onFinish={() => setIsKeyframePlaying(false)}
        />

        {/* The Pitch & Logic */}
        <Pitch 
            onPointerDown={handlePointerDown} 
            onPointerMove={handlePointerMove} 
            onPointerUp={handlePointerUp}
            activeTool={tool}
        />

        {/* Visualization Layers */}
        {activeLayer === 'xg' && <XGLayer />}
        {activeLayer === 'heatmap' && <HeatmapLayer />}
        {activeLayer === 'network' && <PassNetworkLayer players={players} />}

        {/* Players */}
        {players.map((player) => (
            <PlayerMarker 
                key={player.id}
                {...player}
                targetPosition={player.pos}
                isSelected={selectedId === player.id}
                isAnimating={isKeyframePlaying}
                onPointerDown={(e: any) => handleObjectDown(player.id, e)}
            />
        ))}

        {/* Objects (Cones, Balls) */}
        {objects.map((obj) => (
            <ObjectMarker 
                key={obj.id}
                {...obj}
                position={obj.pos}
                isSelected={selectedId === obj.id}
                isAnimating={isKeyframePlaying}
                onPointerDown={(e: any) => handleObjectDown(obj.id, e)}
            />
        ))}

        {/* Text Labels */}
        {texts.map((t) => (
            <TextMarker
                key={t.id}
                {...t}
                position={t.pos}
                isSelected={selectedId === t.id}
                isAnimating={isKeyframePlaying}
                activeTool={tool}
                onPointerDown={(e: any) => handleObjectDown(t.id, e)}
                onUpdateText={handleUpdateText}
            />
        ))}

        <DrawnLines lines={lines} />
        {currentLine.length > 0 && <DrawnLines lines={[currentLine]} />}

      </Canvas>
    </div>
  );
};

export default TacticalField;