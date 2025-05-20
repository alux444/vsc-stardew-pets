declare function acquireVsCodeApi(): {
  postMessage: (msg: any) => void;
  setState: (state: any) => void;
  getState: () => any;
};
const vscode = acquireVsCodeApi();
export default vscode;