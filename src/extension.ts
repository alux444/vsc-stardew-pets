import * as vscode from "vscode";
import { PetViewProvider } from "./extension/PetViewProvider";
import { setPetsPath, loadPetsFile } from "./extension/pets";
import { setWebview, updateBackground, updateScale } from "./extension/webview";
import { registerCommands } from "./extension/commands";

const PET_TYPES: Record<string, string[]> = {
  cat: ["black", "grey", "orange", "purple", "white", "yellow"],
  dog: ["blonde", "gray", "brown", "dark brown", "light brown", "purple"],
  duck: [],
  raccoon: [],
  cow: ["white adult", "white baby", "brown adult", "brown baby"],
  pig: ["adult", "baby"],
  chicken: ["white adult", "blue adult", "brown adult", "black adult"],
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
