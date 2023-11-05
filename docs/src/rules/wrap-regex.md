---
title: wrap-regex
rule_type: layout
---

This rule was **deprecated** in ESLint v8.53.0. Please use the corresponding rule in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).

When a regular expression is used in certain situations, it can end up looking like a division operator. For example:

```js
function a() {
    return /foo/.test("bar");
}
```

## Rule Details

This is used to disambiguate the slash operator and facilitates more readable code.

Example of **incorrect** code for this rule:

::: incorrect

```js
/*eslint wrap-regex: "error"*/

function a() {
    return /foo/.test("bar");
}
```

:::

Example of **correct** code for this rule:

::: correct

```js
/*eslint wrap-regex: "error"*/

function a() {
    return (/foo/).test("bar");
}
```

:::
