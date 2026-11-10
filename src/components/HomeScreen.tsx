/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BottomNav, NavTab } from './BottomNav';
import coinRackImgSrc from '../assets/images/coin_rack.png';
import { sounds } from '../game/sound';

// Cropped settings UI buttons directly from user sprite sheet
import btnMusicSquareSrc from '../assets/images/settings_buttons/btn_music_square.png';
import btnMusicSquareOffSrc from '../assets/images/settings_buttons/btn_music_square_off.png';
import btnSoundSquareSrc from '../assets/images/settings_buttons/btn_sound_square.png';
import btnSoundSquareOffSrc from '../assets/images/settings_buttons/btn_sound_square_off.png';
import btnVibrationSquareSrc from '../assets/images/settings_buttons/btn_vibration_square.png';
import btnVibrationSquareOffSrc from '../assets/images/settings_buttons/btn_vibration_square_off.png';
import btnSupportSrc from '../assets/images/settings_buttons/btn_support.png';
import btnTermsSrc from '../assets/images/settings_buttons/btn_terms.png';
import btnPrivacySrc from '../assets/images/settings_buttons/btn_privacy.png';
import btnCloseXSrc from '../assets/images/settings_buttons/btn_close_x.png';
import switchOnNormSrc from '../assets/images/settings_buttons/switch_on_norm.png';
import switchOffNormSrc from '../assets/images/settings_buttons/switch_off_norm.png';
import tropicalBeachBgSrc from '../assets/images/tropical_beach_resort_entrance.png';

// Profile & Avatar Assets directly from user sprite sheet
import modalPanelSrc from '../assets/images/profile/modal_panel.png';
import btnLevelGreenSrc from '../assets/images/profile/btn_level_green.png';
import nameInputBarPerfectSrc from '../assets/images/profile/name_input_bar_perfect.png';
import avatar8SlotsTraySrc from '../assets/images/profile/avatar_8_slots_tray.png';

// 8 Square Avatars with glossy gold rounded frames
import avatarDragonSrc from '../assets/images/profile/avatar_dragon.png';
import avatarLionSrc from '../assets/images/profile/avatar_lion.png';
import avatarCatSrc from '../assets/images/profile/avatar_cat.png';
import avatarPandaSrc from '../assets/images/profile/avatar_panda.png';
import avatarFoxSrc from '../assets/images/profile/avatar_fox.png';
import avatarPenguinSrc from '../assets/images/profile/avatar_penguin.png';
import avatarHuskySrc from '../assets/images/profile/avatar_husky.png';
import avatarUnicornSrc from '../assets/images/profile/avatar_unicorn.png';

export type AvatarId =
  | 'dragon'
  | 'lion'
  | 'cat'
  | 'panda'
  | 'fox'
  | 'penguin'
  | 'husky'
  | 'unicorn';

interface AvatarOption {
  id: AvatarId;
  name: string;
  squareSrc: string;
}

const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'dragon', name: 'Dragon', squareSrc: avatarDragonSrc },
  { id: 'lion', name: 'Lion', squareSrc: avatarLionSrc },
  { id: 'cat', name: 'Cat', squareSrc: avatarCatSrc },
  { id: 'panda', name: 'Panda', squareSrc: avatarPandaSrc },
  { id: 'fox', name: 'Fox', squareSrc: avatarFoxSrc },
  { id: 'penguin', name: 'Penguin', squareSrc: avatarPenguinSrc },
  { id: 'husky', name: 'Husky', squareSrc: avatarHuskySrc },
  { id: 'unicorn', name: 'Unicorn', squareSrc: avatarUnicornSrc },
];

interface HomeScreenProps {
  onStartGame: () => void;
  levelNumber?: number;
  coins?: number;
  onAddCoins?: (amount: number) => void;
}

