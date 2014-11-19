# Validates JSDoc comments are syntactically correct (valid-jsdoc)

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

The JSDoc comments have a syntax all their own, and it is easy to mistakenly mistype a comment because comments aren't often checked for correctness in editors. Further, it's very easy for the function definition to get out of sync with the comments, making the comments a source of confusion and error.

## Rule Details

This rule aims to prevent invalid and incomplete JSDoc comments. In doing so, it will warn when:

1. There is a JSDoc syntax error
1. A `@param` or `@returns` is used without a type specified
1. A `@param` or `@returns` is used without a description
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

### Options

#### prefer

JSDoc offers a lot of tags with overlapping meaning. For example, both `@return` and `@returns` are acceptable for specifying the return value of a function. However, you may want to enforce a certain tag be used instead of others. You can specify your preferences regarding tag substitution by providing a mapping called `prefer` in the rule configuration. For example, to specify that `@returns` should be used instead of `@return`, you can use the following configuration:

```
"valid-jsdoc": [2, {
    "prefer": {
        "return": "returns"
    }
}]
```

With this configuration, ESLint will warn when it finds `@return` and recommend to replace it with `@returns`.

#### requireReturn

By default ESLint requires you to specify `@return` for every documented function regardless of whether there is anything returned by the function. While using `@return {void}` stops it from asking for a description of the return value using the `requireReturn` option and setting it to false prevents an error from being logged unless there is a return in the function. Note that with this option set to `false`, if there is a return in the function, an error will still be logged and if there is a `@return` specified and there are no `return` statements in the function an error will also be logged. This option is purely to prevent the forced addition of `@return {void}` to an entire codebase not to turn off JSDoc return checking.

```
"valid-jsdoc": [2, {
    "requireReturn": false
}]
```

#### requireParamDescription

By default ESLint requires you to specify a description for each `@param`. You can choose not to require descriptions for parameters by setting `requireParamDescription` to `false`.

```
"valid-jsdoc": [2, {
    "requireParamDescription": false
}]
```

## When Not To Use It

If you aren't using JSDoc, then you can safely turn this rule off.

## Further Reading

* [JSDoc](http://usejsdoc.org)
