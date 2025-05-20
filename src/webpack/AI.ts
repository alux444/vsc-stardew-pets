import { Pet } from "./pets";
import { random, Timer, Vec2 } from "./util";

declare const game: {
  fps: number;
  mouse: {
    hasGift: boolean;
  };
};

interface PetBehaviorOptions {
  idleDurationBase?: number;
  idleDurationVariation?: number;
  canSleep?: boolean;
  sleepDurationBase?: number;
  sleepDurationVariation?: number;
  specialDuration?: number;
}

export class AI {
  static get MOVING() {
    return 0;
  }
  static get IDLE() {
    return 1;
  }
  static get SPECIAL() {
    return 2;
  }

  #pet: Pet;
  get pet() {
    return this.#pet;
  }
  #state = AI.IDLE;
  get state() {
    return this.#state;
  }
  #timer = new Timer();
  get timer() {
    return this.#timer;
  }
  #movePos = new Vec2();

  #mood = "heart";
  #moodAppearTimeout: any;

  #petCooldown: number = 0;
  get petCooldown() {
    return this.#petCooldown;
  }

  #idleDurationBase = 2 * game.fps;
  #idleDurationVariation = 2 * game.fps;
  get idleDuration() {
    return this.#idleDurationBase + random(this.#idleDurationVariation);
  }

  #canSleep = true;
  #isSleeping = false;
  #sleepDurationBase = 10 * game.fps;
  #sleepDurationVariation = 5 * game.fps;
  get sleepDuration() {
    return this.#sleepDurationBase + random(this.#sleepDurationVariation);
  }

  #specialDuration = 2 * game.fps;
  get specialDuration() {
    return this.#specialDuration;
  }

  constructor(pet: Pet, options: PetBehaviorOptions = {}) {
    // Save linked pet
    this.#pet = pet;

    // Random mood
    // this.#setRandomMood();

    // Idle options
    if (options.idleDurationBase) {
      this.#idleDurationBase = options.idleDurationBase;
    }
    if (options.idleDurationVariation) {
      this.#idleDurationVariation = options.idleDurationVariation;
    }

    // Sleep options
    if (!!options.canSleep) {
      this.#canSleep = options.canSleep;
    }
    if (options.sleepDurationBase) {
      this.#sleepDurationBase = options.sleepDurationBase;
    }
    if (options.sleepDurationVariation) {
      this.#sleepDurationVariation = options.sleepDurationVariation;
    }

    // Special options
    if (options.specialDuration) {
      this.#specialDuration = options.specialDuration;
    }

    // Move towards random point
    this.moveTowardsRandom();
  }

  update() {
    const pet = this.pet;

    switch (this.#state) {
      case AI.MOVING: {
        //Move position out of bounds -> Create a new one
        if (this.#movePos.x > pet.maxX || this.#movePos.y > pet.maxY) this.moveTowards(pet.randomPoint);

        if (this.#movePos.x < pet.pos.x) this.moveLeft();
        else if (this.#movePos.x > pet.pos.x) this.moveRight();
        else if (this.#movePos.y < pet.pos.y) this.moveUp();
        else if (this.#movePos.y > pet.pos.y) this.moveDown();
        else this.onMovingEnd();
        break;
      }

      case AI.IDLE:
        this.onIdle();
        break;

      case AI.SPECIAL:
        this.onSpecial();
        break;
    }
  }

  click() {
    this.showMood();
    if (this.#petCooldown > 0) {
      return;
    }

    this.#petCooldown = game.fps * 2;
    this.showMood();

    // add times petted
    this.#pet.incrementTimesPetted();

    console.log("Click", this.#mood);
  }

  showMood() {
    //Show mood
    this.#pet.element.setAttribute("mood", this.#mood);

    //Clear hide mood timeout & start a new one
    if (this.#moodAppearTimeout) {
      clearTimeout(this.#moodAppearTimeout);
    }
    this.#moodAppearTimeout = setTimeout(() => {
      this.#pet.element.removeAttribute("mood");
    }, 2000);
  }

  //States
  setState(newState: number) {
    //Set state
    this.#state = newState;

    switch (newState) {
      //Idle
      case AI.IDLE:
        this.onIdleStart();
        break;

      case AI.SPECIAL:
        this.onSpecialStart();
        break;
    }
  }

  onIdleStart() {
    this.pet.animate("idle");
    this.timer.count(this.idleDuration);
    this.#isSleeping = false;
  }

  onIdle() {
    if (!this.timer.finished) return;
    this.timer.reset();
    if (this.#canSleep && !this.#isSleeping && random(99) < 75) {
      this.pet.animate("sleep");
      this.#isSleeping = true;
      this.timer.count(this.sleepDuration);
    } else {
      this.moveTowardsRandom();
    }
  }

  onSpecialStart() {
    this.pet.animate("special", true);
    this.timer.count(this.specialDuration);
  }

  onSpecial() {
    if (!this.timer.finished) return;
    this.timer.reset();
    this.moveTowardsRandom();
  }

  onMovingEnd() {
    this.setState(AI.IDLE);
  }

  //Movement
  moveTowards(point: Vec2) {
    this.#movePos = point;
    this.setState(AI.MOVING);
  }

  moveTowardsRandom() {
    //Move towards random point
    this.moveTowards(this.pet.randomPoint);
  }

  moveLeft() {
    const pet = this.pet;
    pet.moveTo(pet.pos.x - 1, pet.pos.y);
    pet.animate("moveLeft");
  }

  moveRight() {
    const pet = this.pet;
    pet.moveTo(pet.pos.x + 1, pet.pos.y);
    pet.animate("moveRight");
  }

  moveUp() {
    const pet = this.pet;
    pet.moveTo(pet.pos.x, pet.pos.y - 1);
    pet.animate("moveUp");
  }

  moveDown() {
    const pet = this.pet;
    pet.moveTo(pet.pos.x, pet.pos.y + 1);
    pet.animate("moveDown");
  }
}
