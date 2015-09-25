# Disallow generator functions that do not have `yield` (require-yield)

This rule generates warnings for generator functions that do not have the `yield` keyword.

## Rule details

The following patterns are considered problems:

```js
/*eslint require-yield: 2*/
/*eslint-env es6*/

function* foo() { /*error This generator function does not have `yield`.*/
  return 10;
}
```

The following patterns are not considered problems:

```js
/*eslint require-yield: 2*/
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
