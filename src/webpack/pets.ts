import { Vec2, clamp, random } from "./util";
import { AI } from "./AI";
import { Animation } from "./Animation";
import type { Pet as PetType } from "../extension/pets";
import vscode from "./vscode";

export interface AnimationOptions {
  moveDown?: Animation;
  moveRight?: Animation;
  moveUp?: Animation;
  moveLeft?: Animation;
  idle?: Animation;
  special?: Animation;
  sleep?: Animation | Animation[];
}

function isAnimationKey(key: string): key is keyof AnimationOptions {
  return key === "moveDown" || key === "moveRight" || key === "moveUp" || key === "moveLeft" || key === "idle" || key === "special" || key === "sleep";
}

const DEFAULT_ANIMATION_OPTIONS: AnimationOptions = {
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
  moveLeft: new Animation(
    [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
    ],
    5,
    { flip: true }
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
  idle: new Animation([[0, 0]], 5, { loop: false }),
  sleep: new Animation(
    [
      [0, 3],
      [1, 3],
    ],
    30,
    { loop: false }
  ),
  special: new Animation(
    [
      [0, 4],
      [1, 4],
      [2, 4],
      [3, 4],
      [2, 4],
      [1, 4],
      [0, 4],
      [0, 0],
    ],
    5,
    { loop: false }
  ),
};

export interface PetOptions {
  name: string;
  color: string;
  petType: string;
  aiOptions?: Record<string, unknown>;
}

export class Pet {
  #init: boolean = false;
  #name: string = "Pet";
  get name(): string {
    return this.#name;
  }

  #petType: string = "";
  get petType(): string {
    return this.#petType;
  }

  #color: string = "Pet";
  get color(): string {
    return this.#color;
  }

  #timesPetted: number = 0;
  get timesPetted(): number {
    return this.#timesPetted;
  }

  #pos: Vec2 = new Vec2(0, 0);
  get pos(): Vec2 {
    return this.#pos;
  }

  #ai!: AI;
  get ai(): AI {
    return this.#ai;
  }

  #element!: HTMLElement;
  get element(): HTMLElement {
    return this.#element;
  }
  size: Vec2 = new Vec2(32, 32);

  #anim?: Animation;
  anims: AnimationOptions = DEFAULT_ANIMATION_OPTIONS;

  constructor(name: string, color: string, timesPetted: number = 0) {
    this.#name = name;
    this.#color = color;
    this.#timesPetted = timesPetted;
  }

  init(petType: string, aiOptions?: Record<string, unknown>): void {
    if (this.#init) return;
    if (petType === "") return;
    this.#petType = petType;
    const element = document.createElement("div");
    // @ts-expect-error: game is global in the webview context
    game.div.appendChild(element);
    this.#element = element;
    element.classList.add("pet");
    element.classList.add(this.petType);
    element.setAttribute("color", this.#color);
    this.respawn();
    this.#ai = new AI(this, aiOptions);
    // @ts-expect-error: game is global in the webview context
    game.pets.push(this);
    this.#init = true;
    element.onclick = () => this.#ai.click();
  }

  incrementTimesPetted(): void {
    this.#timesPetted++;
    const pet: PetType = {
      name: this.#name,
      color: this.#color,
      petType: this.#petType,
      timesPetted: this.#timesPetted,
    }; 
    console.log("Pet petted", pet);
    vscode.postMessage({
      type: "petPetted",
      pet,
    });
  }

  update(): void {
    this.#ai.update();
    if (this.#anim !== undefined) this.#selectSprite(this.#anim.update());
  }

  animate(name: string, force: boolean = false): void {
    if (!isAnimationKey(name)) return;
    let anim = this.anims[name];
    if (Array.isArray(anim)) anim = anim[random(anim.length - 1)];
    if (anim === this.#anim && !force) return;
    this.#anim = anim as Animation;
    this.#anim.reset();
    if (this.#anim.flip) this.element.setAttribute("flip", "");
    else this.element.removeAttribute("flip");
  }

  #selectSprite(offset: [number, number]): void {
    this.#element.style.setProperty("--offset-x", -(offset[0] * this.size.x) + "px");
    this.#element.style.setProperty("--offset-y", -(offset[1] * this.size.y) + "px");
  }

  get maxX(): number {
    // @ts-expect-error: game is global in the webview context
    return Math.floor(game.width / game.scale - this.size.x);
  }
  get maxY(): number {
    // @ts-expect-error: game is global in the webview context
    return Math.floor(game.height / game.scale - this.size.y);
  }
  get randomPoint(): Vec2 {
    return new Vec2(random(this.maxX), random(this.maxY));
  }

  moveTo(x: number | Vec2, y?: number): void {
    if (typeof x === "object") {
      y = x.y;
      x = x.x;
    }
    x = clamp(x, 0, this.maxX);
    y = clamp(y!, 0, this.maxY);
    this.#pos.x = x;
    this.#pos.y = y;
    this.#element.style.setProperty("--position-x", x + "px");
    this.#element.style.setProperty("--position-y", y + "px");
    this.#element.style.zIndex = String(y + this.size.y);
  }

  respawn(): void {
    this.moveTo(this.randomPoint);
  }
}

class PetSmall extends Pet {
  size: Vec2 = new Vec2(16, 16);
  constructor(name: string, color: string) {
    super(name, color);
  }
}
