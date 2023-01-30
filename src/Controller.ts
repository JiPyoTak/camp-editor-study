import { COMMAND_INFO } from './constants';
import { CampCommand } from './types';

// Controller: 이벤트 실행
class EditorController {
  $root: HTMLElement;
  selection: Selection;

  constructor($root: HTMLElement) {
    this.$root = $root;
    const selection = window.getSelection();
    this.selection = selection ?? new Selection();
    if (!selection) return;
  }

  execCommand(command: CampCommand) {
    // TODO: 많아지면 리팩토링 생각해보기
    switch (command) {
      case 'bold':
      case 'italic':
      case 'strike':
      case 'underline':
        this.applyFormat(command);
        break;

      default:
        break;
    }
  }

  applyFormat(command: CampCommand) {
    console.log(COMMAND_INFO[command]);
  }
}

export { EditorController };
