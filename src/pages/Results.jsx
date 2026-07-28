import React from 'react';
import { Trophy, Coins, Zap, Clock, RotateCcw, ShoppingBag, Sparkles, Target } from 'lucide-react';
import { soundFx } from '../utils/sound';
import { Confetti } from '../components/Confetti';

export const Results = ({ result, onNavigate }) => {
  const getOrdinal = (n) => {
    if (n === 1) return '1st';
    if (n === 2) return '2nd';
    if (n === 3) return '3rd';
    return '4th';
  };

  const isWinner = result.position === 1;

  const mathAccuracy =
    result.questionsAnswered > 0
      ? Math.round((result.correctAnswers / result.questionsAnswered) * 100)
      : 100;

  return (
    <div className="min-h-[calc(100vh-64px)] max-w-4xl mx-auto p-4 sm:p-6 flex flex-col items-center justify-center relative select-none">
      {result.position <= 3 && <Confetti />}

      <div className="w-full bg-white/95 border-4 border-[#FF0080] rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md text-center space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#FFCC00] border-4 border-[#C29B00] shadow-xl mx-auto">
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-[#6B5600] animate-bounce" />
          </div>

          <div className="inline-block px-8 py-2 rounded-2xl font-black text-2xl sm:text-4xl bg-[#FF0080] border-4 border-white text-white shadow-xl uppercase italic tracking-wider">
            {getOrdinal(result.position)} Place Finish!
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-[#1B4332] uppercase italic">
            {isWinner ? '🎉 Incredible Race Champion!' : 'Great Race Effort!'}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border-4 border-[#00B4D8] text-center shadow-md">
            <Clock className="w-6 h-6 text-[#00B4D8] mx-auto mb-1" />
            <p className="text-2xl font-black text-[#1B4332]">{result.timeSeconds}s</p>
            <p className="text-xs font-black text-slate-500 uppercase">Race Time</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border-4 border-[#FFCC00] text-center shadow-md">
            <Coins className="w-6 h-6 text-[#6B5600] mx-auto mb-1" />
            <p className="text-2xl font-black text-[#6B5600]">+{result.coinsEarned}</p>
            <p className="text-xs font-black text-slate-500 uppercase">Coins Earned</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border-4 border-[#00BB9F] text-center shadow-md">
            <Target className="w-6 h-6 text-[#00BB9F] mx-auto mb-1" />
            <p className="text-2xl font-black text-[#006E5D]">{mathAccuracy}%</p>
            <p className="text-xs font-black text-slate-500 uppercase">Math Accuracy</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border-4 border-[#FF0080] text-center shadow-md">
            <Zap className="w-6 h-6 text-[#FF0080] mx-auto mb-1" />
            <p className="text-2xl font-black text-[#1B4332]">{result.maxSpeedReached} MPH</p>
            <p className="text-xs font-black text-slate-500 uppercase">Top Speed</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border-4 border-[#00B4D8] text-left flex items-center justify-between gap-4 shadow-md">
          <div>
            <h4 className="font-black text-[#1B4332] text-sm sm:text-base uppercase">
              Math Boost Checkpoints Answered
            </h4>
            <p className="text-xs font-bold text-slate-600">
              You answered {result.correctAnswers} out of {result.questionsAnswered} math questions correctly!
            </p>
          </div>
          <Sparkles className="w-8 h-8 text-[#FF0080] shrink-0" />
        </div>

        {/* Bank Savings Compound Interest Award */}
        {result.bankInterestEarned > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-100 to-yellow-50 border-4 border-[#FFCC00] text-left flex items-center justify-between gap-4 shadow-md">
            <div>
              <h4 className="font-black text-[#6B5600] text-sm sm:text-base uppercase flex items-center gap-1.5">
                <span>🏦 BANK SAVINGS COMPOUND INTEREST EARNED!</span>
              </h4>
              <p className="text-xs font-bold text-amber-900 mt-0.5">
                Your Savings Vault grew by <strong className="text-emerald-700">+${result.bankInterestEarned} Coins</strong> from compound interest!
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[#FFCC00] text-[#6B5600] font-black text-sm border-2 border-white shrink-0 shadow">
              +${result.bankInterestEarned}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => {
              soundFx.playButtonClick();
              onNavigate('race');
            }}
            className="w-full sm:w-auto h-18 px-8 rounded-3xl bg-[#00F5D4] border-b-[8px] border-[#00BB9F] text-[#006E5D] font-black text-xl uppercase tracking-wider shadow-2xl hover:bg-[#12fcdb] active:border-b-0 active:translate-y-[8px] transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <RotateCcw className="w-6 h-6 stroke-[3]" />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={() => {
              soundFx.playButtonClick();
              onNavigate('shop');
            }}
            className="w-full sm:w-auto h-18 px-8 rounded-3xl bg-[#FFCC00] border-b-[8px] border-[#C29B00] text-[#6B5600] font-black text-xl uppercase tracking-wider hover:bg-[#ffd11a] active:border-b-0 active:translate-y-[8px] transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xl"
          >
            <ShoppingBag className="w-6 h-6" />
            <span>GARAGE SHOP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
