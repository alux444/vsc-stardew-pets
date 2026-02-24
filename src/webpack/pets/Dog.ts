import { Animation } from "../Animation";
import { Pet } from "../pets";
import { Vec2 } from "../util";

const OFFSETS: Record<string, Vec2> = {
  blonde: new Vec2(0, 0),
  gray: new Vec2(128, 0),
  brown: new Vec2(256, 0),
  "dark brown": new Vec2(384, 0),
  "light brown": new Vec2(512, 0),
  purple: new Vec2(640, 0),
};

export class Dog extends Pet {
  override anims = {
    idle: new Animation([[0, 5], [1, 5], [2, 5], [3, 5]], 5, { loop: false }),
    moveDown: new Animation([[0, 0], [1, 0], [2, 0], [3, 0]], 5),
    moveRight: new Animation([[0, 1], [1, 1], [2, 1], [3, 1]], 5),
    moveUp: new Animation([[0, 2], [1, 2], [2, 2], [3, 2]], 5),
    moveLeft: new Animation([[0, 3], [1, 3], [2, 3], [3, 3]], 5),
    special: new Animation([[1, 6], [0, 6], [2, 6], [3, 5]], 5, { loop: false }),
    sleep: new Animation([[0, 7], [1, 7]], 30),
  };

  constructor(name: string, color: string, timesPetted: number = 0, nextPettable: Date = new Date()) {
    super(name, color, timesPetted, nextPettable);
    this.spriteSheetOffset = OFFSETS[color] ?? new Vec2(0, 0);
    this.init("dog");
  }
}
