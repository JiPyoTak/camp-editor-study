import { TOOLBAR } from './constants';
import type { ToolbarOption, TOptions } from './types';
import { EditorController } from './Controller';

class Toolbar {
  $element: HTMLElement;
  options: TOptions;
  controller: EditorController;

  constructor(options: TOptions, controller: EditorController) {
    this.controller = controller;
    this.$element = document.createElement('div');
    this.$element.classList.add('ce-editor-toolbar');
    this.options = options;
    const $buttons = this.options.buttons.map((ops) => {
      return this.createGroup(ops);
    });
    this.$element.append(...$buttons);
  }

  createGroup(options: ToolbarOption[]) {
    const $element = document.createElement('div');
    $element.classList.add('ce-editor-box');
    const children = options.map((option) => {
      return this.createButton(option);
    });
    $element.append(...children);
    return $element;
  }

  createButton(option: ToolbarOption) {
    const $element = document.createElement('button');
    $element.classList.add('ce-editor-btn');
    $element.setAttribute('data-command', option);

    const { icon } = TOOLBAR[option] ?? {};
    if (!icon) throw new Error('존재하지 않는 버튼 옵션입니다');

    const $icon = document.createElement('img');
    $icon.src = icon;
    $element.appendChild($icon);

    return $element;
  }

  initEventListener() {
    this.$element.addEventListener('click', (e: MouseEvent) => {
      const $targetButton = (e.target as HTMLElement).closest(
        '.ce-editor-btn'
      ) as HTMLElement;

      if (!$targetButton) return;

      const command = $targetButton.dataset.command as ToolbarOption;

      if (!command) return;

      this.controller.execCommand(command);
    });
  }
}

export { Toolbar };
