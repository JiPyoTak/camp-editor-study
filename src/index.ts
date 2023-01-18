import { CampEditor } from './campEditor/campEditor';
import '../css/editor.css';

new CampEditor('editor', {
  width: 1000,
  height: 400,
  placeholder: '적으시던가',
  toolbarOptions: [['bold', 'italic', 'underline', 'strike']],
});
