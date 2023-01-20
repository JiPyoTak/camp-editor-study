import { util } from './utils';

class Core {
  static applyFeat(command: string) {
    switch (command) {
      case 'bold':
      case 'italic':
      case 'strike':
      case 'underline': {
        this.applyTextStyle(command);
        break;
      }
      default:
        break;
    }
  }

  static applyTextStyle(command: 'bold' | 'italic' | 'strike' | 'underline') {
    const tagName = {
      bold: 'strong',
      italic: 'i',
      strike: 'del',
      underline: 'u',
    };
    const tag = tagName[command];

    const selection = document.getSelection();

    if (!selection) return;

    const range = selection.getRangeAt(0);

    const selectedNodes = this.getNodes(selection);

    this.nodeChange(selection, tag);

    // this.surroundTag(selection, selectedNodes, tag);
  }

  private static getNodes(selection: Selection): Node | Node[] {
    const range = selection.getRangeAt(0);
    const {
      commonAncestorContainer: { childNodes },
    } = range;

    if (!childNodes.length) {
      return selection.getRangeAt(0).startContainer;
    }

    const nodes: Node[] = [];

    for (let i = 0; i < childNodes.length; i++) {
      const node: Node = childNodes[i];
      const nodeSel = selection.containsNode(node, true);
      if (!nodeSel) continue;
      nodes.push(node);
    }

    return nodes;
  }

  private static isChildrenOf(nodes: Node | Node[], tagName: string) {
    const isContentArea = (node: Node) => {
      return node.parentElement?.classList.contains('ce-editor');
    };

    const recursiveCheck = (node: Node | null) => {
      while (node) {
        if (isContentArea(node)) {
          return false;
        } else if (node.nodeName === tagName.toUpperCase()) {
          return true;
        }
        node = node.parentNode;
      }
    };

    if (nodes instanceof Node) {
      return recursiveCheck(nodes);
    }

    for (let node of nodes) {
      if (!recursiveCheck(node)) {
        return false;
      }
    }
    return true;
  }

  private static nodeChange(selection: Selection, tagName: string) {
    const range = selection.getRangeAt(0);
    const appendNode = document.createElement(tagName);
    const removeNodeRegExp = new RegExp(`^(?:${tagName})$`, 'i');
    const _removeCheck = { v: false };
    const validation = (checkNode: Node) => {
      const vNode = checkNode.cloneNode(false);

      if (vNode.nodeType === Node.TEXT_NODE || util.isBreak(vNode)) {
        return vNode;
      } else if (vNode.nodeName !== appendNode.nodeName) {
        return vNode;
      }

      // const tagRemove = !removeNodeRegExp || removeNodeRegExp.test(vNode.nodeName);

      _removeCheck.v = true;
      return null;
    };

    const lineNodes = this.getSelectedElements(selection, null);
    let startContainer = range.startContainer;
    let endContainer = range.endContainer;
    let startOffset = range.startOffset;
    let endOffset = range.endOffset;

    if (!util.getFormatElement(startContainer)) {
      startContainer = util.getChildElement(
        lineNodes[0],
        function (current: Node) {
          return current.nodeType === Node.TEXT_NODE;
        },
        false
      );
      startOffset = 0;
    }

    if (!util.getFormatElement(endContainer)) {
      endContainer = util.getChildElement(
        lineNodes[lineNodes.length - 1],
        function (current: Node) {
          return current.nodeType === Node.TEXT_NODE;
        },
        false
      );
      endOffset = endContainer.textContent!.length;
    }

    const isOneLine =
      util.getFormatElement(startContainer) ===
      util.getFormatElement(endContainer);
    const endLength = lineNodes.length - (isOneLine ? 0 : 1);

    let newNode = appendNode.cloneNode(false);

    if (isOneLine) {
      const newRange = this.nodeChangeOneLine(
        lineNodes[0],
        newNode,
        validation,
        startContainer,
        startOffset,
        endContainer,
        endOffset,
        false,
        false,
        false,
        _removeCheck
      );
    }
  }

