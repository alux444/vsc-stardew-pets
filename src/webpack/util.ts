export function random(max: number): number {
  return Math.floor(Math.random() * (max + 1));
}

export function clamp(number: number, min: number, max: number): number {
  return Math.min(Math.max(number, min), max);
}

export function moveTowards(current: number, target: number, delta: number): number {
  const diff = target - current;
  const distance = Math.abs(diff);
  if (distance === 0) return current; // Already at target
  if (distance < delta) return target;
  return current + (diff / distance) * delta;
}

export class Vec2 {
  x: number = 0;
  y: number = 0;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y !== 0 ? y : this.x;
  }

  clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  add(n: number | Vec2): Vec2 {
    if (typeof n === "object") return new Vec2(this.x + n.x, this.y + n.y);
    else return new Vec2(this.x + n, this.y + n);
  }

  sub(n: number | Vec2): Vec2 {
    if (typeof n === "object") return new Vec2(this.x - n.x, this.y - n.y);
    else return new Vec2(this.x - n, this.y - n);
  }

  mult(n: number | Vec2): Vec2 {
    if (typeof n === "object") return new Vec2(this.x * n.x, this.y * n.y);
    else return new Vec2(this.x * n, this.y * n);
  }

  div(n: number | Vec2): Vec2 {
    if (typeof n === "object") return new Vec2(this.x / n.x, this.y / n.y);
    else return new Vec2(this.x / n, this.y / n);
  }

  toInt(): Vec2 {
    return new Vec2(Math.floor(this.x), Math.floor(this.y));
  }
}

export class Timer {
  #active: boolean = false;
  #end: number = 0;

  constructor() {}

  get justFinished(): boolean {
    // @ts-expect-error: game is global in the webview context
    return this.#active && game.frames === this.#end;
  }
  get finished(): boolean {
    // @ts-expect-error: game is global in the webview context
    return this.#active && game.frames >= this.#end;
  }

  count(frames: number): void {
    this.#active = true;
    // @ts-expect-error: game is global in the webview context
    this.#end = game.frames + frames;
  }

  reset(): void {
    this.#active = false;
  }
}
