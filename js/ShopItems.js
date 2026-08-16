export const SHOP_ITEMS = [
  {
    id: "paws",
    name: "I have little paws",
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
    id: "streak",
    name: "I am strong",
    description: "Unlock streaks (click more, gain up to 2x!)",
    sprite: "strong",
    baseCost: 1000,
    costMultiplier: 1,
    unlocked: false,
    effect: (state) => {
      state.isStreakUnlocked = true;
    },
  },
  {
    id: "test4",
    name: "test_4",
    description: "+1 coins per click",
    sprite: "fist",
    baseCost: 200,
    costMultiplier: 1.15,
    effect: (state) => {
      state.coinsPerClick += 1;
    },
  },
  {
    id: "test5",
    name: "test_5",
    description: "+1 coins per click",
    sprite: "fist",
    baseCost: 400,
    costMultiplier: 1.15,
    effect: (state) => {
      state.coinsPerClick += 1;
    },
  },
  {
    id: "test6",
    name: "test_6",
    description: "+1 coins per click",
    sprite: "fist",
    baseCost: 800,
    costMultiplier: 1.15,
    effect: (state) => {
      state.coinsPerClick += 1;
    },
  },
  {
    id: "test7",
    name: "test_7",
    description: "+1 coins per click",
    sprite: "fist",
    baseCost: 1600,
    costMultiplier: 1.15,
    effect: (state) => {
      state.coinsPerClick += 1;
    },
  },
  {
    id: "test8",
    name: "test_8",
    description: "+1 coins per click",
    sprite: "fist",
    baseCost: 3200,
    costMultiplier: 1.15,
    effect: (state) => {
      state.coinsPerClick += 1;
    },
  },
  {
    id: "test9",
    name: "test_9",
    description: "+1 coins per click",
    sprite: "fist",
    baseCost: 64000,
    costMultiplier: 1.15,
    effect: (state) => {
      state.coinsPerClick += 1;
    },
  },
  {
    id: "test10",
    name: "test_10",
    description: "+1 coins per click",
    sprite: "fist",
    baseCost: 128000000,
    costMultiplier: 1.15,
    effect: (state) => {
      state.coinsPerClick += 1;
    },
  },
];
