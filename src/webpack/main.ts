import { Pet } from "./pets";
import { Cat } from "./pets/Cat";

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
  scale: 2,
  frames: 0,
  fps: 30,
  pets: [] as Pet[],
};
window.game = game;
console.log("Loaded frame");

window.addEventListener("message", (event: MessageEvent) => {
  const message = event.data;
  switch (message.type.toLowerCase()) {
    case "add":
      switch (message.petType) {
        case "cat":
          new Cat(message.name, message.color);
          console.log("Added cat", message.name, message.color);
          break;
      }
      break;
    case "remove":
      const pet = game.pets[message.index];
      pet.element.remove();
      game.pets.splice(message.index, 1);
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

declare function acquireVsCodeApi(): {
  postMessage: (msg: any) => void;
  setState: (state: any) => void;
  getState: () => any;
};
const vscode = acquireVsCodeApi();
vscode.postMessage({ type: "init" });
