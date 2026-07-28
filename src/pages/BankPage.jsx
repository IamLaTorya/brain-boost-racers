import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Landmark,
  PiggyBank,
  Wallet,
  TrendingUp,
  ArrowRightLeft,
  Award,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  History,
  BookOpen,
  X,
  Coins,
  ChevronRight,
} from 'lucide-react';
import { soundFx } from '../utils/sound';

export const BankPage = ({
  playerData,
  onUpdatePlayerData,
  onNavigate,
}) => {
  const [transferAmount, setTransferAmount] = useState(25);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [goalInput, setGoalInput] = useState(
    playerData.bankAccount?.savingsGoal || 300
  );

  const [showLearnModal, setShowLearnModal] = useState(
    !playerData.bankAccount?.hasCompletedLesson
  );
  const [learnStep, setLearnStep] = useState(0);

  const grade = playerData.selectedGrade || 'K-2';
  const savings = playerData.bankAccount?.savingsBalance || 0;
  const checking = playerData.coins || 0;
  const totalInterest = playerData.bankAccount?.totalInterestEarned || 0;
  const goal = playerData.bankAccount?.savingsGoal || 300;
  const transactions = playerData.bankAccount?.transactions || [];

  // Grade-Specific Interest Rates & Kid-Friendly Lesson Content
  let interestRatePct = 5;
  let gradeLevelTitle = 'Piggy Bank Saver (Grade K-1)';
  let gradeConcept = 'Saving vs. Spending Basics';
  let interestKidAnalogy = 'Interest is a FREE BONUS GIFT COIN from the Bank Piggy! When you keep coins in the bank, the Bank Piggy gives you extra bonus coins after every race!';

  if (grade === '3-5') {
    interestRatePct = 8;
    gradeLevelTitle = 'Smart Budgeting & Interest (Grade 3-5)';
    gradeConcept = 'Earning Interest & Planning Ahead';
    interestKidAnalogy = 'Interest is like planting a Coin Seed in a bank garden! If you plant 100 coins in Savings, the bank gives you 8 free bonus coins every race as your plant grows!';
  } else if (grade === '6-8') {
    interestRatePct = 10;
    gradeLevelTitle = 'Compound Growth & Investing (Grade 6-8)';
    gradeConcept = 'Compound Interest & Financial Independence';
    interestKidAnalogy = 'Interest is Compound Money Magic! When the bank pays you bonus coins on your savings, those bonus coins earn their OWN bonus coins in future races!';
  }

  const handleStartBank = () => {
    soundFx.playVictory();
    setShowLearnModal(false);
    onUpdatePlayerData((prev) => ({
      ...prev,
      bankAccount: {
        ...prev.bankAccount,
        hasCompletedLesson: true,
      },
    }));
  };

  // Grade-Specific Financial Literacy Quizzes
  const quizDataByGrade = {
    'K-2': {
      question: 'You won 40 coins in a race! What is the best thing to do?',
      options: [
        { text: 'Put 20 coins in Savings to earn interest, keep 20 for shop items', correct: true },
        { text: 'Spend all 40 coins immediately on temporary stickers', correct: false },
        { text: 'Throw away the coins', correct: false },
      ],
      explanation: 'Great job! Saving half your earnings lets your money grow while leaving cash for fun items!',
    },
    '3-5': {
      question: 'Why is keeping money in a Savings Account better than holding cash in your pocket?',
      options: [
        { text: 'The bank pays you Interest, so your balance increases over time!', correct: true },
        { text: 'Money in savings automatically vanishes', correct: false },
        { text: 'You can only spend cash on rainy days', correct: false },
      ],
      explanation: 'Awesome! Bank Interest pays you free extra coins just for keeping your money safe in Savings!',
    },
    '6-8': {
      question: 'What is Compound Interest?',
      options: [
        { text: 'Earning interest on your original savings PLUS interest on previous earnings!', correct: true },
        { text: 'A tax you pay when buying car parts', correct: false },
        { text: 'A penalty for keeping money in checking', correct: false },
      ],
      explanation: 'Spot on! Compound Interest creates exponential growth because your earnings earn their own earnings!',
    },
  };

  const currentQuiz = quizDataByGrade[grade] || quizDataByGrade['K-2'];

  const handleDeposit = (amt) => {
    soundFx.playButtonClick();
    const depositAmt = Math.min(checking, Math.max(1, amt));
    if (depositAmt <= 0) return;

    const newChecking = checking - depositAmt;
    const newSavings = savings + depositAmt;
    const newTx = {
      id: 'tx_' + Date.now(),
      type: 'deposit',
      amount: depositAmt,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      note: 'Deposited into Savings',
    };

    onUpdatePlayerData((prev) => ({
      ...prev,
      coins: newChecking,
      bankAccount: {
        ...prev.bankAccount,
        savingsBalance: newSavings,
        transactions: [newTx, ...(prev.bankAccount?.transactions || [])].slice(0, 15),
      },
    }));
    soundFx.playCorrect();
  };

  const handleWithdraw = (amt) => {
    soundFx.playButtonClick();
    const withdrawAmt = Math.min(savings, Math.max(1, amt));
    if (withdrawAmt <= 0) return;

    const newSavings = savings - withdrawAmt;
    const newChecking = checking + withdrawAmt;
    const newTx = {
      id: 'tx_' + Date.now(),
      type: 'withdraw',
      amount: withdrawAmt,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      note: 'Withdrawn to Checking',
    };

    onUpdatePlayerData((prev) => ({
      ...prev,
      coins: newChecking,
      bankAccount: {
        ...prev.bankAccount,
        savingsBalance: newSavings,
        transactions: [newTx, ...(prev.bankAccount?.transactions || [])].slice(0, 15),
      },
    }));
    soundFx.playCorrect();
  };

  const handleUpdateGoal = () => {
    soundFx.playButtonClick();
    const val = Math.max(50, parseInt(goalInput) || 300);
    onUpdatePlayerData((prev) => ({
      ...prev,
      bankAccount: {
        ...prev.bankAccount,
        savingsGoal: val,
      },
    }));
  };

  const handleQuizSelect = (idx) => {
    if (quizCompleted) return;
    soundFx.playButtonClick();
    setSelectedQuizAnswer(idx);

    const isCorrect = currentQuiz.options[idx].correct;
    if (isCorrect) {
      soundFx.playVictory();
      setQuizCompleted(true);
      // Award +20 coins into Savings
      const rewardTx = {
        id: 'tx_quiz_' + Date.now(),
        type: 'interest',
        amount: 20,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        note: 'Financial Genius Quiz Reward!',
      };

      onUpdatePlayerData((prev) => ({
        ...prev,
        bankAccount: {
          ...prev.bankAccount,
          savingsBalance: prev.bankAccount.savingsBalance + 20,
          transactions: [rewardTx, ...(prev.bankAccount?.transactions || [])].slice(0, 15),
        },
      }));
    } else {
      soundFx.playWrong();
    }
  };

  const progressPct = Math.min(100, Math.round((savings / goal) * 100));

  return (
    <div className="min-h-screen bg-slate-900 text-white p-3 sm:p-6 pb-20">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 bg-gradient-to-r from-[#00B4D8] to-[#007791] p-3.5 sm:p-6 rounded-3xl border-4 border-white/30 shadow-2xl overflow-hidden">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-[#FFCC00] border-2 sm:border-4 border-white flex items-center justify-center text-[#6B5600] shadow-xl shrink-0">
              <Landmark className="w-6 h-6 sm:w-10 sm:h-10" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-3xl md:text-4xl font-black italic tracking-tight text-white drop-shadow-md leading-tight break-words">
                RACER MATH BANK
              </h1>
              <p className="text-[11px] sm:text-sm font-bold text-[#FFCC00] uppercase tracking-wider flex items-center gap-1.5 mt-0.5 break-words min-w-0">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00F5D4] shrink-0" />
                <span className="break-words min-w-0">{gradeLevelTitle}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 self-stretch sm:self-center w-full sm:w-auto">
            <button
              onClick={() => {
                soundFx.playButtonClick();
                setLearnStep(0);
                setShowLearnModal(true);
              }}
              className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-[#FFCC00] hover:bg-[#ffd11a] border-2 border-white text-[#6B5600] font-black text-xs sm:text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4 text-[#6B5600] shrink-0" />
              <span>📚 Let's Learn Banking!</span>
            </button>

            <button
              onClick={() => {
                soundFx.playButtonClick();
                onNavigate('shop');
              }}
              className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-[#FF0080] hover:bg-[#D9006C] border-2 border-white text-white font-black text-xs sm:text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <span>Visit Shop</span>
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>

        {/* Bank Balances Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Checking Account (Spending) */}
          <div className="p-5 rounded-3xl bg-slate-800/90 border-4 border-[#00B4D8] shadow-xl space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-[#00B4D8]" />
                Checking Account
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#00B4D8]/20 text-[#00B4D8] text-[10px] font-black uppercase">
                Ready to Spend
              </span>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-[#00F5D4]">
                ${checking}
              </span>
              <span className="text-xs font-bold text-slate-400">Coins</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Use checking coins for immediate shop items, power-ups, and lucky wheel spins!
            </p>
          </div>

          {/* Savings Account (Interest Vault) */}
          <div className="p-5 rounded-3xl bg-slate-800/90 border-4 border-[#FFCC00] shadow-xl space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                <PiggyBank className="w-4 h-4 text-[#FFCC00]" />
                Savings Vault
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#FFCC00]/20 text-[#FFCC00] text-[10px] font-black uppercase">
                +{interestRatePct}% Interest/Race
              </span>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-[#FFCC00]">
                ${savings}
              </span>
              <span className="text-xs font-bold text-slate-400">Coins</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Earns <strong className="text-[#FFCC00]">{interestRatePct}% compound interest</strong> automatically after every race!
            </p>
          </div>

          {/* Interest Stats Card */}
          <div className="p-5 rounded-3xl bg-slate-800/90 border-4 border-[#FF0080] shadow-xl space-y-3">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#FF0080]" />
                Interest Earnings
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#FF0080]/20 text-[#FF0080] text-[10px] font-black uppercase">
                Free Money
              </span>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-black text-[#FF0080]">
                +${totalInterest}
              </span>
              <span className="text-xs font-bold text-slate-400">Total Earned</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Financial literacy rule: Money saved generates passive compound income over time!
            </p>
          </div>
        </div>

        {/* Transfer Station: Deposit & Withdraw */}
        <div className="p-6 rounded-3xl bg-slate-800 border-4 border-slate-700 shadow-2xl space-y-5">
          <div className="flex items-center gap-2 border-b-2 border-slate-700 pb-3">
            <ArrowRightLeft className="w-6 h-6 text-[#00F5D4]" />
            <h2 className="text-xl font-black italic text-white uppercase tracking-tight">
              Deposit & Withdraw Transfer Station
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Actions & Transfer Controls */}
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                Transfer Amount: <span className="text-[#00F5D4] text-lg font-black ml-1">${transferAmount}</span> Coins
              </label>

              <div className="flex items-center gap-2">
                {[10, 25, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setTransferAmount(amt)}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs border-2 transition-all cursor-pointer ${
                      transferAmount === amt
                        ? 'bg-[#00F5D4] text-[#006E5D] border-white scale-105'
                        : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              <input
                type="range"
                min="5"
                max={Math.max(100, Math.max(checking, savings))}
                step="5"
                value={transferAmount}
                onChange={(e) => setTransferAmount(parseInt(e.target.value) || 5)}
                className="w-full accent-[#00F5D4] cursor-pointer"
              />

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleDeposit(transferAmount)}
                  disabled={checking < transferAmount}
                  className={`flex-1 py-3 px-4 rounded-2xl font-black text-sm uppercase shadow-lg border-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    checking >= transferAmount
                      ? 'bg-[#10B981] hover:bg-[#059669] border-white text-white'
                      : 'bg-slate-700 text-slate-500 border-slate-600 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <span>Deposit to Savings</span>
                  <PiggyBank className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleWithdraw(transferAmount)}
                  disabled={savings < transferAmount}
                  className={`flex-1 py-3 px-4 rounded-2xl font-black text-sm uppercase shadow-lg border-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    savings >= transferAmount
                      ? 'bg-[#00B4D8] hover:bg-[#007791] border-white text-white'
                      : 'bg-slate-700 text-slate-500 border-slate-600 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <span>Withdraw to Checking</span>
                  <Wallet className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Compound Interest Simulator Preview */}
            <div className="p-4 rounded-2xl bg-slate-900 border-2 border-[#FFCC00]/40 flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-2 text-[#FFCC00]">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="font-black text-xs uppercase tracking-wider">
                  Future Interest Growth Preview
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Current Savings Balance:</span>
                  <strong className="text-white">${savings} Coins</strong>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Estimated Interest After 1 Race:</span>
                  <strong className="text-[#00F5D4]">
                    +${Math.max(1, Math.floor(savings * (interestRatePct / 100)))} Coins
                  </strong>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Estimated Interest After 5 Races:</span>
                  <strong className="text-[#FF0080]">
                    +${Math.max(5, Math.floor(savings * Math.pow(1 + interestRatePct / 100, 5) - savings))} Coins
                  </strong>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                💡 Tip: The more coins you deposit into Savings, the bigger your compound interest payouts will be!
              </p>
            </div>
          </div>
        </div>

        {/* Savings Goal Tracker */}
        <div className="p-6 rounded-3xl bg-slate-800 border-4 border-[#FF0080] shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-[#FF0080]" />
              <div>
                <h2 className="text-xl font-black italic text-white uppercase tracking-tight">
                  Financial Savings Goal
                </h2>
                <p className="text-xs text-slate-400">
                  Set a savings target to learn goal-oriented budgeting!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="w-24 px-3 py-1.5 rounded-xl bg-slate-900 border-2 border-slate-600 text-white font-black text-sm text-center"
              />
              <button
                onClick={handleUpdateGoal}
                className="px-3 py-1.5 rounded-xl bg-[#FF0080] hover:bg-[#D9006C] text-white font-black text-xs uppercase shadow-md cursor-pointer"
              >
                Set Goal
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-black">
              <span className="text-slate-300">Goal Progress: ${savings} / ${goal} Coins</span>
              <span className="text-[#FF0080]">{progressPct}% Reached</span>
            </div>

            <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden p-1 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-[#FF0080] to-[#FFCC00] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {progressPct >= 100 && (
              <div className="p-3 rounded-2xl bg-[#FFCC00]/20 border-2 border-[#FFCC00] text-[#FFCC00] font-black text-xs flex items-center gap-2 animate-bounce mt-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>CONGRATULATIONS! You achieved your savings goal! You are a certified Financial Master!</span>
              </div>
            )}
          </div>
        </div>

        {/* Grade-Aligned Financial Literacy Quiz Challenge */}
        <div className="p-6 rounded-3xl bg-slate-800 border-4 border-[#00F5D4] shadow-2xl space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-slate-700 pb-3">
            <HelpCircle className="w-6 h-6 text-[#00F5D4]" />
            <div>
              <h2 className="text-xl font-black italic text-white uppercase tracking-tight">
                Grade {grade} Financial Literacy Challenge
              </h2>
              <p className="text-xs text-[#00F5D4] font-bold">
                Answer correctly to earn +20 Bonus Coins deposited directly into Savings!
              </p>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-100 bg-slate-900 p-4 rounded-2xl border border-slate-700">
            {currentQuiz.question}
          </p>

          <div className="space-y-2">
            {currentQuiz.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuizSelect(idx)}
                disabled={quizCompleted}
                className={`w-full p-3.5 rounded-2xl text-left font-bold text-xs sm:text-sm border-2 transition-all flex items-center justify-between gap-3 ${
                  selectedQuizAnswer === idx
                    ? opt.correct
                      ? 'bg-[#10B981] border-white text-white'
                      : 'bg-[#EF4444] border-white text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-[#00F5D4]'
                }`}
              >
                <span>{opt.text}</span>
                {selectedQuizAnswer === idx && (
                  opt.correct ? (
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                  ) : (
                    <span className="text-white text-xs font-black uppercase shrink-0">Incorrect</span>
                  )
                )}
              </button>
            ))}
          </div>

          {quizCompleted && (
            <div className="p-4 rounded-2xl bg-[#10B981]/20 border-2 border-[#10B981] text-[#10B981] text-xs font-bold space-y-1">
              <div className="flex items-center gap-2 font-black text-sm text-white">
                <Sparkles className="w-4 h-4 text-[#FFCC00]" />
                <span>Correct! +20 Coins added to Savings!</span>
              </div>
              <p>{currentQuiz.explanation}</p>
            </div>
          )}
        </div>

        {/* Transaction Log */}
        <div className="p-6 rounded-3xl bg-slate-800 border-4 border-slate-700 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-slate-700 pb-3">
            <History className="w-6 h-6 text-[#FFCC00]" />
            <h2 className="text-xl font-black italic text-white uppercase tracking-tight">
              Bank Transaction History
            </h2>
          </div>

          {transactions.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No transactions recorded yet.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                        tx.type === 'deposit' || tx.type === 'interest'
                          ? 'bg-[#10B981]/20 text-[#10B981]'
                          : 'bg-[#FF0080]/20 text-[#FF0080]'
                      }`}
                    >
                      $
                    </div>
                    <div>
                      <span className="font-bold text-slate-200 block">{tx.note}</span>
                      <span className="text-[10px] text-slate-500">{tx.date}</span>
                    </div>
                  </div>

                  <span
                    className={`font-black text-sm ${
                      tx.type === 'deposit' || tx.type === 'interest'
                        ? 'text-[#10B981]'
                        : 'text-[#FF0080]'
                    }`}
                  >
                    {tx.type === 'deposit' || tx.type === 'interest' ? '+' : '-'}${tx.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interactive "Let's Learn Banking" Kid Storybook Modal */}
      <AnimatePresence>
        {showLearnModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="w-full max-w-xl bg-slate-900 border-4 border-[#FFCC00] rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 text-white overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-700 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFCC00] text-[#6B5600] flex items-center justify-center font-black text-2xl border-2 border-white shadow">
                    🏦
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#00F5D4] tracking-widest block">
                      Grade {grade} Financial Storybook
                    </span>
                    <h3 className="text-xl font-black italic uppercase text-white leading-tight">
                      Let's Learn Banking!
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundFx.playButtonClick();
                    setShowLearnModal(false);
                  }}
                  className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Step Indicators */}
              <div className="flex items-center gap-2">
                {[0, 1, 2].map((stepIdx) => (
                  <div
                    key={stepIdx}
                    className={`flex-1 h-2 rounded-full transition-all ${
                      learnStep === stepIdx
                        ? 'bg-[#FFCC00]'
                        : learnStep > stepIdx
                        ? 'bg-[#00F5D4]'
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>

              {/* Step Content */}
              {learnStep === 0 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-slate-800 border-2 border-[#00B4D8] space-y-3">
                    <h4 className="font-black text-base text-[#00F5D4] uppercase flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-[#00B4D8]" />
                      <span>1. Spending Wallet vs. Savings Vault</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      When you win coins in a race, they go into your <strong>Spending Wallet (Checking)</strong> to buy cars, hats, and wheel trims.
                    </p>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-amber-200">
                      💡 But when you put coins into your <strong>Savings Vault</strong>, the bank guards them AND pays you <strong>FREE BONUS COINS</strong>!
                    </div>
                  </div>
                </div>
              )}

              {learnStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-slate-800 border-2 border-[#FFCC00] space-y-3">
                    <h4 className="font-black text-base text-[#FFCC00] uppercase flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#FFCC00]" />
                      <span>2. What is Interest?</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-700">
                      {interestKidAnalogy}
                    </p>
                    <div className="p-3 rounded-xl bg-[#FFCC00]/10 border border-[#FFCC00] text-xs text-[#FFCC00] font-black">
                      📊 Grade {grade} Interest Rate: +{interestRatePct}% Bonus Coins after every race you complete!
                    </div>
                  </div>
                </div>
              )}

              {learnStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900/60 to-slate-800 border-2 border-[#00F5D4] space-y-3">
                    <h4 className="font-black text-base text-[#00F5D4] uppercase flex items-center gap-2">
                      <Award className="w-5 h-5 text-[#00F5D4]" />
                      <span>3. Ready to Start Your Bank Account?</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      Your Bank Vault currently holds <strong>${savings} Coins</strong>! Keep depositing your race rewards into Savings to see your balance grow automatically!
                    </p>
                  </div>
                </div>
              )}

              {/* Modal Navigation Buttons */}
              <div className="flex items-center justify-between pt-2">
                {learnStep > 0 ? (
                  <button
                    onClick={() => {
                      soundFx.playButtonClick();
                      setLearnStep((prev) => prev - 1);
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs uppercase cursor-pointer"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {learnStep < 2 ? (
                  <button
                    onClick={() => {
                      soundFx.playButtonClick();
                      setLearnStep((prev) => prev + 1);
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-[#00F5D4] hover:bg-[#00e2c4] text-[#006E5D] font-black text-xs uppercase cursor-pointer shadow-lg flex items-center gap-1.5"
                  >
                    <span>Next Lesson</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleStartBank}
                    className="px-6 py-3 rounded-2xl bg-[#FFCC00] hover:bg-[#ffd11a] text-[#6B5600] font-black text-sm uppercase cursor-pointer shadow-xl border-2 border-white flex items-center gap-2 animate-bounce"
                  >
                    <Sparkles className="w-5 h-5 text-[#6B5600]" />
                    <span>🚀 START MY BANK ACCOUNT NOW!</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
