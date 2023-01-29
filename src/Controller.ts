import { TOOLBAR } from './constants';
import { ToolbarOption } from './types';

// Controller: 이벤트 실행
class EditorController {
  selection: Selection;

  constructor() {
    const selection = window.getSelection();
    this.selection = selection ?? new Selection();
    if (!selection) return;
  }

  execCommand(command: ToolbarOption) {
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

  applyFormat(command: ToolbarOption) {
    //
    TOOLBAR[command];
  }
}

export { EditorController };
