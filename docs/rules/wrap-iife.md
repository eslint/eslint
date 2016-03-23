# Require IIFEs to be Wrapped (wrap-iife)

You can immediately invoke function expressions, but not function declarations. A common technique to create an immediately-invoked function expression (IIFE) is to wrap a function declaration in parentheses. The opening parentheses causes the contained function to be parsed as an expression, rather than a declaration.

```js
// function expression could be unwrapped
var x = function () { return { y: 1 };}();

// function declaration must be wrapped
function () { /* side effects */ }(); // SyntaxError
```

## Rule Details

This rule requires all immediately-invoked function expressions to be wrapped in parentheses.

## Options

The rule takes one option which can enforce a consistent wrapping style:

* `"outside"` enforces always wrapping the *call* expression. The default is `"outside"`.
* `"inside"` enforces always wrapping the *function* expression.
* `"any"` enforces always wrapping, but allows either style.

### outside

Examples of **incorrect** code for the default `"outside"` option:

```js
/*eslint wrap-iife: [2, "outside"]*/

var x = function () { return { y: 1 };}(); // unwrapped
var x = (function () { return { y: 1 };})(); // wrapped function expression
```

Examples of **correct** code for the default `"outside"` option:

```js
/*eslint wrap-iife: [2, "outside"]*/

var x = (function () { return { y: 1 };}()); // wrapped call expression
```

### inside

Examples of **incorrect** code for the `"inside"` option:

```js
/*eslint wrap-iife: [2, "inside"]*/

var x = function () { return { y: 1 };}(); // unwrapped
var x = (function () { return { y: 1 };}()); // wrapped call expression
```

Examples of **correct** code for the `"inside"` option:

```js
/*eslint wrap-iife: [2, "inside"]*/

var x = (function () { return { y: 1 };})(); // wrapped function expression
```

### any

Examples of **incorrect** code for the `"any"` option:

```js
/*eslint wrap-iife: [2, "any"]*/

var x = function () { return { y: 1 };}(); // unwrapped
```

Examples of **correct** code for the `"any"` option:

```js
/*eslint wrap-iife: [2, "any"]*/

var x = (function () { return { y: 1 };}()); // wrapped call expression
var x = (function () { return { y: 1 };})(); // wrapped function expression
```
