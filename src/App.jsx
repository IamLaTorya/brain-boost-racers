import React, { useState, useEffect } from 'react';
import { loadPlayerData, savePlayerData, resetPlayerData } from './utils/storage';
import { soundFx } from './utils/sound';
import { HeaderNav } from './components/HeaderNav';
import { Home } from './pages/Home';
import { GradeSelect } from './pages/GradeSelect';
import { CarSelect } from './pages/CarSelect';
import { RacePage } from './pages/RacePage';
import { Results } from './pages/Results';
import { Shop } from './pages/Shop';
import { BankPage } from './pages/BankPage';
import { Instructions } from './pages/Instructions';
import { Settings } from './pages/Settings';
import { Credits } from './pages/Credits';

export default function App() {
  const [playerData, setPlayerData] = useState(() => loadPlayerData());
  const [activePage, setActivePage] = useState('home');
  const [lastRaceResult, setLastRaceResult] = useState(null);

  useEffect(() => {
    soundFx.soundEnabled = playerData.settings.soundEnabled;
    soundFx.engineAudioEnabled = playerData.settings.engineAudio;
  }, [playerData.settings]);

  const updateAndSave = (updater) => {
    setPlayerData((prev) => {
      const updated = updater(prev);
      savePlayerData(updated);
      return updated;
    });
  };

  const handleSelectGrade = (grade) => {
    updateAndSave((prev) => ({ ...prev, selectedGrade: grade }));
  };

  const handleSelectCar = (car) => {
    updateAndSave((prev) => ({
      ...prev,
      selectedCar: car,
      equippedCosmetics: {
        ...prev.equippedCosmetics,
        carPaint: 'default',
      },
    }));
  };

  const handleBuyCosmetic = (item) => {
    if (playerData.coins < item.price) return;

    updateAndSave((prev) => ({
      ...prev,
      coins: prev.coins - item.price,
      unlockedCosmetics: [...prev.unlockedCosmetics, item.id],
    }));

    soundFx.playVictory();
  };

  const handleEquipCosmetic = (category, itemId) => {
    updateAndSave((prev) => {
      const equipped = { ...prev.equippedCosmetics };
      let newSelectedCar = prev.selectedCar;

      if (category === 'hairstyles') equipped.hairstyle = itemId;
      if (category === 'skinTones') equipped.skinTone = itemId;
      if (category === 'hats') equipped.hat = itemId;
      if (category === 'glasses') equipped.glasses = itemId;
      if (category === 'outfits') equipped.outfit = itemId;
      if (category === 'paints') {
        equipped.carPaint = itemId;
        if (itemId === 'paint_red') newSelectedCar = 'red';
        if (itemId === 'paint_green') newSelectedCar = 'green';
        if (itemId === 'paint_blue') newSelectedCar = 'blue';
      }
      if (category === 'decals') equipped.decal = itemId;
      if (category === 'wheels') equipped.wheelColor = itemId;

      return {
        ...prev,
        selectedCar: newSelectedCar,
        equippedCosmetics: equipped,
      };
    });
  };

  const handleBuyPowerUp = (powerUpKey, cost) => {
    if (playerData.coins < cost) return false;
    updateAndSave((prev) => {
      const currentPowerUps = { ...prev.powerUps };
      if (powerUpKey === 'startingBoosts' || powerUpKey === 'mathShields') {
        currentPowerUps[powerUpKey] = (currentPowerUps[powerUpKey] || 0) + 1;
      } else {
        currentPowerUps[powerUpKey] = true;
      }

      return {
        ...prev,
        coins: prev.coins - cost,
        powerUps: currentPowerUps,
      };
    });
    soundFx.playVictory();
    return true;
  };

  const handleBuyTitle = (title, cost) => {
    if (playerData.coins < cost) return false;
    updateAndSave((prev) => {
      if (prev.unlockedTitles.includes(title)) return prev;
      return {
        ...prev,
        coins: prev.coins - cost,
        unlockedTitles: [...prev.unlockedTitles, title],
        equippedTitle: title,
      };
    });
    soundFx.playVictory();
    return true;
  };

  const handleEquipTitle = (title) => {
    updateAndSave((prev) => ({
      ...prev,
      equippedTitle: title,
    }));
  };

  const handleDepositVault = (amount) => {
    if (amount <= 0 || playerData.coins < amount) return false;
    updateAndSave((prev) => {
      const newCoins = prev.coins - amount;
      const newVault = prev.racerVaultCoins + amount;
      const newLevel = 1 + Math.floor(newVault / 100);
      return {
        ...prev,
        coins: newCoins,
        racerVaultCoins: newVault,
        racerLevel: newLevel,
      };
    });
    soundFx.playVictory();
    return true;
  };

  const handleSpinLuckyWheel = () => {
    if (playerData.coins < 50) return null;

    const prizes = [
      { id: 'coins_100', label: '100 BONUS COINS!', type: 'coins', val: 100 },
      { id: 'coins_250', label: '🌟 250 JACKPOT COINS!', type: 'coins', val: 250 },
      { id: 'boost_3', label: '🚀 3x Nitro Passes!', type: 'powerup', key: 'startingBoosts', val: 3 },
      { id: 'shield_2', label: '🛡️ 2x Math Shields!', type: 'powerup', key: 'mathShields', val: 2 },
      { id: 'magnet', label: '🧲 Coin Magnet Active!', type: 'powerup', key: 'coinMagnet', val: true },
      { id: 'title_lucky', label: '🏆 Title: Gilded Lucky Racer!', type: 'title', val: 'Gilded Lucky Racer' },
    ];

    const wonPrize = prizes[Math.floor(Math.random() * prizes.length)];

    updateAndSave((prev) => {
      let coins = prev.coins - 50;
      const powerUps = { ...prev.powerUps };
      let unlockedTitles = [...prev.unlockedTitles];
      let equippedTitle = prev.equippedTitle;

      if (wonPrize.type === 'coins') {
        coins += wonPrize.val;
      } else if (wonPrize.type === 'powerup') {
        if (wonPrize.key === 'startingBoosts' || wonPrize.key === 'mathShields') {
          powerUps[wonPrize.key] = (powerUps[wonPrize.key] || 0) + wonPrize.val;
        } else {
          powerUps[wonPrize.key] = true;
        }
      } else if (wonPrize.type === 'title') {
        if (!unlockedTitles.includes(wonPrize.val)) {
          unlockedTitles.push(wonPrize.val);
        }
        equippedTitle = wonPrize.val;
      }

      return {
        ...prev,
        coins,
        powerUps,
        unlockedTitles,
        equippedTitle,
      };
    });

    return wonPrize;
  };

  const handleUsePowerUpInRace = (key) => {
    updateAndSave((prev) => {
      const powerUps = { ...prev.powerUps };
      if (powerUps[key] && typeof powerUps[key] === 'number' && powerUps[key] > 0) {
        powerUps[key] -= 1;
      }
      return { ...prev, powerUps };
    });
  };

  const handleUpdateSettings = (newSettings) => {
    updateAndSave((prev) => ({ ...prev, settings: newSettings }));
  };

  const handleResetData = () => {
    const res = resetPlayerData();
    setPlayerData(res);
    setActivePage('home');
  };

  const handleFinishRace = (res) => {
    let calculatedInterest = 0;

    updateAndSave((prev) => {
      const newCoins = prev.coins + res.coinsEarned;
      const stats = {
        ...prev.stats,
        totalRaces: prev.stats.totalRaces + 1,
        totalCorrectMath: prev.stats.totalCorrectMath + res.correctAnswers,
        totalMathAnswered: prev.stats.totalMathAnswered + res.questionsAnswered,
        totalCoinsEarned: prev.stats.totalCoinsEarned + res.coinsEarned,
        bestPosition: Math.min(prev.stats.bestPosition, res.position),
      };

      const bestTimes = { ...prev.bestRaceTimes };
      const currentBest = bestTimes[res.grade];
      if (currentBest === null || res.timeSeconds < currentBest) {
        bestTimes[res.grade] = res.timeSeconds;
      }

      // Calculate Bank Savings Compound Interest based on grade
      const currentSavings = prev.bankAccount?.savingsBalance || 0;
      let interestRatePct = 5;
      if (prev.selectedGrade === '3-5') interestRatePct = 8;
      if (prev.selectedGrade === '6-8') interestRatePct = 10;

      let newSavings = currentSavings;
      let newTotalInterest = prev.bankAccount?.totalInterestEarned || 0;
      let updatedTransactions = prev.bankAccount?.transactions || [];

      if (currentSavings > 0) {
        calculatedInterest = Math.max(1, Math.floor(currentSavings * (interestRatePct / 100)));
        newSavings += calculatedInterest;
        newTotalInterest += calculatedInterest;

        const interestTx = {
          id: 'tx_int_' + Date.now(),
          type: 'interest',
          amount: calculatedInterest,
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: `Race Compound Interest (+${interestRatePct}%)`,
        };
        updatedTransactions = [interestTx, ...updatedTransactions].slice(0, 15);
      }

      return {
        ...prev,
        coins: newCoins,
        stats,
        bestRaceTimes: bestTimes,
        bankAccount: {
          ...prev.bankAccount,
          savingsBalance: newSavings,
          totalInterestEarned: newTotalInterest,
          transactions: updatedTransactions,
        },
      };
    });

    setLastRaceResult({
      ...res,
      bankInterestEarned: calculatedInterest,
    });

    setActivePage('results');
  };

  const handleToggleSound = () => {
    handleUpdateSettings({
      ...playerData.settings,
      soundEnabled: !playerData.settings.soundEnabled,
    });
  };

  return (
    <div className="min-h-screen bg-[#00B4D8] text-slate-900 flex flex-col font-['Outfit',sans-serif] selection:bg-[#FFCC00] selection:text-slate-950 relative overflow-x-hidden">
      <div className="fixed inset-0 bg-gradient-to-b from-[#00B4D8] via-[#90E0EF] to-[#CAF0F8] pointer-events-none -z-20" />

      <div className="fixed bottom-0 w-full h-[220px] sm:h-[300px] bg-[#F7DC6F] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute bottom-0 w-full h-[140px] sm:h-[200px] bg-[#D4AC0D] opacity-20 transform -skew-y-3"></div>
        <div className="absolute bottom-0 w-full h-16 sm:h-24 bg-[#5D6D7E] border-t-8 border-white"></div>
        <div className="absolute bottom-6 sm:bottom-8 w-full flex justify-around opacity-40">
          <div className="w-20 sm:w-32 h-3 sm:h-4 bg-white rounded-full"></div>
          <div className="w-20 sm:w-32 h-3 sm:h-4 bg-white rounded-full"></div>
          <div className="w-20 sm:w-32 h-3 sm:h-4 bg-white rounded-full"></div>
          <div className="w-20 sm:w-32 h-3 sm:h-4 bg-white rounded-full"></div>
        </div>
      </div>

      <div className="fixed inset-0 pointer-events-none bg-radial-gradient-overlay -z-10" />

      <HeaderNav
        playerData={playerData}
        activePage={activePage}
        onNavigate={(page) => setActivePage(page)}
        onToggleSound={handleToggleSound}
      />

      <main className="flex-1 flex flex-col z-10">
        {activePage === 'home' && (
          <Home playerData={playerData} onNavigate={(page) => setActivePage(page)} />
        )}

        {activePage === 'grade_select' && (
          <GradeSelect
            playerData={playerData}
            onSelectGrade={handleSelectGrade}
            onNavigate={(page) => setActivePage(page)}
          />
        )}

        {activePage === 'car_select' && (
          <CarSelect
            playerData={playerData}
            onSelectCar={handleSelectCar}
            onNavigate={(page) => setActivePage(page)}
          />
        )}

        {activePage === 'race' && (
          <RacePage
            playerData={playerData}
            onFinishRace={handleFinishRace}
            onUsePowerUp={handleUsePowerUpInRace}
            onNavigate={(page) => setActivePage(page)}
          />
        )}

        {activePage === 'results' && lastRaceResult && (
          <Results result={lastRaceResult} onNavigate={(page) => setActivePage(page)} />
        )}

        {activePage === 'bank' && (
          <BankPage
            playerData={playerData}
            onUpdatePlayerData={(updater) => updateAndSave(updater)}
            onNavigate={(page) => setActivePage(page)}
          />
        )}

        {activePage === 'shop' && (
          <Shop
            playerData={playerData}
            onBuyCosmetic={handleBuyCosmetic}
            onEquipCosmetic={handleEquipCosmetic}
            onBuyPowerUp={handleBuyPowerUp}
            onBuyTitle={handleBuyTitle}
            onEquipTitle={handleEquipTitle}
            onDepositVault={handleDepositVault}
            onSpinLuckyWheel={handleSpinLuckyWheel}
            onNavigate={(page) => setActivePage(page)}
          />
        )}

        {activePage === 'instructions' && (
          <Instructions onNavigate={(page) => setActivePage(page)} />
        )}

        {activePage === 'settings' && (
          <Settings
            playerData={playerData}
            onUpdateSettings={handleUpdateSettings}
            onResetData={handleResetData}
            onNavigate={(page) => setActivePage(page)}
          />
        )}

        {activePage === 'credits' && (
          <Credits onNavigate={(page) => setActivePage(page)} />
        )}
      </main>
    </div>
  );
}
