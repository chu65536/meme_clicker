export const SHOP_ITEMS = [
  {
    id: "test1",
    name: "test_1",
    description: "+1 coins per click",
    sprite: "crypto_coin",
    baseCost: 25,
    costMultiplier: 1.15,
    effect: (state) => {
      state.coinsPerClick += 1;
    },
  },
  {
    id: "test2",
    name: "test_2",
    description: "+1 coins per second",
    sprite: "fist",
    baseCost: 50,
    costMultiplier: 1.15,
    effect: (state) => {
      state.coinsPerSecond += 1;
    },
  },
  {
    id: "test3",
    name: "test_3",
    description: "+1 coins per click",
    sprite: "fist",
    baseCost: 100,
    costMultiplier: 1.15,
    effect: (state) => {
      state.coinsPerClick += 1;
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
