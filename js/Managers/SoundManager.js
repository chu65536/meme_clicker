export class SoundManager {
  static addSound(name, sound) {
    if (!this.sounds) {
      this.sounds = new Map();
    }
    this.sounds.set(name, sound);
  }

  static playSound(name) {
    this.sounds.get(name).play({
      loop: false,
      volume: 0.5,
    });
  }
}
