function getNodes() {
  const sel = window.getSelection();
  const range = sel.getRangeAt(0);
  const {
    commonAncestorContainer,
    startContainer,
    endContainer,
  } = range;
  const nodes = [];

  if (startContainer === endContainer) {
    return startContainer;
  }

  function getNodesRecursive(childList) {
    childList.forEach((node) => {
      const nodeSel = sel.containsNode(node, true);

      // if is not selected
      if (!nodeSel) return;

      const tempStr = node.nodeValue;

      if (node.nodeType === Node.TEXT_NODE && tempStr.replace(/^\s+|\s+$/gm, "") !== "") {
        nodes.push(node);
      }

      // <p> or <div>
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.childNodes) getNodesRecursive(node.childNodes);
      }

    });
  }

  getNodesRecursive(commonAncestorContainer.childNodes);

  return nodes;
}

export {getNodes};

// font-size가 좋지않을까

const Test = [
  ['undo', 'redo'],
  ['font', 'size', 'format'],
  ['font', 'size', 'format'],
  ['font', 'size', 'format'],

]

// Editor

interface IOption {
  height:string;

}


