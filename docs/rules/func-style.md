# enforce the consistent use of either `function` declarations or expressions (func-style)

There are two ways of defining functions in JavaScript: `function` declarations and `function` expressions. Declarations contain the `function` keyword first, followed by a name and then its arguments and the function body, for example:

```js
function doSomething() {
    // ...
}
```

Equivalent function expressions begin with the `var` keyword, followed by a name and then the function itself, such as:

```js
var doSomething = function() {
    // ...
};
```

The primary difference between `function` declarations and `function expressions` is that declarations are *hoisted* to the top of the scope in which they are defined, which allows you to write code that uses the function before its declaration. For example:

```js
doSomething();

function doSomething() {
    // ...
}
```

Although this code might seem like an error, it actually works fine because JavaScript engines hoist the `function` declarations to the top of the scope. That means this code is treated as if the declaration came before the invocation.

For `function` expressions, you must define the function before it is used, otherwise it causes an error. Example:

```js
doSomething();  // error!

var doSomething = function() {
    // ...
};
```

In this case, `doSomething()` is undefined at the time of invocation and so causes a runtime error.

Due to these different behaviors, it is common to have guidelines as to which style of function should be used. There is really no correct or incorrect choice here, it is just a preference.

## Rule Details

This rule enforces a particular type of `function` style throughout a JavaScript file, either declarations or expressions. You can specify which you prefer in the configuration.

## Options

This rule has a string option:

* `"expression"` (default) requires the use of function expressions instead of function declarations
* `"declaration"` requires the use of function declarations instead of function expressions

This rule has an object option for an exception:

* `"allowArrowFunctions": true` (default `false`) allows the use of arrow functions

### expression

Examples of **incorrect** code for this rule with the default `"expression"` option:

```js
/*eslint func-style: ["error", "expression"]*/

function foo() {
    // ...
}
```

Examples of **correct** code for this rule with the default `"expression"` option:

```js
/*eslint func-style: ["error", "expression"]*/

var foo = function() {
    // ...
};
```

### declaration

Examples of **incorrect** code for this rule with the `"declaration"` option:

```js
/*eslint func-style: ["error", "declaration"]*/

var foo = function() {
    // ...
};

var foo = () => {};
```

Examples of **correct** code for this rule with the `"declaration"` option:

```js
/*eslint func-style: ["error", "declaration"]*/

function foo() {
    // ...
}

// Methods (functions assigned to objects) are not checked by this rule
SomeObject.foo = function() {
    // ...
};
```

### allowArrowFunctions

Examples of additional **correct** code for this rule with the `"declaration", { "allowArrowFunctions": true }` options:

```js
/*eslint func-style: ["error", "declaration", { "allowArrowFunctions": true }]*/

var foo = () => {};
```

## When Not To Use It

If you want to allow developers to each decide how they want to write functions on their own, then you can disable this rule.

## Further Reading

* [JavaScript Scoping and Hoisting](http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html)
