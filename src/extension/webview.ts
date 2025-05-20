import { Pet } from "./pets";
import { PetViewProvider } from "./PetViewProvider";

let webview: PetViewProvider;

export function setWebview(wv: PetViewProvider) {
  webview = wv;
}

export function loadPet(pet: Pet) {
  webview.postMessage({
    type: "add",
    petType: pet.petType,
    name: pet.name,
    color: pet.color,
    timesPetted: pet.timesPetted,
  });
}

export function removePetFromWebview(index: number) {
  webview.postMessage({ type: "remove", index });
}

export function updateBackground(value: any) {
  webview.postMessage({ type: "background", value });
}

export function updateScale(value: any) {
  webview.postMessage({ type: "scale", value });
}