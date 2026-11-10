/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MarbleColor } from './types';

// ==========================================
// TUNABLES SPECIFIED IN BLUEPRINT (PAGE 14-15)
// ==========================================
export const BASE_WIDTH = 296;
export const BASE_HEIGHT = 640;

export const BALLS_PER_BLOCK = 9;
export const BELT_SPEED = 120; // px/s
export const BELT_CAPACITY = 30; // exactly 30 ball slots
export const BALL_SPACING = 447.398 / BELT_CAPACITY; // ~14.913px center-to-center
export const GRAVITY = 1000; // px/s^2 down
export const NECK_WIDTH = 38; // px
export const BRICK_HOLES = 3;
export const MAX_WAITING_BALLS = 45; // Max balls in funnel before locking taps
export const RESUME_WAITING_BALLS = 40; // Funnel count must drop below 40 to resume taps

export const BALL_RADIUS_FUNNEL = 7;
export const BALL_RADIUS_BELT = 7.0;
export const MIN_DROP_INTERVAL_MS = 60; // Har column ke liye min 60ms gap

// ==========================================
// VISUAL COLORS (PAGE 4 & 15)
// ==========================================
export const COLOR_CONFIG: Record<
  MarbleColor,
  {
    name: string;
    hex: string;
    dark: string;
    border: string;
    highlight: string;
    dot: string;
  }
> = {
  purple: {
    name: 'Purple',
    hex: '#7B3FE4',
    dark: '#5821A8',
    border: '#44148B',
    highlight: '#B894FA',
    dot: '#612ABC',
  },
  pink: {
    name: 'Pink',
    hex: '#FF8FD6',
    dark: '#D757A7',
    border: '#AD2D7E',
    highlight: '#FFD3F0',
    dot: '#DB67B0',
  },
  ice: {
    name: 'Ice White',
    hex: '#E6F4FA',
    dark: '#A6C8DC',
    border: '#7FA9C2',
    highlight: '#FFFFFF',
    dot: '#BFDCEB',
  },
  yellow: {
    name: 'Yellow',
    hex: '#FFD21F',
    dark: '#C89D00',
    border: '#9C7800',
    highlight: '#FFE87D',
    dot: '#D6A600',
  },
  lime: {
    name: 'Lime',
    hex: '#A8F028',
    dark: '#73B80C',
    border: '#538A04',
    highlight: '#D9FBA4',
    dot: '#81C914',
  },
  cyan: {
    name: 'Cyan',
    hex: '#27C4F4',
    dark: '#0C94C0',
    border: '#086E8F',
    highlight: '#8CE4FD',
    dot: '#17A3D1',
  },
  orange: {
    name: 'Orange',
    hex: '#FF8A1F',
    dark: '#CF5F00',
    border: '#9E4400',
    highlight: '#FFC285',
    dot: '#DE6804',
  },
  red: {
    name: 'Red',
    hex: '#F23B5C',
    dark: '#B71C38',
    border: '#870F24',
    highlight: '#FA8EA2',
    dot: '#C92443',
  },
};

// UI and layout colors
export const THEME = {
  background: '#598596',
  glassFill: 'rgba(255, 255, 255, 0.08)',
  glassBorder: '#00E5FF',
  glassInnerRim: 'rgba(0, 240, 255, 0.45)',
  gridBoardBg: 'rgba(0, 25, 55, 0.45)',
  gridBoardOutline: '#00C8FF',
  funnelFill: 'rgba(0, 160, 240, 0.10)',
  funnelBorder: '#00E5FF',
  neckBorder: '#00E5FF',
  beltHousingFill: 'rgba(0, 35, 75, 0.85)',
  beltHousingBorder: '#00E5FF',
  beltRim: '#00F0FF',
  beltTrack: '#004A80',
  beltSlot: '#00284D',
  beltDivider: '#00F0FF',
  lockedTile: '#0E497A',
  lockedTileBorder: '#062E52',
  dispenserBlue: '#0080E0',
  dispenserBorder: '#00E5FF',
  coinPill: '#0055AA',
  levelPill: '#0055AA',
  goldBorder: '#00F0FF',
  powerUpGreen: '#2EB55A',
  powerUpBorder: '#00E5FF',
  badgeRed: '#E93D5A',
};

// ==========================================
// GRID CONFIGURATION (PAGE 5)
// ==========================================
export const GRID_COLS = 6;
export const GRID_ROWS = 6;
export const CELL_SIZE = 30;
export const CELL_RADIUS = 7;
export const CELL_PITCH_X = 35;
export const CELL_PITCH_Y = 33;
export const GRID_X_CENTERS = [60, 95, 130, 165, 200, 235];
export const GRID_Y_CENTERS = [195, 228, 261, 294, 327, 360];
export const EXIT_ROW = 5; // y=360

// Cyber Frame layout bounds aligned with new game_frame_v5 (738x1220)
export const CYBER_FRAME = {
  width: 296,
  height: 489,
  x: 0,
  y: 117,
};

// Glass container bounds
export const GLASS_CONTAINER = {
  x: 8,
  y: 120,
  width: 280,
  height: 260,
  topRadius: 32,
};

// Playable upper chamber zone for buckets as levels increase (matching user's highlighted red box)
export const UPPER_CHAMBER_BOUNDS = {
  minX: 30,
  maxX: 266,
  minY: 140,
  maxY: 376,
  width: 236,
  height: 236,
  centerX: 148,
};

// Funnel geometry aligned with lower red line slope in user reference
export const FUNNEL = {
  leftWall: { x1: 18, y1: 400, x2: 132, y2: 436 },
  rightWall: { x1: 278, y1: 400, x2: 164, y2: 436 },
  neckX1: 132,
  neckX2: 164,
  neckY1: 436,
  neckY2: 458,
  feedX: 148,
  feedY: 456,
};

// Belt Stadium Path Geometry aligned with frame socket track (30 slots)
export const BELT_GEOM = {
  topY: 463.5,
  bottomY: 484.5,
  leftCenterX: 58,
  rightCenterX: 238,
  centerRadius: 10.5, // centerY = (463.5 + 484.5) / 2 = 474
  straightLength: 180, // 238 - 58
  get arcLength() {
    return Math.PI * this.centerRadius; // ~32.98
  },
  get totalLength() {
    return 2 * this.straightLength + 2 * this.arcLength; // ~425.97
  },
};

// Sci-Fi Slotbar UI Frame & Balti Layout (4 Docking Slots)
export const BRICK_COLUMNS_X = [69, 122, 175, 227];
export const SLOTBAR_FRAME = {
  x: 25,
  y: 540,
  width: 245,
  height: 38.6,
};
export const BALTI_WIDTH = 42;
export const BALTI_HEIGHT = 44;
export const BALTI_TOP_Y = 530;
export const BALTI_SOCKET_Y = 548;
export const BRICK_TOP_Y = BALTI_SOCKET_Y;
export const BRICK_WIDTH = BALTI_WIDTH;
export const BRICK_TOP_HEIGHT = BALTI_HEIGHT;
export const BRICK_STACK_PITCH = 23;
export const BRICK_HOLE_OFFSETS = [-11, 0, 11];
export const BRICK_HOLE_DIAMETER = 12;
export const MATCH_X_TOLERANCE = 25; // |ball.x - col.x| <= 25

export const RAILING_PLATFORM = {
  x: 25,
  y: 538,
  width: 245,
  height: 38.6,
  railY1: 544,
  railY2: 570,
};


