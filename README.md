# VSCode Webview based on Angular

This project contains starter template for your next VSCode extension based on `Angular` framework.

<div align="center">
<img src="https://raw.githubusercontent.com/4gray/vscode-webview-angular/master/screenshot.png" width="" alt="Screenshot" title="VSCode Webview Angular" />
</div>

Project was inspired by:
* [vscode-webview-react](https://github.com/rebornix/vscode-webview-react)
* [VSCode Webview API](https://code.visualstudio.com/api/extension-guides/webview)

## Development

This project was generated with `Angular CLI`, so it can be be used for angular development by default.

To test your extension in vscode context:
```
$ yarn install
$ yarn run build
```

After build process you can press F5 to "Start Debugging" (or: select in menu "Debug" -> "Start Debugging"). A new window will open in which you need to open command palette (Ctrl/Cmd + Shift + P) and select "Angular: Open Webview" to start your extension.

## Packaging

To generate extension in `VSIX` format execute the package command:

```
yarn run package
```

Finally the generated VSIX file with VSCode extension should appear in the root folder of your project.