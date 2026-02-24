import { Animation } from "../Animation";
import { Pet } from "../pets";
import { Vec2 } from "../util";

const OFFSETS: Record<string, Vec2> = {
  adult: new Vec2(0, 0),
  baby: new Vec2(128, 0),
};

export class Goat extends Pet {
  override anims = {
    idle: new Animation([[0, 0]], 5, { loop: false }),
    moveDown: new Animation([[0, 0], [1, 0], [2, 0], [3, 0]], 5),
    moveRight: new Animation([[0, 1], [1, 1], [2, 1], [3, 1]], 5),
    moveLeft: new Animation([[0, 1], [1, 1], [2, 1], [3, 1]], 5, { flip: true }),
    moveUp: new Animation([[0, 2], [1, 2], [2, 2], [3, 2]], 5),
    sleep: new Animation([[0, 3], [1, 3]], 30, { loop: false }),
    special: new Animation([[0, 4], [1, 4], [2, 4], [3, 4], [2, 4], [1, 4], [0, 4], [0, 0]], 5, { loop: false }),
  };

  constructor(name: string, color: string, timesPetted: number = 0, nextPettable: Date = new Date()) {
    super(name, color, timesPetted, nextPettable);
    this.spriteSheetOffset = OFFSETS[color] ?? new Vec2(0, 0);
    this.init("goat");
  }
}
