import * as vscode from "vscode";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  const disposableSidePreview = vscode.commands.registerCommand(
    "jsoncrack-vscode.start",
    async () => {
      initJsonCrack(context);
    }
  );

  context.subscriptions.push(disposableSidePreview);
}

async function initJsonCrack(context: vscode.ExtensionContext) {
  let currentTextEditor: vscode.TextEditor | undefined =
    vscode.window.visibleTextEditors[0];

  const panel = vscode.window.createWebviewPanel(
    "liveHTMLPreviewer",
    "JSON Crack",
    2,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(context.extensionPath, "build")),
        vscode.Uri.file(path.join(context.extensionPath, "assets")),
      ],
    }
  );

  panel.webview.postMessage({
    json: currentTextEditor?.document.getText(),
  });

  const onActiveEditorChange = vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      currentTextEditor = editor;
    }
  );

  const onTextChange = vscode.workspace.onDidChangeTextDocument(
    (changeEvent) => {
      panel.webview.postMessage({
        json: changeEvent.document.getText(),
      });
    }
  );

  panel.onDidDispose(
    () => {
      onTextChange.dispose();
      onActiveEditorChange.dispose();
    },
    null,
    context.subscriptions
  );

  const manifest = require(path.join(
    context.extensionPath,
    "build",
    "asset-manifest.json"
  ));

  const mainScript = manifest.files["main.js"];
  const mainStyle = manifest.files["main.css"];

  const basePathOnDisk = vscode.Uri.file(
    path.join(context.extensionPath, "build")
  );
  const scriptPathOnDisk = vscode.Uri.file(
    path.join(context.extensionPath, "build", mainScript)
  );
  const stylePathOnDisk = vscode.Uri.file(
    path.join(context.extensionPath, "build", mainStyle)
  );

  // const styleUri = stylePathOnDisk.with({ scheme: "vscode-resource" });

  //const baseUri = panel.webview.asWebviewUri(basePathOnDisk);
  const stylesMainUri = panel.webview.asWebviewUri(stylePathOnDisk);
  const scriptUri = panel.webview.asWebviewUri(scriptPathOnDisk);

  const nonce = getNonce();

  panel.webview.html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Security-Policy" content="default-src 'unsafe-inline' 'unsafe-eval' vscode-resource: data: https: http:;">

    <link href="${stylesMainUri}" rel="stylesheet">
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script nonce="${nonce}" src="${scriptUri}"></script>
  </body>
  </html>`;
}

// this method is called when your extension is deactivated
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
