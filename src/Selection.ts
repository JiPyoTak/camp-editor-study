interface Selection {
  getSelection(): Selection;
}

Object.defineProperty(Selection.prototype, 'getSelection', {});
