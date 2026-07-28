import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, XCircle, HelpCircle, Trophy, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getHarderTurboQuestions } from '../utils/mathGenerator';
import { soundFx } from '../utils/sound';

export const TurboSpeedModal = ({
  grade,
  onCompleteTurbo,
  onSkipTurbo,
}) => {
  const harderQuestions = useMemo(() => getHarderTurboQuestions(grade), [grade]);
  const [qIndex, setQIndex] = useState(0);
  const currentQuestion = harderQuestions[qIndex % harderQuestions.length];

  const [phase, setPhase] = useState('prompt');
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    soundFx.setEngineState(false);
    return () => {
      soundFx.setEngineState(false);
    };
  }, []);

  const handleSelectAnswer = (index) => {
    if (selectedAnswerIdx !== null) return;
    setSelectedAnswerIdx(index);
    const correct = index === currentQuestion.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      soundFx.playVictory();
    } else {
      soundFx.playWrong();
    }

    setPhase('feedback');
  };

  const handleClaimReward = () => {
    soundFx.playButtonClick();
    onCompleteTurbo(50);
  };

  const handleTryNextQuestion = () => {
    soundFx.playButtonClick();
    setSelectedAnswerIdx(null);
    setQIndex((prev) => prev + 1);
    setPhase('question');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md select-none overflow-y-auto">
      <AnimatePresence mode="wait">
        {phase === 'prompt' && (
          <motion.div
            key="prompt"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-full max-w-lg max-h-[92vh] overflow-y-auto bg-gradient-to-b from-[#1E1B4B] to-[#0F172A] border-4 border-[#FF0080] rounded-3xl p-4 sm:p-8 text-center shadow-2xl space-y-4 sm:space-y-5 text-white my-auto"
          >
            <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-[#FF0080] border-4 border-[#FFCC00] flex items-center justify-center text-2xl sm:text-4xl shadow-xl animate-bounce">
              ⭐
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-[#FFCC00] text-slate-950 font-black text-[10px] sm:text-xs uppercase tracking-widest">
                Checkpoints Cleared!
              </span>
              <h2 className="text-lg sm:text-3xl font-black text-[#00F5D4] italic uppercase tracking-wider break-words">
                MATH & FINANCE BONUS ROUND!
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-300 leading-relaxed break-words">
                Answer a <strong className="text-[#FFCC00]">BONUS MATH & FINANCIAL LITERACY</strong> challenge question to earn <strong className="text-[#00F5D4]">+50 BONUS COINS!</strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-2">
              <button
                onClick={() => {
                  soundFx.playButtonClick();
                  setPhase('question');
                  setSelectedAnswerIdx(null);
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#FF0080] hover:bg-[#ff1a8c] border-b-4 border-[#B8005C] text-white font-black text-xs sm:text-base uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-105"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFCC00]" />
                <span>ACCEPT BONUS CHALLENGE!</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playButtonClick();
                  onSkipTurbo();
                }}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border-b-4 border-slate-900 text-slate-300 font-bold text-xs sm:text-sm uppercase transition-all cursor-pointer"
              >
                Skip to Results
              </button>
            </div>
          </motion.div>
        )}

        {phase === 'question' && (
          <motion.div
            key="question"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg max-h-[92vh] overflow-y-auto bg-gradient-to-b from-[#1E293B] to-[#0F172A] border-4 border-[#FFCC00] rounded-3xl p-4 sm:p-8 text-center shadow-2xl space-y-4 text-white my-auto"
          >
            <div className="flex items-center justify-between bg-slate-900/90 px-3 py-2 rounded-2xl border border-slate-700 text-xs font-black gap-2">
              <span className="text-[#FFCC00] uppercase tracking-wider flex items-center gap-1 shrink-0">
                <Sparkles className="w-4 h-4 text-[#FF0080]" />
                Bonus Question
              </span>
              <span className="text-[#00F5D4] uppercase truncate">{currentQuestion.topic}</span>
            </div>

            <h3 className="text-base sm:text-2xl font-black text-white leading-relaxed break-words hyphens-auto">
              {currentQuestion.question}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {currentQuestion.answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  className="p-3 sm:p-3.5 rounded-2xl bg-slate-800/90 hover:bg-[#FF0080] border-2 border-slate-600 hover:border-white text-white font-bold text-xs sm:text-sm text-left transition-all cursor-pointer shadow-md flex items-center justify-between gap-2 break-words hyphens-auto min-w-0"
                >
                  <span className="break-words hyphens-auto min-w-0 flex-1">{answer}</span>
                  <HelpCircle className="w-4 h-4 opacity-50 shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'feedback' && (
          <motion.div
            key="feedback"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl p-4 sm:p-8 text-center shadow-2xl space-y-4 text-white my-auto border-4 ${
              isCorrect ? 'bg-gradient-to-b from-[#1B4332] to-[#0F172A] border-[#00F5D4]' : 'bg-gradient-to-b from-[#450A0A] to-[#0F172A] border-[#FF0080]'
            }`}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto flex items-center justify-center">
              {isCorrect ? (
                <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-[#FFCC00] animate-bounce" />
              ) : (
                <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-[#FF0080] animate-pulse" />
              )}
            </div>

            <div className="space-y-2">
              <h3 className={`text-xl sm:text-2xl font-black uppercase italic ${isCorrect ? 'text-[#00F5D4]' : 'text-[#FF0080]'}`}>
                {isCorrect ? 'EXCELLENT! BONUS REWARD UNLOCKED!' : 'NOT QUITE RIGHT!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 font-semibold bg-slate-900/60 p-3 rounded-2xl border border-white/10 break-words leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>

            {isCorrect ? (
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-2xl bg-[#FFCC00]/20 border-2 border-[#FFCC00] flex items-center justify-center gap-2 font-black text-[#FFCC00]">
                  <Coins className="w-5 h-5 text-[#FFCC00]" />
                  <span className="text-sm sm:text-base">+50 BONUS COINS ADDED!</span>
                </div>
                <button
                  onClick={handleClaimReward}
                  className="w-full py-3.5 rounded-2xl bg-[#00F5D4] hover:bg-[#12fcdb] text-[#005245] border-b-4 border-[#00BB9F] font-black text-xs sm:text-base uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl hover:scale-105"
                >
                  <span>CLAIM REWARD & VIEW RESULTS</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                <button
                  onClick={handleTryNextQuestion}
                  className="w-full sm:flex-1 py-3.5 rounded-2xl bg-[#FF0080] hover:bg-[#ff1a8c] text-white border-b-4 border-[#B8005C] font-black text-xs sm:text-sm uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl"
                >
                  <span>TRY ANOTHER QUESTION</span>
                </button>
                <button
                  onClick={() => {
                    soundFx.playButtonClick();
                    onSkipTurbo();
                  }}
                  className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border-b-4 border-slate-900 text-slate-300 font-bold text-xs uppercase cursor-pointer"
                >
                  Continue to Results
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const BonusRoundModal = TurboSpeedModal;
