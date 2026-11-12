/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { COLOR_CONFIG } from './constants';
import { BeltBall, DroppingBall, FunnelBall, MarbleColor } from './types';

export enum FluffyExpression {
  HAPPY_OPEN = 0,    // Wide open happy eyes, smiling mouth
  WINK = 1,          // Cute wink (right eye closed, left eye open)
  SQUINT_HAPPY = 2,  // Both eyes curved shut happily / impact squish
  SURPRISED = 3,     // Shocked / wide round pupils, open 'O' mouth (launching / flying)
  CUTE_IDLE = 4,     // Gentle wide-eyed sweet smile
  SLEEPY = 5,        // Droopy half-closed eyelids, yawning / drowsy waiting
  ANGRY = 6,         // Furrowed eyebrows, gritted teeth (impatient waiting)
  FURIOUS = 7,       // Screaming angry with red anger vein mark on head!
}

export const FLUFFY_COLOR_ROWS: Record<MarbleColor, number> = {
  purple: 0,
  ice: 1,
  yellow: 2,
  pink: 3,
  lime: 4,
  cyan: 5,
  orange: 6,
  red: 7,
};

const FRAME_SIZE = 192;

export class FluffyRenderer {
  private spriteSheet: HTMLImageElement | null = null;
  private isLoaded: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const img = new Image();
      img.onload = () => {
        this.spriteSheet = img;
        this.isLoaded = true;
      };
      img.src = '/assets/fluffies_spritesheet.png';
      if (img.complete) {
        this.spriteSheet = img;
        this.isLoaded = true;
      }
    }
  }

  public setSpriteSheet(img: HTMLImageElement) {
    this.spriteSheet = img;
    this.isLoaded = img.complete && img.naturalWidth > 0;
  }

  public getSpriteSheet(): HTMLImageElement | null {
    return this.spriteSheet;
  }

  /**
   * Evaluates the expressive face of a fluffy marble in the funnel based on
   * its velocity, position, waiting time, impact status, and personality.
   */
  public getFunnelBallExpression(
    ball: FunnelBall,
    totalWaiting: number,
    currentTime: number
  ): FluffyExpression {
    // 1. Released from top / popping upward into air (uchle / launching)
    if (ball.vy < -20 || (ball.y < 350 && Math.abs(ball.vy) > 30)) {
      return FluffyExpression.SURPRISED;
    }

    // 2. Just hit funnel wall or bounced on bottom (funnel par gire tab)
    if (ball.impactTimer && ball.impactTimer > 0) {
      return FluffyExpression.SQUINT_HAPPY;
    }

    // 3. Waiting in lower funnel to enter conveyor neck (waiting me ho)
    const waitingTime = ball.waitingTime || 0;
    const personality = ball.personality || (ball.id % 3 === 0 ? 'sleepy' : ball.id % 3 === 1 ? 'angry' : 'cheerful');

    if (waitingTime > 0.4) {
      // Long wait (> 3.5s) or congested backlog (totalWaiting >= 25)
      if (waitingTime > 3.5 || totalWaiting >= 25) {
        if (personality === 'angry') {
          return FluffyExpression.FURIOUS;
        } else if (personality === 'sleepy') {
          return FluffyExpression.SLEEPY;
        } else {
          // Cheerful alternates winks and sighs
          return (Math.floor(currentTime / 600) + ball.id) % 2 === 0
            ? FluffyExpression.CUTE_IDLE
            : FluffyExpression.SQUINT_HAPPY;
        }
      }

      // Medium wait (1.2s to 3.5s)
      if (waitingTime > 1.2) {
        if (personality === 'angry') {
          return FluffyExpression.ANGRY;
        } else if (personality === 'sleepy') {
          return FluffyExpression.SLEEPY;
        }
      }
    }

    // 4. Freefall downward with high speed
    if (ball.vy > 140 && ball.y < 380) {
      return FluffyExpression.SURPRISED;
    }

    // 5. Default idle / gentle float: Cute idle or Happy open with periodic blinks/winks
    const blinkCycle = 3000;
    const blinkPhase = (currentTime + ball.id * 777) % blinkCycle;
    if (blinkPhase < 160) {
      // Eyes closed or wink during blink
      return ball.id % 2 === 0 ? FluffyExpression.WINK : FluffyExpression.SQUINT_HAPPY;
    }

    return ball.id % 2 === 0 ? FluffyExpression.HAPPY_OPEN : FluffyExpression.CUTE_IDLE;
  }

  /**
   * Expression while cruising on the conveyor belt:
   * Happy & relaxed with periodic winking and blinking.
   */
  public getBeltBallExpression(ball: BeltBall, currentTime: number): FluffyExpression {
    const blinkCycle = 2800;
    const blinkPhase = (currentTime + ball.id * 830) % blinkCycle;
    if (blinkPhase < 160) {
      return ball.id % 2 === 0 ? FluffyExpression.WINK : FluffyExpression.SQUINT_HAPPY;
    }
    return ball.id % 3 === 0 ? FluffyExpression.HAPPY_OPEN : FluffyExpression.CUTE_IDLE;
  }

  /**
   * Expression while dropping into bucket:
   * Cheering joy!
   */
  public getDroppingBallExpression(ball: DroppingBall): FluffyExpression {
    return ball.id % 2 === 0 ? FluffyExpression.HAPPY_OPEN : FluffyExpression.SQUINT_HAPPY;
  }

  /**
   * Expression for balls nestled in upper crates/tiles before launch:
   * Calm cute smile with synchronized gentle blinks.
   */
  public getCrateBallExpression(index: number, currentTime: number): FluffyExpression {
    const blinkCycle = 3500;
    const blinkPhase = (currentTime + index * 920) % blinkCycle;
    if (blinkPhase < 150) {
      return index % 2 === 0 ? FluffyExpression.WINK : FluffyExpression.SQUINT_HAPPY;
    }
    return index % 2 === 0 ? FluffyExpression.CUTE_IDLE : FluffyExpression.HAPPY_OPEN;
  }

  /**
   * Main render function that draws a fluffy character at (x, y) with the
   * specified expression, color, scale, and squish/stretch.
   */
  public drawFluffy(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    color: MarbleColor,
    expression: FluffyExpression,
    scaleX: number = 1.0,
    scaleY: number = 1.0,
    rotation: number = 0
  ) {
    ctx.save();
    ctx.translate(x, y);

    if (rotation !== 0) {
      ctx.rotate(rotation);
    }
    if (scaleX !== 1.0 || scaleY !== 1.0) {
      ctx.scale(scaleX, scaleY);
    }

    const sheet = this.spriteSheet;
    if (sheet && (sheet.complete || this.isLoaded) && sheet.naturalWidth > 0) {
      const col = Math.max(0, Math.min(7, expression));
      const row = FLUFFY_COLOR_ROWS[color] ?? 0;

      const srcX = col * FRAME_SIZE;
      const srcY = row * FRAME_SIZE;

      // Draw size matches marble diameter plus soft fluffy fur margin
      const drawSize = radius * 2.5;

      ctx.drawImage(
        sheet,
        srcX,
        srcY,
        FRAME_SIZE,
        FRAME_SIZE,
        -drawSize / 2,
        -drawSize / 2,
        drawSize,
        drawSize
      );
    } else {
      // Fallback procedural glossy marble
      this.drawFallbackMarble(ctx, radius, color);
    }

    ctx.restore();
  }

  private drawFallbackMarble(ctx: CanvasRenderingContext2D, radius: number, color: MarbleColor) {
    const config = COLOR_CONFIG[color];
    const grad = ctx.createRadialGradient(
      -radius * 0.35,
      -radius * 0.35,
      radius * 0.1,
      0,
      0,
      radius
    );
    grad.addColorStop(0, config.highlight);
    grad.addColorStop(0.5, config.hex);
    grad.addColorStop(1, config.dark);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = config.border;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.arc(-radius * 0.35, -radius * 0.35, radius * 0.28, 0, Math.PI * 2);
    ctx.fill();
  }
}

export const fluffyRenderer = new FluffyRenderer();
