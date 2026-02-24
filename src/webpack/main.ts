import { Pet } from "./pets";
import { Cat } from "./pets/Cat";
import { Dog } from "./pets/Dog";
import { Turtle } from "./pets/Turtle";
import { Dino } from "./pets/Dino";
import { Duck } from "./pets/Duck";
import { Raccoon } from "./pets/Raccoon";
import { Goat } from "./pets/Goat";
import { Sheep } from "./pets/Sheep";
import { Ostrich } from "./pets/Ostrich";
import { Pig } from "./pets/Pig";
import { Rabbit } from "./pets/Rabbit";
import { Chicken } from "./pets/Chicken";
import { Cow } from "./pets/Cow";
import { Parrot } from "./pets/Parrot";
import { Junimo } from "./pets/Junimo";
import { Vec2 } from "./util";
import vscode from "./vscode";

console.log("Loaded main");
// Declare game as global for TS
declare global {
  interface Window {
    game: typeof game;
  }
}

const game = {
  div: document.getElementById("pets")!,
  width: window.innerWidth,
  height: window.innerHeight,
  mouse: {
    element: document.getElementById("mouse")!,
    pos: new Vec2(0, 0),
  },
  scale: 2,
  frames: 0,
  fps: 30,
  pets: [] as Pet[],
};
window.game = game;
console.log("Loaded frame");

const PET_CLASSES: Record<string, new (name: string, color: string, timesPetted: number, nextPettable: Date) => Pet> = {
  cat: Cat,
  dog: Dog,
  turtle: Turtle,
  dino: Dino,
  duck: Duck,
  raccoon: Raccoon,
  goat: Goat,
  sheep: Sheep,
  ostrich: Ostrich,
  pig: Pig,
  rabbit: Rabbit,
  chicken: Chicken,
  cow: Cow,
  parrot: Parrot,
  junimo: Junimo,
};

window.addEventListener("message", (event: MessageEvent) => {
  const message = event.data;
  switch (message.type.toLowerCase()) {
    case "add": {
      const PetClass = PET_CLASSES[message.petType];
      if (PetClass) {
        new PetClass(message.name, message.color, message.timesPetted, message.nextPettable);
        console.log("Added", message.petType, message.name, message.color, message.timesPetted, message.nextPettable);
      }
      break;
    }
    case "remove":
      const pet = game.pets[message.index];
      pet.element.remove();
      game.pets.splice(message.index, 1);
      break;
    case "removeAll":
      console.log("Removing all pets");
      game.pets.forEach((pet) => pet.element.remove());
      game.pets.length = 0;
      break;
    case "background":
      game.div.setAttribute("background", message.value.toLowerCase());
      break;
  }
});

function onResize(): void {
  game.width = window.innerWidth;
  game.height = window.innerHeight;
  game.pets.forEach((pet) => pet.moveTo(pet.pos));
}

function update(): void {
  if (game.width !== window.innerWidth || game.height !== window.innerHeight) onResize();
  game.frames++;
  game.pets.forEach((pet) => pet.update());
}

let lastTime = 0;
function animationLoop(time = 0) {
  if (time - lastTime > 1000 / game.fps) {
    update();
    lastTime = time;
  }
  requestAnimationFrame(animationLoop);
}
animationLoop();

game.div.onmousemove = (event) => {
  game.mouse.pos = new Vec2(event.clientX, event.clientY);
  game.mouse.element.style.left = game.mouse.pos.x + "px";
  game.mouse.element.style.top = game.mouse.pos.y + "px";
};

vscode.postMessage({ type: "init" });
