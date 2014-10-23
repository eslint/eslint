# Disallow functions that share a name with a variable (no-func-var)

## Rule Details

A named function expression declares two different objects: a variable and a function.
In cases of same names of the variable and the function we have redefinition of the variable because a function 
will be available before the variable declaration. IE8 don't like it.

The following patterns are considered warnings:

```js

var blah = function blah() {};

```

The following patterns are not warnings:

```js

var blah = function () {};

var blah = function halb() {};

```

## When Not To Use It

If your code will not working with IE8 you can disable this validation safely.

## Further Reading

* [Named function expressions demystified](http://kangax.github.io/nfe/)
