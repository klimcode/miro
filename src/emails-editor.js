(function() {
  const noop = () => {};
  const defOptions = {
    onChange: noop
  };
  const initialInputText = "add more people…";
  const parsingRX = / *, *| +/;
  const pickNumberRX = /(\d+)\b/;
  const validationRX = /\S+@\S+\.\S+/;
  const validate = validationRX.test.bind(validationRX);
  const parse = string => string.split(parsingRX);
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
  const createElement = (parent, nodeName, className, text) => {
    const el = document.createElement(nodeName);
    if (className) el.className = className;
    if (text) el.innerText = text;
    if (parent) parent.appendChild(el);
    return el;
  };
  const createWrap = (editor, input) => {
    const wrap = createElement("", "span", "emails-editor");
    const bg = createElement(wrap, "span", "emails-editor__background");
    bg.onmousedown = (e) => {
      e.preventDefault();
      input.focus();
    }
    return wrap;
  };
  const createChip = (parent, email, onDelete) => {
    const isValid = validate(email);
    const className =
      "emails-editor__chip" + (isValid ? "" : " emails-editor__chip--invalid");
    const chip = createElement(parent, "span", className);
    chip.innerText = email;

    const btnDelete = createElement(chip, "i", "", "×");
    btnDelete.onclick = onDelete;
    btnDelete.dataset.email = email;
    return chip;
  };
  const createInput = (editor, inputWrap) => {
    const expander = createElement(inputWrap, "i", "");
    const input = createElement(inputWrap, "input");
    const syncInput = string => input.value = expander.innerText = string;
    const submit = value => {
      if (!value || value === initialInputText) return;
      editor.append(value);
      syncInput('');
    }

    syncInput(initialInputText);
    input.onfocus = () => syncInput('');
    input.onpaste = () => setTimeout(() => submit(input.value), 50);
    input.onblur = ({ target }) => {
      submit(target.value);
      syncInput(initialInputText);
    }
    input.onkeydown = (e) => {
      const { key, target } = e;
      if (key === 'Enter' || key === ',') {
        e.preventDefault();
        submit(target.value);
      }
      else expander.innerText = target.value;
    }
    return input;
  };

  window.EmailsEditor = function(options) {
    const { container, emails, onChange } = {
      ...defOptions,
      ...options
    };
    let isMounted = false;
    let chips; // the Virtual DOM :)
    const inputWrap = createElement("", "span", "emails-editor__input-wrap");
    const input = createInput(this, inputWrap);
    const wrap = createWrap(this, input);
    const onDelete = ({ target }) => this.deleteEmail(target.dataset.email);

    const renderAll = (array = []) => {
      chips = new Map();

      // Initially *wrap* is used as the Parent.
      // It's fast enough to append elements into it while it's not mounted.
      // But when it's mounted a new Parent should be created
      const parent = isMounted ? createWrap(chips, input) : wrap;

      array.forEach(email => {
        if (!email || chips.get(email)) return;
        chips.set(email, createChip(parent, email, onDelete));
      });
      parent.appendChild(inputWrap);

      if (!isMounted) {
        // Initial render puts all children to *wrap* because it's not yet mounted to DOM
        container.appendChild(parent);
        isMounted = true;
      } else {
        // Rerender collects all children in the just created Wrapper to replace the mounted one
        // only 1 repaint is required to update the whole email-editor
        container.replaceChild(parent, wrap);
      }
    };
    renderAll(emails);

    // Public methods
    this.setEmails = renderAll;
    this.getEmails = () => Array.from(chips.keys());
    this.getCount = () => Array.from(chips.keys()).reduce((acc, email) => validate(email) ? acc + 1 : acc, 0);
    this.append = string => {
      if (!string) return;
      const array = parse(string);
      if (!array[0]) return;
      const fragment = document.createDocumentFragment();
      array.forEach(email => {
        if (!email || chips.get(email)) return;
        chips.set(email, createChip(fragment, email, onDelete));
      });
      wrap.insertBefore(fragment, inputWrap);

      onChange(this.getEmails());
    };
    this.appendRandom = () => {
      const email = makeRandom(this.getEmails());
      const fragment = document.createDocumentFragment();
      const chip = createChip(fragment, email, onDelete);
      chips.set(email, chip);
      wrap.insertBefore(chip, inputWrap);

      onChange(this.getEmails());
    };
    this.deleteEmail = email => {
      const chipElem = chips.get(email);
      wrap.removeChild(chipElem);
      chips.delete(email);

      onChange(this.getEmails());
    }
    return this;
  };
})();
