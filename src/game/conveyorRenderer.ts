/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BALL_RADIUS_BELT,
  BELT_CAPACITY,
  BELT_GEOM,
  COLOR_CONFIG,
  THEME,
} from './constants';
import {
  ARC_LEN,
  SEG0_END,
  SEG1_END,
  SEG2_END,
  TOTAL_PATH_LEN,
  getBeltCoordinates,
} from './beltPath';
import { BeltBall, MarbleColor } from './types';
import { fluffyRenderer } from './fluffyRenderer';

// Path tangent angle at distance s
export function getBeltTangentAngle(rawS: number): number {
  let s = rawS % TOTAL_PATH_LEN;
  if (s < 0) s += TOTAL_PATH_LEN;

  // Segment 0: Top lane (moving left from 238 to 58)
  if (s < SEG0_END) {
    return Math.PI; // pointing left
  }

  // Segment 1: Left U-turn around (58, 474) curving down
  if (s < SEG1_END) {
    const u = (s - SEG0_END) / ARC_LEN;
    const centerAngle = -Math.PI / 2 - u * Math.PI;
    return centerAngle - Math.PI / 2; // tangent
  }

  // Segment 2: Bottom lane (moving right from 58 to 238)
  if (s < SEG2_END) {
    return 0; // pointing right
  }

  // Segment 3: Right U-turn around (238, 474) curving up
  const u = (s - SEG2_END) / ARC_LEN;
  const centerAngle = Math.PI / 2 - u * Math.PI;
  return centerAngle - Math.PI / 2; // tangent
}

export class ConveyorBeltRenderer {
  /**
   * Renders the complete 100% OPAQUE conveyor belt assembly matching the user's reference crop:
   * - Dusty mauve/purple stadium capsule fill (#947D9E -> #7C6686)
   * - Thick clean white outer capsule border rim (#E5EBFF, 3.5px width)
   * - Crisp white center slot pill divider (#FFFFFF, 3.5px height)
   * - 30 dark dusty purple circular socket indentations (#5E4E6C)
   * - Moving link tread ribs along stadium path
   * - Rotating corner sprockets & glossy white shimmer
   */
  render(
    ctx: CanvasRenderingContext2D,
    scrollDistance: number,
    currentTime: number,
    balls: BeltBall[] = [],
    _drawHousing: boolean = false,
    ballImages?: Record<string, HTMLImageElement>
  ) {
    ctx.save();

    // 1. Dusty Mauve/Purple Stadium Capsule with Thick White Outer Rim (Matches user reference crop 100%)
    this.renderTrackCapsule(ctx);

    // 2. Rotating Left & Right Corner Sprockets
    const beltCenterY = (BELT_GEOM.topY + BELT_GEOM.bottomY) / 2;
    const leftRotAngle = -(scrollDistance / BELT_GEOM.centerRadius);
    const rightRotAngle = -(scrollDistance / BELT_GEOM.centerRadius);
    this.renderSprocket(ctx, BELT_GEOM.leftCenterX, beltCenterY, leftRotAngle);
    this.renderSprocket(ctx, BELT_GEOM.rightCenterX, beltCenterY, rightRotAngle);

    // 3. Moving Link Tread Ribs (sliding along the belt path)
    this.renderMovingTreads(ctx, scrollDistance);

    // 4. Crisp White Center Slot Pill Divider
    this.renderDividerRail(ctx);

    // 5. 30 Dark Dusty Purple Circular Socket Indentations & Glossy 3D Marbles
    this.renderMovingBallSockets(ctx, scrollDistance, balls, currentTime, ballImages);

    // 6. Subtle Directional Flow Chevrons
    this.renderFlowChevrons(ctx, scrollDistance);

    // 7. Glossy White Shimmer Highlight
    this.renderTrackShimmer(ctx, currentTime);

    ctx.restore();
  }