  private static nodeChangeOneLine(
    element: Element,
    newInnerNode: Node,
    validation: Function,
    startContainer: Node,
    startOffset: number,
    endContainer: Node,
    endOffset: number,
    isRemoveFormat: boolean,
    isRemoveNode: boolean,
    collapsed: boolean,
    removeCheck: { v: boolean }
  ) {
    let parentContainer = startContainer.parentNode;
    while (
      parentContainer &&
      !parentContainer.nextSibling &&
      !parentContainer.previousSibling &&
      !util.isFormatElement(parentContainer.parentNode) &&
      !util.isWysiwyg(parentContainer.parentNode)
    ) {
      if (parentContainer.nodeName === newInnerNode.nodeName) break;
      parentContainer = parentContainer.parentNode;
    }

    if (
      !isRemoveNode &&
      parentContainer === endContainer.parentNode &&
      parentContainer?.nodeName === newInnerNode.nodeName
    ) {
      if (
        util.onlyZeroWidthSpace(
          startContainer.textContent?.slice(0, startOffset)
        ) &&
        util.onlyZeroWidthSpace(endContainer.textContent?.slice(endOffset))
      ) {
        const childNodes = parentContainer.childNodes;
        let sameTag = true;

        for (let i = 0, child, hasContent, s, e; i < childNodes.length; i++) {
          child = childNodes[i];
          hasContent = !util.onlyZeroWidthSpace(child);
          if (child === startContainer) {
            s = true;
          } else if (child === endContainer) {
            e = true;
          } else if ((!s && hasContent) || (s && e && hasContent)) {
            sameTag = false;
            break;
          }
        }

        // 한 줄 전체 선택된 경우
        if (sameTag) {
          return {
            ancestor: element,
            startContainer,
            startOffset,
            endContainer,
            endOffset,
          };
        }
      }
    }
    removeCheck.v = false;
    const nodeArr = [newInnerNode];
    const pNode = element.cloneNode(false); // 기존 p와 교체될 p
    const isSameNode = startContainer === endContainer;
    let _startContainer = startContainer;
    let _startOffset = startOffset;
    let _endContainer = endContainer;
    let _endOffset = endOffset;
    let startPass = false; // startContainer를 다뤘는지 여부
    let endPass = false; // endContainer를 다뤘는지 여부
    // pCurrent: text노드부터 p이전까지 부모태그 리스트
    // ex) <p><strong><u>진탁</u></strong></p> 인 경우 pCurrent는 [u, strong]이 됨
    let pCurrent: Node[], newNode: Node | null, appendNode: Node | null;

    (function recursionFunc(current: Node, ancestor: Node) {
      const childNodes = current.childNodes;

      for (let i = 0, vNode; i < childNodes.length; i++) {
        const child = childNodes[i];
        if (!child) continue;
        let coverNode = ancestor;
        let cloneNode;

        // start
        if (!startPass && child === _startContainer) {
          // startContainer 중 선택되지 않은 앞쪽 부분
          const prevNode = document.createTextNode(
            _startContainer.nodeType === Node.ELEMENT_NODE
              ? ''
              : (_startContainer as CharacterData).substringData(0, startOffset)
          );
          // startContainer 중 선택된 뒷쪽 부분
          const textNode = document.createTextNode(
            _startContainer.nodeType === Node.ELEMENT_NODE
              ? ''
              : (_startContainer as CharacterData).substringData(
                  _startOffset,
                  isSameNode
                    ? _endOffset >= _startOffset
                      ? _endOffset - _startOffset
                      : _startContainer.nodeValue!.length - _startOffset
                    : _startContainer.nodeValue!.length - _startOffset
                )
          );

          // 앞쪽을 pNode에 넣어준다
          if (!util.onlyZeroWidthSpace(prevNode)) {
            ancestor.appendChild(prevNode);
          }

          newNode = child;
          pCurrent = [];

          while (newNode !== pNode && newNode !== element && newNode !== null) {
            vNode = validation(newNode);
            if (vNode && newNode.nodeType === Node.ELEMENT_NODE) {
              pCurrent.push(vNode);
            }
            newNode = newNode.parentNode;
          }

          const childNode = pCurrent.pop() || textNode;
          appendNode = newNode = childNode;
          while (pCurrent.length > 0) {
            newNode = pCurrent.pop() as Node;
            appendNode.appendChild(newNode);
            appendNode = newNode;
          }

          newInnerNode.appendChild(childNode);
          pNode.appendChild(newInnerNode);

          _startContainer = textNode;
          _startOffset = 0;
          startPass = true;

          if (newNode && newNode !== textNode) {
            newNode.appendChild(textNode);
          }
          if (!isSameNode) continue;
        }

        // end
        if (!endPass && child === _endContainer) {
          const afterNode = document.createTextNode(
            _endContainer.nodeType === Node.ELEMENT_NODE
              ? ''
              : (_endContainer as CharacterData).substringData(
                  _endOffset,
                  _endContainer.nodeValue!.length - _endOffset
                )
          );
          const textNode = document.createTextNode(
            isSameNode || _endContainer.nodeType === Node.ELEMENT_NODE
              ? ''
              : (_endContainer as CharacterData).substringData(0, _endOffset)
          );

          if (!util.onlyZeroWidthSpace(afterNode)) {
            newNode = child;
            pCurrent = [];

            while (
              newNode !== pNode &&
              newNode !== element &&
              newNode !== null
            ) {
              if (newNode.nodeType === Node.ELEMENT_NODE) {
                pCurrent.push(newNode.cloneNode(false));
              }
              newNode = newNode.parentNode;
            }

            cloneNode = appendNode = newNode = pCurrent.pop() || afterNode;
            while (pCurrent.length > 0) {
              newNode = pCurrent.pop() as Node;
              appendNode.appendChild(newNode);
              appendNode = newNode;
            }

            pNode.appendChild(cloneNode);
            newNode.textContent = afterNode.data;
          }

          newNode = child;
          pCurrent = [];

          while (newNode !== pNode && newNode !== element && newNode !== null) {
            vNode = validation(newNode);
            if (vNode && newNode.nodeType === Node.ELEMENT_NODE) {
              pCurrent.push(vNode);
            }
            newNode = newNode.parentNode;
          }

          const childNode = pCurrent.pop() || textNode;
          appendNode = newNode = childNode;
          while (pCurrent.length > 0) {
            newNode = pCurrent.pop() as Node;
            appendNode.appendChild(newNode);
            appendNode = newNode;
          }

          newInnerNode.appendChild(childNode);

          _endContainer = textNode;
          _endOffset = textNode.data.length;
          endPass = true;

          if (newNode && newNode !== textNode) {
            newNode.appendChild(textNode);
          }
          continue;
        }

        if (startPass) {
          if (child.nodeType === Node.ELEMENT_NODE && !util.isBreak(child)) {
            recursionFunc(child, child);
            continue;
          }

          newNode = child;
          pCurrent = [];
          while (
            newNode.parentNode !== null &&
            newNode !== element &&
            newNode !== newInnerNode
          ) {
            vNode = endPass ? newNode.cloneNode(false) : validation(newNode);
            if (
              newNode.nodeType === Node.ELEMENT_NODE &&
              !util.isBreak(child) &&
              vNode
            ) {
              pCurrent.push(vNode);
            }
            newNode = newNode.parentNode;
          }

          const childNode = pCurrent.pop() || child;
          appendNode = newNode = childNode;
          while (pCurrent.length > 0) {
            newNode = pCurrent.pop() as Node;
            appendNode.appendChild(newNode);
            appendNode = newNode;
          }

          if (!endPass && false) {
            newInnerNode = newInnerNode.cloneNode(false);
            for (let i = 0; i < childNode.childNodes.length; i++) {
              newInnerNode.appendChild(childNode.childNodes[i]);
            }
            childNode.appendChild(newInnerNode);
            pNode.appendChild(childNode);
            nodeArr.push(newInnerNode);
            if ((newInnerNode as Element).children.length > 0) {
              ancestor = newNode as Node;
            } else {
              ancestor = newInnerNode;
            }
          } else if (childNode === child) {
            if (!endPass) {
              ancestor = newInnerNode;
            } else {
              ancestor = pNode;
            }
          } else if (endPass) {
            pNode.appendChild(childNode);
            ancestor = newNode;
          } else {
            newInnerNode.appendChild(childNode);
            ancestor = newNode;
          }
        }

        cloneNode = child.cloneNode(false);
        ancestor.appendChild(cloneNode);
        if (child.nodeType === Node.ELEMENT_NODE && !util.isBreak(child)) {
          coverNode = cloneNode;
        }
        recursionFunc(child, coverNode);
      }
    })(element, pNode);

    element.parentNode?.replaceChild(pNode, element);
  }

