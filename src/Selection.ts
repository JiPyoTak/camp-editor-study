interface Selection {
  isForward: boolean;
}

// 드래그시 정방향 여부를 판단
Object.defineProperty(Selection.prototype, 'isForward', {
  get: function (this: Selection) {
    const { anchorNode, anchorOffset, focusNode, focusOffset } = this;

    if (!anchorNode || !focusNode) return true;

    // 드래그 방향을 저장해야 한다.
    //// true = 정방향
    const selectionPosition = anchorNode.compareDocumentPosition(focusNode);
    const direction = !(
      (!selectionPosition && anchorOffset > focusOffset) ||
      selectionPosition === Node.DOCUMENT_POSITION_PRECEDING
    );

    return direction;
  },
});

const sel = document.getSelection();

const a = sel?.isForward;
