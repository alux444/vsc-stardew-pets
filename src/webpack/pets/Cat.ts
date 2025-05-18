import { Animation } from "../Animation";
import { Pet } from "../pets";

export class Cat extends Pet {
  override anims = {
    moveDown: new Animation(
      [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
      ],
      5
    ),
    moveRight: new Animation(
      [
        [0, 1],
        [1, 1],
        [2, 1],
        [3, 1],
      ],
      5
    ),
    moveUp: new Animation(
      [
        [0, 2],
        [1, 2],
        [2, 2],
        [3, 2],
      ],
      5
    ),
    moveLeft: new Animation(
      [
        [0, 3],
        [1, 3],
        [2, 3],
        [3, 3],
      ],
      5
    ),
    idle: new Animation(
      [
        [0, 4],
        [1, 4],
        [2, 4],
      ],
      5,
      { loop: false }
    ),
    special: new Animation(
      [
        [0, 5],
        [1, 5],
        [2, 5],
        [3, 5],
        [0, 5],
        [2, 4],
      ],
      5,
      { loop: false }
    ),
    sleep: [
      new Animation(
        [
          [0, 7],
          [1, 7],
        ],
        30
      ),
      new Animation(
        [
          [0, 6],
          [1, 6],
          [2, 6],
          [3, 6],
        ],
        5,
        { loop: false }
      ),
    ],
  };
  constructor(name: string, color: string) {
    super(name, color);
    this.init("cat");
  }
}
