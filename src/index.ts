import { Editor } from './Editor';
import type { CampEditorOptions } from './types';
import '../css/editor.css';

const options = {
  height: 1000,
  buttons: [
    ['bold', 'italic'],
    ['underline', 'strike'],
  ],
} as CampEditorOptions;

new Editor('editor', options);
