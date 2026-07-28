import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, ShoppingBag, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/sound';
import { CarCanvas } from '../components/CarCanvas';

export const CarSelect = ({
  playerData,
  onSelectCar,
  onNavigate,
}) => {
  const cars = [
    {
      id: 'blue',
      name: 'Cobalt Speedster',
      description: 'Ultra slick aerodynamic blue chassis.',
      speedTag: 'Balanced Acceleration',
      borderColor: 'border-[#00B4D8]',
      tagBg: 'bg-[#00B4D8] text-white',
    },
    {
      id: 'red',
      name: 'Crimson Flame',
      description: 'Fiery high-octane red racer body.',
      speedTag: 'Top Speed Turbo',
      borderColor: 'border-[#FF0080]',
      tagBg: 'bg-[#FF0080] text-white',
    },
    {
      id: 'green',
      name: 'Emerald Nitro',
      description: 'Lime green eco-boost racer.',
      speedTag: 'Quick Handling',
      borderColor: 'border-[#00BB9F]',
      tagBg: 'bg-[#00BB9F] text-slate-950',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] max-w-5xl mx-auto p-4 sm:p-6 flex flex-col justify-center select-none">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white/90 backdrop-blur-md border-4 border-[#FF0080] p-4 sm:p-6 rounded-3xl shadow-xl">
        <button
          onClick={() => {
            soundFx.playButtonClick();
            onNavigate('grade_select');
          }}
          className="px-4 py-2 rounded-2xl bg-white border-b-4 border-[#E0E0E0] text-slate-700 font-extrabold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all cursor-pointer shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Grade Select</span>
        </button>

        <h2 className="text-2xl sm:text-4xl font-black text-[#1B4332] italic tracking-tight uppercase text-center">
          Choose Your Race Car
        </h2>

        <div className="w-24 hidden sm:block"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cars.map((c) => {
          const isSelected = playerData.selectedCar === c.id;

          return (
            <div
              key={c.id}
              onClick={() => {
                soundFx.playButtonClick();
                onSelectCar(c.id);
              }}
              className={`rounded-3xl bg-white/95 border-4 ${c.borderColor} p-6 flex flex-col items-center text-center transition-all cursor-pointer shadow-2xl relative ${
                isSelected ? 'ring-4 ring-[#00F5D4] scale-102' : 'hover:scale-101'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <CheckCircle2 className="w-7 h-7 text-[#00BB9F] fill-[#00BB9F]/20" />
                </div>
              )}

              <div className="my-3 p-2 bg-slate-950/90 rounded-2xl border-2 border-slate-800 shadow-inner w-full flex items-center justify-center">
                <CarCanvas
                  carColor={c.id}
                  equipped={{ ...playerData.equippedCosmetics, carPaint: 'default' }}
                  width={210}
                  height={120}
                  animateWheels={isSelected}
                />
              </div>

              <h3 className="text-xl font-black text-[#1B4332] mb-1">{c.name}</h3>
              <span className={`px-3 py-0.5 rounded-full font-black text-[10px] uppercase mb-2 ${c.tagBg}`}>
                {c.speedTag}
              </span>
              <p className="text-xs font-semibold text-slate-600 mb-6">{c.description}</p>

              <button
                className={`w-full mt-auto py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 uppercase transition-all shadow-md ${
                  isSelected
                    ? 'bg-[#00F5D4] border-b-4 border-[#00BB9F] text-[#006E5D]'
                    : 'bg-slate-100 border-b-4 border-slate-300 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{isSelected ? 'Ready to Race' : 'Choose Car'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => {
            soundFx.playButtonClick();
            onNavigate('shop');
          }}
          className="h-16 px-6 rounded-3xl bg-[#FFCC00] border-b-[6px] border-[#C29B00] text-[#6B5600] font-black text-base uppercase flex items-center gap-2 hover:bg-[#ffd11a] active:border-b-0 active:translate-y-[6px] transition-all cursor-pointer shadow-xl"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Customize Paints in Shop</span>
        </button>

        <button
          onClick={() => {
            soundFx.playButtonClick();
            onNavigate('race');
          }}
          className="h-20 px-8 rounded-3xl bg-[#00F5D4] border-b-[8px] border-[#00BB9F] text-[#006E5D] font-black text-2xl uppercase tracking-wider shadow-2xl hover:bg-[#12fcdb] active:border-b-0 active:translate-y-[8px] transition-all flex items-center gap-3 cursor-pointer"
        >
          <Sparkles className="w-7 h-7 fill-[#006E5D]" />
          <span>Start Beach Race!</span>
        </button>
      </div>
    </div>
  );
};
