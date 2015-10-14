# Require JSDoc comment (require-jsdoc)

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

Some style guides require JSDoc comments for all functions as a way of explaining function behavior.

## Rule details

This rule generates warnings for nodes that do not have JSDoc comments when they should. Supported nodes:

* `FunctionDeclaration`

The following patterns are considered problems:

```js
/*eslint require-jsdoc: 2*/

function foo() {       /*error Missing JSDoc comment.*/
    return 10;
}
```

The following patterns are not considered problems:

```js
/*eslint require-jsdoc: 2*/

/**
* It returns 10
*/
function foo() {
    return 10;
}

/**
* It returns 10
*/
var foo = function() {
    return 10;
}

var array = [1,2,3];
array.filter(function(item) {
    return item > 2;
});
```

## When not to use

If you do not require JSDoc for your functions, then you can leave this rule off.

## Related Rules

* [valid-jsdoc](valid-jsdoc.md)
