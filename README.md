![License](https://img.shields.io/badge/License-MIT-ff932e)
![Release](https://img.shields.io/github/v/release/mraxays/clipxjs?color=ff7a5e)

# ClipX.js -Maximize Clipboard Power with Minimal Size


ClipX.js is an ultra-light JavaScript library that simplifies clipboard tasks and enriches user feedback. It offers straightforward `copy, cut, and paste` capabilities,  and `built-in toast notifications` that you can easily customize, providing a quick and efficient way to handle clipboard and notification needs. ——— The Smarter Clipboard Solution.

---
## Official Website

For more information about this project, please visit our official website: [ClipX](https://clipx.dzr.app/)

---
## Table of Contents 📑

1. [Why Choose ClipX.js?](#why-choose-clipxjs)
   - [Lightweight & Fast](#lightweight--fast)
   - [Built-in Feedback](#built-in-feedback)
   - [Flexible Customization](#flexible-customization)
   - [Easy Integration](#easy-integration)
   - [Robust Error Handling](#robust-error-handling)
2. [Installation](#installation)
   - [Via NPM](#via-npm)
   - [Via CDN](#via-cdn)
3. [Initializing ClipX.js](#initializing-clipxjs)
   - [Basic Initialization](#basic-initialization)
   - [Configuration Options](#configuration-options)
4. [Attaching ClipX Functionality](#attaching-clipx-functionality)
   - [Example: Using Data Attributes](#example-using-data-attributes)
   - [Example: Using Class Names](#example-using-class-names)
5. [Attributes Overview](#attributes-overview)
   - [`data-clipx-target`](#data-clipx-target)
   - [`data-clipx-text`](#data-clipx-text)
   - [`data-clipx-cut`](#data-clipx-cut)
   - [`data-clipx-msg`](#data-clipx-msg)
   - [`data-clipx-toast`](#data-clipx-toast)
   - [`data-clipx-disable-msg`](#data-clipx-disable-msg)
   - [`data-clipx-disable-toast`](#data-clipx-disable-toast)
   - [`data-clipx-toast-position`](#data-clipx-toast-position)
   - [`data-clipx-duration`](#data-clipx-duration)
6. [Example](#example)
7. [Demo](#demo--get-start-code)

---
## Why Choose ClipX.js?

### Lightweight & Fast
- At only 2KB, ClipX.js is smaller and faster than most clipboard libraries.
### Built-in Feedback
- Includes customizable toast notifications for clipboard actions—no need for additional UI libraries.
### Flexible Customization
- Easily style toasts, control message display, and integrate seamlessly with your app's design.
### Easy Integration
- Simple API with minimal setup, ensuring broad compatibility across modern and older browsers.
### Robust Error Handling
- Provides clear, customizable error feedback to enhance user experience and simplify debugging.
  
---

## Installation

### Via NPM

```bash
npm i clipxjs
```
### Via CDN 

Use only one `CDN`

**jsdelivr**

```html
<script src="https://cdn.jsdelivr.net/npm/clipxjs/dist/clipx.min.js"></script>
```

**OR**

**unpkg**

```html
<script src="https://unpkg.com/clipxjs/dist/clipx.min.js"></script>
```
---
## Initializing ClipX.js

To get started with ClipX.js, follow these steps to set up and configure the library according to your needs:

## Basic Initialization

```javascript
/* Initialize ClipX.js instance */
var clipx = new clipx();
```

## Configuration Options

### 1. Disable Text Content Change Globally

To prevent the text content of elements from changing globally, set the `msg` property to `true`. Otherwise, set it to `false` to enable text content change.

```javascript
clipx.disable.msg = false; // Set to true to disable text content change globally
```

### 2. Disable Toast Notifications Globally

To prevent toast notifications from showing globally, set the `toast` property to `true`. Otherwise, set it to `false` to enable toast notifications.

```javascript
clipx.disable.toast = false; // Set to true to disable toast notifications globally
```

### 3. Set Custom Styles for Toast Notifications

Customize the appearance of toast notifications by providing CSS styles. For example, the following configuration sets a dark background with white text, padding, and rounded corners.

```javascript
clipx.setCustomStyles({
    toast: "background-color: #333; color: #fff; padding: 12px; border-radius: 5px;"
});
```

## Attaching ClipX Functionality

To bind ClipX.js functionality to elements, use the `attach` method with appropriate selectors. This method will enable clipboard operations on elements with the specified attributes or classes.

### Example: Using Data Attributes

Apply ClipX.js to elements with `data-clipx-text` or `data-clipx-target` attributes.

```javascript
clipx.attach('[data-clipx-text], [data-clipx-target]');
```

### Example: Using Class Names

Alternatively, apply ClipX.js to elements with specific classes.

```javascript
clipx.attach('.clipx, .copy-btn, .your-class');
```


---
## Attributes Overview

### This All Are Attributes
- **`data-clipx-target`**: Element selector for text source.
- **`data-clipx-text`**: Static text to copy or cut.
- **`data-clipx-cut`**: Toggle cut operation.
- **`data-clipx-msg`**: Custom success message.
- **`data-clipx-toast`**: Show only toast, no text change.
- **`data-clipx-disable-msg`**: Disable element text change.
- **`data-clipx-disable-toast`**: Disable toast notification.
- **`data-clipx-toast-position`**: Position of the toast (top/bottom).
- **`data-clipx-duration`**: Duration of toast visibility.

---


## Example 

### `data-clipx-target`

**Description:** Specifies the target element whose text will be copied to the clipboard when the button is clicked.

**Example:**
```html
<button class="copy-btn" data-clipx-target="#text-to-copy">Copy Text</button>
<p id="text-to-copy">This is the text to be copied.</p>
```

### `data-clipx-text`

**Description:** Defines a static text string that will be copied to the clipboard when the button is clicked.

**Example:**
```html
<button class="copy-btn" data-clipx-text="Static text to copy">Copy Static Text</button>
```

### `data-clipx-cut`

**Description:** Cuts the text from the specified element, copying it to the clipboard and clearing the element's content.

**Example:**
```html
<textarea id="text-to-cut">This text will be cut.</textarea>
<button class="copy-btn" data-clipx-target="#text-to-cut" data-clipx-cut>Cut Text</button>
```

### `data-clipx-msg`

**Description:** Copies the specified text to the clipboard and shows a toast notification with a custom message.

**Example:**
```html
<button class="copy-btn" data-clipx-text="Another static text" data-clipx-msg="Text copied successfully!">Copy with Custom Message</button>
```

### `data-clipx-toast`

**Description:** Displays a toast notification with the copied text. The button text remains unchanged.

**Example:**
```html
<button class="copy-btn" data-clipx-text="Text to copy" data-clipx-toast>Copy with Toast Only</button>
```

### `data-clipx-disable-msg`

**Description:** Shows a toast notification without changing the button's text content.

**Example:**
```html
<button class="copy-btn" data-clipx-text="Text to copy" data-clipx-disable-msg>Copy with Toast Only, No Text Change</button>
```

###  `USE data-clipx-disable-toast & data-clipx-disable-msg`

**Description:** Copies the specified text to the clipboard without showing a toast notification And Changing Text Contents.

**Example:**
```html
<button class="copy-btn" data-clipx-text="Text to copy" data-clipx-disable-toast data-clipx-disable-msg>Copy without Toast & with Change Text</button>
```

### `data-clipx-disable-toast`

**Description:** Copies the specified text to the clipboard without showing a toast notification.

**Example:**
```html
<button class="copy-btn" data-clipx-text="Text to copy" data-clipx-disable-toast>Copy without Toast</button>
```

### `data-clipx-toast-position`

**Description:** Defines the position of the toast notification (top or bottom).

**Example:**
```html
<button class="copy-btn" data-clipx-text="Text to copy" data-clipx-toast data-clipx-toast-position="top">Copy with Toast on Top</button>
<button class="copy-btn" data-clipx-text="Text to copy" data-clipx-toast data-clipx-toast-position="bottom">Copy with Toast on Bottom</button>
```

### `data-clipx-duration`

**Description:** Sets the duration (in milliseconds) for which the toast notification is visible before it fades out.

**Example:**
```html
<button class="copy-btn" data-clipx-text="Text to copy" data-clipx-toast data-clipx-duration="3000">Copy with 3 Seconds Toast</button>
<button class="copy-btn" data-clipx-text="Text to copy" data-clipx-duration="3000">Copy with 3 Seconds Toast & Content Change</button>
<button class="copy-btn" data-clipx-text="Text to copy" data-clipx-disable-toast data-clipx-duration="3000">Copy 3 sec Content Change</button>
```
---

## Demo || Get Start Code

```html

<h1>ClipX.js Demo</h1>

<button class="copy-btn" data-clipx-text="Static text to copy" data-clipx-msg="Static text copied!">Copy Static Text</button>

<button class="copy-btn" data-clipx-target="#text-to-copy" data-clipx-cut>Cut Text</button>
<button class="copy-btn" data-clipx-target="#text-to-copy">Copy Text</button>

<p id="text-to-copy">This text will be cut and copied to the clipboard.</p>

<button class="copy-btn" data-clipx-text="Another static text" data-clipx-toast data-clipx-toast-position="bottom">Copy with Toast Only</button>

<button class="copy-btn" data-clipx-text="Text with 5 seconds toast" data-clipx-toast data-clipx-duration="5000">Copy with 5 Seconds Toast</button>


<script src="https://cdn.jsdelivr.net/npm/clipxjs/dist/clipx.min.js"></script>
<script>
    // Initialize ClipX.js instance
    var clipx = new clipx();

    // Optional: Set custom styles for toast notifications
    clipx.setCustomStyles({
        toast: "background-color: #333; color: #fff; padding: 12px; border-radius: 5px;"
    });

    // Attach ClipX.js functionality to elements
    clipx.attach('[data-clipx-text], [data-clipx-target]');
</script>

```
