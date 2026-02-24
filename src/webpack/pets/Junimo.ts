import { Animation } from "../Animation";
import { PetSmall } from "../pets";
import { Vec2 } from "../util";

const OFFSETS: Record<string, Vec2> = {
  white: new Vec2(0, 0),
  black: new Vec2(128, 0),
  gray: new Vec2(256, 0),
  pink: new Vec2(384, 0),
  red: new Vec2(0, 96),
  orange: new Vec2(128, 96),
  yellow: new Vec2(256, 96),
  green: new Vec2(384, 96),
  cyan: new Vec2(0, 192),
  purple: new Vec2(128, 192),
  brown: new Vec2(256, 192),
};

export class Junimo extends PetSmall {
  override anims = {
    idle: new Animation([[0, 0]], 5, { loop: false }),
    moveDown: new Animation([[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]], 2),
    moveRight: new Animation([[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2]], 2),
    moveLeft: new Animation([[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2]], 2, { flip: true }),
    moveUp: new Animation([[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4]], 2),
    special: [
      new Animation([[4, 3], [5, 3], [6, 3], [7, 3]], 5),
      new Animation([[4, 5], [5, 5], [6, 5], [7, 5]], 5),
    ],
    sleep: new Animation([[4, 1], [5, 1], [6, 1], [7, 1]], 30),
  };

  constructor(name: string, color: string, timesPetted: number = 0, nextPettable: Date = new Date()) {
    super(name, color, timesPetted, nextPettable);
    this.spriteSheetOffset = OFFSETS[color] ?? new Vec2(0, 0);
    this.init("junimo");
  }
}
