import { TOOLBAR } from './constants';
import type { ToolbarOption, TOptions } from './types';

class Toolbar {
  $element: HTMLElement;
  options: TOptions;

  constructor(options: TOptions) {
    this.$element = document.createElement('div');
    this.options = options;
    const $buttons = this.options.buttons.map((ops) => {
      return this.createGroup(ops);
    });
    this.$element.append(...$buttons);
  }

  createGroup(options: ToolbarOption[]) {
    const $element = document.createElement('div');
    const children = options.map((option) => {
      return this.createButton(option);
    });
    $element.append(...children);
    return $element;
  }

  createButton(option: ToolbarOption) {
    const $element = document.createElement('button');
    $element.setAttribute('data-id', option);

    const { icon } = TOOLBAR[option] ?? {};
    if (!icon) throw new Error('존재하지 않는 버튼 옵션입니다');

    const $icon = document.createElement('img');
    $icon.src = icon;
    $element.appendChild($icon);

    return $element;
  }
}

export { Toolbar };
