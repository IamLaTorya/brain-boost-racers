const STORAGE_KEY = 'brain_boost_racers_save_v1';

export const DEFAULT_EQUIPPED = {
  hairstyle: 'hair_curly_afro_puffs',
  skinTone: 'skin_medium_warm',
  hat: 'hat_default',
  glasses: 'glasses_none',
  outfit: 'outfit_default',
  carPaint: 'default',
  decal: 'decal_none',
  wheelColor: 'wheel_default',
};

export const DEFAULT_PLAYER_DATA = {
  coins: 100, // Starting bonus
  selectedGrade: 'K-2',
  selectedCar: 'blue',
  unlockedCosmetics: [
    'hair_short_fade',
    'hair_curly_afro_puffs',
    'hair_spiky_turbo',
    'hair_braids_beads',
    'hair_wavy_flow',
    'hair_high_ponytail',
    'hair_afro_crown',
    'hair_dreads_locs',
    'skin_light_glow',
    'skin_medium_warm',
    'skin_deep_bronze',
    'skin_rich_espresso',
    'skin_sun_kissed',
    'hat_none',
    'hat_default',
    'glasses_none',
    'outfit_default',
    'paint_blue',
    'paint_red',
    'paint_green',
    'decal_none',
    'wheel_default',
  ],
  equippedCosmetics: DEFAULT_EQUIPPED,
  powerUps: {
    startingBoosts: 0,
    mathShields: 0,
    coinMagnet: false,
    engineTuning: false,
  },
  equippedTitle: 'Rookie Racer',
  unlockedTitles: ['Rookie Racer'],
  racerVaultCoins: 0,
  racerLevel: 1,
  bankAccount: {
    savingsBalance: 50,
    savingsGoal: 300,
    totalInterestEarned: 0,
    transactions: [
      { id: 't1', type: 'deposit', amount: 50, date: 'Initial Starter Savings', note: 'Starter Piggy Bank Bonus!' },
    ],
  },
  settings: {
    soundEnabled: true,
    engineAudio: true,
    mathTimerEnabled: true,
    mathTimerSeconds: 15,
  },
  stats: {
    totalRaces: 0,
    totalCorrectMath: 0,
    totalMathAnswered: 0,
    totalCoinsEarned: 100,
    bestPosition: 4,
  },
  bestRaceTimes: {
    'K-2': null,
    '3-5': null,
    '6-8': null,
  },
};

export function loadPlayerData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      savePlayerData(DEFAULT_PLAYER_DATA);
      return DEFAULT_PLAYER_DATA;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PLAYER_DATA,
      ...parsed,
      powerUps: { ...DEFAULT_PLAYER_DATA.powerUps, ...(parsed.powerUps || {}) },
      unlockedTitles: parsed.unlockedTitles || DEFAULT_PLAYER_DATA.unlockedTitles,
      equippedTitle: parsed.equippedTitle || DEFAULT_PLAYER_DATA.equippedTitle,
      racerVaultCoins: parsed.racerVaultCoins ?? 0,
      racerLevel: parsed.racerLevel ?? 1,
      bankAccount: {
        ...DEFAULT_PLAYER_DATA.bankAccount,
        ...(parsed.bankAccount || {}),
        transactions: parsed.bankAccount?.transactions || DEFAULT_PLAYER_DATA.bankAccount.transactions,
      },
      settings: { ...DEFAULT_PLAYER_DATA.settings, ...(parsed.settings || {}) },
      stats: { ...DEFAULT_PLAYER_DATA.stats, ...(parsed.stats || {}) },
      equippedCosmetics: { ...DEFAULT_PLAYER_DATA.equippedCosmetics, ...(parsed.equippedCosmetics || {}) },
      bestRaceTimes: { ...DEFAULT_PLAYER_DATA.bestRaceTimes, ...(parsed.bestRaceTimes || {}) },
    };
  } catch (err) {
    console.warn('Failed to parse saved game state, using defaults:', err);
    return DEFAULT_PLAYER_DATA;
  }
}

export function savePlayerData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save game state to LocalStorage:', err);
  }
}

export function resetPlayerData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear storage:', err);
  }
  const freshData = JSON.parse(JSON.stringify(DEFAULT_PLAYER_DATA));
  savePlayerData(freshData);
  return freshData;
}
