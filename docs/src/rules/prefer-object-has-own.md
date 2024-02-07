---
title: prefer-object-has-own
rule_type: suggestion
further_reading:
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn
---



It is very common to write code like:

```js
if (Object.prototype.hasOwnProperty.call(object, "foo")) {
  console.log("has property foo");
}
```

This is a common practice because methods on `Object.prototype` can sometimes be unavailable or redefined (see the [no-prototype-builtins](no-prototype-builtins) rule).

Introduced in ES2022, `Object.hasOwn()` is a shorter alternative to `Object.prototype.hasOwnProperty.call()`:

```js
if (Object.hasOwn(object, "foo")) {
  console.log("has property foo")
}
```

## Rule Details

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint prefer-object-has-own: "error"*/

Object.prototype.hasOwnProperty.call(obj, "a");

Object.hasOwnProperty.call(obj, "a");

({}).hasOwnProperty.call(obj, "a");

const hasProperty = Object.prototype.hasOwnProperty.call(object, property);
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint prefer-object-has-own: "error"*/

Object.hasOwn(obj, "a");

const hasProperty = Object.hasOwn(object, property);
```

:::

## When Not To Use It

This rule should not be used unless ES2022 is supported in your codebase.
