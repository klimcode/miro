(function() {
  const noop = () => {};
  const defOptions = {
    boardName: "Board name",
    onChange: noop
  };
  const qs = document.querySelector.bind(document);
  const createElement = document.createElement.bind(document);
  const addChild = (parent, nodeName, className, text) => {
    const el = createElement(nodeName);
    if (className) el.className = className;
    if (text) el.innerText = text;
    parent.appendChild(el);
    return el;
  };

  window.EmailsEditor = function(options) {
    const { container, boardName, onChange } = { ...defOptions, ...options };
    const wrap = createElement("div");
    wrap.className = "emails-editor";

    const main = addChild(wrap, "div", "emails-editor__main");
    const h3 = addChild(main, "h3", "", `Share ${boardName} with others`);
    const area = addChild(main, "div", "emails-editor__area");
    const chip = addChild(area, "div", "emails-editor__chip", "test@chip.ru");
    const btnDelete = addChild(chip, "div", "emails-editor__delete", "×");
    const inputWrap = addChild(area, "div", "emails-editor__input-wrap");
    const input = addChild(inputWrap, "input");
    const expander = addChild(inputWrap, "i", "", "add more people…");
    const controls = addChild(wrap, "div", "emails-editor__controls");
    const btnAdd = addChild(controls, "button", "", "Add email");
    const btnCount = addChild(controls, "button", "", "Get emails count");

    container.appendChild(wrap);
    console.log(wrap);
  };
})();
