# Enforce require() on the top-level module scope (global-require)

In Node.js, module dependencies are included using the `require()` function, such as:

```js
var fs = require("fs");
```

While `require()` may be called anywhere in code, some style guides prescribe that it should be called only in the top level of a module to make it easier to identify dependencies. For instance, it's arguably harder to identify dependencies when they are deeply nested inside of functions and other statements:

```js
function foo() {

    if (condition) {
        var fs = require("fs");
    }
}
```

Since `require()` does a synchronous load, it can cause performance problems when used in other locations.

Further, ES6 modules mandate that `import` and `export` statements can only occur in the top level of the module's body.

## Rule Details

This rule requires all calls to `require()` to be at the top level of the module, similar to ES6 `import` and `export` statements, which also can occur only at the top level.

Examples of **incorrect** code for this rule:

```js
/*eslint global-require: "error"*/
/*eslint-env es6*/

// calling require() inside of a function is not allowed
function readFile(filename, callback) {
    var fs = require('fs');
    fs.readFile(filename, callback)
}

// conditional requires like this are also not allowed
if (DEBUG) { require('debug'); }

// a require() in a switch statement is also flagged
switch(x) { case '1': require('1'); break; }

// you may not require() inside an arrow function body
var getModule = (name) => require(name);

// you may not require() inside of a function body as well
function getModule(name) { return require(name); }

// you may not require() inside of a try/catch block
try {
    require(unsafeModule);
} catch(e) {
    console.log(e);
}
```

Examples of **correct** code for this rule:

```js
/*eslint global-require: "error"*/

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

If you have a module that must be initialized with information that comes from the file-system or if a module is only used in very rare situations and will cause significant overhead to load it may make sense to disable the rule. If you need to `require()` an optional dependency inside of a `try`/`catch`, you can disable this rule for just that dependency using the `// eslint-disable-line global-require` comment.
