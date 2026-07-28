import React from 'react';
import { ArrowLeft, Zap, Coins, Flag, Sparkles, Navigation } from 'lucide-react';
import { soundFx } from '../utils/sound';

export const Instructions = ({ onNavigate }) => {
  return (
    <div className="min-h-[calc(100vh-64px)] max-w-4xl mx-auto p-3 sm:p-6 space-y-6 select-none">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/95 border-4 border-[#00B4D8] p-4 sm:p-6 rounded-3xl shadow-xl backdrop-blur-md">
        <button
          onClick={() => {
            soundFx.playButtonClick();
            onNavigate('home');
          }}
          className="px-4 py-2 rounded-2xl bg-white border-b-4 border-[#E0E0E0] text-slate-700 font-extrabold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all cursor-pointer shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00B4D8]"
          aria-label="Back to main menu"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>

        <h2 className="text-2xl sm:text-3xl font-black text-[#1B4332] italic uppercase text-center break-words">
          How to Play & Controls
        </h2>

        <div className="w-24 hidden sm:block"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 sm:p-6 rounded-3xl bg-white/95 border-4 border-[#FF0080] space-y-4 shadow-2xl">
          <div className="flex items-center gap-2 text-[#FF0080] font-black text-lg uppercase">
            <Navigation className="w-6 h-6 shrink-0" />
            <h3 className="break-words">Autopilot Cruise Control</h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-700 font-bold leading-relaxed">
            <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200">
              <span className="text-[#FF0080] font-black uppercase block mb-1">Smooth Auto Drive</span>
              Your race car automatically steers and accelerates smoothly along the scenic Beach Track!
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200">
              <span className="text-[#00B4D8] font-black uppercase block mb-1">Math Powered Speed</span>
              Answering math questions correctly unlocks instant Nitro Boosts to zoom past rival racers!
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-3xl bg-white/95 border-4 border-[#FFCC00] space-y-4 shadow-2xl">
          <div className="flex items-center gap-2 text-[#6B5600] font-black text-lg uppercase">
            <Zap className="w-6 h-6 text-[#6B5600] shrink-0" />
            <h3 className="break-words">Math Boost Checkpoints</h3>
          </div>

          <p className="text-xs font-semibold text-slate-600 leading-relaxed">
            During each race on the Beach Track, you will hit 5 Math Checkpoints.
          </p>

          <div className="space-y-2 text-xs font-black">
            <div className="p-3 rounded-2xl bg-emerald-100 border-2 border-emerald-500 text-[#1B4332] flex items-center gap-2 break-words">
              <Sparkles className="w-4 h-4 text-[#00BB9F] shrink-0" />
              <span>Correct Answer = Nitro Rocket Speed Boost + 30 Coins!</span>
            </div>

            <div className="p-3 rounded-2xl bg-rose-100 border-2 border-rose-500 text-rose-900 flex items-center gap-2 break-words">
              <Flag className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Wrong Answer = Spinout delay & -20 Coins penalty (unless protected by a Math Shield)!</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 rounded-3xl bg-white/95 border-4 border-[#00BB9F] flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1 text-center md:text-left min-w-0">
          <h3 className="font-black text-[#1B4332] text-base sm:text-lg flex items-center justify-center md:justify-start gap-2 uppercase break-words">
            <Coins className="w-5 h-5 text-[#6B5600] shrink-0" />
            <span>Earn & Save Coins for Cosmetics</span>
          </h3>
          <p className="text-xs font-semibold text-slate-600 max-w-xl break-words leading-relaxed">
            Learn financial literacy as you race! Save coins earned from finishing races and answering math questions to unlock awesome driver hats, cool shades, flame outfits, and metallic car paints in the Garage Shop.
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playButtonClick();
            onNavigate('shop');
          }}
          className="h-14 px-6 rounded-2xl bg-[#FFCC00] border-b-[6px] border-[#C29B00] text-[#6B5600] font-black text-sm shadow-lg hover:bg-[#ffd11a] active:border-b-0 active:translate-y-[6px] transition-all cursor-pointer uppercase shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B5600]"
        >
          Visit Garage Shop
        </button>
      </div>
    </div>
  );
};
