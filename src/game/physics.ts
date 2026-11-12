/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BALL_RADIUS_FUNNEL,
  GRAVITY,
  NECK_WIDTH,
} from './constants';
import { FunnelBall, MarbleColor } from './types';

export interface FunnelBoundarySegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  nx: number;
  ny: number;
  length: number;
}

export class FunnelPhysics {
  public balls: FunnelBall[] = [];
  public onImpact?: () => void;
  public onGrumble?: () => void;
  private nextId = 1;
  private walls: FunnelBoundarySegment[] = [];

  constructor() {
    this.initWalls();
  }

  private initWalls() {
    // Exact coordinates aligned with lower red line slope in user reference (image_ef13bb91.png):
    // Left vertical wall: (18, 120) -> (18, 400)
    // Left upper slope: (18, 400) -> (74, 420)
    // Left lower slope: (74, 420) -> (132, 436)
    // Left neck vertical wall: (132, 436) -> (132, 458)
    // Right neck vertical wall: (164, 458) -> (164, 436)
    // Right lower slope: (164, 436) -> (222, 420)
    // Right upper slope: (222, 420) -> (278, 400)
    // Right vertical wall: (278, 400) -> (278, 120)

    const rawSegments = [
      { x1: 18, y1: 120, x2: 18, y2: 400, nx: 1.0, ny: 0.0 },
      { x1: 18, y1: 400, x2: 74, y2: 420, nx: 0.336, ny: -0.942 },
      { x1: 74, y1: 420, x2: 132, y2: 436, nx: 0.266, ny: -0.964 },
      { x1: 132, y1: 436, x2: 132, y2: 458, nx: 1.0, ny: 0.0 },
      { x1: 164, y1: 458, x2: 164, y2: 436, nx: -1.0, ny: 0.0 },
      { x1: 164, y1: 436, x2: 222, y2: 420, nx: -0.266, ny: -0.964 },
      { x1: 222, y1: 420, x2: 278, y2: 400, nx: -0.336, ny: -0.942 },
      { x1: 278, y1: 400, x2: 278, y2: 120, nx: -1.0, ny: 0.0 },
    ];

    this.walls = rawSegments.map((s) => {
      const dx = s.x2 - s.x1;
      const dy = s.y2 - s.y1;
      const length = Math.hypot(dx, dy);
      return { ...s, length };
    });
  }

  /**
   * Spawns a single marble popping upward out of a tray position
   * and arcing down into the funnel with initial upward velocity.
   */
  spawnPoppingBall(
    x: number,
    y: number,
    color: MarbleColor,
    vx: number = 0,
    vy: number = -160
  ): FunnelBall {
    const id = this.nextId++;
    const personalities: ('sleepy' | 'angry' | 'cheerful')[] = ['cheerful', 'angry', 'sleepy'];
    const ball: FunnelBall = {
      id,
      color,
      x,
      y,
      vx,
      vy,
      radius: BALL_RADIUS_FUNNEL,
      spawnTime: performance.now(),
      impactTimer: 0,
      waitingTime: 0,
      personality: personalities[id % 3],
    };
    this.balls.push(ball);
    return ball;
  }

  spawnBurst(centerX: number, centerY: number, color: MarbleColor, count: number) {
    const personalities: ('sleepy' | 'angry' | 'cheerful')[] = ['cheerful', 'angry', 'sleepy'];
    for (let i = 0; i < count; i++) {
      // Delay / slight staggered position within 8px radius
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 8;
      const px = centerX + Math.cos(angle) * dist;
      const py = centerY + Math.sin(angle) * dist;

      // Random speed 60-140 px/s with downward bias
      const speed = 60 + Math.random() * 80;
      const spreadAngle = Math.PI * 0.15 + Math.random() * Math.PI * 0.7; // downward cone
      const vx = Math.cos(spreadAngle) * speed * (Math.random() > 0.5 ? 1 : -1);
      const vy = Math.sin(spreadAngle) * speed + 30; // downward push

      const id = this.nextId++;
      this.balls.push({
        id,
        color,
        x: px,
        y: py,
        vx,
        vy,
        radius: BALL_RADIUS_FUNNEL,
        spawnTime: performance.now(),
        impactTimer: 0,
        waitingTime: 0,
        personality: personalities[id % 3],
      });
    }
  }

