import * as vscode from "vscode";
import {createWebviewPanel} from "./webview";

function replaceEmptyKeys(obj: any): string {
    // Parse the input if it's a valid JSON string
    let parsedObj;
    try {
        parsedObj = typeof obj === "string" ? JSON.parse(obj) : obj;
    } catch {
        // If parsing fails, return the original object as a JSON string
        return obj;
    }

    function processObject(val: any, seen = new WeakSet()): any {
        if (val === null) {
            // Return null as is
            return null;
        }

        if (Array.isArray(val)) {
            // Handle arrays recursively
            return val.map((item) => processObject(item, seen));
        }

        if (typeof val === "object") {
            // Check for circular references
            if (seen.has(val)) {
                // Return the object as is for circular references
                return "[Circular]";
            }
            seen.add(val);

            const newObj: any = {};
            Object.keys(val).forEach((key) => {
                const newKey = key === "" ? "Empty_String" : key;
                newObj[newKey] = processObject(val[key], seen);
            });
            return newObj;
        }

        // Return primitive values as is
        return val;
    }

    const result = processObject(parsedObj);
    return JSON.stringify(result);
}



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
            const val = editor?.document.getText();
            panel.webview.postMessage({
                json: replaceEmptyKeys(val),
            });
        }
    });

    const onTextChange = vscode.workspace.onDidChangeTextDocument(
        (changeEvent) => {
            if (changeEvent.document === editor?.document) {
                let val = changeEvent.document.getText();
                if (val) {
                    try {
                        val = JSON.parse(val);
                    } catch (err) {
                        val = editor?.document.getText();
                    }
                }
                panel.webview.postMessage({
                    json: replaceEmptyKeys(val),
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
        let val = content;
        if (val) {
            try {
                val = JSON.parse(val);
            } catch (err) {
                val = content;
            }
        }
        panel.webview.postMessage({
            json: replaceEmptyKeys(val),
        });
    }
}

// This method is called when your extension is deactivated
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {
}