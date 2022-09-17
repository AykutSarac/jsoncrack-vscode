import * as vscode from "vscode";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  // commandId
  const SIDE_PREVIEW_COMMAND = "jsoncrack-vscode.helloWorld";

  const disposableSidePreview = vscode.commands.registerCommand(
    SIDE_PREVIEW_COMMAND,
    async () => {
      initJsonCrack(context);
    }
  );

  context.subscriptions.push(disposableSidePreview);
}

async function initJsonCrack(context: vscode.ExtensionContext) {
  const manifest = require(path.join(
    context.extensionPath,
    "build",
    "asset-manifest.json"
  ));
  const mainScript = manifest["main.js"];
  const mainStyle = manifest["main.css"];

  const scriptPathOnDisk = vscode.Uri.file(
    path.join(context.extensionPath, "build", mainScript)
  );
  const scriptUri = scriptPathOnDisk.with({ scheme: "vscode-resource" });
  const stylePathOnDisk = vscode.Uri.file(
    path.join(context.extensionPath, "build", mainStyle)
  );
  const styleUri = stylePathOnDisk.with({ scheme: "vscode-resource" });

  const panel = vscode.window.createWebviewPanel(
    // Webview id
    "liveHTMLPreviewer",
    // Webview title
    "JSON Crack",
    // This will open the second column for preview inside editor
    2,
    {
      // Enable scripts in the webview
      enableScripts: true,
      retainContextWhenHidden: true,
      // And restrict the webview to only loading content from our extension's `assets` directory.
      localResourceRoots: [
        vscode.Uri.file(path.join(context.extensionPath, "build")),
        vscode.Uri.file(path.join(context.extensionPath, "assets")),
      ],
    }
  );

  const nonce = getNonce();

  panel.webview.html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
    <meta name="theme-color" content="#000000">
    <title>React App</title>
    <link rel="stylesheet" type="text/css" href="${styleUri}">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';style-src vscode-resource: 'unsafe-inline' http: https: data:;">
    <base href="${vscode.Uri.file(
      path.join(context.extensionPath, "build")
    ).with({
      scheme: "vscode-resource",
    })}/">
  </head>

  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    
    <script nonce="${nonce}" src="${scriptUri}"></script>
  </body>
  </html>`;
}

// this method is called when your extension is deactivated
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
