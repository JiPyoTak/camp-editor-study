interface Selection {
  direction: boolean;
  $from: Node | null;
  $to: Node | null;
}

Object.defineProperty(Selection.prototype, 'direction', {
  get() {
    const { type, anchorNode, anchorOffset, focusNode, focusOffset } = this;

    if (type === 'None' || !anchorNode || !focusNode) return true;

    const selectionPosition = anchorNode.compareDocumentPosition(focusNode);
    return !(
      (!selectionPosition && anchorOffset > focusOffset) ||
      selectionPosition === Node.DOCUMENT_POSITION_PRECEDING
    );
  },
});
Object.defineProperty(Selection.prototype, '$from', {
  get() {
    return this.direction ? this.anchorNode : this.focusNode;
  },
});
Object.defineProperty(Selection.prototype, '$to', {
  get() {
    return this.direction ? this.focusNode : this.anchorNode;
  },
});
