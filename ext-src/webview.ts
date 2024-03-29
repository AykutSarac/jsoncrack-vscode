import * as vscode from "vscode";
import * as path from "path";

export function createWebviewPanel(context: vscode.ExtensionContext) {
  const extPath = context.extensionPath;

  const panel = vscode.window.createWebviewPanel(
    "liveHTMLPreviewer",
    "JSON Crack",
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(extPath, "build")),
        vscode.Uri.file(path.join(extPath, "assets")),
      ],
    }
  );

  panel.iconPath = vscode.Uri.file(
    path.join(extPath, "build", "assets", "favicon.ico")
  );

  const manifest = require(path.join(extPath, "build", "asset-manifest.json"));
  const mainScript = manifest.files["main.js"];
  const mainStyle = manifest.files["main.css"];

  const scriptPathOnDisk = vscode.Uri.file(
    path.join(extPath, "build", mainScript)
  );
  const stylePathOnDisk = vscode.Uri.file(
    path.join(extPath, "build", mainStyle)
  );

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

  return panel;
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
