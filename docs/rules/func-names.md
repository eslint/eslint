# Require Function Expressions to have a Name (func-names)

A pattern that's becoming more common is to give function expressions names to aid in debugging, such as:

```js
Foo.prototype.bar = function bar() {};
```

Adding the second `bar` in the above example is optional.  If you leave off the function name then when the function throws an exception you are likely to get something similar to `anonymous function` in the stack trace.  If you provide the optional name for a function expression then you will get the name of the function expression in the stack trace.

## Rule Details

The following patterns are considered problems:

```js
/* eslint func-names: 2*/

Foo.prototype.bar = function() {}; /*error Missing function expression name.*/

(function() {                      /*error Missing function expression name.*/
    // ...
}())
```

The following patterns are not considered problems:

```js
/* eslint func-names: 2*/

Foo.prototype.bar = function bar() {};

(function bar() {
    // ...
}())
```

## Further Reading

* [Functions Explained](http://markdaggett.com/blog/2013/02/15/functions-explained/)
