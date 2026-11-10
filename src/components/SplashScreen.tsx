/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import splashImgSrc from '../assets/images/splash_screen.png';

interface SplashScreenProps {
  onComplete: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  durationMs = 2600,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [isFading, setIsFading] = useState<boolean>(false);

  useEffect(() => {
    const startTime = performance.now();

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / durationMs) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            onComplete();
          }, 350);
        }, 150);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [durationMs, onComplete]);

  return (
    <div
      className={`fixed inset-0 w-full h-full z-[100] flex flex-col items-center justify-between select-none bg-[#008AE6] overflow-hidden transition-opacity duration-350 ease-in-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundImage: `url(${splashImgSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Top spacing */}
      <div className="w-full h-12" />

      {/* Bottom Loading Bar Section */}
      <div className="w-full max-w-xs sm:max-w-sm px-6 pb-12 sm:pb-16 flex flex-col items-center justify-center gap-3">
        {/* Loading Label & Percentage */}
        <div className="w-full flex items-center justify-between px-2 font-['Fredoka']">
          <span className="text-sm sm:text-base font-extrabold text-white tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] animate-pulse">
            LOADING...
          </span>
          <span className="text-sm sm:text-base font-black text-[#FFE382] tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            {progress}%
          </span>
        </div>

        {/* Loading Bar with White Borders & Blue Fill */}
        <div
          className="relative w-full h-6 sm:h-7 rounded-full bg-[#001D40]/80 p-[3px] shadow-[0_4px_16px_rgba(0,0,0,0.7)]"
          style={{
            border: '2.5px solid #FFFFFF',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.9), 0 4px 14px rgba(0, 0, 0, 0.7)',
          }}
        >
          {/* Blue Loading Bar Fill */}
          <div
            className="h-full rounded-full transition-all duration-75 ease-out flex items-center justify-end relative overflow-hidden"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(180deg, #00D5FF 0%, #0066FF 50%, #0040B3 100%)',
              boxShadow: '0 0 12px #00C8FF, inset 0 1px 2px rgba(255,255,255,0.7)',
            }}
          >
            {/* Animated Shimmer Highlight */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
};
