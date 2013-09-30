# No unused variables

Variables that are only declared and not used anywhere in the code are unnecessary complicating code base.


## Rule Details

This error occurs when a variable is declared but never used

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
};
```

No warning will be thrown for unused variables in the parameters of Function Declarations or Function Expressions if any of the variables following the unused variable are used in that function's scope. This allows you to have unused variables in a function but still use that variable via super().

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
