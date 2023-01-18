class Core {
  static applyFeat(command: string) {
    switch (command) {
      case 'bold': {
        this.bold();
        break;
      }
      default:
        break;
    }
  }

  private static bold() {
    // 1. 드래그시
    //    1.1 한줄
    //    1.2 여러줄
    // 2. 드래그하지 않고실행시

    const selection = document.getSelection();

    if (!selection) return;

    const range = selection.getRangeAt(0);
    const { commonAncestorContainer } = range;

    const selectedNodes = this.getNodes(
      selection,
      commonAncestorContainer.childNodes
    );

    console.log(commonAncestorContainer, commonAncestorContainer.childNodes);
  }
  // italic() {}

  private static getNodes(
    selection: Selection,
    childList: NodeListOf<ChildNode>
  ) {
    const nodes: ChildNode[] = [];

    childList.forEach((n) => {
      const stack = [n];

      while (stack.length) {
        const node = stack.pop();

        if (!node) return;

        const nodeSel = selection.containsNode(node, true);
        // if is not selected
        if (!nodeSel) return;

        // const tempStr = node.textContent;

        if (
          node.nodeType === Node.TEXT_NODE
          // &&tempStr.replace(/^\s+|\s+$/gm, '') !== ''
        ) {
          nodes.push(node);
        }

        if (node.nodeType === Node.ELEMENT_NODE && node.childNodes) {
          node.childNodes.forEach((n) => stack.push(n));
        }
      }
    });

    return nodes;
  }
}

export { Core };

/*
bold.addEventListener("mousedown", (e) => {
  e.preventDefault();
  const selection = window.getSelection();

  // 선택된 적이 없을 때
  const { type, anchorNode, anchorOffset, focusNode } = selection;
  if (type === "None" || !anchorNode) return;

  // editor 안에서 focus 인지 확인
  const parent = anchorNode.parentElement;
  const editor = parent.closest("#editor");
  if (!editor) return;

  <p></p>
  // 현재 커서에서 시작할 때 / anchorNode nodeName === "#text"
  if (type === "Caret" && anchorNode.nodeType === 3) {
    const zeroSpace = "&ZeroWidthSpace;";
    const text = anchorNode.data;

    // strong 태그 앞에서 추가될 때
    const ns = focusNode.nextSibling;
    if (ns && ns.nodeName === "STRONG" && anchorOffset === text.length)
      return (ns.innerHTML = `${zeroSpace}${ns.innerHTML}`);

    const newBold = document.createElement("strong");
    newBold.innerHTML = zeroSpace;

    parent.insertBefore(
      document.createTextNode(text.slice(0, anchorOffset)),
      anchorNode
    );
    parent.insertBefore(newBold, anchorNode);
    anchorNode.nodeValue = text.slice(anchorOffset);
  }
});
*/

// <p></P>
// asdasasd<strong>asdasd</strong>asdasd
