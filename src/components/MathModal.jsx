import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, CheckCircle2, XCircle, Clock, Coins, Lightbulb, ShieldCheck } from 'lucide-react';
import { soundFx } from '../utils/sound';

export const MathModal = ({
  question,
  checkpointNumber,
  totalCheckpoints,
  timerEnabled,
  timerSeconds,
  powerUps,
  onUsePowerUp,
  onAnswer,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerSeconds);
  const [showShieldChoice, setShowShieldChoice] = useState(false);
  const [isShieldUsed, setIsShieldUsed] = useState(false);

  useEffect(() => {
    soundFx.setEngineState(false);
    return () => {
      soundFx.setEngineState(false);
    };
  }, []);

  useEffect(() => {
    if (!timerEnabled || isAnswered || showShieldChoice) return;

    if (timeLeft <= 0) {
      handleOptionSelect(-1);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerEnabled, isAnswered, timeLeft, showShieldChoice]);

  const handleOptionSelect = (index) => {
    if (isAnswered) return;
    setSelectedIndex(index);
    setIsAnswered(true);

    const isCorrect = index === question.correctIndex;
    if (isCorrect) {
      soundFx.playCorrect();
      setTimeout(() => {
        onAnswer(true, false);
      }, 1800);
    } else {
      soundFx.playWrong();
      if (powerUps?.mathShields > 0) {
        setShowShieldChoice(true);
      } else {
        setTimeout(() => {
          onAnswer(false, false);
        }, 1800);
      }
    }
  };

  const handleActivateShield = () => {
    if (onUsePowerUp) {
      onUsePowerUp('mathShields');
    }
    soundFx.playCheckpoint();
    setShowShieldChoice(false);
    setIsShieldUsed(true);

    setTimeout(() => {
      onAnswer(false, true);
    }, 1200);
  };

  const handleSkipShield = () => {
    setShowShieldChoice(false);
    setTimeout(() => {
      onAnswer(false, false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md select-none overflow-y-auto">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white border-4 border-[#FF0080] rounded-3xl p-4 sm:p-8 shadow-2xl relative my-auto scrollbar-thin"
      >
        <div className="flex items-center justify-between gap-2 border-b-2 border-slate-200 pb-3 sm:pb-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#00F5D4] border-2 border-[#00BB9F] flex items-center justify-center text-[#006E5D] shrink-0">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#FF0080] block">
                Checkpoint {checkpointNumber} / {totalCheckpoints}
              </span>
              <h3 className="text-xs sm:text-base font-black text-[#1B4332] truncate">
                Topic: {question.topic}
              </h3>
            </div>
          </div>

          {timerEnabled && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFCC00] border-2 border-[#C29B00] text-[#6B5600] font-black text-xs sm:text-sm shadow shrink-0">
              <Clock className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>
          )}
        </div>

        <div className="bg-slate-50 border-3 sm:border-4 border-[#00B4D8] rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6 text-center shadow-md">
          <p className="text-base sm:text-2xl font-black text-[#1B4332] leading-relaxed break-words hyphens-auto">
            {question.question}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-4 sm:mb-6">
          {question.answers.map((ans, idx) => {
            const option3DStyles = [
              'bg-[#00F5D4] border-b-[6px] border-[#00BB9F] text-[#006E5D]',
              'bg-[#FFCC00] border-b-[6px] border-[#C29B00] text-[#6B5600]',
              'bg-[#00B4D8] border-b-[6px] border-[#007791] text-white',
              'bg-[#FF0080] border-b-[6px] border-[#B8005C] text-white',
            ];

            let btnStyle = option3DStyles[idx % option3DStyles.length];

            if (isAnswered) {
              if (idx === question.correctIndex) {
                btnStyle = 'bg-[#00F5D4] border-b-[6px] border-[#00BB9F] text-[#006E5D] font-black ring-4 ring-[#00F5D4]/50 scale-102';
              } else if (idx === selectedIndex) {
                btnStyle = 'bg-rose-500 border-b-[6px] border-rose-700 text-white font-black opacity-80';
              } else {
                btnStyle = 'bg-slate-100 border-b-[4px] border-slate-300 text-slate-400 opacity-40';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleOptionSelect(idx)}
                className={`py-3 sm:py-4 px-3.5 sm:px-5 rounded-2xl font-black text-xs sm:text-lg transition-all shadow-lg active:border-b-0 active:translate-y-[6px] cursor-pointer flex items-center justify-between text-left break-words hyphens-auto leading-snug min-w-0 ${btnStyle}`}
              >
                <span className="pr-2 break-words hyphens-auto min-w-0 flex-1">{ans}</span>
                {isAnswered && idx === question.correctIndex && (
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#006E5D] shrink-0" />
                )}
                {isAnswered && idx === selectedIndex && idx !== question.correctIndex && (
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Math Shield Activation Modal Prompt */}
        {showShieldChoice && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-amber-100 to-yellow-100 border-4 border-[#F59E0B] space-y-3 shadow-xl mb-4 text-slate-900"
          >
            <div className="flex items-center gap-2 text-[#B45309]">
              <ShieldCheck className="w-6 h-6 text-[#F59E0B] animate-bounce shrink-0" />
              <h4 className="font-black text-xs sm:text-sm uppercase break-words">
                USE MATH SHIELD TO PROTECT COINS?
              </h4>
            </div>
            <p className="text-xs font-bold text-slate-800 leading-relaxed break-words">
              You answered incorrectly! Use a <strong className="text-[#B45309]">Math Shield (x{powerUps.mathShields})</strong> to protect your total coins from deduction and avoid a spinout!
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 pt-1">
              <button
                onClick={handleActivateShield}
                className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-[#00F5D4] hover:bg-[#00e2c4] border-b-4 border-[#00BB9F] text-[#006E5D] font-black text-xs sm:text-sm uppercase cursor-pointer shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Use Math Shield (x{powerUps.mathShields})</span>
              </button>
              <button
                onClick={handleSkipShield}
                className="w-full sm:w-auto py-2.5 px-4 rounded-2xl bg-slate-300 hover:bg-slate-400 text-slate-800 font-extrabold text-xs uppercase cursor-pointer transition-all"
              >
                Take Penalty (-20 Coins)
              </button>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {isAnswered && !showShieldChoice && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3.5 sm:p-4 rounded-2xl flex items-center justify-between gap-2 sm:gap-3 font-black border-2 shadow-md ${
                selectedIndex === question.correctIndex
                  ? 'bg-emerald-100 border-emerald-500 text-[#1B4332]'
                  : isShieldUsed
                  ? 'bg-amber-100 border-amber-500 text-amber-950'
                  : 'bg-rose-100 border-rose-500 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {selectedIndex === question.correctIndex ? (
                  <>
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#00BB9F] shrink-0" />
                    <span className="uppercase text-[11px] sm:text-sm break-words min-w-0">Correct! Speed Boost + 30 Coins!</span>
                  </>
                ) : isShieldUsed ? (
                  <>
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#D97706] shrink-0" />
                    <span className="uppercase text-[11px] sm:text-sm break-words min-w-0">MATH SHIELD ACTIVATED! Coins Protected! 0 Coins Lost!</span>
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600 shrink-0" />
                    <span className="text-[11px] sm:text-sm break-words min-w-0">
                      {question.explanation || `Correct answer is ${question.answers[question.correctIndex]}`}
                    </span>
                  </>
                )}
              </div>
              <div
                className={`flex items-center gap-1 font-black px-2.5 py-1 rounded-full border shrink-0 text-xs sm:text-sm ${
                  selectedIndex === question.correctIndex
                    ? 'text-[#6B5600] bg-[#FFCC00] border-[#C29B00]'
                    : isShieldUsed
                    ? 'text-[#006E5D] bg-[#00F5D4] border-[#00BB9F]'
                    : 'text-rose-900 bg-rose-200 border-rose-400'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>
                  {selectedIndex === question.correctIndex
                    ? '+30'
                    : isShieldUsed
                    ? '0'
                    : '-20'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
