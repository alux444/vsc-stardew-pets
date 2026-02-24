import { Animation } from "../Animation";
import { PetMedium } from "../pets";
import { Vec2 } from "../util";

const OFFSETS: Record<string, Vec2> = {
  "green adult": new Vec2(0, 0),
  "green baby": new Vec2(0, 24),
  "blue adult": new Vec2(0, 48),
  "blue baby": new Vec2(0, 72),
  "golden joja": new Vec2(0, 96),
};

export class Parrot extends PetMedium {
  override anims = {
    idle: new Animation([[0, 0]], 5, { loop: false }),
    moveUp: new Animation([[8, 0], [9, 0], [10, 0]], 5),
    moveRight: new Animation([[2, 0], [3, 0], [4, 0]], 5, { flip: true }),
    moveDown: new Animation([[5, 0], [6, 0], [7, 0]], 5),
    moveLeft: new Animation([[2, 0], [3, 0], [4, 0]], 5),
    special: new Animation([[0, 0], [1, 0], [0, 0], [1, 0], [0, 0]], 5, { loop: false }),
  };

  constructor(name: string, color: string, timesPetted: number = 0, nextPettable: Date = new Date()) {
    super(name, color, timesPetted, nextPettable);
    this.spriteSheetOffset = OFFSETS[color] ?? new Vec2(0, 0);
    this.init("parrot", { canSleep: false });
  }
}
