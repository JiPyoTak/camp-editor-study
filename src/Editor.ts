import { Toolbar } from './Toolbar';
import { TOptions } from './types';
import { ContentArea } from './ContentArea';
import { EditorController } from './Controller';

class Editor {
  $root: HTMLElement;
  options: any;
  _editorView: EditorView;

  constructor(idOrEl: HTMLElement | string, options: TOptions) {
    this.$root = this.getRootElement(idOrEl);
    this.options = options;
    this._editorView = new EditorView(this.$root, options);
  }

  getRootElement(idOrEl: HTMLElement | string) {
    let $element = null;

    if (idOrEl instanceof HTMLElement) {
      $element = idOrEl;
    } else if (typeof idOrEl === 'string') {
      $element = document.getElementById(idOrEl);
    } else {
      throw new Error('초기화 에러 발생');
    }

    if (!$element) {
      throw new Error('태그가 존재하지 않습니다.');
    }

    return $element;
  }
}

class EditorView {
  $root: HTMLElement;
  _toolbar: Toolbar;
  _contentArea: ContentArea;

  options: TOptions;

  controller: EditorController;

  constructor($root: HTMLElement, options: TOptions) {
    this.$root = $root;
    this.options = options;

    this.controller = new EditorController();
    this._toolbar = new Toolbar(options, this.controller);
    this._contentArea = new ContentArea(options, this.controller);
    this.$root.appendChild(this._toolbar.$element);
    this.$root.appendChild(this._contentArea.$element);
  }
}

export { Editor };
