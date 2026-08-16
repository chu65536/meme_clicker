import { LocalStorageManager } from "../Managers/LocalStorageManager.js";

export class Utils {
  static truncateNumber(num, decimals = 1) {
    // Handle negative numbers
    const sign = num < 0 ? "-" : "";
    num = Math.ceil(Math.abs(num));

    if (num < 1000) return sign + num.toString();

    const units = ["", "k", "m", "b", "t", "q"];
    const unitIndex = Math.floor(Math.log10(num) / 3);
    const scaled = num / Math.pow(1000, unitIndex);

    // Round to specified decimals
    const rounded = Number(scaled.toFixed(decimals));

    return sign + rounded + units[unitIndex];
  }

  static getItemCost(item) {
    const localStorageItemData = LocalStorageManager.getItemData(item);
    return item.baseCost * item.costMultiplier ** localStorageItemData.owned;
  }
}
