# Disallow the use of `Math.pow` in favor of the `**` operator (prefer-exponentiation-operator)

Introduced in ES2016, the infix exponentiation operator `**` is an alternative for the standard `Math.pow` function.

Infix notation is considered to be more readable and thus more preferable than the function notation.

## Rule Details

This rule disallows calls to `Math.pow` and suggests using the `**` operator instead.

Examples of **incorrect** code for this rule:

```js
/*eslint prefer-exponentiation-operator: "error"*/

const foo = Math.pow(2, 8);

const bar = Math.pow(a, b);

let baz = Math.pow(a + b, c + d);

let quux = Math.pow(-1, n);
```

Examples of **correct** code for this rule:

```js
/*eslint prefer-exponentiation-operator: "error"*/

const foo = 2 ** 8;

const bar = a ** b;

let baz = (a + b) ** (c + d);

let quux = (-1) ** n;
```

## When Not To Use It

This rule should not be used unless ES2016 is supported in your codebase.

## Further Reading

* [MDN Arithmetic Operators - Exponentiation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Exponentiation)
* [Issue 5848: Exponentiation operator ** has different results for numbers and variables from 50 upwards](https://bugs.chromium.org/p/v8/issues/detail?id=5848)
