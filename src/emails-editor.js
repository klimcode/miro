// import "./emails-editor.css";

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
  let maxNumberDomain;
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
const createElement = (parent, nodeName, className, extra) => {
  const el = document.createElement(nodeName);
  if (className) el.className = className;
  if (extra) extra(el);
  if (parent) parent.appendChild(el);
  return el;
};

function Core(options) {
  const { container = document.body, emails, onChange } = {
    ...defOptions,
    ...options
  };
  let isMounted = false;
  let chips; // the Virtual DOM :)
  let wrap; // main Element

  this.renderAll = (array = []) => {
    chips = new Map();

    const oldWrap = wrap;
    wrap = this.createWrap();

    const preparedArray = parse(array.join(" "));
    preparedArray.forEach(email => {
      if (!email || chips.get(email)) return;
      chips.set(email, this.createChip(wrap, email));
    });
    wrap.appendChild(this.inputWrap);

    if (!isMounted) {
      // Initial render puts all children to *wrap* because it's not yet mounted to DOM
      container.appendChild(wrap);
      isMounted = true;
    } else {
      // Rerender collects all children in the just created Wrapper to replace the mounted one
      // only 1 repaint is required to update the whole email-editor
      container.replaceChild(wrap, oldWrap);
    }
  };
  this.createWrap = () => {
    return createElement("", "span", "emails-editor", wrap => {
      createElement(wrap, "span", "emails-editor__background", bg => {
        bg.onmousedown = e => {
          e.preventDefault();
          this.inputElem.focus();
        };
      });
    });
  };
  this.createChip = (parent, email) => {
    const isValid = validate(email);
    const className =
      "emails-editor__chip" + (isValid ? "" : " emails-editor__chip--invalid");
    const _chip = createElement(parent, "span", className, chip => {
      chip.textContent = email;

      createElement(chip, "i", "", btn => {
        btn.addEventListener("click", this.onClickDelete);
        btn.dataset.email = email;
      });
    });
    _chip.isValid = isValid;
    return _chip;
  };
  this.createInput = () => {
    this.inputWrap = createElement("", "span", "emails-editor__input-wrap");
    const expander = createElement(this.inputWrap, "i");
    const input = createElement(this.inputWrap, "input");

    const syncInput = string => (input.value = expander.textContent = string);
    const submit = value => {
      if (!value || value === initialInputText) return;
      this.append(value);
      syncInput("");
    };

    syncInput(initialInputText);
    input.onfocus = () => syncInput("");
    input.onpaste = () => setTimeout(() => submit(input.value), 5);
    input.onblur = ({ target }) => {
      submit(target.value);
      syncInput(initialInputText);
    };
    input.onkeydown = e => {
      const { key, target } = e;
      if (key === "Enter" || key === ",") {
        e.preventDefault();
        submit(target.value);
      } else expander.innerText = target.value;
    };
    this.inputElem = input;
  };

  // Methods
  this.getEmails = () => {
    if (!isMounted) return;
    return Array.from(chips.keys());
  };
  this.getCount = () => {
    if (!isMounted) return;
    return Array.from(chips.keys()).reduce(
      (acc, email) => (validate(email) ? acc + 1 : acc),
      0
    );
  };
  this.append = string => {
    if (!isMounted) return;
    if (!string) return;
    const array = parse(string);
    if (!array[0]) return;
    const fragment = document.createDocumentFragment();
    array.forEach(email => {
      if (!email || chips.get(email)) return;
      chips.set(email, this.createChip(fragment, email));
    });
    wrap.insertBefore(fragment, this.inputWrap);

    onChange(this.getEmails());
  };
  this.appendRandom = () => {
    if (!isMounted) return;
    const email = makeRandom(this.getEmails());
    const fragment = document.createDocumentFragment();
    const chip = this.createChip(fragment, email);
    chips.set(email, chip);
    wrap.insertBefore(chip, this.inputWrap);

    onChange(this.getEmails());
  };
  this.deleteEmail = email => {
    if (!isMounted) return;
    const chipElem = chips.get(email);
    if (!chipElem) return;
    wrap.removeChild(chipElem);
    chips.delete(email);

    onChange(this.getEmails());
  };
  this.onClickDelete = ({ target }) => this.deleteEmail(target.dataset.email);
  this.destroy = () => {
    if (!isMounted) return;
    chips = undefined;
    container.removeChild(wrap);
    isMounted = false;
  };

  // Initialization
  this.createInput();
  this.renderAll(emails);

  return this;
}

export default function EmailsEditor(options) {
  const core = new Core(options);

  // Public methods
  Object.defineProperty(this, "emails", {
    get: core.getEmails,
    set: core.renderAll
  });
  this.getCount = core.getCount;
  this.append = core.append;
  this.appendRandom = core.appendRandom;
  this.deleteEmail = core.deleteEmail;
  this.destroy = core.destroy;
  return this;
}
