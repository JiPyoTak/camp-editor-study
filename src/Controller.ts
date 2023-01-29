class EditorController {
  selection: Selection;
  constructor() {
    const selection = window.getSelection();
    this.selection = selection ?? new Selection();
    if (!selection) return;
  }

  execCommand(command: string) {}
}

export { EditorController };
