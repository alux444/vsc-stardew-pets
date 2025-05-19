import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

let config = vscode.workspace.getConfiguration("vscode-stardew-pets");
let webview: PetViewProvider;
let extensionStorageFolder: string = "";

const PET_TYPES: { [key: string]: string[] } = {
  cat: ["black"],
};

let petsPath: string;

type Pet = {
  petType: string;
  name: string;
  color: string;
};
let pets: Pet[] = [];

class PetItem implements vscode.QuickPickItem {
  public index: number;
  public label: string;
  public description: string;

  constructor(index: number, name: string, description: string) {
    this.index = index;
    this.label = name;
    this.description = description;
  }
}

function loadPetsFile() {
  if (!fs.existsSync(extensionStorageFolder)) {
    fs.mkdirSync(extensionStorageFolder, { recursive: true });
  }

  if (fs.existsSync(petsPath)) {
    try {
      pets = JSON.parse(fs.readFileSync(petsPath, "utf8"));
      if (!Array.isArray(pets)) {
        pets = [];
      }
    } catch (e) {
      pets = [];
    }
  } else {
    savePets();
  }
}

function savePets() {
  fs.writeFileSync(petsPath, JSON.stringify(pets, null, 2));
}

function loadPet(pet: Pet) {
  console.log("Loading pet", pet);
  webview.postMessage({
    type: "add",
    petType: pet.petType,
    name: pet.name,
    color: pet.color,
  });
}

function addPet(pet: Pet) {
  pets.push(pet);
  savePets();
  loadPet(pet);
}

function removePet(index: number, save: boolean) {
  pets.splice(index, 1);
  webview.postMessage({
    type: "remove",
    index: index,
  });

  if (save) {
    savePets();
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log("Stardew Pets is now active");

  extensionStorageFolder = context.globalStorageUri.fsPath;
  petsPath = path.join(extensionStorageFolder, "pets.json");

  loadPetsFile();

  webview = new PetViewProvider(context);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider(PetViewProvider.viewType, webview));

  vscode.workspace.onDidChangeConfiguration((event) => {
    config = vscode.workspace.getConfiguration("vscode-stardew-pets");

    if (event.affectsConfiguration("vscode-stardew-pets.background")) {
      webview.postMessage({
        type: "background",
        value: config.get("background"),
      });
    }

    if (event.affectsConfiguration("vscode-stardew-pets.scale")) {
      webview.postMessage({
        type: "scale",
        value: config.get("scale"),
      });
    }
  });

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

    addPet({
      petType: pet,
      name,
      color: variant,
    });

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

    removePet(pet.index, true);
    vscode.window.showInformationMessage(`Bye ${pet.label} :(`);
  });

  const commandRemoveAllPets = vscode.commands.registerCommand("vscode-stardew-pets.removeAllPets", async () => {
    let petNames: string[] = [];
    for (let i = pets.length - 1; i >= 0; i--) {
      petNames.push(pets[i].name);
      removePet(i, false);
    }
    pets = [];
    savePets();
    webview.postMessage({
      type: "removeAll",
    });
    vscode.window.showInformationMessage(`Bye ${petNames.join(", ")} :(`);
  });

  const commandOpenPetsFile = vscode.commands.registerCommand("vscode-stardew-pets.openPetsFile", async () => {
    const uri = vscode.Uri.file(petsPath);
    await vscode.env.openExternal(uri);
  });

  const commandReloadPetsFile = vscode.commands.registerCommand("vscode-stardew-pets.reloadPetsFile", async () => {
    const petsLength = pets.length;
    for (let i = 0; i < petsLength; i++) {
      removePet(0, false);
    }
    loadPetsFile();
    for (const pet of pets) {
      loadPet(pet);
    }
  });

  context.subscriptions.push(commandAddPet, commandRemovePet, commandOpenPetsFile, commandRemoveAllPets, commandReloadPetsFile);
}

export function deactivate() {
  console.log("Stardew Pets is now deactivated");
}

export class PetViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "stardew-pets";
  private view?: vscode.WebviewView;

  constructor(private readonly context: vscode.ExtensionContext) {}

  public postMessage(message: any) {
    this.view?.webview.postMessage(message);
  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this.view = webviewView;
    const webview = webviewView.webview;

    webview.options = { enableScripts: true };
    webview.html = this.getHtmlContent(webview);

    webview.onDidReceiveMessage((message) => {
      switch (message.type) {
        case "error":
          vscode.window.showErrorMessage(message.text);
          break;
        case "info":
          vscode.window.showInformationMessage(message.text);
          break;
        case "init":
          webview.postMessage({
            type: "background",
            value: config.get("background"),
          });
          webview.postMessage({
            type: "scale",
            value: config.get("scale"),
          });
          pets.forEach((pet) => loadPet(pet));
          break;
      }
    });
  }

  private getHtmlContent(webview: vscode.Webview): string {
    const style = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "src", "webpack", "style.css"));
    const util = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "dist", "util.js"));
    const pets = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "dist", "pets.js"));
    const main = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "dist", "main.js"));
    console.log("pets", pets.toString());

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${style}" rel="stylesheet">
        <title>stardew pets</title>
      </head>
      <body>
        <div id="pets" background="${config.get("background")}">
        </div>
        <div id="mouse"></div>
        <script src="${util}"></script>
        <script src="${pets}"></script>
        <script src="${main}"></script>
      </body>
      </html>
    `;
  }
}
