---
title: quotes
rule_type: layout
---

This rule was **deprecated** in ESLint v8.53.0. Please use the [corresponding rule](https://eslint.style/rules/js/quotes) in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).

JavaScript allows you to define strings in one of three ways: double quotes, single quotes, and backticks (as of ECMAScript 6). For example:

```js
var double = "double";
var single = 'single';
var backtick = `backtick`;    // ES6 only
```

Each of these lines creates a string and, in some cases, can be used interchangeably. The choice of how to define strings in a codebase is a stylistic one outside of template literals (which allow embedded expressions to be interpreted).

Many codebases require strings to be defined in a consistent manner.

## Rule Details

This rule enforces the consistent use of either backticks, double, or single quotes.

This rule is aware of directive prologues such as `"use strict"` and will not flag or autofix them if doing so will change how the directive prologue is interpreted.

## Options

This rule has two options, a string option and an object option.

String option:

* `"double"` (default) requires the use of double quotes wherever possible
* `"single"` requires the use of single quotes wherever possible
* `"backtick"` requires the use of backticks wherever possible

Object option:

* `"avoidEscape": true` allows strings to use single-quotes or double-quotes so long as the string contains a quote that would have to be escaped otherwise
* `"allowTemplateLiterals": true` allows strings to use backticks

**Deprecated**: The object property `avoid-escape` is deprecated; please use the object property `avoidEscape` instead.

### double

Examples of **incorrect** code for this rule with the default `"double"` option:

::: incorrect

```js
/*eslint quotes: ["error", "double"]*/

var single = 'single';
var unescaped = 'a string containing "double" quotes';
var backtick = `back\ntick`; // you can use \n in single or double quoted strings
```

:::

Examples of **correct** code for this rule with the default `"double"` option:

::: correct

```js
/*eslint quotes: ["error", "double"]*/

var double = "double";
var backtick = `back
tick`;  // backticks are allowed due to newline
var backtick = tag`backtick`; // backticks are allowed due to tag
```

:::

### single

Examples of **incorrect** code for this rule with the `"single"` option:

::: incorrect

```js
/*eslint quotes: ["error", "single"]*/

var double = "double";
var unescaped = "a string containing 'single' quotes";
```

:::

Examples of **correct** code for this rule with the `"single"` option:

::: correct

```js
/*eslint quotes: ["error", "single"]*/

var single = 'single';
var backtick = `back${x}tick`; // backticks are allowed due to substitution
```

:::

### backticks

Examples of **incorrect** code for this rule with the `"backtick"` option:

::: incorrect

```js
/*eslint quotes: ["error", "backtick"]*/

var single = 'single';
var double = "double";
var unescaped = 'a string containing `backticks`';
```

:::

Examples of **correct** code for this rule with the `"backtick"` option:

::: correct

```js
/*eslint quotes: ["error", "backtick"]*/

"use strict"; // directives must use single or double quotes
var backtick = `backtick`;
var obj = { 'prop-name': `value` }; // backticks not allowed for property names
```

:::

### avoidEscape

Examples of additional **correct** code for this rule with the `"double", { "avoidEscape": true }` options:

::: correct

```js
/*eslint quotes: ["error", "double", { "avoidEscape": true }]*/

var single = 'a string containing "double" quotes';
```

:::

Examples of additional **correct** code for this rule with the `"single", { "avoidEscape": true }` options:

::: correct

```js
/*eslint quotes: ["error", "single", { "avoidEscape": true }]*/

var double = "a string containing 'single' quotes";
```

:::

Examples of additional **correct** code for this rule with the `"backtick", { "avoidEscape": true }` options:

::: correct

```js
/*eslint quotes: ["error", "backtick", { "avoidEscape": true }]*/

var double = "a string containing `backtick` quotes"
```

:::

### allowTemplateLiterals

Examples of additional **correct** code for this rule with the `"double", { "allowTemplateLiterals": true }` options:

::: correct

```js
/*eslint quotes: ["error", "double", { "allowTemplateLiterals": true }]*/

var double = "double";
var double = `double`;
```

:::

Examples of additional **correct** code for this rule with the `"single", { "allowTemplateLiterals": true }` options:

::: correct

```js
/*eslint quotes: ["error", "single", { "allowTemplateLiterals": true }]*/

var single = 'single';
var single = `single`;
```

:::

`{ "allowTemplateLiterals": false }` will not disallow the usage of all template literals. If you want to forbid any instance of template literals, use [no-restricted-syntax](no-restricted-syntax) and target the `TemplateLiteral` selector.

## When Not To Use It

If you do not need consistency in your string styles, you can safely disable this rule.
