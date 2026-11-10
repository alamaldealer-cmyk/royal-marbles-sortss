/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import navHomeSrc from '../assets/images/nav/nav_home.png';
import navShopSrc from '../assets/images/nav/nav_shop.png';
import navSettingsSrc from '../assets/images/nav/nav_settings.png';
import { sounds } from '../game/sound';

export type NavTab = 'home' | 'shop' | 'settings';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const HIT_AREAS: Record<NavTab, Record<NavTab, { left: string; top: string; width: string; height: string }>> = {
  home: {
    shop: { left: '6.15%', top: '28.47%', width: '19.72%', height: '56.94%' },
    home: { left: '31.28%', top: '12.15%', width: '37.43%', height: '73.26%' },
    settings: { left: '74.23%', top: '28.47%', width: '19.72%', height: '56.94%' },
  },
  shop: {
    shop: { left: '6.15%', top: '12.15%', width: '37.43%', height: '73.26%' },
    home: { left: '49.20%', top: '28.47%', width: '19.72%', height: '56.94%' },
    settings: { left: '74.23%', top: '28.47%', width: '19.72%', height: '56.94%' },
  },
  settings: {
    shop: { left: '6.15%', top: '28.47%', width: '19.72%', height: '56.94%' },
    home: { left: '30.96%', top: '28.47%', width: '19.72%', height: '56.94%' },
    settings: { left: '55.99%', top: '12.15%', width: '37.43%', height: '73.26%' },
  },
};

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const getNavImage = () => {
    switch (activeTab) {
      case 'shop':
        return navShopSrc;
      case 'settings':
        return navSettingsSrc;
      case 'home':
      default:
        return navHomeSrc;
    }
  };

  const currentHitAreas = HIT_AREAS[activeTab];

  const handleSelect = (tab: NavTab) => {
    sounds.playTap();
    onTabChange(tab);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full max-w-[480px] mx-auto z-40 select-none pointer-events-none">
      <div className="relative w-full aspect-[943/288]">
        {/* Full-width Nav Strip */}
        <img
          src={getNavImage()}
          alt="Navigation Bar"
          className="w-full h-full object-contain pointer-events-none drop-shadow-[0_-4px_16px_rgba(0,0,0,0.6)]"
        />

        {/* 1. Shop Button Hit Area */}
        <button
          type="button"
          onClick={() => handleSelect('shop')}
          aria-label="Shop Tab"
          className="absolute pointer-events-auto cursor-pointer border-none bg-transparent p-0 focus:outline-none active:scale-95 transition-transform"
          style={{
            left: currentHitAreas.shop.left,
            top: currentHitAreas.shop.top,
            width: currentHitAreas.shop.width,
            height: currentHitAreas.shop.height,
          }}
        />

        {/* 2. Home Button Hit Area */}
        <button
          type="button"
          onClick={() => handleSelect('home')}
          aria-label="Home Tab"
          className="absolute pointer-events-auto cursor-pointer border-none bg-transparent p-0 focus:outline-none active:scale-95 transition-transform"
          style={{
            left: currentHitAreas.home.left,
            top: currentHitAreas.home.top,
            width: currentHitAreas.home.width,
            height: currentHitAreas.home.height,
          }}
        />

        {/* 3. Settings Button Hit Area */}
        <button
          type="button"
          onClick={() => handleSelect('settings')}
          aria-label="Settings Tab"
          className="absolute pointer-events-auto cursor-pointer border-none bg-transparent p-0 focus:outline-none active:scale-95 transition-transform"
          style={{
            left: currentHitAreas.settings.left,
            top: currentHitAreas.settings.top,
            width: currentHitAreas.settings.width,
            height: currentHitAreas.settings.height,
          }}
        />
      </div>
    </div>
  );
};
