
export type Position = 'GK' | 'DEF' | 'MID' | 'FWD';
export type Status = 'Fit' | 'Injured' | 'Suspended' | 'International Duty' | 'Resting';

export interface PlayerAttributes {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface BioMechanics {
    sprintSymmetry: number; // percentage (e.g., 50.1)
    groundContactTime: number; // ms
    forceProduction: number; // N
    fatigueIndex: number; // 0-100 (lower is better)
    sleepQuality: number; // 0-100
}

export interface LoadManagement {
    acuteLoad: number; // 7-day avg
    chronicLoad: number; // 28-day avg
    acwr: number; // Ratio
    weeklyStrain: number[]; // Last 7 days strain arbitrary units
}

export interface Player {
  id: string;
  number: number;
  name: string;
  position: Position;
  status: Status;
  minutesPlayed: number;
  goals: number;
  assists: number;
  avatar: string;
  attributes?: PlayerAttributes; 
  bioMechanics?: BioMechanics; // New: Bio Metrics
  loadManagement?: LoadManagement; // New: Periodization
  notes?: string[]; 
}

export interface Match {
  id: string;
  opponent: string;
  date: string;
  time: string;
  venue: 'Home' | 'Away';
  competition: string;
}

export interface NavItem {
  icon: any;
  label: string;
  path: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  slug: string;
  image: string;
  collection: string;
}

// New Types for Coaching Features
export type DrillCategory = 'Technical' | 'Tactical' | 'Physical' | 'Psychosocial';
export type DrillDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Elite';

export interface DrillHistory {
  date: string;
  sessionTitle: string;
  rating: number; // 1-5
  notes: string;
}

export interface DrillResource {
  id: string;
  type: 'video' | 'link' | 'file';
  title: string;
  url: string;
  fileSize?: string; // Optional for files
}

export interface Drill {
  id: string;
  title: string;
  category: DrillCategory;
  duration: number; // minutes
  minPlayers: number;
  difficulty: DrillDifficulty;
  image: string;
  diagram?: string;
  description?: string;
  coachingPoints?: string[];
  history?: DrillHistory[];
  resources?: DrillResource[];
}

export interface PracticeSession {
  id: string;
  date: string;
  title: string;
  blocks: {
    drillId: string;
    duration: number; // override default duration
    notes?: string;
  }[];
}

// Match Simulation Types
export type EventType = 'goal' | 'shot' | 'save' | 'foul' | 'card' | 'sub' | 'whistle' | 'commentary';

export interface MatchEvent {
  id: string;
  minute: number;
  type: EventType;
  team: 'home' | 'away' | 'neutral';
  player?: string;
  description: string;
  score?: [number, number]; // [home, away] at that moment
  isKeyMoment?: boolean;
}

export interface MatchStats {
  possession: [number, number];
  shots: [number, number];
  shotsOnTarget: [number, number];
  corners: [number, number];
  fouls: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
}

export interface FullMatchData {
  id: string;
  opponent: string;
  date: string;
  venue: string;
  lineups: {
    home: { formation: string; players: { num: number; name: string; pos: string }[] };
    away: { formation: string; players: { num: number; name: string; pos: string }[] };
  };
  events: MatchEvent[];
  finalStats: MatchStats;
}
