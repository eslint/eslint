# Require Variable Declarations to be at the top of their scope (vars-on-top)

The `vars-on-top` rule generates warnings when variable declarations are not used serially at the top of a function scope or the top of a program.
By default variable declarations are always moved (“hoisted”) invisibly to the top of their containing scope by the JavaScript interpreter.
This rule forces the programmer to represent that behaviour by manually moving the variable declaration to the top of its containing scope.

## Rule Details

This rule aims to keep all variable declarations in the leading series of statements.
Allowing multiple declarations helps promote maintainability and is thus allowed.

### Examples

The following patterns are considered problems:

```js
/*eslint vars-on-top: 2*/

// Variable declarations in a block:
function doSomething() {
    var first;
    if (true) {
        first = true;
    }
    var second;                 /*error All "var" declarations must be at the top of the function scope.*/
}

// Variable declaration in for initializer:
function doSomething() {
    for (var i=0; i<10; i++) {} /*error All "var" declarations must be at the top of the function scope.*/
}

// Variables after other statements:
f();
var a;                          /*error All "var" declarations must be at the top of the function scope.*/
```

The following patterns are not considered problems:

```js
/*eslint vars-on-top: 2*/

function doSomething() {
    var first;
    var second; //multiple declarations are allowed at the top
    if (true) {
        first = true;
    }
}

function doSomething() {
    var i;
    for (i=0; i<10; i++) {}
}
```

```js
/*eslint vars-on-top: 2*/

var a;
f();
```

```js
/*eslint vars-on-top: 2*/

// Directives may precede variable declarations.
"use strict";
var a;
f();

// Comments can describe variables.
function doSomething() {
    // this is the first var.
    var first;
    // this is the second var.
    var second
}
```

## Further Reading

* [JavaScript Scoping and Hoisting](http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html)
* [var Hoisting](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var#var_hoisting)
* [A criticism of the Single Var Pattern in JavaScript, and a simple alternative](http://danielhough.co.uk/blog/single-var-pattern-rant/)
* [Multiple var statements in JavaScript, not superfluous](http://benalman.com/news/2012/05/multiple-var-statements-javascript/)
