import * as vscode from "vscode";
import { PetViewProvider } from "./extension/PetViewProvider";
import { setPetsPath, loadPetsFile } from "./extension/pets";
import { setWebview, updateBackground, updateScale } from "./extension/webview";
import { registerCommands } from "./extension/commands";

const PET_TYPES: Record<string, string[]> = {
  cat: ["black", "grey", "orange", "purple", "white", "yellow"],
  dog: ["blonde", "gray", "brown", "dark brown", "light brown", "purple"],
  turtle: ["green", "purple"],
  dino: [],
  duck: [],
  raccoon: [],
  goat: ["adult", "baby"],
  sheep: ["adult", "baby"],
  ostrich: ["adult", "baby"],
  pig: ["adult", "baby"],
  rabbit: ["adult", "baby"],
  chicken: ["white adult", "white baby", "blue adult", "blue baby", "brown adult", "brown baby", "black adult", "black baby"],
  cow: ["white adult", "white baby", "brown adult", "brown baby"],
  parrot: ["green adult", "green baby", "blue adult", "blue baby", "golden joja"],
  junimo: ["white", "black", "gray", "pink", "red", "orange", "yellow", "green", "cyan", "purple", "brown"],
};

export function activate(context: vscode.ExtensionContext) {
  console.log("Stardew Pets is now active");

  setPetsPath(context.globalStorageUri.fsPath);
  loadPetsFile();

  const webview = new PetViewProvider(context, vscode.workspace.getConfiguration("vscode-stardew-pets"));
  setWebview(webview);

  context.subscriptions.push(vscode.window.registerWebviewViewProvider(PetViewProvider.viewType, webview), ...registerCommands(context, PET_TYPES));

  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration("vscode-stardew-pets.background")) {
      updateBackground(vscode.workspace.getConfiguration("vscode-stardew-pets").get("background"));
    }
    if (event.affectsConfiguration("vscode-stardew-pets.scale")) {
      updateScale(vscode.workspace.getConfiguration("vscode-stardew-pets").get("scale"));
    }
  });
}

export function deactivate() {
  console.log("Stardew Pets is now deactivated");
}
