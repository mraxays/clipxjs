![License](https://img.shields.io/badge/License-MIT-ff932e)
![Release](https://img.shields.io/github/v/release/mraxays/clipxjs?color=ff7a5e)

# ClipX.js

A lightweight JavaScript library for clipboard management, text formatting and user feedback. Copy, cut and paste with simple HTML data attributes, optionally format the text first, and get customizable toast notifications built in. No dependencies.

Website: [clipx.js.org](https://clipx.js.org/)

## Features

- **Copy, cut and paste** from elements or static text
- **Text formatting** (`trim`, `uppercase`, `titlecase`, …) with support for your own formatters
- **Toast notifications** with custom messages, position, duration and styles
- **Event delegation**: works for elements added after page load
- **Events**: `clipx:success` and `clipx:error` on the clicked element
- **Fallback copy** via `execCommand` when the Clipboard API is unavailable

## Installation

```bash
npm i clipxjs
```

Or use a CDN (one is enough):

```html
<script src="https://cdn.jsdelivr.net/npm/clipxjs/dist/clipx.min.js"></script>
<script src="https://unpkg.com/clipxjs/dist/clipx.min.js"></script>
```

## Quick start

```html
<input id="name" value="Hello world">
<button data-clipx-target="#name">Copy</button>
<button data-clipx-target="#name" data-clipx-cut>Cut</button>
<button data-clipx-paste="#name">Paste</button>
<button data-clipx-text="Static text" data-clipx-msg="Done!">Copy text</button>

<script src="https://cdn.jsdelivr.net/npm/clipxjs/dist/clipx.min.js"></script>
<script>
  var clipx = new ClipX();
  clipx.attach(); // matches [data-clipx-text], [data-clipx-target], [data-clipx-paste]
</script>
```

`new clipx()` also works, and `ClipX` is an alias that avoids shadowing the constructor.

## Configuration

```js
clipx.disable.msg = true;   // never change the button text
clipx.disable.toast = true; // never show toasts

clipx.setCustomStyles({
  toast: "background:#333;color:#fff;padding:12px;border-radius:5px;", // all toasts
  error: "background:#7a1f1f;",                                        // extra styles for error toasts
});

clipx.attach(".copy-btn, .your-class"); // custom selectors; safe to call more than once
clipx.detach();                          // remove listeners
```

Hide the toast icon:

```css
.clipx-js-svg-icon { display: none; }
```

## Attributes

| Attribute | Description |
| --- | --- |
| `data-clipx-target` | Selector of the element to copy (or cut) from |
| `data-clipx-text` | Static text to copy |
| `data-clipx-paste` | Selector of the element to paste into |
| `data-clipx-cut` | Clear the target after copying (only with `data-clipx-target`) |
| `data-clipx-format` | Comma-separated formatters applied before copy or paste |
| `data-clipx-msg` | Custom success message (default `Copied!` / `Pasted!`) |
| `data-clipx-toast` | Show only the toast; leave the button text unchanged |
| `data-clipx-disable-msg` | Don't change the button text |
| `data-clipx-disable-toast` | Don't show the toast |
| `data-clipx-toast-position` | `top` or `bottom` (default) |
| `data-clipx-duration` | Milliseconds the message stays visible (default `1500`) |

Priority when several are present: `data-clipx-paste`, then `data-clipx-target`, then `data-clipx-text`.

### Examples

```html
<!-- Copy from an element -->
<p id="t">Text to copy</p>
<button data-clipx-target="#t">Copy</button>

<!-- Cut -->
<textarea id="c">Cut me</textarea>
<button data-clipx-target="#c" data-clipx-cut>Cut</button>

<!-- Paste, formatted -->
<textarea id="p"></textarea>
<button data-clipx-paste="#p" data-clipx-format="trim,uppercase">Paste</button>

<!-- Toast only, on top, for 3 seconds -->
<button data-clipx-text="Hi" data-clipx-toast data-clipx-toast-position="top" data-clipx-duration="3000">Copy</button>

<!-- Silent copy -->
<button data-clipx-text="Hi" data-clipx-disable-toast data-clipx-disable-msg>Copy</button>
```

## Formatting

Built-in formatters for `data-clipx-format` (applied left to right):

`trim` · `uppercase` · `lowercase` · `capitalize` · `titlecase` · `collapse` (merge whitespace) · `singleline` (remove line breaks) · `striphtml`

Add your own:

```js
clipx.addFormatter("reverse", function (s) { return s.split("").reverse().join(""); });
// <button data-clipx-text="abc" data-clipx-format="reverse">
```

## JavaScript API

All methods return Promises.

```js
clipx.copyText("hello");
clipx.cutText("hello", element);             // copy, then clear element
clipx.copyFromElement(element, "trim");      // optional format
clipx.cutFromElement(element, "trim");
clipx.pasteText();                           // resolves with clipboard text
clipx.pasteToElement(element, "uppercase");
clipx.format("  hi ", "trim,uppercase");     // synchronous, returns a string
```

## Events

```js
document.addEventListener("clipx:success", function (e) {
  console.log(e.target, e.detail.type); // "copy" | "cut" | "paste"
});
document.addEventListener("clipx:error", function (e) {
  console.log(e.detail.error);
});
```

## Notes

- The Clipboard API needs a secure context (HTTPS or `localhost`). Copy falls back to `execCommand` elsewhere.
- **Paste** uses `navigator.clipboard.readText()`, which requires HTTPS, a user click, and usually a browser permission prompt. Support and prompts vary by browser.
- Toast messages are inserted as plain text, so `data-clipx-msg` can't inject HTML.
- Static text (`data-clipx-text`) can only be copied; "cut" has nothing to clear.

## Upgrading from 1.2.x

- Default message is now `Copied!` (no space).
- `setCustomStyles` accepts an optional `error` key.
- `isProcessing` is gone; busy state is tracked per element.
- `attach()` uses event delegation, so elements added later work automatically.

## License

MIT © 2024 [Mr Akshay Shinde](https://github.com/mraxays)