import { Editor } from './Editor';
import type { CampEditorOptions } from './types';
import '../css/editor.css';

const options = {
  height: '1000px',
  buttons: [
    ['bold', 'italic'],
    ['underline', 'strike'],
  ],
} as Partial<CampEditorOptions>;

new Editor('editor', options);
