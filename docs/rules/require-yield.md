# Disallow generator functions that do not have `yield` (require-yield)

This rule generates warnings for generator functions that do not have the `yield` keyword.

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
// This rule does not warn on empty generator functions.
function* foo() { }
```
