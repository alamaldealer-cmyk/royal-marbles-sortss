/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { sounds } from '../game/sound';

import victoryTitleSpritesheet from '../assets/images/victory/victory_title_spritesheet.png';
import star1 from '../assets/images/victory/star_1.png';
import star2 from '../assets/images/victory/star_2.png';
import star3 from '../assets/images/victory/star_3.png';
import charGreen from '../assets/images/victory/char_green.png';
import charRed from '../assets/images/victory/char_red.png';
import charPurple from '../assets/images/victory/char_purple.png';
import multiplierBar from '../assets/images/victory/multiplier_bar.png';
import arrowUp from '../assets/images/victory/arrow_up.png';
import btnSmoothBlue from '../assets/images/victory/btn_smooth_blue.png';
import btnSmoothGreen from '../assets/images/victory/btn_smooth_green.png';

import coin01 from '../assets/images/coins/coin_01.png';
import coin02 from '../assets/images/coins/coin_02.png';
import coin03 from '../assets/images/coins/coin_03.png';
import coin04 from '../assets/images/coins/coin_04.png';
import coin05 from '../assets/images/coins/coin_05.png';
import coin06 from '../assets/images/coins/coin_06.png';
import coin07 from '../assets/images/coins/coin_07.png';
import coin08 from '../assets/images/coins/coin_08.png';

