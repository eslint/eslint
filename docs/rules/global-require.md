# Enforce require() on the top-level module scope. (global-require)

In Node.js, module dependencies are included using the `require()` function, such as:

```js
var fs = require("fs");
```

While `require()` may be called anywhere in code, some style guide prescribe that it should be called only in the top-level scope of a module to make it easier to identify dependencies. For instance, it's arguably harder to identify dependencies when they are deeply nested inside of functions and other statements:

```js
function foo() {

    if (condition) {
        var fs = require("fs");
    }
}
```

Since `require()` does a synchronous load, it can cause performance problems when used in other locations.

## Rule Details

This rule requires all calls to `require()` to be at the top-level module scope.

You can enable this rule with the following syntax:

```json
"global-require": 2
```

The following patterns are considered problems:

```js
/*eslint global-require: 2*/
/*eslint-env es6*/

// calling require() inside of a function is not allowed
function readFile(filename, callback) {
    var fs = require('fs');                                /*error Unexpected require().*/
    fs.readFile(filename, callback)
}

// conditional requires like this are also not allowed
if (DEBUG) { require('debug'); }                           /*error Unexpected require().*/

// a require() in a switch statement is also flagged
switch(x) { case '1': require('1'); break; }               /*error Unexpected require().*/

// you may not require() inside an arrow function body
var getModule = (name) => require(name);                   /*error Unexpected require().*/

// you may not require() inside of a function body as well
function getModule(name) { return require(name); }         /*error Unexpected require().*/

// you may not require() inside of a try/catch block
try {
    require(unsafeModule);                                 /*error Unexpected require().*/
} catch(e) {
    console.log(e);
}
```

The following patterns are not considered problems:

```js
/*eslint global-require: 2*/

// all these variations of require() are ok
require('x');
var y = require('y');
var z;
z = require('z').initialize();

// requiring a module and using it in a function is ok
var fs = require('fs');
function readFile(filename, callback) {
    fs.readFile(filename, callback)
}

// you can use a ternary to determine which module to require
var logger = DEBUG ? require('dev-logger') : require('logger');

// if you want you can require() at the end of your module
function doSomethingA() {}
function doSomethingB() {}
var x = require("x"),
    z = require("z");
```

## When Not To Use It

If you have a module that must be initialized with information that comes from the file-system or if a module is only used in very rare situations and will cause significant overhead to load it may make sense to disable the rule.
