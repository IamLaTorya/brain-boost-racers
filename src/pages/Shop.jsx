import React, { useState } from 'react';
import { Coins, Check, Lock, ArrowLeft, Sparkles } from 'lucide-react';
import cosmeticsCatalog from '../data/cosmetics.json';
import { soundFx } from '../utils/sound';
import { CarCanvas } from '../components/CarCanvas';

export const Shop = ({
  playerData,
  onBuyCosmetic,
  onEquipCosmetic,
  onBuyPowerUp,
  onBuyTitle,
  onEquipTitle,
  onDepositVault,
  onSpinLuckyWheel,
  onNavigate,
}) => {
  const [activeCategory, setActiveCategory] = useState('hairstyles');
  const [spinningWheel, setSpinningWheel] = useState(false);
  const [wheelResult, setWheelResult] = useState(null);
  const [wheelRotation, setWheelRotation] = useState(0);

  const categories = [
    { id: 'hairstyles', label: 'Hairstyles', icon: '💇‍♀️' },
    { id: 'skinTones', label: 'Skin Color', icon: '👤' },
    { id: 'paints', label: 'Car Paint', icon: '🎨' },
    { id: 'decals', label: 'Decals', icon: '🏁' },
    { id: 'wheels', label: 'Wheel Rims', icon: '🛞' },
    { id: 'hats', label: 'Driver Hats', icon: '🧢' },
    { id: 'glasses', label: 'Glasses', icon: '🕶️' },
    { id: 'outfits', label: 'Outfits', icon: '🏎️' },
    { id: 'powerups', label: 'Power-Ups', icon: '⚡' },
    { id: 'luckywheel', label: 'Lucky Wheel', icon: '🎰' },
    { id: 'titles', label: 'Racer Titles', icon: '🏆' },
    { id: 'vault', label: 'Fame Vault', icon: '🏛️' },
  ];

  // Check if all cosmetics are unlocked
  const purchasableCosmetics = cosmeticsCatalog.filter((item) => !item.unlockedByDefault);
  const totalPurchasable = purchasableCosmetics.length;
  const unlockedPurchasable = purchasableCosmetics.filter((item) =>
    playerData.unlockedCosmetics.includes(item.id)
  ).length;
  const isAllCosmeticsUnlocked = totalPurchasable > 0 && unlockedPurchasable >= totalPurchasable;

  const itemsForCategory = cosmeticsCatalog.filter(
    (item) => item.category === activeCategory
  );

  const isEquipped = (category, id) => {
    switch (category) {
      case 'hairstyles':
        return playerData.equippedCosmetics.hairstyle === id;
      case 'skinTones':
        return playerData.equippedCosmetics.skinTone === id;
      case 'hats':
        return playerData.equippedCosmetics.hat === id;
      case 'glasses':
        return playerData.equippedCosmetics.glasses === id;
      case 'outfits':
        return playerData.equippedCosmetics.outfit === id;
      case 'paints':
        return playerData.equippedCosmetics.carPaint === id;
      case 'decals':
        return playerData.equippedCosmetics.decal === id;
      case 'wheels':
        return playerData.equippedCosmetics.wheelColor === id;
      default:
        return false;
    }
  };

  const handleSpinWheelClick = () => {
    if (spinningWheel || playerData.coins < 50) return;
    soundFx.playButtonClick();
    setSpinningWheel(true);
    setWheelResult(null);

    const newRotation = wheelRotation + 1440 + Math.floor(Math.random() * 360);
    setWheelRotation(newRotation);

    setTimeout(() => {
      const res = onSpinLuckyWheel ? onSpinLuckyWheel() : null;
      setSpinningWheel(false);
      setWheelResult(res);
      soundFx.playVictory();
    }, 2000);
  };

  const powerUpCatalog = [
    {
      id: 'startingBoosts',
      name: 'Rocket Nitro Pass',
      icon: '🚀',
      price: 40,
      description: 'Start your next race with a full instant Nitro Rocket boost!',
      count: playerData.powerUps?.startingBoosts || 0,
    },
    {
      id: 'mathShields',
      name: 'Math Shield Armor',
      icon: '🛡️',
      price: 60,
      description: 'Protects you from 1 wrong math answer spinout penalty during race!',
      count: playerData.powerUps?.mathShields || 0,
    },
    {
      id: 'coinMagnet',
      name: 'Coin Magnet Module',
      icon: '🧲',
      price: 100,
      description: 'Magnetically attracts track coins to your car automatically while driving!',
      isOwned: playerData.powerUps?.coinMagnet || false,
    },
    {
      id: 'engineTuning',
      name: 'Super Engine Tuning',
      icon: '🏎️',
      price: 150,
      description: 'Boosts your racer base top speed by +25 MPH in all races!',
      isOwned: playerData.powerUps?.engineTuning || false,
    },
  ];

  const titleCatalog = [
    { title: 'Rookie Racer', price: 0, icon: '🌟' },
    { title: 'Math Speed Demon', price: 150, icon: '⚡' },
    { title: 'Genius Calculator', price: 250, icon: '🧠' },
    { title: 'Golden Champion', price: 400, icon: '👑' },
    { title: 'Nitro Master', price: 600, icon: '🚀' },
    { title: 'Galaxy Legend', price: 1000, icon: '🌌' },
  ];

  const currentLevel = playerData.racerLevel || 1;
  const vaultCoins = playerData.racerVaultCoins || 0;

  return (
    <div className="min-h-[calc(100vh-64px)] max-w-6xl mx-auto p-4 sm:p-6 space-y-6 select-none">
      {/* Header Bar */}
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

        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-black text-[#1B4332] italic uppercase">
            Racer Garage & Coin Shop
          </h2>
          <p className="text-xs font-bold text-slate-600">
            Spend coins on cosmetics, power-ups, lucky wheel spins, titles & vault levels!
          </p>
        </div>

        <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FFCC00] border-2 border-[#C29B00] text-[#6B5600] font-black text-lg shadow-lg">
          <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center font-bold text-xs text-[#6B5600]">
            $
          </div>
          <span>{playerData.coins} Coins</span>
        </div>
      </div>

      {/* All Cosmetics Unlocked Trophy Banner */}
      {isAllCosmeticsUnlocked && (
        <div className="bg-gradient-to-r from-[#FFCC00] via-[#FF0080] to-[#00F5D4] p-1 rounded-3xl shadow-2xl">
          <div className="bg-slate-950 p-4 sm:p-5 rounded-[22px] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-[#FFCC00] rounded-2xl flex items-center justify-center text-3xl shadow-lg shrink-0">
                🏆
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#FFCC00] uppercase tracking-wide">
                  100% COSMETICS UNLOCKED!
                </h3>
                <p className="text-xs font-bold text-slate-300">
                  You own every cosmetic in the garage! Use your extra coins for Power-Ups, Lucky Wheel spins, Racer Titles, and Fame Vault Leveling!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundFx.playButtonClick();
                  setActiveCategory('luckywheel');
                }}
                className="px-4 py-2 bg-[#FF0080] text-white font-black text-xs uppercase rounded-xl hover:bg-[#ff1a8c] shadow-lg"
              >
                Spin Wheel 🎰
              </button>
              <button
                onClick={() => {
                  soundFx.playButtonClick();
                  setActiveCategory('vault');
                }}
                className="px-4 py-2 bg-[#00F5D4] text-[#006E5D] font-black text-xs uppercase rounded-xl hover:bg-[#12fcdb] shadow-lg"
              >
                Vault Level 🏛️
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Customizer Car Preview */}
        <div className="lg:col-span-1 bg-white/95 border-4 border-[#FF0080] rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-md">
          <div className="w-full flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-[#FF0080] uppercase tracking-widest">
              GARAGE PREVIEW
            </h3>
            {playerData.equippedTitle && (
              <span className="text-[10px] font-black text-[#006E5D] bg-[#00F5D4] px-2.5 py-0.5 rounded-full uppercase shadow">
                🏆 {playerData.equippedTitle}
              </span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border-2 border-slate-800 mb-4 shadow-inner w-full flex justify-center">
            <CarCanvas
              carColor={playerData.selectedCar}
              equipped={playerData.equippedCosmetics}
              width={240}
              height={140}
              animateWheels={true}
            />
          </div>

          <div className="space-y-1.5 text-xs text-slate-700 w-full font-bold">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Hairstyle:</span>
              <span className="font-black text-[#8B5CF6] truncate max-w-[120px]">
                {playerData.equippedCosmetics.hairstyle}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Skin Color:</span>
              <span className="font-black text-[#D97706] truncate max-w-[120px]">
                {playerData.equippedCosmetics.skinTone}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Base Car:</span>
              <span className="font-black text-[#1B4332] capitalize">{playerData.selectedCar}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Paint Finish:</span>
              <span className="font-black text-[#FF0080]">{playerData.equippedCosmetics.carPaint}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Nitro Rocket Passes:</span>
              <span className="font-black text-[#FF0080]">{playerData.powerUps?.startingBoosts || 0} Ready</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Math Shields:</span>
              <span className="font-black text-[#00B4D8]">{playerData.powerUps?.mathShields || 0} Owned</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Racer Level:</span>
              <span className="font-black text-[#6B5600] bg-[#FFCC00] px-2 py-0.5 rounded-md">
                Level {currentLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Category Tabs & Catalog */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category Tabs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundFx.playButtonClick();
                    setActiveCategory(cat.id);
                  }}
                  className={`p-2.5 sm:p-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 border-b-4 transition-all cursor-pointer shadow-md uppercase text-center ${
                    isActive
                      ? 'bg-[#00F5D4] border-[#00BB9F] text-[#006E5D] scale-[1.02]'
                      : 'bg-white border-[#E0E0E0] text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="shrink-0 text-base">{cat.icon}</span>
                  <span className="leading-tight break-words">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Catalog Content based on Active Category */}

          {/* Standard Cosmetics Tabs */}
          {!['powerups', 'luckywheel', 'titles', 'vault'].includes(activeCategory) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {itemsForCategory.map((item) => {
                const isUnlocked =
                  item.unlockedByDefault ||
                  playerData.unlockedCosmetics.includes(item.id);
                const equipped = isEquipped(item.category, item.id);
                const canAfford = playerData.coins >= item.price;

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-3xl border-4 flex flex-col justify-between transition-all shadow-lg ${
                      equipped
                        ? 'bg-white border-[#00BB9F] ring-4 ring-[#00F5D4]'
                        : isUnlocked
                        ? 'bg-white border-[#00B4D8]'
                        : 'bg-white/80 border-slate-300 opacity-80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border-2 border-black/10 shadow-inner shrink-0"
                          style={{ backgroundColor: item.previewColor || '#F1F5F9' }}
                        >
                          {item.icon || '✨'}
                        </div>
                        <div>
                          <h4 className="font-black text-[#1B4332] text-sm sm:text-base">
                            {item.name}
                          </h4>
                          <p className="text-xs text-slate-600 font-semibold leading-tight">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {equipped && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#00BB9F] text-slate-950 font-black text-[10px] uppercase shrink-0 shadow">
                          Equipped
                        </span>
                      )}
                    </div>

                    <div className="mt-2 pt-3 border-t border-slate-200 flex items-center justify-between">
                      {!isUnlocked ? (
                        <div className="flex items-center gap-1 font-black text-[#6B5600] text-sm bg-[#FFCC00] px-3 py-1 rounded-full border border-[#C29B00]">
                          <Coins className="w-4 h-4 text-[#6B5600]" />
                          <span>{item.price} Coins</span>
                        </div>
                      ) : (
                        <span className="text-xs font-black text-[#00BB9F] flex items-center gap-1 uppercase">
                          <Check className="w-4 h-4" /> Unlocked
                        </span>
                      )}

                      {isUnlocked ? (
                        <button
                          disabled={equipped}
                          onClick={() => {
                            soundFx.playButtonClick();
                            onEquipCosmetic(item.category, item.id);
                          }}
                          className={`px-4 py-2 rounded-2xl font-black text-xs uppercase transition-all cursor-pointer shadow-md ${
                            equipped
                              ? 'bg-slate-200 text-slate-400 cursor-default'
                              : 'bg-[#00F5D4] hover:bg-[#12fcdb] text-[#006E5D] border-b-4 border-[#00BB9F]'
                          }`}
                        >
                          {equipped ? 'Equipped' : 'Equip'}
                        </button>
                      ) : (
                        <button
                          disabled={!canAfford}
                          onClick={() => {
                            if (canAfford) {
                              soundFx.playButtonClick();
                              onBuyCosmetic(item);
                            } else {
                              soundFx.playWrong();
                            }
                          }}
                          className={`px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-1.5 uppercase transition-all cursor-pointer shadow-md ${
                            canAfford
                              ? 'bg-[#FF0080] hover:bg-[#ff1a8c] text-white border-b-4 border-[#B8005C]'
                              : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                          }`}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>{canAfford ? 'Buy' : 'Need Coins'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ⚡ Power-Ups Tab */}
          {activeCategory === 'powerups' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {powerUpCatalog.map((pu) => {
                const canAfford = playerData.coins >= pu.price;

                return (
                  <div
                    key={pu.id}
                    className="p-4 rounded-3xl bg-white border-4 border-[#00F5D4] flex flex-col justify-between shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="w-12 h-12 rounded-2xl bg-[#00F5D4]/20 border-2 border-[#00BB9F] flex items-center justify-center text-3xl shrink-0">
                        {pu.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-[#1B4332] text-sm sm:text-base">
                          {pu.name}
                        </h4>
                        <p className="text-xs text-slate-600 font-semibold leading-tight">
                          {pu.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-1 font-black text-[#6B5600] text-sm bg-[#FFCC00] px-3 py-1 rounded-full border border-[#C29B00]">
                        <Coins className="w-4 h-4 text-[#6B5600]" />
                        <span>{pu.price} Coins</span>
                      </div>

                      {pu.isOwned !== undefined ? (
                        <span className={`px-3 py-1.5 rounded-2xl font-black text-xs uppercase ${
                          pu.isOwned
                            ? 'bg-[#00BB9F] text-slate-950'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {pu.isOwned ? 'Active' : 'Not Purchased'}
                        </span>
                      ) : (
                        <span className="text-xs font-black text-[#006E5D] bg-[#00F5D4] px-2.5 py-1 rounded-xl">
                          Owned: {pu.count}
                        </span>
                      )}

                      <button
                        disabled={!canAfford || pu.isOwned}
                        onClick={() => {
                          if (canAfford) {
                            soundFx.playButtonClick();
                            onBuyPowerUp(pu.id, pu.price);
                          } else {
                            soundFx.playWrong();
                          }
                        }}
                        className={`px-4 py-2 rounded-2xl font-black text-xs uppercase transition-all cursor-pointer shadow-md ${
                          pu.isOwned
                            ? 'bg-slate-200 text-slate-400 cursor-default'
                            : canAfford
                            ? 'bg-[#FF0080] hover:bg-[#ff1a8c] text-white border-b-4 border-[#B8005C]'
                            : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                        }`}
                      >
                        {pu.isOwned ? 'Installed' : 'Buy Power-Up'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 🎰 Lucky Wheel Tab */}
          {activeCategory === 'luckywheel' && (
            <div className="p-6 bg-white/95 border-4 border-[#FFCC00] rounded-3xl flex flex-col items-center text-center shadow-xl backdrop-blur-md">
              <h3 className="text-xl sm:text-2xl font-black text-[#1B4332] italic uppercase mb-2">
                BEACH LUCKY WHEEL 🎰
              </h3>
              <p className="text-xs font-bold text-slate-600 mb-6 max-w-md">
                Spend 50 race coins to spin the wheel! Win instant bonus coin windfalls, power-up charges, and exclusive champion titles!
              </p>

              <div className="relative w-56 h-56 sm:w-64 sm:h-64 mb-6 flex items-center justify-center">
                <div className="absolute -top-3 z-20 text-3xl drop-shadow-md">
                  🔻
                </div>

                <div
                  className="w-full h-full rounded-full border-8 border-[#FFCC00] shadow-2xl relative overflow-hidden transition-transform duration-[2000ms] cubic-bezier(0.15, 0.85, 0.35, 1)"
                  style={{
                    transform: `rotate(${wheelRotation}deg)`,
                    background: 'conic-gradient(#FF0080 0deg 60deg, #00F5D4 60deg 120deg, #FFCC00 120deg 180deg, #38BDF8 180deg 240deg, #A855F7 240deg 300deg, #10B981 300deg 360deg)',
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center font-black text-white text-xs">
                    <span className="bg-black/60 px-3 py-1 rounded-full border border-white">LUCKY WHEEL</span>
                  </div>
                </div>
              </div>

              {wheelResult && (
                <div className="mb-6 p-4 rounded-2xl bg-[#00F5D4] border-2 border-[#00BB9F] text-[#006E5D] font-black text-base animate-bounce shadow-lg">
                  🎉 YOU WON: {wheelResult.label}
                </div>
              )}

              <button
                disabled={spinningWheel || playerData.coins < 50}
                onClick={handleSpinWheelClick}
                className={`px-8 py-4 rounded-3xl font-black text-lg uppercase tracking-wider transition-all shadow-2xl flex items-center gap-2 cursor-pointer ${
                  spinningWheel
                    ? 'bg-slate-300 text-slate-500 cursor-wait'
                    : playerData.coins >= 50
                    ? 'bg-[#FF0080] hover:bg-[#ff1a8c] text-white border-b-8 border-[#B8005C]'
                    : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-6 h-6" />
                <span>{spinningWheel ? 'Spinning...' : 'Spin for 50 Coins'}</span>
              </button>
            </div>
          )}

          {/* 🏆 Racer Titles Tab */}
          {activeCategory === 'titles' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {titleCatalog.map((t) => {
                const isUnlocked = playerData.unlockedTitles?.includes(t.title);
                const isEquippedTitle = playerData.equippedTitle === t.title;
                const canAfford = playerData.coins >= t.price;

                return (
                  <div
                    key={t.title}
                    className={`p-4 rounded-3xl border-4 flex flex-col justify-between transition-all shadow-lg ${
                      isEquippedTitle
                        ? 'bg-white border-[#00BB9F] ring-4 ring-[#00F5D4]'
                        : isUnlocked
                        ? 'bg-white border-[#00B4D8]'
                        : 'bg-white/80 border-slate-300 opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFCC00]/30 border-2 border-[#C29B00] flex items-center justify-center text-2xl shrink-0">
                        {t.icon}
                      </div>
                      <div>
                        <h4 className="font-black text-[#1B4332] text-sm sm:text-base">
                          {t.title}
                        </h4>
                        <p className="text-xs text-slate-600 font-bold">
                          {isUnlocked ? 'Unlocked Driver Prestige Title' : `Unlock with ${t.price} Coins`}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                      {!isUnlocked ? (
                        <div className="flex items-center gap-1 font-black text-[#6B5600] text-sm bg-[#FFCC00] px-3 py-1 rounded-full border border-[#C29B00]">
                          <Coins className="w-4 h-4 text-[#6B5600]" />
                          <span>{t.price} Coins</span>
                        </div>
                      ) : (
                        <span className="text-xs font-black text-[#00BB9F] flex items-center gap-1 uppercase">
                          <Check className="w-4 h-4" /> Unlocked
                        </span>
                      )}

                      {isUnlocked ? (
                        <button
                          disabled={isEquippedTitle}
                          onClick={() => {
                            soundFx.playButtonClick();
                            onEquipTitle(t.title);
                          }}
                          className={`px-4 py-2 rounded-2xl font-black text-xs uppercase transition-all cursor-pointer shadow-md ${
                            isEquippedTitle
                              ? 'bg-slate-200 text-slate-400 cursor-default'
                              : 'bg-[#00F5D4] hover:bg-[#12fcdb] text-[#006E5D] border-b-4 border-[#00BB9F]'
                          }`}
                        >
                          {isEquippedTitle ? 'Equipped' : 'Equip Title'}
                        </button>
                      ) : (
                        <button
                          disabled={!canAfford}
                          onClick={() => {
                            if (canAfford) {
                              soundFx.playButtonClick();
                              onBuyTitle(t.title, t.price);
                            } else {
                              soundFx.playWrong();
                            }
                          }}
                          className={`px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-1.5 uppercase transition-all cursor-pointer shadow-md ${
                            canAfford
                              ? 'bg-[#FF0080] hover:bg-[#ff1a8c] text-white border-b-4 border-[#B8005C]'
                              : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                          }`}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>{canAfford ? 'Buy Title' : 'Need Coins'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 🏛️ Fame Vault Tab */}
          {activeCategory === 'vault' && (
            <div className="p-6 bg-white/95 border-4 border-[#00B4D8] rounded-3xl flex flex-col items-center text-center shadow-xl backdrop-blur-md space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#1B4332] italic uppercase">
                  RACER FAME VAULT 🏛️
                </h3>
                <p className="text-xs font-bold text-slate-600 max-w-md mx-auto">
                  Deposit your surplus race coins into the Math Fame Vault to level up your Driver Mastery Rank!
                </p>
              </div>

              <div className="w-full max-w-md p-6 bg-slate-950 rounded-3xl border-4 border-[#FFCC00] text-white shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#FFCC00] rounded-2xl flex items-center justify-center font-black text-xl text-[#6B5600] shadow-md">
                      {currentLevel}
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-[#FFCC00] font-black uppercase">
                        CURRENT RANK
                      </div>
                      <div className="text-lg font-black text-white">
                        Level {currentLevel} Racer
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-bold">TOTAL VAULTED</div>
                    <div className="text-xl font-black text-[#00F5D4]">
                      {vaultCoins} $
                    </div>
                  </div>
                </div>

                {/* Level Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Progress to Level {currentLevel + 1}</span>
                    <span>{vaultCoins % 100} / 100 Coins</span>
                  </div>
                  <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-[#00F5D4] to-[#FFCC00] rounded-full transition-all duration-500"
                      style={{ width: `${vaultCoins % 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Deposit Buttons */}
              <div className="w-full max-w-md space-y-3">
                <button
                  onClick={() => {
                    soundFx.playButtonClick();
                    onNavigate('bank');
                  }}
                  className="w-full py-3 px-3.5 rounded-2xl bg-[#FFCC00] hover:bg-[#ffd11a] text-[#6B5600] font-black text-xs sm:text-sm uppercase shadow-lg flex items-center justify-center gap-2 cursor-pointer border-2 border-white text-center leading-tight break-words"
                >
                  <span className="break-words">🏦 Open Full Bank Account & Earn Compound Interest</span>
                </button>

                <p className="text-xs font-extrabold text-slate-700 uppercase pt-2">
                  Select Deposit Amount into Fame Vault:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[50, 200, 500, playerData.coins].map((amt, idx) => {
                    const isAll = idx === 3;
                    const canAfford = playerData.coins >= amt && amt > 0;

                    return (
                      <button
                        key={idx}
                        disabled={!canAfford}
                        onClick={() => {
                          if (canAfford) {
                            soundFx.playButtonClick();
                            onDepositVault(amt);
                          }
                        }}
                        className={`py-3 px-2 rounded-2xl font-black text-xs uppercase transition-all shadow-md ${
                          canAfford
                            ? 'bg-[#00F5D4] hover:bg-[#12fcdb] text-[#006E5D] border-b-4 border-[#00BB9F] cursor-pointer'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                        }`}
                      >
                        {isAll ? `All (${amt})` : `+${amt} Coins`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