  private renderTrackCapsule(ctx: CanvasRenderingContext2D) {
    const beltCenterY = (BELT_GEOM.topY + BELT_GEOM.bottomY) / 2; // 474
    const capsuleX = 38;
    const capsuleW = 220;
    const capsuleY = beltCenterY - 20; // 454
    const capsuleH = 40;
    const rx = 20;

    ctx.save();

    // 1. Opaque dusty mauve/purple capsule background fill with a slightly lighter center tone
    const trackGrad = ctx.createLinearGradient(capsuleX, capsuleY, capsuleX, capsuleY + capsuleH);
    trackGrad.addColorStop(0, '#947E9F');
    trackGrad.addColorStop(0.3, '#826C8D');
    trackGrad.addColorStop(0.5, '#9B87A7'); // Slightly lighter tone in the center for the white line
    trackGrad.addColorStop(0.7, '#7F6789');
    trackGrad.addColorStop(1, '#705979');
    ctx.fillStyle = trackGrad;

    ctx.beginPath();
    ctx.roundRect(capsuleX, capsuleY, capsuleW, capsuleH, rx);
    ctx.fill();

    // Lighter central horizontal band highlight along the middle (y = beltCenterY)
    const centerHighlightGrad = ctx.createLinearGradient(capsuleX, beltCenterY - 4, capsuleX, beltCenterY + 4);
    centerHighlightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.0)');
    centerHighlightGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.22)');
    centerHighlightGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
    ctx.fillStyle = centerHighlightGrad;
    ctx.beginPath();
    ctx.roundRect(50, beltCenterY - 4, 196, 8, 4);
    ctx.fill();

    // 2. Thick clean white outer capsule border rim (Matches user image crop 100%)
    ctx.strokeStyle = '#E5EBFF';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Inner rim accent line
    ctx.strokeStyle = 'rgba(70, 50, 85, 0.4)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.restore();
  }

  private renderSprocket(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    rotAngle: number,
    baseColor: string = '#7C6789',
    accentColor: string = '#F4C842'
  ) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotAngle);

    const radius = BELT_GEOM.centerRadius; // 10.5
    const teethCount = 8;

    ctx.fillStyle = baseColor;
    for (let i = 0; i < teethCount; i++) {
      const angle = (i * Math.PI * 2) / teethCount;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.roundRect(-2, -radius - 2, 4, 4, 1);
      ctx.fill();
      ctx.restore();
    }

    const gearGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, radius);
    gearGrad.addColorStop(0, '#A692B6');
    gearGrad.addColorStop(0.7, '#796486');
    gearGrad.addColorStop(1, '#5B4967');
    ctx.fillStyle = gearGrad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#43344E';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.6, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private renderMovingTreads(ctx: CanvasRenderingContext2D, scrollDistance: number) {
    ctx.save();

    const treadPitch = 7.5;
    const treadCount = Math.floor(TOTAL_PATH_LEN / treadPitch);

    for (let i = 0; i < treadCount; i++) {
      const s = (i * treadPitch + scrollDistance) % TOTAL_PATH_LEN;
      const coords = getBeltCoordinates(s);
      const angle = getBeltTangentAngle(s);

      ctx.save();
      ctx.translate(coords.x, coords.y);
      ctx.rotate(angle);

      ctx.fillStyle = 'rgba(100, 80, 115, 0.3)';
      ctx.fillRect(-1.2, -6.5, 2.4, 13);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillRect(-0.4, -5.5, 0.8, 11);

      ctx.restore();
    }

    ctx.restore();
  }

  private renderDividerRail(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const beltCenterY = (BELT_GEOM.topY + BELT_GEOM.bottomY) / 2; // 474

    // 1. Soft light background bed behind the center divider line
    const lightBedGrad = ctx.createLinearGradient(0, beltCenterY - 3, 0, beltCenterY + 3);
    lightBedGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
    lightBedGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.35)');
    lightBedGrad.addColorStop(1, 'rgba(255, 255, 255, 0.15)');
    ctx.fillStyle = lightBedGrad;
    ctx.beginPath();
    ctx.roundRect(55, beltCenterY - 3, 186, 6, 3);
    ctx.fill();

    // 2. Crisp white center slot pill divider (Matches user reference crop 100%)
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(58, beltCenterY - 1.75, 180, 3.5, 1.75);
    ctx.fill();

    ctx.strokeStyle = '#ECE9F5';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.restore();
  }

  private renderMovingBallSockets(
    ctx: CanvasRenderingContext2D,
    scrollDistance: number,
    balls: BeltBall[],
    currentTime: number = 0,
    ballImages?: Record<string, HTMLImageElement>
  ) {
    ctx.save();

    const socketCount = BELT_CAPACITY; // 30
    const spacing = TOTAL_PATH_LEN / socketCount; // ~13.15px

    const ballBySlot = new Map<number, BeltBall>();
    for (const b of balls) {
      ballBySlot.set(b.slotIndex, b);
    }

    for (let i = 0; i < socketCount; i++) {
      const s = (i * spacing + scrollDistance) % TOTAL_PATH_LEN;
      const coords = getBeltCoordinates(s);
      const angle = getBeltTangentAngle(s);

      ctx.save();
      ctx.translate(coords.x, coords.y);
      ctx.rotate(angle);

      // (A) Dark dusty purple circular socket indentation (Matches user reference crop 100%)
      ctx.fillStyle = '#5E4E6C';
      ctx.beginPath();
      ctx.arc(0, 0, 6.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#4B3C58';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Soft radial gradient depth inside socket
      const innerGrad = ctx.createRadialGradient(0, -0.6, 0.5, 0, 0, 6.4);
      innerGrad.addColorStop(0, '#705E7F');
      innerGrad.addColorStop(0.6, '#564664');
      innerGrad.addColorStop(1, '#453651');
      ctx.fillStyle = innerGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 6.2, 0, Math.PI * 2);
      ctx.fill();

      // Top-left subtle white highlight curve
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(0, 0.2, 5.8, Math.PI * 0.25, Math.PI * 0.85);
      ctx.stroke();

      // (B) IF A BALL IS IN THIS SLOT, DRAW IT AT EXACT (0, 0) CENTER!
      const ball = ballBySlot.get(i);
      if (ball) {
        const expr = fluffyRenderer.getBeltBallExpression(ball, currentTime || performance.now());
        fluffyRenderer.drawFluffy(ctx, 0, 0, BALL_RADIUS_BELT, ball.color, expr, ball.scale, ball.scale);
      }

      ctx.restore();
    }

    ctx.restore();
  }

  private drawGlossyMarble(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    color: MarbleColor,
    scale: number = 1.0
  ) {
    ctx.save();
    ctx.translate(x, y);
    if (scale !== 1.0) ctx.scale(scale, scale);

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

    ctx.restore();
  }

  private renderFlowChevrons(ctx: CanvasRenderingContext2D, scrollDistance: number) {
    ctx.save();
    const topOffset = (scrollDistance * 0.7) % 36;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let x = 225 - topOffset; x > 68; x -= 36) {
      ctx.fillText('◀', x, BELT_GEOM.topY);
    }

    const bottomOffset = (scrollDistance * 0.7) % 36;
    for (let x = 70 + bottomOffset; x < 228; x += 36) {
      ctx.fillText('▶', x, BELT_GEOM.bottomY);
    }

    ctx.restore();
  }

  private renderTrackShimmer(ctx: CanvasRenderingContext2D, currentTime: number) {
    ctx.save();
    const beltCenterY = (BELT_GEOM.topY + BELT_GEOM.bottomY) / 2;
    const phase = (currentTime * 0.0004) % 1;
    const shimmerX = 50 + phase * 190;

    const shimGrad = ctx.createLinearGradient(shimmerX - 20, beltCenterY - 15, shimmerX + 20, beltCenterY - 15);
    shimGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    shimGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
    shimGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = shimGrad;
    ctx.fillRect(shimmerX - 20, beltCenterY - 15, 40, 30);
    ctx.restore();
  }
}

export const conveyorRenderer = new ConveyorBeltRenderer();