  update(dt: number, gateOpen: boolean): FunnelBall | null {
    // Sub-stepping for ultra-stable soft circle collisions
    const subSteps = 4;
    const subDt = Math.min(dt, 0.05) / subSteps;
    const restitution = 0.3;
    const friction = 0.02;

    let ballToFeed: FunnelBall | null = null;

    for (let step = 0; step < subSteps; step++) {
      // 1. Integrate forces & velocity
      for (const b of this.balls) {
        b.vy += GRAVITY * subDt;
        // Small air drag
        b.vx *= 1 - 0.01 * subDt;
        b.vy *= 1 - 0.01 * subDt;

        b.x += b.vx * subDt;
        b.y += b.vy * subDt;
      }

      // 2. Ball-Wall Collisions
      for (const b of this.balls) {
        for (const wall of this.walls) {
          // Project point onto line segment
          const dx = b.x - wall.x1;
          const dy = b.y - wall.y1;
          const segDx = wall.x2 - wall.x1;
          const segDy = wall.y2 - wall.y1;

          let t = (dx * segDx + dy * segDy) / (wall.length * wall.length);
          t = Math.max(0, Math.min(1, t));

          const closestX = wall.x1 + t * segDx;
          const closestY = wall.y1 + t * segDy;

          const distX = b.x - closestX;
          const distY = b.y - closestY;
          const distance = Math.hypot(distX, distY);

          if (distance < b.radius) {
            // Push inside along inward normal
            const overlap = b.radius - distance;
            b.x += wall.nx * overlap;
            b.y += wall.ny * overlap;

            // Reflect velocity with restitution and friction
            const velNormal = b.vx * wall.nx + b.vy * wall.ny;
            if (velNormal < 0) {
              if (Math.abs(velNormal) > 30) {
                b.impactTimer = 0.28;
                this.onImpact?.();
              }
              b.vx -= (1 + restitution) * velNormal * wall.nx;
              b.vy -= (1 + restitution) * velNormal * wall.ny;
              b.vx *= (1 - friction);
              b.vy *= (1 - friction);
            }
          }
        }

        // Invisible gate at neck bottom (y=456, x in 128..168)
        if (!gateOpen) {
          if (b.y + b.radius >= 456 && b.x >= 128 && b.x <= 168) {
            b.y = 456 - b.radius;
            if (b.vy > 0) b.vy = -b.vy * 0.2;
          }
        }
      }

      // 3. Ball-Ball soft collisions (Relaxation)
      const count = this.balls.length;
      for (let i = 0; i < count; i++) {
        const b1 = this.balls[i];
        for (let j = i + 1; j < count; j++) {
          const b2 = this.balls[j];
          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const distSq = dx * dx + dy * dy;
          const minDist = b1.radius + b2.radius;

          if (distSq < minDist * minDist && distSq > 0.0001) {
            const dist = Math.sqrt(distSq);
            const overlap = 0.5 * (minDist - dist);
            const nx = dx / dist;
            const ny = dy / dist;

            // Positional shift
            b1.x -= nx * overlap;
            b1.y -= ny * overlap;
            b2.x += nx * overlap;
            b2.y += ny * overlap;

            // Velocity impulse
            const dvx = b2.vx - b1.vx;
            const dvy = b2.vy - b1.vy;
            const normalVel = dvx * nx + dvy * ny;

            if (normalVel < 0) {
              if (normalVel < -45) {
                b1.impactTimer = 0.22;
                b2.impactTimer = 0.22;
                this.onImpact?.();
              }
              const impulse = -(1 + restitution) * normalVel * 0.5;
              b1.vx -= nx * impulse;
              b1.vy -= ny * impulse;
              b2.vx += nx * impulse;
              b2.vy += ny * impulse;
            }
          }
        }
      }
    }

    // Update fluffy facial timers and waiting states
    for (const b of this.balls) {
      if (b.impactTimer && b.impactTimer > 0) {
        b.impactTimer -= dt;
      }
      const speed = Math.hypot(b.vx, b.vy);
      if (b.y > 360 && speed < 40) {
        b.waitingTime = (b.waitingTime || 0) + dt;
        if (b.waitingTime > 2.5 && b.personality === 'angry') {
          this.onGrumble?.();
        }
      } else if (b.y < 340 || speed > 85) {
        b.waitingTime = 0;
      }
    }

    // 4. Check if gate is open and a ball is in the neck exit zone (y >= 436)
    if (gateOpen && !ballToFeed) {
      // Find the lowest ball in the neck
      let lowestIndex = -1;
      let lowestY = 0;

      for (let i = 0; i < this.balls.length; i++) {
        const b = this.balls[i];
        if (b.x >= 128 && b.x <= 168 && b.y >= 436) {
          if (b.y > lowestY) {
            lowestY = b.y;
            lowestIndex = i;
          }
        }
      }

      if (lowestIndex !== -1 && lowestY >= 442) {
        ballToFeed = this.balls.splice(lowestIndex, 1)[0];
      }
    }

    return ballToFeed;
  }
}
