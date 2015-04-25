# Disallows multiple blank lines (no-multiple-empty-lines)

Some developers prefer to have multiple blank lines removed, while others feel that it helps improve readability. Whitespace is useful for separating logical sections of code, but excess whitespace takes up more of the screen.


## Rule Details

This rule aims to reduce the scrolling required when reading through your code. It will warn when the maximum amount of empty lines has been exceeded.

The following patterns are considered warnings:

```js
// no-multiple-empty-lines: [1, {max: 2}]  // Maximum of 2 empty lines.
var foo = 5;




var bar = 3;

```

The following patterns are not warnings:

```js

// no-multiple-empty-lines: [1, {max: 2}]  // Maximum of 2 empty lines.
var foo = 5;

var bar = 3;

// no-multiple-empty-lines: [1, {max: 4}]  // Maximum of 4 empty lines.
var foo = 5;




var bar = 3;

```

### Options

You can configure the depth as an option by using the second argument in your configuration. For example, this sets the rule as an error (code is 2) with a maximum tolerated blank lines of 2:

```json
"no-multiple-empty-lines": [2, {"max": 2}]
```

## When Not To Use It

If you do not care about extra blank lines, turn this off.
