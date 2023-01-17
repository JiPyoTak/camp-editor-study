import {EditorOption, ToolbarOption} from "./types.ts";
import {TOOLBAR} from "./constants/toolbar.ts";


class CampEditor {
  $element: Element;

  /**
   * @description Create the CampEditor
   * @param elementOrId
   * @param options
   */
  constructor(elementOrId: Element | string, options: EditorOption) {
     
    this.$element = this.getElement(elementOrId);
    this.createToolbar(options.toolbarOptions);
  }

  /**
   * @description
   * @param elementOrId
   */
  getElement(elementOrId: Element | string): Element {
    let $element = null;

    if (elementOrId instanceof HTMLElement) {
      $element = elementOrId;
    } else if (typeof elementOrId === 'string') {
      $element = document.getElementById(elementOrId);

      if (!$element) {
        throw new Error(`CampEditor init: Wrong id => ${elementOrId}`);
      }
    }

    if (!$element) {
      throw new Error(`CampEditor init: Wrong type elementOrId => ${elementOrId}`);
    }


    return $element;
  }

  createToolbar(toolbarOptions: ToolbarOption[][]) {
    const $toolbar = document.createElement('div');
    $toolbar.classList.add('ce-editor-toolbar');

    const $toolbarLine = document.createElement('div');
    $toolbarLine.classList.add('ce-editor-line');

    toolbarOptions.forEach((option) => {
      const box = document.createElement('div');
      box.classList.add('ce-editor-box');
      option.forEach(item => {
        const $button = this.createButton(item);
        if ($button) {
          box.appendChild($button)
        }
      })
      $toolbarLine.appendChild(box);
    })

    $toolbar.appendChild($toolbar);
    this.$element.appendChild($toolbar);
  }

  // 버튼 하나 생성
  createButton(toolbarOption: ToolbarOption) {
    if (!(toolbarOption in TOOLBAR)) throw new Error(`CampEditor ToolBar: Wrong ToolbarOption => ${toolbarOption}`);

    const data = TOOLBAR[toolbarOption];

    if (!data) throw new Error(`CampEditor ToolBar: Need to pecify ToolbarOption => ${toolbarOption}`);

    const $button = document.createElement('button');
    $button.classList.add('ce-editor-btn', 'smaller');
    const $buttonImage = document.createElement('img');
    $buttonImage.src = data.icon;
    $button.appendChild($buttonImage);
    return $button;
  }
}

export { CampEditor };