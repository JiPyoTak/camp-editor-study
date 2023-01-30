/**
 * Provide closest with custom function
 * @param compareFunction - (target) => boolean
 * @returns Element | Node | null
 */
function customClosest<T extends Element | Node>(
  this: T,
  compareFunction = (_: T) => false
) {
  let target: T | null = this;
  while (target) {
    if (compareFunction(target)) {
      return target;
    }
    if ('tagName' in target) target = target.parentElement as T | null;
    else target = target.parentNode as T | null;
  }
  return null;
}

// 선택된 모든 라인을 반환해야겠다고 생각함
export function getEditorLines(selection: Selection, $root: HTMLElement) {
  // $root -> contentarea (p태그들 사이에서 있는거 찾는다?)
  // 모든 p태그 검사
  // index로 검사하는건 비슷하네

  // anchor / focus를 타고 올라가서 parent parent === $root p태그 잖아
  // 이 노드를 가져와서 parentElement에서 indexOf 사용해서 다 잘라내고 가져올 생각했었음
  Array.prototype.indexOf.call($root.children, 0, 1);
}