const HOME_BG_STYLE: React.CSSProperties = {
  backgroundImage: `url(${tropicalBeachBgSrc})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center bottom',
  backgroundRepeat: 'no-repeat',
};

const DIAMOND_BG_STYLE: React.CSSProperties = {
  backgroundColor: '#003380',
  backgroundImage: `
    radial-gradient(circle at 50% 35%, #0055B8 0%, #002D78 60%, #001A4D 100%),
    url("data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18 0L36 18L18 36L0 18Z' fill='%23ffffff' fill-opacity='0.035' stroke='%23ffffff' stroke-opacity='0.08' stroke-width='1'/%3E%3C/svg%3E")
  `,
  backgroundRepeat: 'repeat',
};

const SHOP_ITEMS = [
  { coins: 1000, displayAmount: '1.000', price: 'PKR 550.00', numCoins: 1000 },
  { coins: 5000, displayAmount: '5.000', price: 'PKR 2200.00', numCoins: 5000 },
  { coins: 10000, displayAmount: '10.000', price: 'PKR 4150.00', numCoins: 10000 },
  { coins: 25000, displayAmount: '25.000', price: 'PKR 8400.00', numCoins: 25000 },
  { coins: 50000, displayAmount: '50.000', price: 'PKR 15300.00', numCoins: 50000 },
  { coins: 100000, displayAmount: '100.000', price: 'PKR 27800.00', numCoins: 100000 },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartGame,
  levelNumber = 1,
  coins = 19330,
  onAddCoins,
}) => {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [musicEnabled, setMusicEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(sounds.enabled);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [activeModal, setActiveModal] = useState<'support' | 'terms' | 'privacy' | null>(null);

  // Profile Customization State (Stored in localStorage)
  const [selectedAvatarId, setSelectedAvatarId] = useState<AvatarId>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('royal_marble_avatar');
      if (saved && AVATAR_OPTIONS.some((a) => a.id === saved)) return saved as AvatarId;
    }
    return 'dragon';
  });

  const [playerName, setPlayerName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('royal_marble_name');
      if (saved && saved.trim()) return saved.trim();
    }
    return 'Player 1';
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [draftAvatarId, setDraftAvatarId] = useState<AvatarId>(selectedAvatarId);
  const [draftPlayerName, setDraftPlayerName] = useState<string>(playerName);

  const openProfileModal = () => {
    sounds.playTap();
    setDraftAvatarId(selectedAvatarId);
    setDraftPlayerName(playerName);
    setIsProfileModalOpen(true);
  };

  const handleSaveProfile = () => {
    sounds.playPowerup();
    const finalName = draftPlayerName.trim() || 'Player 1';
    setSelectedAvatarId(draftAvatarId);
    setPlayerName(finalName);
    if (typeof window !== 'undefined') {
      localStorage.setItem('royal_marble_avatar', draftAvatarId);
      localStorage.setItem('royal_marble_name', finalName);
    }
    // Directly close modal without toast message per user instruction
    setIsProfileModalOpen(false);
  };

  const currentAvatarSrc =
    AVATAR_OPTIONS.find((a) => a.id === selectedAvatarId)?.squareSrc || avatarDragonSrc;

  const handleBuy = (item: (typeof SHOP_ITEMS)[0]) => {
    sounds.playPowerup();
    if (onAddCoins) {
      onAddCoins(item.numCoins);
    }
  };

  const toggleSound = () => {
    sounds.playTap();
    sounds.enabled = !sounds.enabled;
    setSoundEnabled(sounds.enabled);
  };

  const toggleMusic = () => {
    sounds.playTap();
    setMusicEnabled((prev) => !prev);
  };

  const toggleVibration = () => {
    sounds.playTap();
    setVibrationEnabled((prev) => !prev);
  };

  return (
    <div
      className="fixed inset-0 w-full h-full flex flex-col items-center justify-between select-none overflow-hidden font-['Fredoka']"
      style={activeTab === 'home' ? HOME_BG_STYLE : DIAMOND_BG_STYLE}
    >
      {/* Top Header Bar */}
      <div className="w-full max-w-[480px] flex flex-col items-center pt-3 z-30">
        <div className="w-full px-4 flex items-center justify-between h-14">
          {/* Left Element: Profile Photo on Home Screen; Coin Box on Shop Screen */}
          {activeTab === 'home' ? (
            <button
              type="button"
              onClick={openProfileModal}
              aria-label="Edit Profile"
              className="relative flex items-center gap-2 group cursor-pointer active:scale-95 transition-transform"
            >
              {/* Square Avatar with exact gold rounded border */}
              <div className="relative w-12 h-12 flex items-center justify-center rounded-xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]">
                <img
                  src={currentAvatarSrc}
                  alt={playerName}
                  className="w-full h-full object-contain pointer-events-none rounded-xl group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Player Name Pill */}
              <div className="bg-[#002766]/85 backdrop-blur-xs border-2 border-[#FFD700] rounded-full px-3 py-1 shadow-[0_3px_8px_rgba(0,0,0,0.6)] max-w-[110px] truncate">
                <span className="font-black text-white text-xs tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] truncate block">
                  {playerName}
                </span>
              </div>
            </button>
          ) : activeTab === 'shop' ? (
            <div className="relative w-28 h-10 flex items-center justify-center cursor-pointer active:scale-95 transition-transform">
              <img
                src={coinRackImgSrc}
                alt="Coins"
                className="w-full h-full object-contain pointer-events-none drop-shadow"
              />
              <span
                className="absolute font-black text-white text-xs tracking-wide pointer-events-none"
                style={{
                  left: '28px',
                  right: '10px',
                  top: '8px',
                  bottom: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textShadow: '0 1px 3px rgba(0,0,0,0.85), 0 0 4px #003B7A',
                }}
              >
                {coins.toLocaleString()}
              </span>
            </div>
          ) : (
            <div className="w-28" />
          )}

          {/* Center Header Title */}
          {activeTab === 'shop' && (
            <h1 className="text-3xl font-black text-[#FFE600] tracking-wider uppercase drop-shadow-[0_3px_6px_rgba(0,0,0,0.85)] flex items-center justify-center">
              Shop
            </h1>
          )}
          {activeTab === 'settings' && (
            <h1 className="text-3xl font-black text-[#FFE600] tracking-wider uppercase drop-shadow-[0_3px_6px_rgba(0,0,0,0.85)] flex items-center justify-center">
              Settings
            </h1>
          )}

          {/* Right Element: Coin Box on Home Screen (top-right corner) */}
          {activeTab === 'home' ? (
            <div className="relative w-28 h-10 flex items-center justify-center cursor-pointer active:scale-95 transition-transform ml-auto">
              <img
                src={coinRackImgSrc}
                alt="Coins"
                className="w-full h-full object-contain pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
              />
              <span
                className="absolute font-black text-white text-xs tracking-wide pointer-events-none"
                style={{
                  left: '28px',
                  right: '10px',
                  top: '8px',
                  bottom: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textShadow: '0 1px 3px rgba(0,0,0,0.85), 0 0 4px #003B7A',
                }}
              >
                {coins.toLocaleString()}
              </span>
            </div>
          ) : (
            <div className="w-28" />
          )}
        </div>

        {/* Yellow Horizontal Divider Line below Header (only on Shop & Settings tabs) */}
        {activeTab !== 'home' && (
          <div className="w-full h-[3px] mt-2 bg-gradient-to-r from-[#FFB800] via-[#FFF5A5] to-[#FFB800] shadow-[0_2px_6px_rgba(0,0,0,0.5)]" />
        )}
      </div>

      {/* Main Content Area Based on Active Tab */}
      <div className="w-full max-w-[480px] flex-1 flex flex-col items-center justify-between px-4 pb-24 pt-3 z-20 overflow-y-auto">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="flex flex-col items-center justify-end w-full h-full my-auto pb-6">
            {/* Green Glossy 3D Level Button from User Sprite Sheet */}
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                onStartGame();
              }}
              aria-label={`Play Level ${levelNumber}`}
              className="relative group w-full max-w-[280px] h-[78px] transition-all duration-150 active:scale-95 hover:scale-105 cursor-pointer flex items-center justify-center drop-shadow-[0_10px_24px_rgba(0,0,0,0.7)] my-auto border-none bg-transparent p-0 focus:outline-none"
              style={{ marginTop: '500px' }}
            >
              <img
                src={btnLevelGreenSrc}
                alt={`Level ${levelNumber}`}
                className="w-full h-full object-contain pointer-events-none"
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-1">
                <span className="font-black text-2xl sm:text-3xl text-white tracking-widest uppercase drop-shadow-[0_2px_5px_rgba(0,0,0,0.95)]">
                  LEVEL {levelNumber}
                </span>
                <span className="text-[10px] font-black text-[#FFE27D] tracking-widest uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] -mt-1">
                  TAP TO PLAY
                </span>
              </div>
            </button>
          </div>
        )}

        {/* SHOP TAB */}
        {activeTab === 'shop' && (
          <div className="flex flex-col items-center w-full max-w-md my-auto pt-2 pb-4 gap-3 animate-fade-in">
            {SHOP_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="w-full bg-[#FFF6E5] border-2 border-[#DDAF66] rounded-2xl px-4 py-2.5 flex items-center justify-between shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-transform hover:scale-[1.01]"
              >
                {/* Left Coin Stack graphic + Amount */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center text-2xl drop-shadow">
                    🪙
                  </div>
                  <span className="font-black text-2xl text-[#5E3A10] tracking-wider">
                    {item.displayAmount}
                  </span>
                </div>

                {/* Right Green Price Button */}
                <button
                  type="button"
                  onClick={() => handleBuy(item)}
                  className="bg-gradient-to-b from-[#4ADE80] via-[#22C55E] to-[#15803D] border-2 border-[#A8F028] text-white font-black text-sm px-4 py-2 rounded-xl shadow-[0_4px_8px_rgba(0,0,0,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer tracking-wider"
                >
                  {item.price}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="flex flex-col items-center justify-center w-full max-w-sm my-auto gap-6 animate-fade-in">
            {/* Top Blue Container for Toggles */}
            <div className="w-full bg-[#0B5FA7]/90 border-2 border-[#00C4FF] rounded-3xl p-5 shadow-[0_8px_20px_rgba(0,0,0,0.4)] flex flex-col items-center">
              <div className="grid grid-cols-3 gap-3 w-full items-center">
                {/* 1. Music Button */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleMusic}
                    aria-label="Toggle Music"
                    className="relative w-20 h-20 transition-all duration-200 active:scale-90 hover:scale-105 cursor-pointer"
                  >
                    <img
                      src={btnMusicSquareSrc}
                      alt="Music ON"
                      className={`absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md transition-all duration-200 ${
                        musicEnabled
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-95 pointer-events-none'
                      }`}
                    />
                    <img
                      src={btnMusicSquareOffSrc}
                      alt="Music OFF"
                      className={`absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md transition-all duration-200 ${
                        musicEnabled
                          ? 'opacity-0 scale-95 pointer-events-none'
                          : 'opacity-100 scale-100'
                      }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={toggleMusic}
                    aria-label="Toggle Music Switch"
                    className="relative w-14 h-9 cursor-pointer active:scale-90 hover:scale-105 transition-all duration-200 focus:outline-none"
                  >
                    <img
                      src={switchOnNormSrc}
                      alt="Switch ON"
                      className={`absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm transition-all duration-200 ${
                        musicEnabled ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    <img
                      src={switchOffNormSrc}
                      alt="Switch OFF"
                      className={`absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm transition-all duration-200 ${
                        musicEnabled ? 'opacity-0' : 'opacity-100'
                      }`}
                    />
                  </button>
                </div>

                {/* 2. Sound Button */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleSound}
                    aria-label="Toggle Sound"
                    className="relative w-20 h-20 transition-all duration-200 active:scale-90 hover:scale-105 cursor-pointer"
                  >
                    <img
                      src={btnSoundSquareSrc}
                      alt="Sound ON"
                      className={`absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md transition-all duration-200 ${
                        soundEnabled
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-95 pointer-events-none'
                      }`}
                    />
                    <img
                      src={btnSoundSquareOffSrc}
                      alt="Sound OFF"
                      className={`absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md transition-all duration-200 ${
                        soundEnabled
                          ? 'opacity-0 scale-95 pointer-events-none'
                          : 'opacity-100 scale-100'
                      }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={toggleSound}
                    aria-label="Toggle Sound Switch"
                    className="relative w-14 h-9 cursor-pointer active:scale-90 hover:scale-105 transition-all duration-200 focus:outline-none"
                  >
                    <img
                      src={switchOnNormSrc}
                      alt="Switch ON"
                      className={`absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm transition-all duration-200 ${
                        soundEnabled ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    <img
                      src={switchOffNormSrc}
                      alt="Switch OFF"
                      className={`absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm transition-all duration-200 ${
                        soundEnabled ? 'opacity-0' : 'opacity-100'
                      }`}
                    />
                  </button>
                </div>

                {/* 3. Vibration Button */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleVibration}
                    aria-label="Toggle Vibration"
                    className="relative w-20 h-20 transition-all duration-200 active:scale-90 hover:scale-105 cursor-pointer"
                  >
                    <img
                      src={btnVibrationSquareSrc}
                      alt="Vibration ON"
                      className={`absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md transition-all duration-200 ${
                        vibrationEnabled
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-95 pointer-events-none'
                      }`}
                    />
                    <img
                      src={btnVibrationSquareOffSrc}
                      alt="Vibration OFF"
                      className={`absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-md transition-all duration-200 ${
                        vibrationEnabled
                          ? 'opacity-0 scale-95 pointer-events-none'
                          : 'opacity-100 scale-100'
                      }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={toggleVibration}
                    aria-label="Toggle Vibration Switch"
                    className="relative w-14 h-9 cursor-pointer active:scale-90 hover:scale-105 transition-all duration-200 focus:outline-none"
                  >
                    <img
                      src={switchOnNormSrc}
                      alt="Switch ON"
                      className={`absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm transition-all duration-200 ${
                        vibrationEnabled ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    <img
                      src={switchOffNormSrc}
                      alt="Switch OFF"
                      className={`absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-sm transition-all duration-200 ${
                        vibrationEnabled ? 'opacity-0' : 'opacity-100'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Support Button from sprite sheet */}
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setActiveModal('support');
              }}
              aria-label="Support"
              className="w-full max-w-[240px] transition-transform active:scale-95 cursor-pointer hover:brightness-105 drop-shadow-[0_6px_16px_rgba(0,0,0,0.5)]"
            >
              <img
                src={btnSupportSrc}
                alt="Support"
                className="w-full h-auto object-contain pointer-events-none"
              />
            </button>

            {/* Terms and Privacy Buttons from sprite sheet */}
            <div className="flex items-center gap-4 w-full max-w-[310px] justify-center">
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setActiveModal('terms');
                }}
                aria-label="Terms"
                className="flex-1 transition-transform active:scale-95 cursor-pointer hover:brightness-105 drop-shadow-md"
              >
                <img
                  src={btnTermsSrc}
                  alt="Terms"
                  className="w-full h-auto object-contain pointer-events-none"
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setActiveModal('privacy');
                }}
                aria-label="Privacy"
                className="flex-1 transition-transform active:scale-95 cursor-pointer hover:brightness-105 drop-shadow-md"
              >
                <img
                  src={btnPrivacySrc}
                  alt="Privacy"
                  className="w-full h-auto object-contain pointer-events-none"
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* USER PROFILE MODAL (Proper aspect ratio, built-in close X, clean name input bar, and save button outside/below) */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-3 animate-fade-in">
          {/* Modal Container: Compact width 250px per CSS 9 */}
          <div
            className="relative w-full aspect-[537/456] flex flex-col items-center justify-between px-5 pt-3 pb-6 select-none"
            style={{
              width: '250px',
              backgroundImage: `url(${modalPanelSrc})`,
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.95))',
            }}
          >
            {/* Transparent Hit Area for the Built-In Red X Button (Top Right corner) */}
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setIsProfileModalOpen(false);
              }}
              aria-label="Close Profile Modal"
              className="absolute top-1 right-1 w-12 h-12 rounded-full cursor-pointer z-30 border-none bg-transparent p-0 active:scale-90 transition-transform focus:outline-none"
            />

            {/* Modal Title Banner Header: Perfectly aligned inside top blue banner */}
            <div className="pt-2">
              <h2
                className="font-black text-[#FFE600] tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
                style={{
                  fontSize: '11px',
                  marginTop: '-8px',
                  marginBottom: '1px',
                  marginLeft: '5px',
                }}
              >
                PLAYER PROFILE
              </h2>
            </div>

            {/* Middle Content Section: Name Input Bar + 8 Avatar Tray */}
            <div className="w-full flex flex-col items-center gap-3 px-2 mt-1 mb-2">
              {/* Clean Name Input Bar without any stretching (CSS 1) */}
              <div
                className="relative flex items-center justify-center"
                style={{
                  fontSize: '12px',
                  width: '174px',
                  height: '30px',
                  backgroundImage: `url(${nameInputBarPerfectSrc})`,
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <input
                  type="text"
                  maxLength={14}
                  value={draftPlayerName}
                  onChange={(e) => setDraftPlayerName(e.target.value)}
                  placeholder="Enter Name..."
                  className="w-full bg-transparent pl-8 pr-8 text-center font-black text-white outline-none placeholder-white/60 tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                  style={{ fontSize: '12px' }}
                />
              </div>

              {/* 8 Avatar Tray from sprite sheet (CSS 2) */}
              <div
                className="relative flex items-center justify-center p-1.5"
                style={{
                  width: '188px',
                  height: '84px',
                  backgroundImage: `url(${avatar8SlotsTraySrc})`,
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <div className="grid grid-cols-4 gap-x-2 gap-y-1.5 w-full h-full items-center justify-items-center px-1">
                  {AVATAR_OPTIONS.map((avatar, idx) => {
                    const isSelected = draftAvatarId === avatar.id;
                    let extraStyle: React.CSSProperties = {};
                    if (idx === 1) {
                      // CSS 8 (button 2)
                      extraStyle = { marginLeft: '-1px', marginTop: '2px' };
                    } else if (idx === 3) {
                      // CSS 3 (button 4)
                      extraStyle = { width: '37px', height: '35px' };
                    } else if (idx === 4) {
                      // CSS 6 (button 5)
                      extraStyle = { marginTop: '-4px', marginBottom: '1px', marginLeft: '-2px', width: '35px' };
                    } else if (idx === 5) {
                      // CSS 7 (button 6)
                      extraStyle = { marginLeft: '-1px', marginTop: '-5px', marginRight: '1px', width: '37px' };
                    } else if (idx === 6) {
                      // CSS 5 (button 7)
                      extraStyle = { marginRight: '1px', marginTop: '-3px' };
                    } else if (idx === 7) {
                      // CSS 4 (button 8)
                      extraStyle = { width: '35px', height: '35px', marginRight: '0px', marginTop: '-2px' };
                    }

                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => {
                          sounds.playTap();
                          setDraftAvatarId(avatar.id);
                        }}
                        aria-label={`Select ${avatar.name}`}
                        className={`relative w-8.5 h-8.5 rounded-lg transition-all duration-150 cursor-pointer active:scale-90 ${
                          isSelected
                            ? 'ring-2 ring-[#FFE600] scale-110 drop-shadow-[0_0_8px_#FFE600]'
                            : 'hover:scale-105 opacity-90 hover:opacity-100'
                        }`}
                        style={extraStyle}
                      >
                        <img
                          src={avatar.squareSrc}
                          alt={avatar.name}
                          className="w-full h-full object-contain pointer-events-none rounded-lg"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Spacer to keep interior balanced */}
            <div className="h-1" />
          </div>

          {/* Save Button Positioned Outside/Below the Popup Menu per user request */}
          <div className="mt-4 z-40">
            <button
              type="button"
              onClick={handleSaveProfile}
              aria-label="Save Profile"
              className="relative group w-44 h-12 flex items-center justify-center cursor-pointer active:scale-95 hover:scale-105 transition-all duration-150 border-none bg-transparent p-0 drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)]"
            >
              <img
                src={btnLevelGreenSrc}
                alt="Save"
                className="w-full h-full object-contain pointer-events-none"
              />
              <span className="absolute font-black text-white text-lg tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] flex items-center gap-2">
                <span>✔</span> SAVE
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Info Modals for Support, Terms, Privacy */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#002766] border-3 border-[#00C4FF] rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl relative animate-scale-up">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-2 right-2 w-9 h-9 transition-transform active:scale-90 cursor-pointer"
            >
              <img
                src={btnCloseXSrc}
                alt="Close"
                className="w-full h-full object-contain pointer-events-none"
              />
            </button>

            {activeModal === 'support' && (
              <div>
                <h3 className="text-2xl font-black text-[#FFE600] uppercase mb-3">
                  Player Support
                </h3>
                <p className="text-sm text-white/90 mb-4">
                  Need help or have suggestions? Contact our support team directly.
                </p>
                <div className="bg-[#001D4A] p-3 rounded-xl border border-[#00C4FF]/40 text-xs text-[#8CE4FD] font-mono">
                  support@royalmarblesort.com
                </div>
              </div>
            )}

            {activeModal === 'terms' && (
              <div>
                <h3 className="text-2xl font-black text-[#FFE600] uppercase mb-3">
                  Terms of Service
                </h3>
                <p className="text-xs text-white/80 leading-relaxed mb-4 text-left max-h-40 overflow-y-auto pr-1">
                  By playing Royal Marble Sort, you agree to enjoy the puzzle mechanics responsibly. All coins and boosters are in-game virtual items for entertainment purposes.
                </p>
              </div>
            )}

            {activeModal === 'privacy' && (
              <div>
                <h3 className="text-2xl font-black text-[#FFE600] uppercase mb-3">
                  Privacy Policy
                </h3>
                <p className="text-xs text-white/80 leading-relaxed mb-4 text-left max-h-40 overflow-y-auto pr-1">
                  We respect your privacy. Game progress, level settings, and preferences are stored locally on your device. No personal data is shared with third parties.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="mt-4 px-6 py-2 bg-[#2EB55A] text-white font-extrabold text-sm rounded-xl border border-white/60 active:scale-95 transition-transform"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};
