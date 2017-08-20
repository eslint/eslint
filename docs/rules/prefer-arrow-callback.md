# Suggest using ES6 arrow functions to describe callbacks (prefer-arrow-callback)

Arrow functions can be an attractive alternative to function expressions, when describing callbacks or function arguments.

For example, arrow functions are bound to their surrounding scope/context automatically. This is an upgrade from using `bind()` and `this` to explicitly bind a function expression, which was the pre-ES6 standard for achieving similar scoping behavior.

Additionally, arrow functions are:

- less verbose and easier to reason about.

- more robust and lexically bound regardless of where or when they are eventually invoked.

## Rule Details

This rule identifies function expressions being used as callbacks or function arguments, where upgrading to an arrow function would achieve identical results.

Instances where an arrow function would not achieve identical results will be ignored.

The following patterns **will** produce an error:

```js
/*eslint prefer-arrow-callback: "error"*/

foo(function(a) { return a; });
foo(function() { return this.a; }.bind(this));
```

The following patterns **will not** produce an error:

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

Access further control over this rule's behavior via an options object.

Default: `{ allowNamedFunctions: false, allowUnboundThis: true }`

### allowNamedFunctions

This option accepts a `boolean` value and is `false` by default. When `false`, any named functions used as callbacks will produce a flag.
When `true`, named functions will no longer produce a flag.

Examples of **correct** code for the `{ "allowNamedFunctions": true }` option:

```js
/*eslint prefer-arrow-callback: [ "error", { "allowNamedFunctions": true } ]*/

foo(function bar() {});
```

### allowUnboundThis

By default `{ "allowUnboundThis": true }`, this option will allow function expressions containing `this` to be used as callbacks - as long as the function in question has not been explicitly bound.

`{ "allowUnboundThis": false }` prohibits using function expressions to describe callbacks entirely, without exception.

Examples of **incorrect** code for the `{ "allowUnboundThis": false }` option:

```js
/*eslint prefer-arrow-callback: [ "error", { "allowUnboundThis": false } ]*/
/*eslint-env es6*/

foo(function() { this.a; });

foo(function() { (() => this); });

someArray.map(function (itm) { return this.doSomething(itm); }, someObject);
```

## When Not To Use It

- In environments that have not yet adopted ES6 language features (ES3/5).

- In ES6+ environments that allow the use of function expressions when describing callbacks or function arguments.

## Further Reading

- [More on ES6 arrow functions]('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions')
