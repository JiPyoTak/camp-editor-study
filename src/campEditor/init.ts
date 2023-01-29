function init(element: Element, options: Array<any>) {

  // Editor 클래스 상
  // init 함수 = constructor
  //
  //
  // new EditorView() => 초기 텍스트에리아, 메뉴 ?
  //

  // EditorView(); 옵션들 지정해주기
  // 이벤트 등록
}

init("#id", [['bold', 'italic'],['undo', 'redo']]);

/* Bold
handler{} {}
const object = { bold(): , italic}
  함수를 만들 듯 => 막연한 생각
  그걸 잇는거는 다 만들고해도 상관없어 사실
*/

class Editor {
  $dom;
  editorView;
  editorController;
  editorToolbar;
  constructor(element: Element) {
    this.$dom = element;
    this.editorController = new EditorController();
    this.editorView = new EditorView(this.editorController);
    this.editorToolbar = new EditorToolbar(this.editorController);
    // handler를 class와 매칭시키잖아 -> 지정을 해주는 곳이 있을거야
  }
}