  private static getSelectedElements(
    selection: Selection,
    validation: Function | null
  ) {
    const range = selection.getRangeAt(0);

    if (util.isWysiwyg(range.startContainer)) {
      const children = range.startContainer.childNodes;
      if (children.length === 0) return [];
    }

    const startContainer = range.startContainer;
    const endContainer = range.endContainer;
    const commonAncestor = range.commonAncestorContainer;

    const lineNodes = util.getListChildren(
      commonAncestor as Element,
      (current: Node) =>
        validation ? validation(current) : util.isFormatElement(current)
    );

    let startLine = util.getFormatElement(startContainer, null);
    let endLine = util.getFormatElement(endContainer, null);
    let startIdx = null;
    let endIdx = null;

    if (!util.isWysiwyg(commonAncestor)) {
      lineNodes.unshift(util.getFormatElement(commonAncestor, null) as Element);
    }

    for (let i = 0; i < lineNodes.length; i++) {
      const line = lineNodes[i];

      if (startLine === line) {
        startIdx = i;
        continue;
      }

      if (endLine === line) {
        endIdx = i;
        break;
      }
    }
    startIdx ??= 0;
    endIdx ??= lineNodes.length - 1;
    return lineNodes.slice(startIdx, endIdx + 1);
  }

  private static surroundTag(
    selection: Selection,
    nodes: Node | Node[],
    tagName: string
  ) {
    const range = selection.getRangeAt(0);

    console.dir(range.cloneContents());

    // 한 줄
    if (nodes instanceof Node) {
      const newNode = document.createElement(tagName);
      range.surroundContents(newNode);
    }
    // 여러 줄
    else {
      // todo
    }
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
