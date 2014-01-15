# Disallow Unused Variables

Variables that are declared and not used anywhere in the code are most likely an error due to incomplete refactoring. Such variables take up space in the code and can lead to confusion by readers.

## Rule Details

This rule is aimed at eliminating unused variables and functions, as as such, warns when one is found.

The following patterns are considered warnings:

```js
var x = 10;
```
```js
var x = 10; x = 5;
```

The following patterns are not considered warnings:

```js
var x = 10;
alert(x);

// foo is considered used here
myFunc(function foo() {
    // ...
}.bind(this));
```

No warning will be thrown for unused variables in the parameters of function declarations or function expressions if any of the variables following the unused variable are used in that function's scope. This allows you to have unused variables in a function.

```js
"use strict";

function A(x, y) {
    this.x = y;
    this.x = y;
}

A.prototype.getY = function () {
    return this.y;
};

function B(x, y) {
    A.apply(this, arguments);
    this.y = 2 * y;
}

var b = new B(1, 2);

b.getY();
```

### Options

By default this rule is enabled with "local" option.
```
{
    "rules": {
        "no-unused-vars": [2, "local"]
    }
}
```
 This will check that all local variables are used, but it will allow global variables to be unused.
"All" option will disable this behavior and will not allow any variables to be unused.
```
{
    "rules": {
        "no-unused-vars": [2, "all"],
    }
}
```
