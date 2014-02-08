# Validates JSDoc comments are syntactically correct

[JSDoc](http://usejsdoc.org) is a JavaScript API documentation generator. It uses specially-formatted comments inside of code to generate API documentation automatically. For example, this is what a JSDoc comment looks like for a function:

```js
/**
 * Adds two numbers together.
 * @param {int} num1 The first number.
 * @param {int} num2 The second number.
 * @returns {int} The sum of the two numbers.
 */
function sum(num1, num2) {
    return num1 + num2;
}
```

The JSDoc comments have a syntax all their own, and it is easy to mistakenly mistype a comment because comments aren't often checked for correctness in editors.

## Rule Details

This rule aims to prevent invalid and incomplete JSDoc comments. In doing so, it will warn when:

1. There is a JSDoc syntax error
1. A `@param` or `@returns` is used without a type specified
1. A `@param` or `@returns` is used without a description
1. `@return` is used instead of `@returns`
1. A comment for a function is missing `@returns`
1. A parameter has no associated `@param` in the JSDoc comment
1. `@param`s are out of order with named arguments

The following patterns are considered warnings:

```js
// missing type for @param and missing @returns
/**
 * A description
 * @param num1 The first number.
 */

// missing description for @param
/**
 * A description
 * @param {int} num1
 */

// using @return instead of @returns
/**
 * A description
 * @return {void}
 */

// no description for @returns
/**
 * A description
 * @returns {int}
 */

// no type for @returns
/**
 * A description
 * @returns Something awesome
 */

// missing @param
/**
 * A description
 * @returns {void}
 */
function foo(a) {
    // ...
}

// incorrect @param
/**
 * A description
 * @param {string} b Desc
 * @returns {void}
 */
function foo(a) {
    // ...
}
```

The following patterns are not warnings:

```js
/**
 * Adds two numbers together.
 * @param {int} num1 The first number.
 * @param {int} num2 The second number.
 * @returns {int} The sum of the two numbers.
 */

/**
 * Represents a sum.
 * @param {int} num1 The first number.
 * @param {int} num2 The second number.
 * @constructor
 */
```

## When Not To Use It

If you aren't using JSDoc, then you can safely turn this rule off.

## Further Reading

* [JSDoc](http://usejsdoc.org)
