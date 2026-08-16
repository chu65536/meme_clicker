import { SHOP_ITEMS } from "./ShopItems.js";

export class GameState {
  constructor() {
    this.coins = 0;
    this.coinsPerClick = 1;
    this.coinsPerSecond = 0;
    this.items = SHOP_ITEMS.map((item) => ({ id: item.id, owned: 0 }));
  }
}
