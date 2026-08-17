import { SHOP_ITEMS } from "./ShopItems.js";

export class GameState {
  constructor() {
    this.isAdsEnabled = true;
    this.coins = 0;
    this.baseCoinsPerClick = 1;
    this.coinsPerClickMultiplier = 1;
    this.coinsPerSecond = 0;
    this.items = SHOP_ITEMS.map((item) => ({ id: item.id, owned: 0 }));

    // crits
    this.isCritsUnlocked = false;
    this.critMultiplier = 2;
    this.critChance = 0.25;

    // streak
    this.isStreakUnlocked = false;
    this.streakProgress = 0;
  }
}
