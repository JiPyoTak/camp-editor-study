const editor = document.querySelector('.ce-editor');
const toolbar = editor.querySelector('.ce-editor-toolbar');
const buttons = toolbar.querySelectorAll('.ce-editor-btn:not(.ce-editor-has-submenu)');
const contentArea = document.querySelector('.ce-content-area');

contentArea.addEventListener('keypress', addParagraphTag);

for (let i = 0; i < buttons.length; i++){
  let button = buttons[i];

  button.addEventListener('click', function(event) {
    const tagName = this.dataset.tagName;
    if (['strong', 'del', 'i', 'u'].includes(tagName)) {
      applyTextStyle(tagName);
    }
  })
}


// https://stackoverflow.com/questions/29894781/javascript-selected-text-highlighting-prob
function applyTextStyle(tagName) {
  const sel = window.getSelection();
  const range = sel.getRangeAt(0);
  const {
    commonAncestorContainer,
    startContainer,
    endContainer,
    startOffset,
    endOffset,
  } = range;
  const nodes = [];

  console.group("range");

  console.log("range", range);
  console.log("commonAncestorContainer", commonAncestorContainer);
  console.log("startContainer", startContainer);
  console.log("endContainer", endContainer);
  console.log("startOffset", startOffset);
  console.log("endOffset", endOffset);
  console.log("startContainer.parentNode", startContainer.parentNode);
  console.groupEnd();

  if (startContainer === endContainer) {
    const newNode = document.createElement(tagName);
    range.surroundContents(newNode);
    return;
  }

  // get all posibles selected nodes
  function getNodes(childList) {
    console.group("***** getNode: ", childList);
    childList.forEach((node) => {
      console.log("node:", node, "nodoType", node.nodeType);

      const nodeSel = sel.containsNode(node, true);
      console.log("nodeSel", nodeSel);

      // if is not selected
      if (!nodeSel) return;

      const tempStr = node.nodeValue;
      console.log("nodeValue:", tempStr);

      if (node.nodeType === Node.TEXT_NODE && tempStr.replace(/^\s+|\s+$/gm, "") !== "") {
        console.log("정상 노드");
        nodes.push(node);
      }

      // <p> or <div>
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.childNodes) getNodes(node.childNodes);
      }
    });
    console.groupEnd();
  }

  getNodes(commonAncestorContainer.childNodes);

  console.log(nodes);

  nodes.forEach((node, index, listObj) => {
    const { nodeValue } = node;
    let text, prevText, nextText;

    if (index === 0) {
      prevText = nodeValue.substring(0, startOffset);
      text = nodeValue.substring(startOffset);
    } else if (index === listObj.length - 1) {
      text = nodeValue.substring(0, endOffset);
      nextText = nodeValue.substring(endOffset);
    } else {
      text = nodeValue;
    }

    const newNode = document.createElement(tagName);
    newNode.append(document.createTextNode(text));
    const { parentNode } = node;

    parentNode.replaceChild(newNode, node);

    if (prevText) {
      const prevDOM = document.createTextNode(prevText);
      parentNode.insertBefore(prevDOM, newNode);
    }

    if (nextText) {
      const nextDOM = document.createTextNode(nextText);
      parentNode.insertBefore(nextDOM, newNode.nextSibling);
    }
  });

  sel.removeRange(range);
}

function addParagraphTag(event) {
  if (event.key === 'Enter') {

    // don't add a p tag on list item
    if(window.getSelection().anchorNode.parentNode.tagName === 'LI') return;
    document.execCommand('formatBlock', false, 'p');
  }
}
