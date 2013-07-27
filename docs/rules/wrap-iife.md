# wrap iife

Require immediate function invocation to be wrapped in parentheses

```js
var x = function () { return { y: 1 };}();
```

## Rule Details

Since function statements cannot be immediately invoked, and function expressions can be, a common technique to create an immediately-invoked function expression is to simply wrap a function statement in parentheses. The opening parentheses causes the contained function to be parsed as an expression, rather than a declaration.

The following patterns are considered warnings:

```js
var x = function () { return { y: 1 };}();
```

The following patterns adhere to this rule:

```js
var x = (function () { return { y: 1 };})();
```