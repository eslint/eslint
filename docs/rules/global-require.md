# Disallow require() outside of the top-level module scope. (global-require)

Declaring module's dependencies at the beginning of a module improves readability and provides insight to
other developers about what modules are required. Declaring these dependencies inline within other parts of the
code may make them harder to spot and could lead to poorly-maintainable code in the long term.

In addition to maintainability issues there are also performance implications. `require` is a synchronous function and
will block the main thread while it loads its modules. This can be a problem even after `require()` caches the loaded
module and thus should be avoided whenever possible.


## Rule Details

This rule disallow `require()` outside of the top-level module scope.

You can enable this rule with the following syntax:

```json
"global-require": 2
```

With the rule enabled enabled the following examples would warn:

```js
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

These following would **not** warn:

```js
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

If you have a module that must be initialized with information that comes from the file-system or if a module
 is only used in very rare situations and will cause significant overhead to load it may make sense to disable the rule.

