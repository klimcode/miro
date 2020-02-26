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
  const createWrap = (onclick) => {
    const wrap = addChild("", "span", "emails-editor");
    wrap.onclick = onclick; 
    return wrap;
  };
  const createChip = (parent, email) => {
    const chip = addChild(parent, "span", "emails-editor__chip");
    addChild(chip, "span", "emails-editor__chip-expander", email);
    const btnDelete = addChild(chip, "i", "", "×");
    btnDelete.dataset.email = email;
    return chip;
  };

  window.EmailsEditor = function(options) {
    const { container, boardName, emails, onChange } = {
      ...defOptions,
      ...options
    };
    let chips = {}; // the Virtual-DOM :)
    let isMounted = false;
    let emailList = [...emails] || [];

    const clickHandler = ({ target }) => {
      const data = target.dataset || {};
      if (data.email) delete chips[data.email]
      console.log(target.dataset);
    }
    const inputWrap = addChild("", "span", "emails-editor__input-wrap");
    const input = addChild(inputWrap, "input");
    const expander = addChild(inputWrap, "i", "", "add more people…");

    const renderList = () => {
      chips = {};
      const parent = createWrap(clickHandler);

      emailList.forEach((email, i) => chips[email] = createChip(parent, email));
      parent.appendChild(inputWrap);

      if (!isMounted) {
        // Initial render puts all children to *wrap* because it's not yet mounted to DOM  
        container.appendChild(parent);
      } else {
        // Rerender collects all children in the just created Wrapper to replace the mounted one
        // only 1 repaint is required to update the whole email-editor
        container.replaceChild(parent, wrap);
      }
    };

    renderList();

    this.getList = () => emailList;
    this.setList = array => {
      emailList = array;
      renderList();
    };
    return this;
  };
})();
