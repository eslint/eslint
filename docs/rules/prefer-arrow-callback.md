# Require using arrow functions for callbacks (prefer-arrow-callback)

Arrow functions can be an attractive alternative to function expressions for callbacks or function arguments.

For example, arrow functions are automatically bound to their surrounding scope/context. This provides an alternative to the pre-ES6 standard of explicitly binding function expressions to achieve similar behavior.

Additionally, arrow functions are:

- less verbose, and easier to reason about.

- bound lexically regardless of where or when they are invoked.

## Rule Details

This rule locates function expressions used as callbacks or function arguments. An error will be produced for any that could be replaced by an arrow function without changing the result.

The following examples **will** be flagged:

```js
/* eslint prefer-arrow-callback: "error" */

foo(function(a) { return a; }); // ERROR
// prefer: foo(a => a)

foo(function() { return this.a; }.bind(this)); // ERROR
// prefer: foo(() => this.a)
```

Instances where an arrow function would not produce identical results will be ignored.

The following examples **will not** be flagged:

```js
/* eslint prefer-arrow-callback: "error" */
/* eslint-env es6 */

// arrow function callback
foo(a => a); // OK

// generator as callback
foo(function*() { yield; }); // OK

// function expression not used as callback or function argument
var foo = function foo(a) { return a; }; // OK

// unbound function expression callback
foo(function() { return this.a; }); // OK

// recursive named function callback
foo(function bar(n) { return n && n + bar(n - 1); }); // OK
```

## Options

Access further control over this rule's behavior via an options object.

Default: `{ allowNamedFunctions: false, allowUnboundThis: true }`

### allowNamedFunctions

By default `{ "allowNamedFunctions": false }`, this `boolean` option prohibits using named functions as callbacks or function arguments.

Changing this value to `true` will reverse this option's behavior by allowing use of named functions without restriction.

`{ "allowNamedFunctions": true }` **will not** flag the following example:

```js
/* eslint prefer-arrow-callback: [ "error", { "allowNamedFunctions": true } ] */

foo(function bar() {});
```

### allowUnboundThis

By default `{ "allowUnboundThis": true }`, this `boolean` option allows function expressions containing `this` to be used as callbacks, as long as the function in question has not been explicitly bound.

When set to `false` this option prohibits the use of function expressions as callbacks or function arguments entirely, without exception.

`{ "allowUnboundThis": false }` **will** flag the following examples:

```js
/* eslint prefer-arrow-callback: [ "error", { "allowUnboundThis": false } ] */
/* eslint-env es6 */

foo(function() { this.a; });

foo(function() { (() => this); });

someArray.map(function(itm) { return this.doSomething(itm); }, someObject);
```

## When Not To Use It

- In environments that have not yet adopted ES6 language features (ES3/5).

- In ES6+ environments that allow the use of function expressions when describing callbacks or function arguments.

## Further Reading

- [More on ES6 arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
