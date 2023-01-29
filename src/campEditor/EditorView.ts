/**
 *
 */
class EditorView {
  controller: EditorController;
  $textarea: Element;
  // DI (Dependency Injection)
  constructor(controller: EditorController) {
    this.controller = controller;
  }
  // selection을 통해서 virtual dom까지 변경시켜준다면 ? EditorView가 되지 않을까?
}

class EditorController {
  selection: Selection;

  constructor() {
    this.selection = window.getSelection() as Selection;
  }
}

export { EditorView, EditorController };
