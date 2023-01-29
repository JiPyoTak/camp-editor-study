import { EditorController } from './Controller';

class ContentArea {
  options: any;
  $element: HTMLElement;
  controller: EditorController;

  constructor(options: any, controller: EditorController) {
    this.controller = controller;
    this.options = options;

    this.$element = this.createContentArea(options);
  }

  createContentArea(options: any) {
    const $element = document.createElement('div');
    $element.classList.add('ce-editor-content-area');
    $element.setAttribute('contenteditable', 'true');
    $element.setAttribute('placeholder', '석호짱');
    $element.style.height = options.height;
    return $element;
  }
}

export { ContentArea };
