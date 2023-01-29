type TOptions = { buttons: ToolbarOption[][] };

type ToolbarOption =
  | 'undo'
  | 'redo'
  | 'font'
  | 'font-size'
  | 'bold'
  | 'underline'
  | 'italic'
  | 'strike'
  | 'subscript'
  | 'superscript'
  | 'remove-format'
  | 'heading'
  | 'font-color'
  | 'font-background-color'
  | 'code-block'
  | 'inline-code-block'
  | 'indent'
  | 'outdent'
  | 'order-list'
  | 'unorder-list'
  | 'align'
  | 'horizontal-line'
  | 'line-height'
  | 'table'
  | 'image'
  | 'video'
  | 'preview'
  | 'show-block'
  | 'full-screen'
  | 'help';

type ToolbarButtonInfo = {
  icon: string;
  tagName?: keyof HTMLElementTagNameMap;
};

type Toolbars = {
  [key in ToolbarOption]?: ToolbarButtonInfo;
};

interface EditorOption {
  width?: number | string;
  height?: number | string;
  placeholder?: string;
  toolbarOptions: ToolbarOption[][];
}

export type {
  TOptions,
  EditorOption,
  ToolbarOption,
  ToolbarButtonInfo,
  Toolbars,
};
