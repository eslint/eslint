---
title: yield-star-spacing
rule_type: layout
further_reading:
- https://leanpub.com/understandinges6/read/#leanpub-auto-generators
---

This rule was **deprecated** in ESLint v8.53.0. Please use the [corresponding rule](https://eslint.style/rules/js/yield-star-spacing) in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).

## Rule Details

This rule enforces spacing around the `*` in `yield*` expressions.

## Options

The rule takes one option, an object, which has two keys `before` and `after` having boolean values `true` or `false`.

* `before` enforces spacing between the `yield` and the `*`.
  If `true`, a space is required, otherwise spaces are disallowed.

* `after` enforces spacing between the `*` and the argument.
  If it is `true`, a space is required, otherwise spaces are disallowed.

The default is `{"before": false, "after": true}`.

```json
"yield-star-spacing": ["error", {"before": true, "after": false}]
```

The option also has a string shorthand:

* `{"before": false, "after": true}` → `"after"`
* `{"before": true, "after": false}` → `"before"`
* `{"before": true, "after": true}` → `"both"`
* `{"before": false, "after": false}` → `"neither"`

```json
"yield-star-spacing": ["error", "after"]
```

## Examples

### after

Examples of **correct** code for this rule with the default `"after"` option:

::: correct

```js
/*eslint yield-star-spacing: ["error", "after"]*/

function* generator() {
  yield* other();
}
```

:::

### before

Examples of **correct** code for this rule with the `"before"` option:

::: correct

```js
/*eslint yield-star-spacing: ["error", "before"]*/

function *generator() {
  yield *other();
}
```

:::

### both

Examples of **correct** code for this rule with the `"both"` option:

::: correct

```js
/*eslint yield-star-spacing: ["error", "both"]*/

function * generator() {
  yield * other();
}
```

:::

### neither

Examples of **correct** code for this rule with the `"neither"` option:

::: correct

```js
/*eslint yield-star-spacing: ["error", "neither"]*/

function*generator() {
  yield*other();
}
```

:::

## When Not To Use It

If your project will not be using generators or you are not concerned with spacing consistency, you do not need this rule.
