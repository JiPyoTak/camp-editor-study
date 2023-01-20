function isSizeAttribute(arg: string | number) {
  const reg = /([0-9])+(px|rem|em|%|vw|vh)$/;
  return reg.test(String(arg));
}

function isNumber(arg: string | number) {
  return !isNaN(Number(arg));
}

const util = {
  zeroWidthSpaceReg: new RegExp('^' + String.fromCharCode(8203) + '+$'),
  hasClass(node: Node | Element, className: string) {
    return new RegExp(className).test((node as Element).className);
  },
  isWysiwyg(node: Node | Element | null) {
    console.log(node, node?.parentElement);
    return (
      node &&
      node.nodeType === Node.ELEMENT_NODE &&
      this.hasClass(node, 'ce-content-area')
    );
  },

  isFormatElement(element: Node | null): boolean {
    return (
      !!element &&
      element.nodeType === Node.ELEMENT_NODE &&
      /^(P|DIV|H[1-6]|PRE|LI|TH|TD|DETAILS)$/i.test(element.nodeName)
    );
  },

  isBreak(node?: string | Node): boolean {
    return !!node && /^BR$/i.test(node instanceof Node ? node.nodeName : node);
  },

  onlyZeroWidthSpace(text?: null | string | Node): boolean {
    const textContent = text instanceof Node ? text.textContent : text;
    if (textContent === null || textContent === undefined) return false;
    return textContent === '' || this.zeroWidthSpaceReg.test(textContent);
  },

  getElementByNode(node: Node) {
    const parentNode = node.parentNode;
    if (!parentNode) return null;
    const children = parentNode.children;
    for (let i = 0; i < children.length; i++) {
      const el = children[i];
      if (el === node) {
        return el;
      }
    }
  },

  removeEmptyNode(element: Element) {
    const self = this;
    (function recursionFunc(current) {
      // if (current !== element && self.onlyZeroWidthSpace(current.textContent) && )
    })(element);
  },

  getFormatElement(
    element: Node | null,
    validation?: Function | null
  ): Node | null {
    if (!element) return null;
    validation =
      validation ||
      function () {
        return true;
      };

    while (element) {
      if (this.isWysiwyg(element)) return null;
      if (this.isFormatElement(element) && validation(element)) return element;
      element = element.parentNode;
    }

    return null;
  },

  // children을 가져옴
  getListChildren(element: Element, validation?: Function): Element[] {
    const children: Element[] = [];
    if (!element || !element.children || element.children.length === 0)
      return children;

    validation =
      validation ||
      function () {
        return true;
      };

    (function recursionFunc(current) {
      if (element !== current && validation(current)) {
        children.push(current);
      }

      if (!!current.children) {
        for (let i = 0; i < current.children.length; i++) {
          recursionFunc(current.children[i]);
        }
      }
    })(element);

    return children;
  },

  getListChildNodes(element: Node, validation?: Function): Node[] {
    const childNodes: Node[] = [];
    if (!element || element.childNodes.length === 0) return childNodes;

    validation ??= function () {
      return true;
    };

    (function recursionFunc(current) {
      if (element !== current && validation(current)) {
        childNodes.push(current);
      }

      for (let i = 0; i < current.childNodes.length; i++) {
        recursionFunc(current.childNodes[i]);
      }
    })(element);

    return childNodes;
  },

  getChildElement(element: Node, query: Function, last: boolean): Element {
    const childList = this.getListChildren(
      element as Element,
      function (current: Node) {
        return query(current);
      }
    );

    return childList[last ? childList.length - 1 : 0];
  },
};

export { isSizeAttribute, isNumber, util };
