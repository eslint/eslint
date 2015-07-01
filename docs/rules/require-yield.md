# Disallow generator functions that does not have `yield` (require-yield)

This rule catches generator functions that does not have `yield`, then warns those.

## Rule details

The following patterns are considered warnings:

```js
function* foo() {
  return 10;
}
```

The following patterns are not considered warnings:

```js
function* foo() {
  yield 5;
  return 10;
}
```

```js
function foo() {
  return 10;
}
```

```js
// This rule does not warn just empty generator functions.
function* foo() { }
```
