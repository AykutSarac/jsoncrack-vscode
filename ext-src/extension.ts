import * as vscode from "vscode";
import { createWebviewPanel } from "./webview";

export function activate(context: vscode.ExtensionContext) {
  const cmd = "jsoncrack-vscode.start";
  const init = () => initJsonCrack(context);
  const disposable = vscode.commands.registerCommand(cmd, init);
  context.subscriptions.push(disposable);
}

async function initJsonCrack(context: vscode.ExtensionContext) {
  const panel = createWebviewPanel(context);
  const editor = vscode.window.activeTextEditor;

  const onReceiveMessage = panel.webview.onDidReceiveMessage((e) => {
    if (e === "ready") {
      panel.webview.postMessage({
        json: editor?.document.getText(),
      });
    }
  });

  const onTextChange = vscode.workspace.onDidChangeTextDocument(
    (changeEvent) => {
      if (changeEvent.document === editor?.document) {
        panel.webview.postMessage({
          json: changeEvent.document.getText(),
        });
      }
    }
  );

  const disposer = () => {
    onTextChange.dispose();
    onReceiveMessage.dispose();
  };

  panel.onDidDispose(disposer, null, context.subscriptions);
}

// This method is called when your extension is deactivated
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
