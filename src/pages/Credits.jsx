import React from 'react';
import { ArrowLeft, Award, ShieldCheck, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/sound';

export const Credits = ({ onNavigate }) => {
  return (
    <div className="min-h-[calc(100vh-64px)] max-w-3xl mx-auto p-4 sm:p-6 space-y-6 select-none">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/95 border-4 border-[#00B4D8] p-4 sm:p-6 rounded-3xl shadow-xl backdrop-blur-md">
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

        <h2 className="text-2xl sm:text-3xl font-black text-[#1B4332] italic uppercase">
          Credits & Educational Info
        </h2>

        <div className="w-24 hidden sm:block"></div>
      </div>

      <div className="bg-white/95 border-4 border-[#FF0080] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md">
        <div className="text-center space-y-2 border-b-2 border-slate-200 pb-6">
          <h3 className="text-3xl font-black text-[#1B4332] italic">BRAIN BOOST RACERS</h3>
          <p className="text-xs font-black text-[#FF0080] uppercase tracking-widest">
            Race • Learn • Earn • Customize
          </p>
          <p className="text-xs font-bold text-slate-500">
            Version 1.0.0 (Beach Track Edition)
          </p>

          <div className="pt-4 text-xs font-bold text-slate-600 space-y-1">
            <p>Created by LaTorya Hoyle-Sadler</p>
            <p className="text-[#00B4D8]">A ToyMind Interactive Experience</p>
            <p>© 2026 ToyMind Interactive. All Rights Reserved.</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border-2 border-[#FFD166] space-y-2 shadow-sm">
          <h4 className="font-black text-[#FFB703] flex items-center gap-2 uppercase">
            <Sparkles className="w-5 h-5 text-[#FFB703]" />
            <span>Inspired by Young Creators</span>
          </h4>

          <p className="text-xs text-slate-600 leading-relaxed font-semibold">
            Brain Boost Racers was inspired by the creativity and ideas of kids,
            <strong> Jacolby</strong> and <strong>Jaliyah</strong>, who helped
            shape the vision of combining racing, math challenges, and financial
            literacy into a fun learning experience.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border-2 border-[#9B5DE5] space-y-2 shadow-sm">
          <h4 className="font-black text-[#9B5DE5] flex items-center gap-2 uppercase">
            <Sparkles className="w-5 h-5 text-[#9B5DE5]" />
            <span>AI-Assisted Development</span>
          </h4>

          <p className="text-xs text-slate-600 leading-relaxed font-semibold">
            Brain Boost Racers was brought to life through a creative development
            process using AI tools as collaborative assistants. ChatGPT supported
            brainstorming, game design planning, architecture decisions, and
            troubleshooting. Google AI Studio was used during prototyping, testing,
            debugging, and iterative refinement. All creative direction, final
            implementation choices, and project decisions were guided by LaTorya
            Hoyle-Sadler.
          </p>
        </div>

        <div className="space-y-4 text-sm text-slate-700 font-semibold">
          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-[#00B4D8] space-y-2 shadow-sm">
            <h4 className="font-black text-[#00B4D8] flex items-center gap-2 uppercase">
              <Award className="w-5 h-5 text-[#00B4D8]" />
              <span>Target Audience & Curriculum Standard</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              Brain Boost Racers is designed for students in grades K–8, parents, teachers, and homeschool families. Math questions are aligned with core math curriculum standards including addition, subtraction, multiplication, fractions, geometry, place value, and pre-algebra.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-[#00BB9F] space-y-2 shadow-sm">
            <h4 className="font-black text-[#00BB9F] flex items-center gap-2 uppercase">
              <ShieldCheck className="w-5 h-5 text-[#00BB9F]" />
              <span>Safe Educational Experience</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              100% offline-ready with local browser storage. No accounts required, no online tracking, no ads, and strictly zero pay-to-win mechanics. Coins are earned purely through gameplay and math checkpoint mastery!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-[#FF0080] space-y-2 shadow-sm">
            <h4 className="font-black text-[#FF0080] flex items-center gap-2 uppercase">
              <Sparkles className="w-5 h-5 text-[#FF0080]" />
              <span>Built with Modern Web Tech</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              Built using React 19, Phaser 3 Game Engine, JavaScript, Web Audio API Sound Generation, and Tailwind CSS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
