import React from 'react';
import { Gauge, Flag, Zap, ArrowLeft, ArrowRight } from 'lucide-react';

export const RaceHUD = ({
  speedMph,
  position,
  coins,
  progressPct,
  onSteerChange,
  onTriggerNitro,
}) => {
  const getOrdinal = (n) => {
    if (n === 1) return '1st';
    if (n === 2) return '2nd';
    if (n === 3) return '3rd';
    return '4th';
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2 sm:p-4 z-30 select-none">
      {/* Top HUD Bar */}
      <div className="flex items-start justify-between gap-1 sm:gap-2">
        {/* Race Position Badge */}
        <div className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-[#FF0080] border-2 sm:border-4 border-white text-white font-black shadow-2xl flex items-center gap-1 sm:gap-2">
          <Flag className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xl sm:text-3xl tracking-tight leading-none italic">
            {getOrdinal(position)}
          </span>
          <span className="hidden sm:inline text-[10px] sm:text-xs uppercase opacity-90 tracking-widest">Place</span>
        </div>

        {/* Speedometer Gauge */}
        <div className="px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-2xl bg-white/95 border-2 sm:border-4 border-[#00B4D8] text-center shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-center gap-1 text-[#00B4D8]">
            <Gauge className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xl sm:text-3xl font-black text-[#1B4332] leading-none">
              {speedMph}
            </span>
            <span className="text-[10px] sm:text-xs font-black text-[#00B4D8]">MPH</span>
          </div>
          <div className="w-20 sm:w-28 h-1.5 sm:h-2 bg-slate-200 rounded-full mt-1 overflow-hidden border border-slate-300">
            <div
              className="h-full bg-[#00F5D4] transition-all duration-200"
              style={{ width: `${Math.min(100, (speedMph / 120) * 100)}%` }}
            />
          </div>
        </div>

        {/* Race Coins */}
        <div className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-[#FFCC00] border-2 sm:border-4 border-white text-[#6B5600] font-black flex items-center gap-1.5 shadow-2xl">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold text-[#6B5600]">
            $
          </div>
          <span className="text-lg sm:text-2xl leading-none">+{coins}</span>
        </div>
      </div>

      {/* Track Progress Bar */}
      <div className="w-full max-w-xs sm:max-w-md mx-auto px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-white/95 border-2 sm:border-4 border-[#FFCC00] shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between text-[10px] sm:text-xs font-black text-[#1B4332] mb-0.5 sm:mb-1">
          <span>START</span>
          <span className="text-[#FF0080]">{progressPct}% LAP</span>
          <span>FINISH</span>
        </div>
        <div className="w-full h-2 sm:h-3 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
          <div
            className="h-full bg-[#00F5D4] rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Auto-Drive Cruise Control Status & Nitro Boost */}
      <div className="pointer-events-auto flex items-end justify-between gap-4">
        <div className="px-3 py-1.5 rounded-2xl bg-slate-950/90 border-2 border-[#00F5D4] text-[#00F5D4] font-black text-xs uppercase flex items-center gap-1.5 shadow-xl backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#00F5D4] animate-ping" />
          <span>🚀 AUTOPILOT DRIVING</span>
        </div>

        {/* Nitro Boost Button */}
        {onTriggerNitro && (
          <button
            onClick={onTriggerNitro}
            className="h-14 sm:h-16 px-5 rounded-3xl bg-[#00F5D4] border-b-[6px] border-[#00BB9F] text-[#006E5D] font-black text-base sm:text-lg shadow-2xl active:border-b-0 active:translate-y-[6px] transition-all flex items-center gap-2 cursor-pointer select-none"
          >
            <Zap className="w-5 h-5 animate-pulse" />
            <span>NITRO BOOST!</span>
          </button>
        )}
      </div>
    </div>
  );
};
