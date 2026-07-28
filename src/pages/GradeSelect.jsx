import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { soundFx } from '../utils/sound';

export const GradeSelect = ({
  playerData,
  onSelectGrade,
  onNavigate,
}) => {
  const grades = [
    {
      id: 'K-2',
      title: 'Kindergarten – Grade 2',
      subtitle: 'Early Math Explorers',
      topics: ['Addition & Subtraction', 'Counting & Numbers', 'Shapes & Coins', 'Simple Word Problems'],
      borderColor: 'border-[#00B4D8]',
      badgeBg: 'bg-[#00B4D8]',
      badgeText: 'text-white',
    },
    {
      id: '3-5',
      title: 'Grades 3 – 5',
      subtitle: 'Multiplication & Fractions',
      topics: ['Multiplication & Division', 'Fractions & Decimals', 'Place Value & Perimeter', 'Financial Literacy'],
      borderColor: 'border-[#FF0080]',
      badgeBg: 'bg-[#FF0080]',
      badgeText: 'text-white',
    },
    {
      id: '6-8',
      title: 'Grades 6 – 8',
      subtitle: 'Pre-Algebra & Ratios',
      topics: ['Pre-Algebra Equations', 'Percentages & Ratios', 'Order of Operations', 'Interest & Budgets'],
      borderColor: 'border-[#FFCC00]',
      badgeBg: 'bg-[#FFCC00]',
      badgeText: 'text-[#6B5600]',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] max-w-5xl mx-auto p-4 sm:p-6 flex flex-col justify-center select-none">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white/90 backdrop-blur-md border-4 border-[#00B4D8] p-4 sm:p-6 rounded-3xl shadow-xl">
        <button
          onClick={() => {
            soundFx.playButtonClick();
            onNavigate('home');
          }}
          className="px-4 py-2 rounded-2xl bg-white border-b-4 border-[#E0E0E0] text-slate-700 font-extrabold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all cursor-pointer shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>

        <h2 className="text-2xl sm:text-4xl font-black text-[#1B4332] italic tracking-tight uppercase text-center">
          Choose Your Math Level
        </h2>

        <div className="w-24 hidden sm:block"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {grades.map((g) => {
          const isSelected = playerData.selectedGrade === g.id;

          return (
            <div
              key={g.id}
              onClick={() => {
                soundFx.playButtonClick();
                onSelectGrade(g.id);
              }}
              className={`rounded-3xl bg-white/95 border-4 ${g.borderColor} p-6 flex flex-col justify-between transition-all cursor-pointer shadow-2xl relative ${
                isSelected ? 'ring-4 ring-[#00F5D4] scale-102' : 'hover:scale-101'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3.5 py-1 rounded-full font-black text-xs uppercase ${g.badgeBg} ${g.badgeText} shadow-md`}>
                    Grade {g.id}
                  </span>
                  {isSelected && <CheckCircle2 className="w-7 h-7 text-[#00BB9F] fill-[#00BB9F]/20" />}
                </div>

                <h3 className="text-xl font-black text-[#1B4332] mb-1">{g.title}</h3>
                <p className="text-xs font-bold text-slate-600 mb-4">{g.subtitle}</p>

                <div className="space-y-2 mb-6">
                  {g.topics.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Sparkles className="w-4 h-4 text-[#FF0080] shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 uppercase transition-all shadow-md ${
                  isSelected
                    ? 'bg-[#00F5D4] border-b-4 border-[#00BB9F] text-[#006E5D]'
                    : 'bg-slate-100 border-b-4 border-slate-300 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{isSelected ? 'Selected Level' : 'Select Level'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <button
          onClick={() => {
            soundFx.playButtonClick();
            onNavigate('car_select');
          }}
          className="h-20 px-8 rounded-3xl bg-[#00F5D4] border-b-[8px] border-[#00BB9F] text-[#006E5D] font-black text-2xl uppercase tracking-wider shadow-2xl hover:bg-[#12fcdb] active:border-b-0 active:translate-y-[8px] transition-all inline-flex items-center gap-3 cursor-pointer"
        >
          <span>Choose Your Race Car</span>
          <ArrowRight className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};
