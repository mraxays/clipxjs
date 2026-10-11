![License](https://img.shields.io/badge/License-MIT-ff932e)
![Release](https://img.shields.io/github/v/release/mraxays/clipxjs?color=ff7a5e)

# ClipX.js — The Smarter Clipboard Solution

ClipX.js is a tiny, dependency-free JavaScript library for clipboard management, text formatting and user feedback. Copy, cut and paste with plain HTML `data-` attributes, optionally format the text first, and show built-in toast notifications that you can fully customize.

**Website:** [clipx.js.org](https://clipx.js.org/)

---

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Initializing ClipX.js](#initializing-clipxjs)
   - [Basic Initialization](#basic-initialization)
   - [Configuration Options](#configuration-options)
4. [Attaching ClipX Functionality](#attaching-clipx-functionality)
5. [Attributes Overview](#attributes-overview)
6. [Attribute Examples](#attribute-examples)
7. [Text Formatting](#text-formatting)
8. [JavaScript API](#javascript-api)
9. [Events](#events)
10. [Browser Support & Notes](#browser-support--notes)
11. [Upgrading from 1.2.x](#upgrading-from-12x)
12. [Demo / Get Started Code](#demo--get-started-code)
13. [License](#license)

---

## Features

- **Copy, cut and paste** from elements or static text.
- **Text formatting** (`trim`, `uppercase`, `titlecase`, …) plus your own custom formatters.
- **Built-in toast notifications** with custom messages, position, duration and styles. No extra UI library needed.
- **Event delegation:** works on elements added after page load, and `attach()` is safe to call more than once.
- **Clear error feedback:** a missing target or empty text shows an error toast instead of failing silently.
- **Events:** `clipx:success` and `clipx:error` are fired on the clicked element.
- **Fallback copy** using `execCommand` when the Clipboard API is unavailable.
- **Safe by default:** toast messages are inserted as plain text, so `data-clipx-msg` cannot inject HTML.

---

## Installation

### Via NPM

```bash
npm i clipxjs
```

### Via CDN

Use only one CDN.

**jsDelivr**

```html
<script src="https://cdn.jsdelivr.net/npm/clipxjs/dist/clipx.min.js"></script>
```

**OR unpkg**

```html
<script src="https://unpkg.com/clipxjs/dist/clipx.min.js"></script>
```

---

## Initializing ClipX.js

### Basic Initialization

```javascript
var clipx = new ClipX(); // `new clipx()` also works
```

`ClipX` is an alias of the `clipx` constructor. Using it avoids shadowing the constructor when you name your instance `clipx`.

With a bundler:

```javascript
const ClipX = require("clipxjs"); // or: import ClipX from "clipxjs";
const clipx = new ClipX();
```

### Configuration Options

#### 1. Disable Text Content Change Globally

Set `msg` to `true` to stop the clicked element's text from changing (for example to "Copied!").

```javascript
clipx.disable.msg = false; // true = never change the element text
```

#### 2. Disable Toast Notifications Globally

```javascript
clipx.disable.toast = false; // true = never show toasts
```

#### 3. Set Custom Styles for Toast Notifications

`toast` styles apply to every toast. The optional `error` styles are added on top for error toasts.

```javascript
clipx.setCustomStyles({
  toast: "background-color: #333; color: #fff; padding: 12px; border-radius: 5px;",
  error: "background-color: #7a1f1f;",
});
```

#### 4. Hide the SVG Icon

```css
.clipx-js-svg-icon {
  display: none;
}
```

---

## Attaching ClipX Functionality

`attach()` uses event delegation, so it also works for elements added to the page later.

**Default selector** (matches `data-clipx-text`, `data-clipx-target` and `data-clipx-paste`):

```javascript
clipx.attach();
```

**Custom selectors** (data attributes, classes, anything):

```javascript
clipx.attach(".clipx, .copy-btn, .your-class");
clipx.attach("[data-clipx-text], [data-clipx-target]");
```

**Remove all listeners:**

```javascript
clipx.detach();
```

---

## Attributes Overview

| Attribute | Description |
| --- | --- |
| `data-clipx-target` | Selector of the element to copy (or cut) from. |
| `data-clipx-text` | Static text to copy. |
| `data-clipx-paste` | Selector of the element to paste into. |
| `data-clipx-cut` | Cut instead of copy: clears the target after copying. |
| `data-clipx-format` | Comma-separated formatters applied before copy or paste. |
| `data-clipx-msg` | Custom success message (default `Copied!` / `Pasted!`). |
| `data-clipx-toast` | Show only the toast; leave the element text unchanged. |
| `data-clipx-disable-msg` | Don't change the element text. |
| `data-clipx-disable-toast` | Don't show the toast. |
| `data-clipx-toast-position` | Toast position: `top` or `bottom` (default). |
| `data-clipx-duration` | Milliseconds the message stays visible (default `1500`). |

If several source attributes are present, the priority is `data-clipx-paste`, then `data-clipx-target`, then `data-clipx-text`.

---

## Attribute Examples

### `data-clipx-target`

Copies the text of the target element. Inputs, textareas and selects use their value; other elements use their text content.

```html
<button data-clipx-target="#text-to-copy">Copy Text</button>
<p id="text-to-copy">This is the text to be copied.</p>
```

### `data-clipx-text`

Copies a static text string.

```html
<button data-clipx-text="Static text to copy">Copy Static Text</button>
```

### `data-clipx-paste`

Reads the clipboard and puts the text into the target element (see [notes](#browser-support--notes) for permission requirements).

```html
<textarea id="paste-here"></textarea>
<button data-clipx-paste="#paste-here">Paste</button>
```

### `data-clipx-cut`

Copies the text of the target element and then clears it. Only works together with `data-clipx-target`; static text has nothing to clear.

```html
<textarea id="text-to-cut">This text will be cut.</textarea>
<button data-clipx-target="#text-to-cut" data-clipx-cut>Cut Text</button>
```

### `data-clipx-format`

Transforms the text before it is copied or pasted. See [Text Formatting](#text-formatting).

```html
<input id="email" value="  Ada@Example.COM ">
<button data-clipx-target="#email" data-clipx-format="trim,lowercase">Copy Email</button>
```

### `data-clipx-msg`

Shows a custom message on the element and in the toast.

```html
<button data-clipx-text="Another static text" data-clipx-msg="Text copied successfully!">
  Copy with Custom Message
</button>
```

### `data-clipx-toast`

Shows the toast only. The element's own text stays unchanged.

```html
<button data-clipx-text="Text to copy" data-clipx-toast>Copy with Toast Only</button>
```

### `data-clipx-disable-msg`

Shows the toast but doesn't change the element's text.

```html
<button data-clipx-text="Text to copy" data-clipx-disable-msg>Copy, No Text Change</button>
```

### `data-clipx-disable-toast`

Copies without showing a toast. The element text still changes.

```html
<button data-clipx-text="Text to copy" data-clipx-disable-toast>Copy without Toast</button>
```

### `data-clipx-disable-toast` + `data-clipx-disable-msg`

Silent copy: no toast and no text change.

```html
<button data-clipx-text="Text to copy" data-clipx-disable-toast data-clipx-disable-msg>
  Silent Copy
</button>
```

### `data-clipx-toast-position`

```html
<button data-clipx-text="Text to copy" data-clipx-toast-position="top">Toast on Top</button>
<button data-clipx-text="Text to copy" data-clipx-toast-position="bottom">Toast on Bottom</button>
```

### `data-clipx-duration`

Sets how long (in milliseconds) the toast and the element text message stay visible.

```html
<button data-clipx-text="Text to copy" data-clipx-duration="3000">3 Seconds</button>
<button data-clipx-text="Text to copy" data-clipx-toast data-clipx-duration="3000">3 Seconds, Toast Only</button>
<button data-clipx-text="Text to copy" data-clipx-disable-toast data-clipx-duration="3000">3 Seconds, Text Only</button>
```

---

## Text Formatting

Formatters in `data-clipx-format` run left to right, before the text is copied or pasted.

| Formatter | Effect |
| --- | --- |
| `trim` | Remove leading and trailing whitespace |
| `uppercase` / `lowercase` | Change case |
| `capitalize` | Uppercase the first letter only |
| `titlecase` | Capitalize Each Word |
| `collapse` | Replace runs of whitespace with a single space |
| `singleline` | Replace line breaks with a space |
| `striphtml` | Remove HTML tags |

```html
<button data-clipx-target="#messy" data-clipx-format="trim,collapse,titlecase">Copy Clean</button>
```

**Custom formatters:**

```javascript
clipx.addFormatter("reverse", function (text) {
  return text.split("").reverse().join("");
});
// <button data-clipx-text="abc" data-clipx-format="reverse">
```

Unknown formatter names are skipped with a console warning.

---

## JavaScript API

You can use ClipX without any HTML attributes. Copy, cut and paste methods return Promises.

```javascript
clipx.copyText("hello");                    // copy a string
clipx.cutText("hello", element);            // copy, then clear `element`
clipx.copyFromElement(element, "trim");     // optional format
clipx.cutFromElement(element, "trim");
clipx.pasteText();                          // resolves with the clipboard text
clipx.pasteToElement(element, "uppercase"); // paste into an element
clipx.format("  hi ", "trim,uppercase");    // synchronous, returns "HI"
clipx.addFormatter(name, fn);               // add a custom formatter
clipx.attach(selector);                     // bind (returns the instance)
clipx.detach();                             // unbind
clipx.setCustomStyles({ toast, error });    // toast styling
```

Example:

```javascript
clipx.copyText("Hello!")
  .then(function () { console.log("Copied"); })
  .catch(function (err) { console.error(err); });
```

---

## Events

ClipX dispatches bubbling events from the clicked element:

```javascript
document.addEventListener("clipx:success", function (e) {
  console.log(e.target, e.detail.type); // "copy" | "cut" | "paste"
});

document.addEventListener("clipx:error", function (e) {
  console.log(e.detail.error);
});
```

---

## Browser Support & Notes

- Works in modern browsers. Copy uses the async Clipboard API and falls back to `execCommand("copy")` if it is unavailable or blocked.
- The Clipboard API requires a **secure context** (HTTPS or `localhost`).
- **Paste** uses `navigator.clipboard.readText()`, which needs HTTPS, a user click, and usually shows a browser permission prompt. Support and prompts vary between browsers; when unsupported, an error toast is shown.
- Cutting from a non-input element sets its `textContent` to an empty string, which removes any child elements inside it.
- Static text (`data-clipx-text`) can only be copied.

---

## Upgrading from 1.2.x

- The default success message is now `Copied!` (the stray space is gone).
- `attach()` uses event delegation and can be called repeatedly; new elements are picked up automatically. Calling `attach()` with no argument uses the default selector.
- Busy state is tracked per element. The old `isProcessing` property was removed.
- `setCustomStyles()` accepts an optional `error` key.
- Missing targets and empty text now show an error toast.
- New: `data-clipx-paste`, `data-clipx-format`, `addFormatter()`, `pasteText()`, `pasteToElement()`, `detach()`, and the `clipx:success` / `clipx:error` events.

---

## Demo / Get Started Code

```html
<h1>ClipX.js Demo</h1>

<button data-clipx-text="Static text to copy" data-clipx-msg="Static text copied!">
  Copy Static Text
</button>

<p id="text-to-copy">   This text will be copied or cut.   </p>
<button data-clipx-target="#text-to-copy" data-clipx-format="trim">Copy Text</button>
<button data-clipx-target="#text-to-copy" data-clipx-cut>Cut Text</button>

<textarea id="paste-here" placeholder="Paste here"></textarea>
<button data-clipx-paste="#paste-here">Paste</button>

<button data-clipx-text="Toast only, on top" data-clipx-toast data-clipx-toast-position="top">
  Copy with Toast Only
</button>

<button data-clipx-text="Text with 5 seconds toast" data-clipx-toast data-clipx-duration="5000">
  Copy with 5 Seconds Toast
</button>

<script src="https://cdn.jsdelivr.net/npm/clipxjs/dist/clipx.min.js"></script>
<script>
  var clipx = new ClipX();

  // Optional: style the toast notifications
  clipx.setCustomStyles({
    toast: "background-color: #333; color: #fff; padding: 12px; border-radius: 5px;",
  });

  // Bind all elements with data-clipx-text / -target / -paste
  clipx.attach();
</script>
```

---

## License

MIT © 2024 [Mr Akshay Shinde](https://github.com/mraxays). See [LICENSE](LICENSE.md).