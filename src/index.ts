import { Editor } from './Editor';
import type { TOptions } from './types';
import '../css/editor.css';

const options = {
  buttons: [
    ['bold', 'italic'],
    ['underline', 'strike'],
  ],
} as TOptions;

new Editor('editor', options);
