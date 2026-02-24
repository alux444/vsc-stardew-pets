import { Animation } from "../Animation";
import { Pet } from "../pets";

export class Raccoon extends Pet {
  override anims = {
    idle: new Animation([[0, 0]], 5, { loop: false }),
    moveDown: new Animation([[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]], 2),
    moveLeft: new Animation([[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1]], 2),
    moveUp: new Animation([[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2]], 2),
    moveRight: new Animation([[0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3]], 2),
    special: new Animation([[8, 2], [9, 2], [10, 2], [11, 2], [12, 2], [13, 2], [14, 2], [15, 2]], 5),
  };

  constructor(name: string, color: string, timesPetted: number = 0, nextPettable: Date = new Date()) {
    super(name, color, timesPetted, nextPettable);
    this.init("raccoon", { canSleep: false });
  }
}
