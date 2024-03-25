import * as vscode from "vscode";
import { createWebviewPanel } from "./webview";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("jsoncrack-vscode.start", () => createWebviewForActiveEditor(context)),
    vscode.commands.registerCommand("jsoncrack-vscode.start.specific", (content?: string) => createWebviewForContent(context, content)),
  );
}

async function createWebviewForActiveEditor(context: vscode.ExtensionContext) {
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

/**
 * Renders a readonly diagram from a string
 * @param context ExtensionContext
 * @param content JSON content as a string
 */
function createWebviewForContent(context?: vscode.ExtensionContext, content?: string): any {
  if (context && content) {
    const panel = createWebviewPanel(context);
    panel.webview.postMessage({
      json: content,
    });
  }
}

// This method is called when your extension is deactivated
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}