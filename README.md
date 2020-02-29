# Miro EmailsEditor

A tiny (under 3KB Gzipped) library to handle email lists.

## Easy to use

1. Download JS and CSS.
2. Link the resources in the <head> of your HTML
3. Make a new instance of EmailsEditor using an existing HTML element as a container.

## Minimal installation

```html
<head>
  <!-- other stuff... -->
  <script src="emails-editor.js"></script>
  <link rel="stylesheet" href="emails-editor.css" />
</head>
<body>
  <div id="emails"></div>
</body>
```

```js
const Editor = emailsEditor.default;
new Editor({ container: document.querySelector("#emails") });
```

The library exposes the `EmailsEditor` constructor in an ES6 module. There are 2 ways to import it:

- as a node module: `import EmailsEditor from 'emails-editor'`
- as a `script tag`, so the constructor can be found here: `window.emailsEditor.default`.

Once called, the constructor mounts the Editor into the container (Editor is built of inline elements only: `span`, `input`, `i`).
The constructor receives the object of options.
It's recommended to specify the container element in the options otherwise the Editor is mounted straight to `document.body`.
The container should have a minimal size of `80px x 43px` otherwise the Editor will overflow a bit.
The Editor tries to occupy all container's inner space, but will fail to do it sometimes (e.g. if the parent is a `block` with only `min-height` specified)

### Don't forget to import the `emails-editor.css` file.

## Usage

The Editor can be focused on `Tab` key pressed or on click.
While focused the Editor accepts everything: a user can type words of any length, not only emails.
When `Tab`, `Enter` of `comma` pressed or a user clicked somewhere else the Editor transforms the entered text into a list of words and valid emails.
The valid emails have a blue background, the invalid ones are white and have a red border-bottom.
Any word or email (or just "chip") can be deleted by pressing the `x` button attached to every "chip".

## Advanced installation

```js
const Editor = emailsEditor.default;
const container = document.querySelector("#emails");
const editor = new Editor({
  container,
  emails: ["aa@bb.ru", "cc12@dd.ru", "invalid-email"],
  onChange: emails => console.log(emails)
});
editor.setEmails(["a", "bunch", "of strings", " and   test@email.ru"]);
editor.appendRandom();
console.log(editor.getCount());
editor.deleteEmail("test@email.ru");
console.log(editor.getCount());
editor.append("test54@email.ru   , test55@email.ru");
console.log(editor.getEmails());
editor.destroy();
```

The constructor receives these **options**:

- container
- emails (an `array of strings` to be initially added to the Editor)
- onChange (a callback to subscribe to the Editor's updates. Receives an `array of strings` currently stored in the Editor)

The constructor returns an object with **methods**:

- setEmails (accepts an `array of strings` to replace the strings already stored in the Editor)
- getEmails (returns an `array of strings` and valid emails stored in the Editor)
- getCount (returns `number` of valid emails)
- append (accepts a `string` which will be split into words and emails and appended into the end)
- appendRandom (forces the Editor to generate a new unique valid email)
- deleteEmail (accepts a `string` to be deleted. Nothing will happen if the Editor does not store such a string)
- destroy (unmount the Editor and clear it's store. The only way to restore the same instance is `setEmails`. Other methods will not work while the Editor is unmounted)

## Tests, Typescript and IE

I tried to develop a ready-to-use library in a short perion of time which was barely enough to finish it and do some quick manual tests.
Typescript typings are not provided.
IE is not supported due to its incomplete implementation of ES2015 Map.
Some methods are not perfectly optimized (`getCount` and `appendRandom`)
