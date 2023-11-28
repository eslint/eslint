---
title: require-yield
rule_type: suggestion
related_rules:
- require-await
---



## Rule Details

This rule generates warnings for generator functions that do not have the `yield` keyword.

## Examples

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint require-yield: "error"*/
/*eslint-env es6*/

function* foo() {
  return 10;
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint require-yield: "error"*/
/*eslint-env es6*/

function* foo() {
  yield 5;
  return 10;
}

function bar() {
  return 10;
}

// This rule does not warn on empty generator functions.
function* baz() { }
```

:::

## When Not To Use It

If you don't want to notify generator functions that have no `yield` expression, then it's safe to disable this rule.
