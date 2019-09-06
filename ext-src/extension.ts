import * as path from 'path';
import * as vscode from 'vscode';

/**
 * Manages webview panels
 */
class WebPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: WebPanel | undefined;

  private static readonly viewType = 'angular';

  private readonly panel: vscode.WebviewPanel;
  private readonly extensionPath: string;
  private readonly builtAppFolder: string;
  private disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionPath: string) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    // Otherwise, create angular panel.
    if (WebPanel.currentPanel) {
      WebPanel.currentPanel.panel.reveal(column);
    } else {
      WebPanel.currentPanel = new WebPanel(
        extensionPath,
        column || vscode.ViewColumn.One
      );
    }
    return WebPanel.currentPanel;
  }

  private constructor(extensionPath: string, column: vscode.ViewColumn) {
    this.extensionPath = extensionPath;
    this.builtAppFolder = 'dist';

    // Create and show a new webview panel
    this.panel = vscode.window.createWebviewPanel(
      WebPanel.viewType,
      'My Angular Webview',
      column,
      {
        // Enable javascript in the webview
        enableScripts: true,

        // And restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [
          vscode.Uri.file(path.join(this.extensionPath, this.builtAppFolder))
        ]
      }
    );

    // Set the webview's initial html content
    this.panel.webview.html = this._getHtmlForWebview();

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

    // Handle messages from the webview
    this.panel.webview.onDidReceiveMessage(
      (message: any) => {
        switch (message.command) {
          case 'alert':
            vscode.window.showErrorMessage(message.text);
            return;
        }
      },
      null,
      this.disposables
    );
  }

  public dispose() {
    WebPanel.currentPanel = undefined;

    // Clean up our resources
    this.panel.dispose();

    while (this.disposables.length) {
      const x = this.disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  /**
   * Returns html of the start page (index.html)
   */
  private _getHtmlForWebview() {
    // main
    const scriptPathOnDisk = vscode.Uri.file(
      path.join(this.extensionPath, 'dist/main-es5.js')
    );
    const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });

    // main es2015
    const script15PathOnDisk = vscode.Uri.file(
      path.join(this.extensionPath, 'dist/main-es2015.js')
    );
    const scriptEs2015Uri = script15PathOnDisk.with({
      scheme: 'vscode-resource'
    });

    // runtime
    const runtimePathOnDisk = vscode.Uri.file(
      path.join(this.extensionPath, 'dist/runtime-es5.js')
    );
    const runtimeUri = runtimePathOnDisk.with({ scheme: 'vscode-resource' });

    // runtime es2015
    const runtime15PathOnDisk = vscode.Uri.file(
      path.join(this.extensionPath, 'dist/runtime-es2015.js')
    );
    const runtimeEs2015Uri = runtime15PathOnDisk.with({
      scheme: 'vscode-resource'
    });

    // polyfill
    const polyfillPathOnDisk = vscode.Uri.file(
      path.join(this.extensionPath, 'dist/polyfills-es5.js')
    );
    const polyfillUri = polyfillPathOnDisk.with({ scheme: 'vscode-resource' });

    // polyfill es2015
    const polyfill15PathOnDisk = vscode.Uri.file(
      path.join(this.extensionPath, 'dist/polyfills-es2015.js')
    );
    const polyfillEs2015Uri = polyfill15PathOnDisk.with({
      scheme: 'vscode-resource'
    });

    // style
    const stylePathOnDisk = vscode.Uri.file(
      path.join(this.extensionPath, 'dist/styles.css')
    );
    const styleUri = stylePathOnDisk.with({ scheme: 'vscode-resource' });

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
        <meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
        <meta name="theme-color" content="#000000">
				<title>My Angular Webview</title>
				<link rel="stylesheet" type="text/css" href="${styleUri}">

				<base href="${vscode.Uri.file(
          path.join(this.extensionPath, this.builtAppFolder)
        ).with({
          scheme: 'vscode-resource'
        })}/">
			</head>

			<body>
				<noscript>You need to enable JavaScript to run this app.</noscript>
				<app-root></app-root>
        <script src="${runtimeEs2015Uri}" type="module"></script>
        <script src="${polyfillEs2015Uri}" type="module"></script>
        <script src="${scriptEs2015Uri}" type="module"></script>
        <script src="${runtimeUri}" nomodule defer></script>
        <script src="${polyfillUri}" nomodule defer></script>
        <script src="${scriptUri}" nomodule defer></script>
			</body>
			</html>`;
  }
}

/**
 * Activates extension
 * @param context vscode extension context
 */
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('angular-webview.start', () => {
      WebPanel.createOrShow(context.extensionPath);
    })
  );
}
