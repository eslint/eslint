# Suggest using arrow functions as callbacks. (prefer-arrow-callback)

Arrow functions are suited to callbacks, because:

- `this` keywords in arrow functions bind to the upper scope's.
- The notation of the arrow function is shorter than function expression's.

## Rule Details

This rule is aimed to flag usage of function expressions in an argument list.

The following patterns are considered problems:

```js
/*eslint prefer-arrow-callback: 2*/

foo(function(a) { return a; });                /*error Unexpected function expression.*/
foo(function() { return this.a; }.bind(this)); /*error Unexpected function expression.*/
```

The following patterns are not considered problems:

```js
/*eslint prefer-arrow-callback: 2*/
/*eslint-env es6*/

foo(a => a);
foo(function*() { yield; });

// this is not a callback.
var foo = function foo(a) { return a; };

// using `this` without `.bind(this)`.
foo(function() { return this.a; });

// recursively.
foo(function bar(n) { return n && n + bar(n - 1); });
```

## When Not to Use It

This rule should not be used in ES3/5 environments.

In ES2015 (ES6) or later, if you don't want to be notified about function expressions in an argument list, you can safely disable this rule.
