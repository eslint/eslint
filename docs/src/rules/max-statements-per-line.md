---
title: max-statements-per-line
rule_type: layout
related_rules:
- max-depth
- max-len
- max-lines
- max-lines-per-function
- max-nested-callbacks
- max-params
- max-statements
---

This rule was **deprecated** in ESLint v8.53.0. Please use the corresponding rule in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).

A line of code containing too many statements can be difficult to read. Code is generally read from the top down, especially when scanning, so limiting the number of statements allowed on a single line can be very beneficial for readability and maintainability.

```js
function foo () { var bar; if (condition) { bar = 1; } else { bar = 2; } return true; } // too many statements
```

## Rule Details

This rule enforces a maximum number of statements allowed per line.

## Options

### max

The "max" object property is optional (default: 1).

Examples of **incorrect** code for this rule with the default `{ "max": 1 }` option:

::: incorrect

```js
/*eslint max-statements-per-line: ["error", { "max": 1 }]*/

var bar; var baz;
if (condition) { bar = 1; }
for (var i = 0; i < length; ++i) { bar = 1; }
switch (discriminant) { default: break; }
function foo() { bar = 1; }
var qux = function qux() { bar = 1; };
(function foo() { bar = 1; })();
```

:::

Examples of **correct** code for this rule with the default `{ "max": 1 }` option:

::: correct

```js
/*eslint max-statements-per-line: ["error", { "max": 1 }]*/

var bar, baz;
if (condition) bar = 1;
for (var i = 0; i < length; ++i);
switch (discriminant) { default: }
function foo() { }
var qux = function qux() { };
(function foo() { })();
```

:::

Examples of **incorrect** code for this rule with the `{ "max": 2 }` option:

::: incorrect

```js
/*eslint max-statements-per-line: ["error", { "max": 2 }]*/

var bar; var baz; var qux;
if (condition) { bar = 1; } else { baz = 2; }
for (var i = 0; i < length; ++i) { bar = 1; baz = 2; }
switch (discriminant) { case 'test': break; default: break; }
function foo() { bar = 1; baz = 2; }
var qux = function qux() { bar = 1; baz = 2; };
(function foo() { bar = 1; baz = 2; })();
```

:::

Examples of **correct** code for this rule with the `{ "max": 2 }` option:

::: correct

```js
/*eslint max-statements-per-line: ["error", { "max": 2 }]*/

var bar; var baz;
if (condition) bar = 1; if (condition) baz = 2;
for (var i = 0; i < length; ++i) { bar = 1; }
switch (discriminant) { default: break; }
function foo() { bar = 1; }
var qux = function qux() { bar = 1; };
(function foo() { var bar = 1; })();
```

:::

## When Not To Use It

You can turn this rule off if you are not concerned with the number of statements on each line.
