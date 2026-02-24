import { Animation } from "../Animation";
import { PetSmall } from "../pets";

export class Chicken extends PetSmall {
  override anims = {
    idle: new Animation([[0, 0]], 5, { loop: false }),
    moveDown: new Animation([[0, 0], [1, 0], [2, 0], [3, 0]], 5),
    moveRight: new Animation([[0, 1], [1, 1], [2, 1], [3, 1]], 5),
    moveUp: new Animation([[0, 2], [1, 2], [2, 2], [3, 2]], 5),
    moveLeft: new Animation([[0, 3], [1, 3], [2, 3], [3, 3]], 5),
    special: new Animation([[0, 6], [1, 6], [2, 6], [1, 6], [2, 6], [1, 6], [0, 6], [0, 0]], 5, { loop: false }),
    sleep: new Animation([[0, 4], [1, 4]], 5, { loop: false }),
  };

  constructor(name: string, color: string, timesPetted: number = 0, nextPettable: Date = new Date()) {
    super(name, color, timesPetted, nextPettable);
    this.init("chicken");
  }
}