const COIN_FRAMES = [coin01, coin02, coin03, coin04, coin05, coin06, coin07, coin08];
if (typeof window !== 'undefined') {
  COIN_FRAMES.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

interface LevelCompleteModalProps {
  levelNumber: number;
  coins?: number;
  onPause?: () => void;
  onNextLevel: () => void;
  onAddCoins?: (amount: number) => void;
  onReplay?: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  levelNumber,
  coins,
  onPause,
  onNextLevel,
  onAddCoins,
  onReplay,
}) => {
  // Arrow position percentage (0 to 100)
  const [arrowPos, setArrowPos] = useState<number>(50);
  const [isStopped, setIsStopped] = useState<boolean>(false);
  const [claimedReward, setClaimedReward] = useState<number | null>(null);
  const [activeMultiplier, setActiveMultiplier] = useState<number>(5);
  const [starsVisible, setStarsVisible] = useState<boolean[]>([false, false, false]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const titleAnimRef = useRef<number | null>(null);

  // Victory Title Sprite Sheet Animation (pop_in: frames 0..13 @ 24fps, idle: frames 14..25 @ 12fps)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = victoryTitleSpritesheet;
    let isLoaded = false;
    let currentFrame = 0;
    let state: 'pop_in' | 'idle' = 'pop_in';
    let lastFrameTime = performance.now();

    img.onload = () => {
      isLoaded = true;
    };

    const render = (now: number) => {
      if (isLoaded && ctx) {
        const targetFps = state === 'pop_in' ? 24 : 12;
        const interval = 1000 / targetFps;

        if (now - lastFrameTime >= interval) {
          lastFrameTime = now;

          if (state === 'pop_in') {
            currentFrame++;
            if (currentFrame > 13) {
              state = 'idle';
              currentFrame = 14;
            }
          } else {
            // Idle loop: frames 14..25
            currentFrame++;
            if (currentFrame > 25) {
              currentFrame = 14;
            }
          }
        }

        const col = currentFrame % 4;
        const row = Math.floor(currentFrame / 4);
        const sx = col * 720;
        const sy = row * 240;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, sx, sy, 720, 240, 0, 0, canvas.width, canvas.height);
      }

      titleAnimRef.current = requestAnimationFrame(render);
    };

    titleAnimRef.current = requestAnimationFrame(render);

    return () => {
      if (titleAnimRef.current) cancelAnimationFrame(titleAnimRef.current);
    };
  }, []);

  // Trigger win sounds, star pop-in, and festive confetti
  useEffect(() => {
    sounds.playWin();

    // Staggered star reveal sound and pop-in
    const timer1 = setTimeout(() => {
      setStarsVisible([true, false, false]);
      sounds.playPopBurst();
    }, 180);
    const timer2 = setTimeout(() => {
      setStarsVisible([true, true, false]);
      sounds.playPopBurst();
    }, 420);
    const timer3 = setTimeout(() => {
      setStarsVisible([true, true, true]);
      sounds.playPopBurst();
    }, 660);

    // Festive background confetti
    const end = Date.now() + 2200;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#FFD700', '#FF4500', '#00E5FF', '#76FF03'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#FFD700', '#FF4500', '#00E5FF', '#76FF03'],
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Smooth oscillation for the 3D yellow arrow pointer
  useEffect(() => {
    if (isStopped) return;

    let startTime = performance.now();
    const speed = 0.0025; // oscillation speed

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const rawSine = (Math.sin(elapsed * speed) + 1) / 2; // 0..1
      const pos = 6 + rawSine * 88; // 6% to 94% range
      setArrowPos(pos);

      // Multiplier mapping across 100% width:
      // [ x2 (0-20%) | x3 (20-40%) | x5 (40-60%) | x3 (60-80%) | x2 (80-100%) ]
      let mult = 2;
      if (pos >= 20 && pos < 40) mult = 3;
      else if (pos >= 40 && pos < 60) mult = 5;
      else if (pos >= 60 && pos < 80) mult = 3;
      else if (pos >= 80) mult = 2;
      setActiveMultiplier(mult);

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isStopped]);

  // Exact Coin Collection Animation logic requested by user
  const collectCoins = useCallback(
    (fromEl: HTMLElement, totalValue: number) => {
      const toEl = document.getElementById('coin-rack-ui');
      const a = fromEl.getBoundingClientRect();
      const b = toEl
        ? toEl.getBoundingClientRect()
        : { left: window.innerWidth - 80, top: 15, width: 95, height: 42 };

      const sx = a.left + a.width / 2;
      const sy = a.top + a.height / 2;
      const ex = b.left + b.width / 2;
      const ey = b.top + b.height / 2;

      const count = 15;
      const perCoin = Math.floor(totalValue / count);
      const remainder = totalValue - perCoin * count;

      let arrivedCount = 0;

      for (let i = 0; i < count; i++) {
        const coinAmount = i === count - 1 ? perCoin + remainder : perCoin;
        const coin = document.createElement('img');
        Object.assign(coin.style, {
          position: 'fixed',
          width: '44px',
          height: '44px',
          left: '0',
          top: '0',
          pointerEvents: 'none',
          zIndex: '9999',
          opacity: '0',
          transform: `translate(${sx - 22}px, ${sy - 22}px)`,
        });
        document.body.appendChild(coin);

        const angle = Math.random() * Math.PI * 2;
        const burst = 40 + Math.random() * 50;
        const bx = sx + Math.cos(angle) * burst;
        const by = sy + Math.sin(angle) * burst;
        const start = performance.now() + i * 50; // 50ms stagger per coin
        const T1 = 300; // 300ms scatter phase
        const T2 = 700; // 700ms curved flight phase

        const tick = (now: number) => {
          const t = now - start;
          if (t < 0) {
            coin.style.opacity = '0';
            requestAnimationFrame(tick);
            return;
          }
          coin.style.opacity = '1';
          // 8-frame spinning animation at 80ms per frame
          const frameIdx = Math.floor(now / 80) % 8;
          coin.src = COIN_FRAMES[frameIdx];

          let x: number, y: number;
          if (t < T1) {
            // Phase 1: Bikharna / Scatter around button
            const p = 1 - Math.pow(1 - t / T1, 3);
            x = sx + (bx - sx) * p;
            y = sy + (by - sy) * p;
          } else {
            // Phase 2: Curved trajectory towards coin counter icon
            const p = Math.min((t - T1) / T2, 1);
            const e = p * p * (3 - 2 * p);
            x = bx + (ex - bx) * e;
            y = by + (ey - by) * e - Math.sin(e * Math.PI) * 60; // 60px height arc curve
          }

          coin.style.transform = `translate(${x - 22}px, ${y - 22}px)`;

          if (t < T1 + T2) {
            requestAnimationFrame(tick);
          } else {
            coin.remove();
            sounds.playCoinCollect(i * 12);
            window.dispatchEvent(
              new CustomEvent('coin-rack-hit', { detail: { amount: coinAmount } })
            );

            arrivedCount++;
            if (arrivedCount === count) {
              setTimeout(() => {
                onNextLevel();
              }, 400);
            }
          }
        };

        requestAnimationFrame(tick);
      }
    },
    [onNextLevel]
  );

  // Green Button (Standard Claim): 50 flat coins
  const handleGreenClaim = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isStopped) return;
      setIsStopped(true);

      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }

      const totalReward = 50;
      setClaimedReward(totalReward);

      sounds.playBrickClear();

      confetti({
        particleCount: 50,
        spread: 75,
        origin: { y: 0.65 },
        colors: ['#76FF03', '#FFD700', '#FFFFFF'],
      });

      // Trigger 15-coin collection animation
      collectCoins(e.currentTarget, totalReward);
    },
    [isStopped, collectCoins]
  );

  // Blue Button (Video Multiplier Claim): 50 * activeMultiplier coins
  const handleBlueClaim = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isStopped) return;
      setIsStopped(true);

      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }

      const totalReward = 50 * activeMultiplier;
      setClaimedReward(totalReward);

      sounds.playBrickClear();

      confetti({
        particleCount: 70,
        spread: 90,
        origin: { y: 0.65 },
        colors: ['#00E5FF', '#FFD700', '#FFFFFF'],
      });

      // Trigger 15-coin collection animation
      collectCoins(e.currentTarget, totalReward);
    },
    [isStopped, activeMultiplier, collectCoins]
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Level Complete Screen"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/40 backdrop-blur-[2px] overflow-hidden select-none animate-fade-in"
    >
      <div className="relative flex flex-col items-center w-full max-w-sm px-4 py-2 text-center z-10 mt-6">
        {/* 1. VICTORY Title Canvas Sprite Animation */}
        <div className="w-64 max-w-[80vw] mb-1 transform hover:scale-105 transition-transform duration-300 filter drop-shadow-[0_6px_14px_rgba(0,0,0,0.35)]">
          <canvas
            ref={canvasRef}
            width={720}
            height={240}
            className="w-full h-auto block"
          />
        </div>

        {/* 2. 3 Individual Gold Stars */}
        <div className="flex items-center justify-center gap-2 my-1 h-16">
          <div
            className={`transform transition-all duration-500 ${
              starsVisible[0]
                ? 'scale-100 opacity-100 rotate-0'
                : 'scale-0 opacity-0 -rotate-45'
            }`}
          >
            <img
              src={star1}
              alt="Star 1"
              className="w-12 h-12 object-contain filter drop-shadow-[0_4px_10px_rgba(255,215,0,0.5)]"
            />
          </div>
          <div
            className={`transform transition-all duration-500 ${
              starsVisible[1]
                ? 'scale-110 opacity-100 -translate-y-2 rotate-0'
                : 'scale-0 opacity-0 -rotate-45'
            }`}
          >
            <img
              src={star2}
              alt="Star 2"
              className="w-15 h-15 object-contain filter drop-shadow-[0_6px_14px_rgba(255,215,0,0.7)]"
            />
          </div>
          <div
            className={`transform transition-all duration-500 ${
              starsVisible[2]
                ? 'scale-100 opacity-100 rotate-0'
                : 'scale-0 opacity-0 -rotate-45'
            }`}
          >
            <img
              src={star3}
              alt="Star 3"
              className="w-12 h-12 object-contain filter drop-shadow-[0_4px_10px_rgba(255,215,0,0.5)]"
            />
          </div>
        </div>

        {/* 3. 3 Individual Cute Characters */}
        <div className="flex items-center justify-center gap-1 w-full max-w-[260px] my-1 transform hover:scale-105 transition-transform duration-300 filter drop-shadow-[0_8px_18px_rgba(0,0,0,0.3)]">
          <img
            src={charGreen}
            alt="Green"
            className="w-16 h-16 object-contain animate-pulse"
            style={{ animationDuration: '2.5s' }}
          />
          <img
            src={charRed}
            alt="Red"
            className="w-20 h-20 object-contain z-10 animate-bounce"
            style={{ animationDuration: '3s' }}
          />
          <img
            src={charPurple}
            alt="Purple"
            className="w-16 h-16 object-contain animate-pulse"
            style={{ animationDuration: '2.8s' }}
          />
        </div>

        {/* 4. Multiplier Track & 3D Yellow Pointer Arrow */}
        <div className="w-full max-w-[260px] my-2 flex flex-col items-center">
          <div className="relative w-full rounded-full overflow-hidden border-2 border-white/60 shadow-[0_4px_14px_rgba(0,0,0,0.35)]">
            <img
              src={multiplierBar}
              alt="Multiplier Bar"
              className="w-full h-auto object-contain block"
            />
          </div>
          <div className="relative w-full h-6 mt-0.5">
            <div
              className={`absolute top-0 transform -translate-x-1/2 transition-all duration-75 ${
                isStopped ? 'scale-125 filter drop-shadow-[0_0_12px_#FFD700]' : ''
              }`}
              style={{ left: `${arrowPos}%` }}
            >
              <img src={arrowUp} alt="Arrow" className="w-5 h-5 object-contain" />
              {isStopped && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-amber-400 text-purple-950 font-black text-xs px-2 py-0.2 rounded-full shadow-lg border border-white animate-bounce">
                  x{activeMultiplier}!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5. User's Exact Glossy Buttons with Transparent Number Overlays */}
        <div className="flex flex-col items-center gap-2.5 w-full max-w-[230px] mt-1">
          {/* Top Button: Blue Glossy Ad Multiplier Claim Button */}
          <button
            onClick={handleBlueClaim}
            disabled={isStopped}
            aria-label="Claim Multiplied Coins"
            className="w-full group focus:outline-none active:scale-95 transition-transform disabled:opacity-80 cursor-pointer"
          >
            <div className="relative w-full filter drop-shadow-[0_5px_12px_rgba(0,0,0,0.35)]">
              <img
                src={btnSmoothBlue}
                alt="Claim Multiplied Coins"
                className="h-auto object-contain group-hover:brightness-110 transition-all block mx-auto"
                style={{ width: '150px' }}
              />
              {/* Clean Number Overlay with transparent background (no background box/pill) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none pr-6 pl-4">
                <span className="text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wider">
                  {50 * activeMultiplier}
                </span>
              </div>
            </div>
          </button>

          {/* Bottom Button: Green Glossy Standard Claim Button */}
          <button
            onClick={handleGreenClaim}
            disabled={isStopped}
            aria-label="Claim 50 Coins"
            className="w-full group focus:outline-none active:scale-95 transition-transform disabled:opacity-80 cursor-pointer"
          >
            <div className="relative w-full filter drop-shadow-[0_5px_12px_rgba(0,0,0,0.35)]">
              <img
                src={btnSmoothGreen}
                alt="Claim 50 Coins"
                className="h-auto object-contain group-hover:brightness-110 transition-all block mx-auto"
                style={{ width: '150px' }}
              />
              {/* Clean Number Overlay with transparent background (no background box/pill) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none pl-12 pr-4">
                <span className="text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wider">
                  50
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Reward Notification Banner */}
        {claimedReward !== null && (
          <div className="mt-2 px-4 py-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-purple-950 font-black rounded-full text-sm shadow-2xl animate-bounce border-2 border-white">
            🎉 +{claimedReward} COINS CLAIMED!
          </div>
        )}
      </div>
    </div>
  );
};
