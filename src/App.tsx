import React, { useMemo, useState } from 'react';
import { GameBoard } from './components/GameBoard';
import { HomeScreen } from './components/HomeScreen';
import { SplashScreen } from './components/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      return !p.has('autostart') && !p.has('win');
    }
    return true;
  });
  const [currentView, setCurrentView] = useState<'home' | 'playing'>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      if (p.has('win') || p.get('view') === 'playing') return 'playing';
    }
    return 'home';
  });
  const [coins, setCoins] = useState<number>(19330);
  const [currentLevel, setCurrentLevel] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const lvl = params.get('level');
      if (lvl) {
        const num = parseInt(lvl, 10);
        if (!isNaN(num) && num > 0) return num;
      }
    }
    return 1;
  });

  const handleAddCoins = (amount: number) => {
    setCoins((prev) => prev + amount);
  };

  const handleLevelComplete = () => {
    setCurrentLevel((prev) => prev + 1);
  };

  return (
    <main
      className="fixed inset-0 w-full h-full bg-[#002766] flex items-center justify-center overflow-hidden"
      data-state={currentView}
    >
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      {currentView === 'home' ? (
        <HomeScreen
          levelNumber={currentLevel}
          coins={coins}
          onAddCoins={handleAddCoins}
          onStartGame={() => setCurrentView('playing')}
        />
      ) : (
        <GameBoard
          levelNumber={currentLevel}
          onReturnHome={() => setCurrentView('home')}
        />
      )}
    </main>
  );
}

