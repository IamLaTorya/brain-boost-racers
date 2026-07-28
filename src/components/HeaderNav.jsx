import React from 'react';
import { Volume2, VolumeX, Sparkles, ShoppingBag, Landmark, Settings as SettingsIcon, HelpCircle } from 'lucide-react';
import { soundFx } from '../utils/sound';

export const HeaderNav = ({
  playerData,
  activePage,
  onNavigate,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#00B4D8]/90 backdrop-blur-md border-b-4 border-white/40 px-2 sm:px-4 py-2 sm:py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Logo Branding */}
        <button
          onClick={() => {
            soundFx.playButtonClick();
            onNavigate('home');
          }}
          className="flex items-center gap-1.5 text-left group cursor-pointer focus:outline-none shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-[#FF0080] border-2 border-white flex items-center justify-center font-black text-lg sm:text-xl text-[#FFCC00] shadow-md group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <h1 className="font-black text-sm sm:text-2xl text-white drop-shadow-[0_2px_0_rgba(0,180,216,1)] tracking-tight leading-none italic">
              BRAIN BOOST
            </h1>
            <p className="text-[9px] sm:text-xs font-black text-[#FFCC00] tracking-widest uppercase drop-shadow-[0_1px_0_rgba(0,0,0,0.5)]">
              RACERS
            </p>
          </div>
        </button>

        {/* Grade Badge & Coin Display */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={() => {
              soundFx.playButtonClick();
              onNavigate('grade_select');
            }}
            className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-2xl bg-white/95 border-2 sm:border-4 border-[#FF0080] text-[#1B4332] text-[11px] sm:text-sm font-black shadow-lg hover:bg-white transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF0080]" />
            <span className="uppercase">Grade {playerData.selectedGrade}</span>
          </button>

          <button
            onClick={() => {
              soundFx.playButtonClick();
              onNavigate('shop');
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-2xl bg-white/95 border-2 sm:border-4 border-[#FFCC00] text-[#1B4332] font-black text-[11px] sm:text-sm shadow-lg hover:bg-white transition-all cursor-pointer"
          >
            <div className="w-5 h-5 bg-[#FFCC00] rounded-full border border-white flex items-center justify-center font-bold text-[#6B5600] text-[10px]">
              $
            </div>
            <span>{playerData.coins}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => {
              soundFx.playButtonClick();
              onNavigate('bank');
            }}
            className={`p-2 rounded-2xl border-2 sm:border-4 font-black text-xs flex items-center gap-1 transition-all cursor-pointer shadow-lg ${
              activePage === 'bank'
                ? 'bg-[#FFCC00] text-[#6B5600] border-white'
                : 'bg-white/95 text-[#1B4332] border-[#00B4D8] hover:bg-white'
            }`}
            title="Racer Math Bank"
          >
            <Landmark className="w-4 h-4 text-[#FFCC00]" />
            <span className="hidden md:inline uppercase">Bank</span>
          </button>

          <button
            onClick={() => {
              soundFx.playButtonClick();
              onNavigate('shop');
            }}
            className={`p-2 rounded-2xl border-2 sm:border-4 font-black text-xs flex items-center gap-1 transition-all cursor-pointer shadow-lg ${
              activePage === 'shop'
                ? 'bg-[#FF0080] text-white border-white'
                : 'bg-white/95 text-[#1B4332] border-[#00B4D8] hover:bg-white'
            }`}
            title="Cosmetics Shop"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden md:inline uppercase">Shop</span>
          </button>

          <button
            onClick={() => {
              if (!playerData.settings.soundEnabled) {
                soundFx.playButtonClick();
              }
              onToggleSound();
            }}
            className="p-2 rounded-2xl bg-white/95 text-[#1B4332] border-2 sm:border-4 border-[#00B4D8] hover:bg-white transition-all cursor-pointer shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00B4D8]"
            title="Toggle Sound"
            aria-label={playerData.settings.soundEnabled ? "Mute all sounds" : "Unmute all sounds"}
          >
            {playerData.settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#00BB9F]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#FF0080]" />
            )}
          </button>

          <button
            onClick={() => {
              soundFx.playButtonClick();
              onNavigate('instructions');
            }}
            className={`p-2 rounded-2xl border-2 sm:border-4 transition-all cursor-pointer shadow-lg ${
              activePage === 'instructions'
                ? 'bg-[#FFCC00] text-[#6B5600] border-white'
                : 'bg-white/95 text-[#1B4332] border-[#00B4D8] hover:bg-white'
            }`}
            title="Instructions"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundFx.playButtonClick();
              onNavigate('settings');
            }}
            className={`p-2 rounded-2xl border-2 sm:border-4 transition-all cursor-pointer shadow-lg ${
              activePage === 'settings'
                ? 'bg-[#FF0080] text-white border-white'
                : 'bg-white/95 text-[#1B4332] border-[#00B4D8] hover:bg-white'
            }`}
            title="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
