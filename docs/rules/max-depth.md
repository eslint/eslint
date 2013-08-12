# max depth

The `max-depth` rule allows you to specify the maximum depth blocks can be nested.

```js
// max-depth: [1, 2]  // Maximum of 2 deep.
function foo() {
  for (;;) {
    if (true) {
      if (true) { // Nested 3 deep.

      }
    }
  }
}
```

## Rule Details

This rule aims to reduce the complexity of your code by allowing you to configure the maximum depth blocks can be nested in a function. As such, it will warn when blocks are nested too deeply.

The following patterns are considered warnings:

```js
// max-depth: [1, 2]  // Maximum of 2 deep.
function foo() {
  for (;;) {
    if (true) {
      if (true) { // Nested 3 deep.

      }
    }
  }
}
```

The following patterns are not warnings:

```js
// max-depth: [1, 2]  // Maximum of 2 deep.
function foo() {
  for (;;) {
    if (true) {

    }
  }
}
```
