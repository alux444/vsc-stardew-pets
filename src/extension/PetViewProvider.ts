import * as vscode from "vscode";
import { pets, updatePetTimesPetted } from "./pets";
import { loadPet } from "./webview";

export class PetViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "stardew-pets";
  private view?: vscode.WebviewView;

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly config: vscode.WorkspaceConfiguration,
  ) {}

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
        case "petPetted":
          vscode.window.showInformationMessage(`You petted ${message.pet.name} ${message.pet.timesPetted} times`);
          updatePetTimesPetted(message.pet);
          break;
        case "init":
          webview.postMessage({
            type: "background",
            value: this.config.get("background"),
          });
          webview.postMessage({
            type: "scale",
            value: this.config.get("scale"),
          });
          pets.forEach((pet) => loadPet(pet));
          break;
      }
    });
  }

  private getHtmlContent(webview: vscode.Webview): string {
    const style = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "media", "style.css"));
    console.log(style.toString());
    const main = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "media", "webview.js"));

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
        <div id="pets" background="${this.config.get("background")}">
        </div>
        <div id="mouse"></div>
        <script src="${main}"></script>
      </body>
      </html>
    `;
  }
}
