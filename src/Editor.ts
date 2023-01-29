import { EditorView } from './EditorView';
import type { CampEditorOptions } from './types';

class Editor {
  $root: HTMLElement;
  options: any;
  _editorView: EditorView;

  constructor(idOrEl: HTMLElement | string, options: CampEditorOptions = {}) {
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

export { Editor };
