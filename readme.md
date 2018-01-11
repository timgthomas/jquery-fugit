# jQuery Fugit

A lightweight jQuery plugin for time input fields.

## Installation

Include Fugit's CSS:

```html
<link rel="stylesheet" href="jquery.fugit.css">
```

Include jQuery and the Fugit plugin script:

```html
<script src="jquery.js"></script>
<script src="jquery.fugit.js"></script>
```

Initialize the plugin as follows:

```javascript
$(document).ready(function() {
  $('input').fugit();
});
```

## Usage

The automated tests in `test/tests.js` outline most usage scenarios; start there to learn how to interact with the plugin.

## Testing

Tests are written in [QUnit](https://qunitjs.com/). As this plugin requires a DOM and jQuery, serve the repo as a web app and open `test/index.html` in a browser.
