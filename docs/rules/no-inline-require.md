# Enforces module dependencies to be declared before use (no-inline-require)

Declaring your module's dependencies at the beginning of your module improves readability and provides insight to other developers about what modules are required. Declaring these dependencies inline within other parts of your code may make them harder to spot and could lead to poorly-maintainable code.

## Rule details

This rule enforces that modules are declared in the module's scope and are not used before that.

The following patterns are considered errors:

```js
// Use of module function before dependency declaration
var formatted = require("util").format("Ultimate answer: %s", 42);

var util;
util = require('util');

function myFunc () {
    // require() statements should be in the module's top-level scope
    var util = require('util');
}

// Use of require() in a function call
myFunc(require('util').inspect);

var result = require('myfunc')();
```

The following patterns are considered okay and do not cause warnings:

```js
var util = require('util')

var inspect = require('util').inspect

var util = require('util')
function myFunc () {
    var inspect = util.inspect
}
```

## When Not To Use It

If you want to be able to require other modules from anywhere in your code you can safely keep this rule disabled.
