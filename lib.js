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
    if (parent) parent.appendChild(el);
    return el;
  };
  const createChip = (parent, email) => {
    const chip = addChild(parent, "div", "emails-editor__chip");
    const chipText = addChild(chip, "span", "", email);
    const btnDelete = addChild(chip, "div", "emails-editor__delete", "×");
    return { chip, chipText, btnDelete };
  };

  window.EmailsEditor = function(options) {
    const { container, boardName, emails, onChange } = {
      ...defOptions,
      ...options
    };
    let chips = {};
    let emailList = emails || [];

    const wrap = addChild("", "div", "emails-editor");
    const main = addChild(wrap, "div", "emails-editor__main");
    const h3 = addChild(main, "h3", "", `Share ${boardName} with others`);
    const area = addChild(main, "div", "emails-editor__area");
    const inputWrap = addChild(area, "div", "emails-editor__input-wrap");
    const input = addChild(inputWrap, "input");
    const expander = addChild(inputWrap, "i", "", "add more people…");
    const controls = addChild(wrap, "div", "emails-editor__controls");
    const btnAdd = addChild(controls, "button", "", "Add email");
    const btnCount = addChild(controls, "button", "", "Get emails count");

    const renderList = parent => {
      parent.innerText = "";
      chips = {};
      const fragment = document.createDocumentFragment();

      emailList.forEach(email => {
        chips[email] = createChip(fragment, email);
      });
      fragment.appendChild(inputWrap);
      parent.appendChild(fragment);
    };

    if (emailList.length) renderList(area);
    container.appendChild(wrap);

    this.getList = () => emailList;
    this.setList = array => {
      emailList = array;
      renderList();
    };
    return this;
  };
})();
