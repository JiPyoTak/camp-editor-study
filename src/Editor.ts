class Editor {
  $element: HTMLElement | string;
  options: any;
  constructor(idOrEl: HTMLElement | string, options: any) {
    this.$element = this.getRootElement(idOrEl);
    this.options = options;
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
  $element: HTMLElement;
  $toolbar: Toolbar;
  $contentArea: HTMLElement;

  options: any;

  constructor($element: HTMLElement, options: any) {
    this.$element = $element;

    this.$toolbar = new Toolbar(options);
    // this.$contentArea = new ContentArea(options);
  }
}

class Toolbar {
  $element: HTMLElement;
  options: any;

  constructor(options: any) {
    this.options = options;
  }

  create() {}
}

class ContentArea {
  options: any;

  constructor(options) {
    this.options = options;
  }
}
// class EditorController { }

export { Editor };

const options = {
  buttons: [['bold', ''], [], []],
};
