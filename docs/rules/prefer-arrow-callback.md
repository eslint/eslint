# Suggest using arrow functions as callbacks. (prefer-arrow-callback)

Arrow functions are suited to callbacks, because:

- `this` keywords in arrow functions bind to the upper scope's.
- The notation of the arrow function is shorter than function expression's.

## Rule Details

This rule is aimed to flag usage of function expressions in an argument list.

The following patterns are considered problems:

```js
/*eslint prefer-arrow-callback: "error"*/

foo(function(a) { return a; });
foo(function() { return this.a; }.bind(this));
```

The following patterns are not considered problems:

```js
/*eslint prefer-arrow-callback: "error"*/
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

## Options

This rule takes one optional argument, an object which is an options object.

### allowNamedFunctions

This is a `boolean` option and it is `false` by default. When set to `true`, the rule doesn't warn on named functions used as callbacks.

Examples of **correct** code for the `{ "allowNamedFunctions": true }` option:

```js
/*eslint prefer-arrow-callback: ["error", { "allowNamedFunctions": true }]*/

foo(function bar() {});
```

### allowUnboundThis

__ES6 Arrow Functions__, when used to describe a callback, are lexically bound to the surrounding context/scope _automatically_, which eliminates the need to combine __ES5 Function Expressions__ with `bind()` and `this` to achieve similar behavior.

By default `{"allowUnboundThis": true}`, eslint _loosely_ enforces this option. When `false`, eslint _strictly_ enforces the option.

Behavior when `true` (LOOSE):

- __ALLOWED__: ES5 Function Expression callbacks containing the `this` keyword, __AS LONG AS__ the function in question __HAS NOT__ been _explicitly bound_.
- __NOT ALLOWED__: Callbacks described using ES5 Function Expression syntax that contains use of the `this` keyword, and has been _explicitly bound_.

Behavior when `false` (STRICT):

- __ALLOWED__: Callbacks containing `this` are not allowed unless described using ES6 Arrow Function syntax.
- __NOT ALLOWED__: Any use of `this` from within an ES5 Function Expression callback, whether _explicitly bound_ or not.

Examples of **incorrect** code for `{ "allowUnboundThis": false }`:

```js
/*eslint prefer-arrow-callback: ["error", { "allowUnboundThis": false }]*/
/*eslint-env es6*/

foo(function() { this.a; });

foo(function() { (() => this); });

someArray.map(function (itm) { return this.doSomething(itm); }, someObject);
```

## When Not To Use It

This rule should not be used in ES3/5 environments.

In ES2015 (ES6) or later, if you don't want to be notified about function expressions in an argument list, you can safely disable this rule.
