# Disallow generator functions that do not have `yield` (require-yield)

This rule generates warnings for generator functions that do not have the `yield` keyword.

## Rule Details

The following patterns are considered problems:

```js
/*eslint require-yield: "error"*/
/*eslint-env es6*/

function* foo() {
  return 10;
}
```

The following patterns are not considered problems:

```js
/*eslint require-yield: "error"*/
/*eslint-env es6*/

function* foo() {
  yield 5;
  return 10;
}

function foo() {
  return 10;
}

// This rule does not warn on empty generator functions.
function* foo() { }
```
