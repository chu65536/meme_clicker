export const SHOP_ITEMS = [
  {
    id: "paws",
    name: "Little paws",
    description: "+1 coins per click",
    sprite: "paws",
    baseCost: 25,
    costMultiplier: 1.15,
    effect: (state) => {
      state.baseCoinsPerClick += 1;
    },
  },
  {
    id: "thug",
    name: "Business, baby!",
    description: "+1 coins per second",
    sprite: "thug",
    baseCost: 50,
    costMultiplier: 1.15,
    effect: (state) => {
      state.coinsPerSecond += 1;
    },
  },
  {
    id: "crit",
    name: "Mega bite",
    description: "Unlock crits (25% chance to gain x2 coins on click)",
    sprite: "bite",
    baseCost: 1000,
    costMultiplier: 1,
    unlocked: false,
    effect: (state) => {
      state.isCritsUnlocked = true;
    },
  },
  {
    id: "streak",
    name: "I am strong",
    description: "Unlock streaks (fill the streak bar to gain up to x2)",
    sprite: "strong",
    baseCost: 5000,
    costMultiplier: 1,
    unlocked: false,
    effect: (state) => {
      state.isStreakUnlocked = true;
    },
  },
  {
    id: "crypto",
    name: "Crypto millionaire",
    description: "Win the game!",
    sprite: "crypto_coin",
    baseCost: 1000000,
    costMultiplier: 1,
    unlocked: false,
    effect: (state) => {
      state.isWin = true;
    },
  },
];
