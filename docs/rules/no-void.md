# Disallow use of void operator. (no-void)

The `void` operator takes operand and returns `undefined`: `void expression` will evaluate `expression` and return `undefined`. It can be used to suppress any side effects `expression` may produce:

The common case of using `void` operator is to get "pure" `undefined` value as prior to ES5 `undefined` variable was mutable:

```js
// will always return undefined
(function(){
    return void 0;
})();

// will return 1 in ES3 and undefined in ES5+
(function(){
    undefined = 1;
    return undefined;
))();

// will throw TypeError is ES5+
(function(){
    'use strict';
    undefined = 1;
})();
 ```

Another common case is to minify code as `void 0` is shorter than `undefined`:

```js
foo = void 0;
foo = undefined;
```

When used with IIFE (immediately-invoked function expression) `void` can be used to force the function keyword to be treated as an expression instead of a declaration:

```js
var foo = 1;
void function(){ foo = 1; }() // will assign foo a value of 1
+function(){ foo = 1; }() // same as above
function(){ foo = 1; }() // will throw SyntaxError
```

Some code styles prohibit `void` operator marking it as non-obvious and hard to read.

## Rule Details

This rule aims to eliminate use of void operator.

The following patterns are considered warnings:

```js
void foo
```

```js
var foo = void bar();
```

## When Not To Use It

If you intentionally use `void` operator then you can disable this rule.

## Further Reading

* [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void)
* [Bad Parts: Appendix B - JavaScript: The Good Parts by Douglas Crockford](http://oreilly.com/javascript/excerpts/javascript-good-parts/bad-parts.html)
