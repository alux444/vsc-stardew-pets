export interface AnimationOptions {
  loop?: boolean;
  flip?: boolean;
}

export class Animation {
  public finished: boolean = false;
  #frame: number = 0;
  #counter: number = 0;

  #frames: [number, number][];
  #speed: number = 3;
  #loop: boolean = true;
  get loop(): boolean {
    return this.#loop;
  }
  #flip: boolean = false;
  get flip(): boolean {
    return this.#flip;
  }

  constructor(frames: [number, number][], speed: number, options?: AnimationOptions) {
    this.#frames = frames;
    this.#speed = speed;
    if (typeof options !== "object" || options === null) {
      options = {};
    }
    if (typeof options.loop === "boolean") {
      this.#loop = options.loop;
    }
    if (typeof options.flip === "boolean") {
      this.#flip = options.flip;
    }

    this.reset();
  }

  reset(): void {
    this.#frame = 0;
    this.#counter = 0;
    this.finished = false;
  }

  update(): [number, number] {
    if (!this.finished) {
      this.#counter++;
      if (this.#counter >= this.#speed) {
        this.#counter = 0;
        if (!this.#loop && this.#frame >= this.#frames.length - 1) {
          this.finished = true;
        } else {
          this.#frame++;
          if (this.#frame >= this.#frames.length) {
            this.#frame = 0;
          }
        }
      }
    }
    return this.#frames[this.#frame];
  }
}
