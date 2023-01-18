import { EditorOption, ToolbarOption } from './types';
import { TOOLBAR } from './constants/toolbar';
import { isSizeAttribute, isNumber } from './utils';
import { Core } from './core';

class CampEditor {
  $element: Element;

  /**
   * @description Create the CampEditor
   * @param elementOrId
   * @param options
   */
  constructor(elementOrId: Element | string, options: EditorOption) {
    this.$element = this.getElement(elementOrId, options);

    this.createToolbar(options.toolbarOptions);
    this.createContentArea(options);
  }

  /**
   * @description
   * @param elementOrId
   */
  getElement(
    elementOrId: Element | string,
    { width = 700, height = 700 }: EditorOption
  ): Element {
    let $element = null;

    if (elementOrId instanceof HTMLElement) {
      $element = elementOrId;
    } else if (typeof elementOrId === 'string') {
      $element = document.getElementById(elementOrId);
    }

    if (!$element) {
      throw new Error(
        `CampEditor init: Wrong type elementOrId => ${elementOrId}`
      );
    }

    if (isNumber(width)) {
      width = `${width}px`;
    } else if (!isSizeAttribute(width)) {
      throw new Error('width 잘못 입력했어 자식아');
    }

    if (isNumber(height)) {
      height = `${height}px`;
    } else if (!isSizeAttribute(height)) {
      throw new Error('height 잘못 입력했어 자식아');
    }

    const contentStyle = `width: ${width}; height: ${height};`;
    $element.setAttribute('style', contentStyle);

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
      option.forEach((item) => {
        const $button = this.createButton(item);
        if ($button) {
          box.appendChild($button);
        }
      });
      $toolbarLine.appendChild(box);
    });

    $toolbar.appendChild($toolbarLine);
    this.onClickToolbarButton($toolbar);
    this.$element.appendChild($toolbar);
  }

  // 버튼 하나 생성
  createButton(toolbarOption: ToolbarOption) {
    if (!(toolbarOption in TOOLBAR))
      throw new Error(
        `CampEditor ToolBar: Wrong ToolbarOption => ${toolbarOption}`
      );

    const data = TOOLBAR[toolbarOption];

    if (!data)
      throw new Error(
        `CampEditor ToolBar: Need to pacify ToolbarOption => ${toolbarOption}`
      );

    const $button = document.createElement('button');
    $button.classList.add('ce-editor-btn', 'smaller');
    $button.setAttribute('data-type', toolbarOption);
    const $buttonImage = document.createElement('img');
    $buttonImage.src = data.icon;
    $button.appendChild($buttonImage);

    return $button;
  }

  createContentArea({ placeholder }: EditorOption) {
    const $contentArea = document.createElement('div');

    $contentArea.setAttribute('contenteditable', 'true');
    $contentArea.classList.add('ce-content-area');
    if (placeholder) {
      $contentArea.setAttribute('placeholder', placeholder);
    }
    $contentArea.append(document.createElement('p'));

    this.addParagraphTag($contentArea);
    this.$element.appendChild($contentArea);
  }

  addParagraphTag($contentArea: HTMLElement) {
    $contentArea.addEventListener('keydown', (e) => {
      const { key } = e as KeyboardEvent;
      const { children } = $contentArea;

      if (key === 'Enter') {
        const selection = document.getSelection();
        if (selection?.anchorNode?.parentElement?.tagName === 'LI') return;
        document.execCommand('formatBlock', false, 'p');
      } else if (
        key === 'Backspace' &&
        children.length === 1 &&
        children[0].textContent === ''
      )
        e.preventDefault();
    });
  }

  onClickToolbarButton($toolbar: Element) {
    $toolbar.addEventListener('click', (e) => {
      const eventTarget = e.target as HTMLElement;
      const $button = eventTarget.closest('button');

      if (!$button) return;

      const buttonType = $button.dataset.type ?? '';
      console.log(buttonType);

      if (!(buttonType in TOOLBAR)) return;

      Core.applyFeat(buttonType);
    });
  }
}

export { CampEditor };

// // 사용
// const { command } = event.target.dataset;
// 기능들.apply(command);

// // 구현
// class 기능들 {
//   applyFeature(command) {
//     if (command === 'bold') this.bold();
//   }
//   bold() {
//     //선택된거에 bold 적용
//   }
// }

// 초기 contentArea에서 텍스트 입력시 p태그 내부에서 작성되게 하기
// backspace 입렧시 마지막 p 태그 사라지지 않게 하기
// enter 입력시 p태그 자동 생성 (not DIV)
