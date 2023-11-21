---
title: no-multiple-empty-lines
rule_type: layout
---

This rule was **deprecated** in ESLint v8.53.0. Please use the corresponding rule in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).

Some developers prefer to have multiple blank lines removed, while others feel that it helps improve readability. Whitespace is useful for separating logical sections of code, but excess whitespace takes up more of the screen.

## Rule Details

This rule aims to reduce the scrolling required when reading through your code. It will warn when the maximum amount of empty lines has been exceeded.

## Options

This rule has an object option:

* `"max"` (default: `2`) enforces a maximum number of consecutive empty lines.
* `"maxEOF"` enforces a maximum number of consecutive empty lines at the end of files.
* `"maxBOF"` enforces a maximum number of consecutive empty lines at the beginning of files.

### max

Examples of **incorrect** code for this rule with the default `{ "max": 2 }` option:

::: incorrect

```js
/*eslint no-multiple-empty-lines: "error"*/

var foo = 5;



var bar = 3;
```

:::

Examples of **correct** code for this rule with the default `{ "max": 2 }` option:

::: correct

```js
/*eslint no-multiple-empty-lines: "error"*/

var foo = 5;


var bar = 3;
```

:::

### maxEOF

Examples of **incorrect** code for this rule with the `{ max: 2, maxEOF: 0 }` options:

::: incorrect

```js
/*eslint no-multiple-empty-lines: ["error", { "max": 2, "maxEOF": 0 }]*/⏎
⏎
var foo = 5;⏎
⏎
⏎
var bar = 3;⏎
⏎

```

:::

Examples of **correct** code for this rule with the `{ max: 2, maxEOF: 0 }` options:

::: correct

```js
/*eslint no-multiple-empty-lines: ["error", { "max": 2, "maxEOF": 0 }]*/⏎
⏎
var foo = 5;⏎
⏎
⏎
var bar = 3;
```

:::

**Note**: Although this ensures zero empty lines at the EOF, most editors will still show one empty line at the end if the file ends with a line break, as illustrated below. There is no empty line at the end of a file after the last `\n`, although editors may show an additional line. A true additional line would be represented by `\n\n`.

**Correct**:

::: correct

```js
/*eslint no-multiple-empty-lines: ["error", { "max": 2, "maxEOF": 0 }]*/⏎
⏎
var foo = 5;⏎
⏎
⏎
var bar = 3;⏎

```

:::

### maxBOF

Examples of **incorrect** code for this rule with the `{ max: 2, maxBOF: 1 }` options:

::: incorrect

```js


/*eslint no-multiple-empty-lines: ["error", { "max": 2, "maxBOF": 1 }]*/


var foo = 5;


var bar = 3;
```

:::

Examples of **correct** code for this rule with the `{ max: 2, maxBOF: 1 }` options:

::: correct

```js
/*eslint no-multiple-empty-lines: ["error", { "max": 2, "maxBOF": 1}]*/

var foo = 5;


var bar = 3;
```

:::

::: correct

```js

/*eslint no-multiple-empty-lines: ["error", { "max": 2, "maxBOF": 1}]*/

var foo = 5;


var bar = 3;
```

:::

## When Not To Use It

If you do not care about extra blank lines, turn this off.
