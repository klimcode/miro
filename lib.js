(function() {
  const noop = () => {};
  const defOptions = {
    onChange: noop
  };
  const splittingRX = / *, *| +/;
  const pickNumberRX = /(\d+)\b/;
  const validationRX = /\S+@\S+\.\S+/;
  const validate = validationRX.test.bind(validationRX);
  const parse = string => string.split(splittingRX);
  const makeRandom = emails => {
    let maxNumber = 0;
    let maxNumberBase;
    emails.forEach(email => {
      if (!validate(email)) return;
      const [name, domain] = email.split("@");
      const [base, numberStr] = name.split(pickNumberRX);
      const number = Number(numberStr || 1);
      if (number > maxNumber) {
        maxNumber = number;
        maxNumberBase = base;
        maxNumberDomain = domain;
      }
    });
    if (!maxNumberBase) return "blank@blank.ru";
    const newName = `${maxNumberBase}${maxNumber + 1}`;
    return `${newName}@${maxNumberDomain}`;
  };
  const createElement = document.createElement.bind(document);
  const addChild = (parent, nodeName, className, text) => {
    const el = createElement(nodeName);
    if (className) el.className = className;
    if (text) el.innerText = text;
    if (parent) parent.appendChild(el);
    return el;
  };
  const createWrap = onclick => {
    const wrap = addChild("", "span", "emails-editor");
    wrap.onclick = onclick;
    return wrap;
  };
  const createChip = (parent, email) => {
    const isValid = validate(email);
    const className =
      "emails-editor__chip" + (isValid ? "" : " emails-editor__chip--invalid");
    const chip = addChild(parent, "span", className);
    addChild(chip, "span", "emails-editor__chip-expander", email);
    const btnDelete = addChild(chip, "i", "", "×");
    btnDelete.dataset.email = email;
    return chip;
  };

  window.EmailsEditor = function(options) {
    const { container, emails = [], onChange } = {
      ...defOptions,
      ...options
    };
    let chips; // the Virtual-DOM :)
    let isMounted = false;

    const clickHandler = ({ target }) => {
      const data = target.dataset || {};
      if (data.email) delete chips[data.email];
      console.log(target.dataset);
    };
    const wrap = createWrap(clickHandler);
    const inputWrap = addChild("", "span", "emails-editor__input-wrap");
    const input = addChild(inputWrap, "input");
    const expander = addChild(inputWrap, "i", "", "add more people…");

    const renderAll = array => {
      // Initially *wrap* is used as the Parent.
      // It's fast enough to append elements into it while it's not mounted.
      // But when it's mounted a new Parent should be created
      const parent = isMounted ? createWrap(clickHandler) : wrap;

      chips = new Map();
      array.forEach(email => {
        if (!email || chips.get(email)) return;
        chips.set(email, createChip(parent, email));
      });
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
    const appendEmails = string => {
      const array = parse(string);
      const fragment = document.createDocumentFragment();
      array.forEach(email => {
        if (!email || chips.get(email)) return;
        chips.set(email, createChip(fragment, email));
      });
      wrap.insertBefore(fragment, inputWrap);
    };
    const getEmails = () => Array.from(chips.keys());
    const appendRandom = () => {
      const email = makeRandom(getEmails());
      const fragment = document.createDocumentFragment();
      const chip = createChip(fragment, email);
      chips.set(email, chip);
      wrap.insertBefore(chip, inputWrap);
    };

    renderAll(emails);
    isMounted = true;

    // API
    this.getList = getEmails;
    this.setList = renderAll;
    this.append = appendEmails;
    this.addNew = appendRandom;
    return this;
  };
})();
