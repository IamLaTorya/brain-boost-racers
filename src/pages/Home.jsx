import React from 'react';
import { Play, ShoppingBag, Settings, Info, HelpCircle, Landmark } from 'lucide-react';
import { soundFx } from '../utils/sound';
import { CarCanvas } from '../components/CarCanvas';

export const Home = ({ playerData, onNavigate }) => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      <div className="w-full max-w-2xl flex flex-col items-center text-center z-10 space-y-6 my-auto">
        <div className="space-y-3">
          <h1 className="text-[52px] sm:text-[76px] md:text-[88px] leading-none font-black text-white text-center drop-shadow-[0_8px_0_rgba(0,180,216,1)] italic tracking-tighter">
            BRAIN BOOST<br />
            <span className="text-[#FFCC00] drop-shadow-[0_8px_0_rgba(255,0,128,1)] uppercase">
              Racers
            </span>
          </h1>

          <div className="inline-block bg-black text-white px-6 py-1.5 rounded-full text-xs sm:text-base font-black tracking-[0.2em] uppercase shadow-xl border-2 border-white/20">
            Race • Learn • Earn • Customize
          </div>

          <p className="text-slate-800 text-sm sm:text-base max-w-md mx-auto font-bold bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-white/80">
            Answer math questions to boost past rivals, earn coins, and customize your racer!
          </p>
        </div>

        <div className="relative group p-5 sm:p-6 rounded-3xl bg-white/95 border-4 border-[#FF0080] hover:scale-102 transition-all shadow-2xl backdrop-blur-md">
          <div className="bg-slate-950/90 p-3 sm:p-4 rounded-2xl border-2 border-slate-800 shadow-inner">
            <CarCanvas
              carColor={playerData.selectedCar}
              equipped={playerData.equippedCosmetics}
              width={260}
              height={140}
              animateWheels={true}
            />
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-xs font-black text-white bg-[#FF0080] px-3 py-1 rounded-full uppercase shadow">
              Grade {playerData.selectedGrade}
            </span>
            <span className="text-xs font-black text-[#1B4332] bg-[#FFCC00] px-3 py-1 rounded-full uppercase shadow">
              {playerData.equippedCosmetics?.carPaint && playerData.equippedCosmetics.carPaint !== 'default'
                ? playerData.equippedCosmetics.carPaint.replace('paint_', '').toUpperCase() + ' PAINT'
                : playerData.selectedCar.toUpperCase() + ' CAR'}
            </span>
          </div>
        </div>

        <div className="w-full max-w-md space-y-3">
          <button
            onClick={() => {
              soundFx.playButtonClick();
              onNavigate('grade_select');
            }}
            className="w-full h-20 sm:h-22 bg-[#00F5D4] border-b-[10px] border-[#00BB9F] rounded-3xl transition-all active:border-b-0 active:translate-y-[10px] hover:bg-[#12fcdb] flex items-center justify-center gap-3 cursor-pointer shadow-2xl overflow-hidden group"
          >
            <Play className="w-8 h-8 fill-[#006E5D] text-[#006E5D]" />
            <span className="text-3xl sm:text-4xl font-black text-[#006E5D] uppercase tracking-wider">
              Play Now!
            </span>
          </button>

          <button
            onClick={() => {
              soundFx.playButtonClick();
              onNavigate('bank');
            }}
            className="w-full min-h-[4.5rem] py-3.5 px-3.5 sm:px-6 bg-[#FFCC00] border-b-[8px] border-[#C29B00] rounded-3xl transition-all active:border-b-0 active:translate-y-[8px] hover:bg-[#ffd11a] flex items-center justify-between gap-2.5 sm:gap-3 cursor-pointer shadow-xl overflow-hidden"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 text-left">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white flex items-center justify-center text-[#6B5600] font-black text-xl sm:text-2xl shadow shrink-0">
                🏦
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm sm:text-xl font-black text-[#6B5600] uppercase block leading-tight tracking-tight break-words">
                  RACER MATH BANK
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-[#8D7200] block leading-normal break-words mt-0.5">
                  Savings Vault: ${playerData.bankAccount?.savingsBalance || 0} Coins
                </span>
              </div>
            </div>
            <span className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#6B5600] text-white font-black text-[10px] sm:text-xs uppercase tracking-wider shrink-0 whitespace-nowrap">
              EARN INTEREST
            </span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                soundFx.playButtonClick();
                onNavigate('shop');
              }}
              className="h-16 sm:h-18 bg-[#FF0080] border-b-[8px] border-[#B8005C] rounded-3xl transition-all active:border-b-0 active:translate-y-[8px] hover:bg-[#ff1a8c] flex items-center justify-center gap-2 cursor-pointer shadow-xl"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              <span className="text-lg sm:text-xl font-black text-white uppercase">Shop</span>
            </button>

            <button
              onClick={() => {
                soundFx.playButtonClick();
                onNavigate('settings');
              }}
              className="h-16 sm:h-18 bg-[#FFCC00] border-b-[8px] border-[#C29B00] rounded-3xl transition-all active:border-b-0 active:translate-y-[8px] hover:bg-[#ffd11a] flex items-center justify-center gap-2 cursor-pointer shadow-xl"
            >
              <Settings className="w-5 h-5 text-[#6B5600]" />
              <span className="text-lg sm:text-xl font-black text-[#6B5600] uppercase">Settings</span>
            </button>

            <button
              onClick={() => {
                soundFx.playButtonClick();
                onNavigate('instructions');
              }}
              className="h-14 sm:h-16 bg-[#FFFFFF] border-b-[6px] border-[#E0E0E0] rounded-2xl transition-all active:border-b-0 active:translate-y-[6px] hover:bg-slate-50 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <HelpCircle className="w-5 h-5 text-slate-600" />
              <span className="text-base sm:text-lg font-extrabold text-slate-700 uppercase">
                Controls
              </span>
            </button>

            <button
              onClick={() => {
                soundFx.playButtonClick();
                onNavigate('credits');
              }}
              className="h-14 sm:h-16 bg-[#FFFFFF] border-b-[6px] border-[#E0E0E0] rounded-2xl transition-all active:border-b-0 active:translate-y-[6px] hover:bg-slate-50 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Info className="w-5 h-5 text-slate-600" />
              <span className="text-base sm:text-lg font-extrabold text-slate-700 uppercase">
                Credits
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
