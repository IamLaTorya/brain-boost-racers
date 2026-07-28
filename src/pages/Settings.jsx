import React, { useState } from 'react';
import { ArrowLeft, Volume2, VolumeX, Clock, Trash2, AlertTriangle, X } from 'lucide-react';
import { soundFx } from '../utils/sound';

export const Settings = ({
  playerData,
  onUpdateSettings,
  onResetData,
  onNavigate,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const settings = playerData.settings;

  const toggleSound = () => {
    if (!settings.soundEnabled) {
      soundFx.playButtonClick();
    }
    const nextVal = !settings.soundEnabled;
    soundFx.soundEnabled = nextVal;
    onUpdateSettings({ ...settings, soundEnabled: nextVal });
  };

  const toggleEngine = () => {
    if (settings.soundEnabled) {
      soundFx.playButtonClick();
    }
    const nextVal = !settings.engineAudio;
    soundFx.engineAudioEnabled = nextVal;
    onUpdateSettings({ ...settings, engineAudio: nextVal });
  };

  const toggleTimer = () => {
    soundFx.playButtonClick();
    onUpdateSettings({ ...settings, mathTimerEnabled: !settings.mathTimerEnabled });
  };

  const setTimerSec = (sec) => {
    soundFx.playButtonClick();
    onUpdateSettings({ ...settings, mathTimerSeconds: sec });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] max-w-3xl mx-auto p-4 sm:p-6 space-y-6 select-none">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/95 border-4 border-[#FFCC00] p-4 sm:p-6 rounded-3xl shadow-xl backdrop-blur-md">
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
          Game Settings
        </h2>

        <div className="w-24 hidden sm:block"></div>
      </div>

      <div className="bg-white/95 border-4 border-[#00B4D8] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md">
        {/* Sound FX Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border-2 border-slate-200">
          <div className="flex items-center gap-3">
            {settings.soundEnabled ? (
              <Volume2 className="w-6 h-6 text-[#00BB9F]" />
            ) : (
              <VolumeX className="w-6 h-6 text-rose-500" />
            )}
            <div>
              <h4 className="font-black text-[#1B4332] text-base">Sound Effects & Music</h4>
              <p className="text-xs font-semibold text-slate-600">Enable button clicks, fanfares, and boosts</p>
            </div>
          </div>

          <button
            onClick={toggleSound}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase transition-all cursor-pointer shadow-md ${
              settings.soundEnabled
                ? 'bg-[#00F5D4] border-b-4 border-[#00BB9F] text-[#006E5D]'
                : 'bg-slate-200 border-b-4 border-slate-300 text-slate-500'
            }`}
          >
            {settings.soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Engine Audio Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border-2 border-slate-200">
          <div className="flex items-center gap-3">
            <Volume2 className="w-6 h-6 text-[#00B4D8]" />
            <div>
              <h4 className="font-black text-[#1B4332] text-base">Car Engine Audio</h4>
              <p className="text-xs font-semibold text-slate-600">Play realistic arcade engine rumble sound</p>
            </div>
          </div>

          <button
            onClick={toggleEngine}
            className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase transition-all cursor-pointer shadow-md ${
              settings.engineAudio
                ? 'bg-[#00B4D8] border-b-4 border-[#007791] text-white'
                : 'bg-slate-200 border-b-4 border-slate-300 text-slate-500'
            }`}
          >
            {settings.engineAudio ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Math Timer Setting */}
        <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-[#6B5600]" />
              <div>
                <h4 className="font-black text-[#1B4332] text-base">Math Checkpoint Timer</h4>
                <p className="text-xs font-semibold text-slate-600">Add extra challenge with a question countdown</p>
              </div>
            </div>

            <button
              onClick={toggleTimer}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase transition-all cursor-pointer shadow-md ${
                settings.mathTimerEnabled
                  ? 'bg-[#FFCC00] border-b-4 border-[#C29B00] text-[#6B5600]'
                  : 'bg-slate-200 border-b-4 border-slate-300 text-slate-500'
              }`}
            >
              {settings.mathTimerEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {settings.mathTimerEnabled && (
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <span className="text-xs font-black text-slate-700 uppercase">Timer Seconds:</span>
              {[10, 15, 20, 30].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setTimerSec(sec)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow ${
                    settings.mathTimerSeconds === sec
                      ? 'bg-[#FFCC00] border-2 border-[#C29B00] text-[#6B5600]'
                      : 'bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reset Progress Data */}
        <div className="pt-4 border-t-2 border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="font-black text-rose-600 text-sm">Reset Coins & Garage Shop Unlocks</h4>
            <p className="text-xs font-semibold text-slate-500">Restore default coins and locked items</p>
          </div>

          <button
            onClick={() => {
              soundFx.playButtonClick();
              setShowResetConfirm(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-rose-50 border-2 border-rose-300 hover:bg-rose-100 text-rose-700 font-black text-xs uppercase flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Progress</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none">
          <div className="w-full max-w-md bg-white border-4 border-rose-500 rounded-3xl p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-600">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="font-black text-xl text-slate-900 uppercase italic">
                  Reset Progress?
                </h3>
              </div>
              <button
                onClick={() => {
                  soundFx.playButtonClick();
                  setShowResetConfirm(false);
                }}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm font-semibold text-slate-600 leading-relaxed">
              This will completely wipe your local saved coins, unlocked garage cars, cosmetics, titles, and bank savings back to fresh starter values. This cannot be undone!
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  soundFx.playButtonClick();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-xs uppercase cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  soundFx.playVictory();
                  setShowResetConfirm(false);
                  onResetData();
                }}
                className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase cursor-pointer shadow-lg flex items-center gap-1.5 border-2 border-white"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Reset Everything</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
