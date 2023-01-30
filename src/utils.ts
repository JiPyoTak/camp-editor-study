import { CampEditorOptions } from './types';

export const defaultOptions: Pick<
  CampEditorOptions,
  'width' | 'height' | 'placeholder' | 'buttons'
> = {
  height: '300px',
  width: '500px',
  buttons: [
    ['bold', 'italic'],
    ['underline', 'strike'],
  ],
  placeholder: '내용을 입력하세요',
};

// 지정하지 않은 옵션이 들어왔을때
export function getOptions(
  options: Partial<CampEditorOptions>
): CampEditorOptions {
  // todo
  return {
    ...defaultOptions,
    ...options,
  };
}
