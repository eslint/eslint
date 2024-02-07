---
title: no-invalid-regexp
rule_type: problem
further_reading:
- https://es5.github.io/#x7.8.5
---



An invalid pattern in a regular expression literal is a `SyntaxError` when the code is parsed, but an invalid string in `RegExp` constructors throws a `SyntaxError` only when the code is executed.

## Rule Details

This rule disallows invalid regular expression strings in `RegExp` constructors.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-invalid-regexp: "error"*/

RegExp('[')

RegExp('.', 'z')

new RegExp('\\')
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-invalid-regexp: "error"*/

RegExp('.')

new RegExp

this.RegExp('[')
```

:::

Please note that this rule validates regular expressions per the latest ECMAScript specification, regardless of your parser settings.

If you want to allow additional constructor flags for any reason, you can specify them using the `allowConstructorFlags` option. These flags will then be ignored by the rule.

## Options

This rule has an object option for exceptions:

* `"allowConstructorFlags"` is a case-sensitive array of flags

### allowConstructorFlags

Examples of **correct** code for this rule with the `{ "allowConstructorFlags": ["a", "z"] }` option:

::: correct

```js
/*eslint no-invalid-regexp: ["error", { "allowConstructorFlags": ["a", "z"] }]*/

new RegExp('.', 'a')

new RegExp('.', 'az')
```

:::
