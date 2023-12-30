import { Component } from '@angular/core';

declare function acquireVsCodeApi(): {
  postMessage(options: { command: string; data: unknown }): void;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styles: `button {
    background: rgb(108, 108, 255);
    color: white;
    padding: 5px 20px;
    border-radius: 4px;
    border: none;
  }`,
})
export class AppComponent {
  title = 'VSCode Webview Angular';
  vscode = acquireVsCodeApi();

  constructor() {
    window.addEventListener(
      'message',
      (
        event: MessageEvent<{ command: string; payload: { title: string } }>,
      ) => {
        if (event.data.command === 'update-title') {
          this.title = event.data.payload.title;
        }
      },
    );
  }

  postToExtension(text: string) {
    this.vscode.postMessage({
      command: 'notification',
      data: {
        text,
      },
    });
  }
}
