import * as vscode from "vscode";
import { loadPetsFile, pets, removePet, savePets } from "./pets";
import { loadPet, removePetFromWebview } from "./webview";

class PetItem implements vscode.QuickPickItem {
  constructor(public index: number, public label: string, public description: string) {}
}

export function registerCommands(context: vscode.ExtensionContext, PET_TYPES: { [key: string]: string[] }) {
  const commandAddPet = vscode.commands.registerCommand("vscode-stardew-pets.addPet", async () => {
    const pet = await vscode.window.showQuickPick(Object.keys(PET_TYPES), {
      title: "Select a pet",
      placeHolder: "pet",
    });
    if (!pet) return;

    const variants = PET_TYPES[pet].map((variant, i) => {
      let index = variant.indexOf(" adult");
      if (index === -1) index = variant.indexOf(" baby");
      let name = (index === -1 ? variant : variant.substring(0, index)).trim();
      let description = (index === -1 ? "" : variant.substring(index)).trim();
      return new PetItem(i, name, description);
    });

    const tmpvariant =
      variants.length === 0
        ? new PetItem(0, "", "")
        : await vscode.window.showQuickPick(variants, {
            title: "Select a variant",
            placeHolder: "variant",
          });
    if (!tmpvariant) return;

    const variant: string = (tmpvariant.label + " " + tmpvariant.description).trim();

    const name = await vscode.window.showInputBox({
      title: "Choose a name for your pet",
      placeHolder: "Enter pet name",
    });
    if (name === undefined) return;

    pets.push({
      petType: pet,
      name,
      color: variant,
      timesPetted: 0,
    });
    savePets();
    loadPet(pets[pets.length - 1]);
    vscode.window.showInformationMessage(`Hi ${name} :)`);
  });

  const commandRemovePet = vscode.commands.registerCommand("vscode-stardew-pets.removePet", async () => {
    const items = pets.map((pet, i) => new PetItem(i, pet.name, `${pet.color} ${pet.petType}`));
    const pet = await vscode.window.showQuickPick(items, {
      title: "Select a pet to remove",
      placeHolder: "pet",
      matchOnDescription: true,
    });
    if (!pet) return;
    pets.splice(pet.index, 1);
    removePetFromWebview(pet.index);
    savePets();
    vscode.window.showInformationMessage(`Bye ${pet.label} :(`);
  });

  const commandRemoveAllPets = vscode.commands.registerCommand("vscode-stardew-pets.removeAllPets", async () => {
    const petNames: string[] = [];
    for (let i = pets.length - 1; i >= 0; i--) {
      petNames.push(pets[i].name);
      removePet(i);
      removePetFromWebview(i);
    }
    savePets();
    vscode.window.showInformationMessage(`Bye ${petNames.join(", ")} :(`);
  });

  const commandReloadPetsFile = vscode.commands.registerCommand("vscode-stardew-pets.reloadPetsFile", async () => {
    for (let i = pets.length - 1; i >= 0; i--) {
      removePet(i);
      removePetFromWebview(i);
    }
    loadPetsFile();
    pets.forEach((pet) => loadPet(pet));
  });

  return [commandAddPet, commandRemovePet, commandRemoveAllPets, commandReloadPetsFile];
}
