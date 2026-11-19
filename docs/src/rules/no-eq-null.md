---
title: no-eq-null
rule_type: suggestion
related_rules:
- eqeqeq
---


Comparing to `null` without a type-checking operator (`==` or `!=`) can have unintended results as the comparison will evaluate to `true` when comparing not just to `null`, but also to `undefined`.

```js
if (foo == null) {
  bar();
}
```

## Rule Details

The `no-eq-null` rule aims to reduce potential bugs and unwanted behavior by ensuring that comparisons to `null` only match `null`, and not also `undefined`. As such, it will flag comparisons to `null` when using `==` and `!=`.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-eq-null: "error"*/

if (foo == null) {
  bar();
}

while (qux != null) {
  baz();
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-eq-null: "error"*/

if (foo === null) {
  bar();
}

while (qux !== null) {
  baz();
}

if (foo === null || foo === undefined) {
  bar();
}

while (qux !== null && qux !== undefined) {
  baz();
}
```

:::

This rule offers two suggestions for each reported comparison:

* Replace `==` or `!=` with `===` or `!==` to compare with `null` only. This changes the result when the other operand is `undefined`.
* Replace the operator and add a comparison with `undefined`, as in `foo === null || foo === undefined`, to keep comparing with both `null` and `undefined`. This suggestion is only offered when the other operand can be safely repeated, such as `foo` or `foo.bar`.

## Options

This rule has no options.

## When Not To Use It

If you want to enforce type-checking operations in general, use the more powerful [eqeqeq](./eqeqeq) instead.

## Compatibility

* **JSHint**: This rule corresponds to `eqnull` rule of JSHint.
