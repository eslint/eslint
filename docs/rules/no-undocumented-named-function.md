# Do no leave named functions undocumented (no-undocumented-named-function)

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

This rule aims to enforce documentation for all exported or internally named functions created by the developer.
It will warn if there is no documentation for a named function in your file.

The following patterns are considered warnings:

```js
// exported function as property of Object without documentation
define(function () {

/**
* A module that says hello!
* @exports hello/world
*/
var ns = {};

ns.sayHello = function() {
return 'Hello world';
};

return ns;
});
```

The following patterns are not warnings:

```js
/**
 * Adds two numbers together.
 * @param {int} num1 The first number.
 * @param {int} num2 The second number.
 * @returns {int} The sum of the two numbers.
 */
function add(num1, num2) {
  return num1 + num2;
}

/**
@class MyClass
*/
function MyClass() {

}
```
