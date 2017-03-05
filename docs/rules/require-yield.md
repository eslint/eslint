# Disallow generator functions that do not have `yield` (require-yield)

## Rule Details

This rule generates warnings for generator functions that do not have the `yield` keyword.

## Examples

Examples of **incorrect** code for this rule:

```js
/*eslint require-yield: "error"*/
/*eslint-env es6*/

function* foo() {
  return 10;
}
```

Examples of **correct** code for this rule:

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

## When Not To Use It

If you don't want to notify generator functions that have no `yield` expression, then it's safe to disable this rule.

## Related Rules

* [require-await](require-await.md)
