import { EditorController } from './Controller';
import { CampEditorOptions } from './types';

class ContentArea {
  options: CampEditorOptions;
  $element: HTMLElement;
  controller: EditorController;

  constructor(options: CampEditorOptions, controller: EditorController) {
    this.controller = controller;
    this.options = options;

    this.$element = this.createContentArea(options);
  }

  createContentArea(options: CampEditorOptions) {
    const $element = document.createElement('div');
    $element.classList.add('ce-editor-content-area');
    $element.setAttribute('contenteditable', 'true');
    $element.setAttribute('placeholder', '석호짱');
    $element.style.height = options.height;
    return $element;
  }
}

export { ContentArea };
