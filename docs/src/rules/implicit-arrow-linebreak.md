---
title: implicit-arrow-linebreak
rule_type: layout
related_rules:
- brace-style
---

This rule was **deprecated** in ESLint v8.53.0. Please use the [corresponding rule](https://eslint.style/rules/js/implicit-arrow-linebreak) in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).

An arrow function body can contain an implicit return as an expression instead of a block body. It can be useful to enforce a consistent location for the implicitly returned expression.

## Rule Details

This rule aims to enforce a consistent location for an arrow function containing an implicit return.

### Options

This rule accepts a string option:

* `"beside"` (default) disallows a newline before an arrow function body.
* `"below"` requires a newline before an arrow function body.

Examples of **incorrect** code for this rule with the default `"beside"` option:

::: incorrect

```js
/* eslint implicit-arrow-linebreak: ["error", "beside"] */

(foo) =>
  bar;

(foo) =>
  (bar);

(foo) =>
  bar =>
    baz;

(foo) =>
(
  bar()
);
```

:::

Examples of **correct** code for this rule with the default `"beside"` option:

::: correct

```js
/* eslint implicit-arrow-linebreak: ["error", "beside"] */

(foo) => bar;

(foo) => (bar);

(foo) => bar => baz;

(foo) => (
  bar()
);

// functions with block bodies allowed with this rule using any style
// to enforce a consistent location for this case, see the rule: `brace-style`
(foo) => {
  return bar();
}

(foo) =>
{
  return bar();
}
```

:::

Examples of **incorrect** code for this rule with the `"below"` option:

::: incorrect

```js
/* eslint implicit-arrow-linebreak: ["error", "below"] */

(foo) => bar;

(foo) => (bar);

(foo) => bar => baz;
```

:::

Examples of **correct** code for this rule with the `"below"` option:

::: correct

```js
/* eslint implicit-arrow-linebreak: ["error", "below"] */

(foo) =>
  bar;

(foo) =>
  (bar);

(foo) =>
  bar =>
    baz;
```

:::

## When Not To Use It

If you're not concerned about consistent locations of implicitly returned arrow function expressions, you should not turn on this rule.

You can also disable this rule if you are using the `"always"` option for the [`arrow-body-style`](arrow-body-style), since this will disable the use of implicit returns in arrow functions.
