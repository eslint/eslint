---
title: func-style
rule_type: suggestion
further_reading:
- https://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html
---

There are two ways of defining functions in JavaScript: `function` declarations and function expressions assigned to variables. Function declarations are statements that begin with the `function` keyword. Function expressions can either be arrow functions or use the `function` keyword with an optional name. Here are some examples:

```js
// function declaration
function doSomething() {
    // ...
}

// arrow function expression assigned to a variable
const doSomethingElse = () => {
    // ...
};

// function expression assigned to a variable
const doSomethingAgain = function() {
    // ...
};
```

The primary difference between `function` declarations and function expressions is that declarations are *hoisted* to the top of the scope in which they are defined, which allows you to write code that uses the function before its declaration. For example:

```js
doSomething(); // ok

function doSomething() {
    // ...
}
```

For function expressions, you must define the function before it is used, otherwise it causes an error. Example:

```js
doSomething();  // error!

var doSomething = function() {
    // ...
};
```

In this case, `doSomething()` is undefined at the time of invocation and so causes a runtime error.

Due to these different behaviors, it is common to have guidelines as to which style of function should be used. There is really no correct or incorrect choice here, it is just a preference.

## Rule Details

This rule enforces a particular type of function style, either `function` declarations or expressions assigned to variables. You can specify which you prefer in the configuration.

Note: This rule does not apply to *all* functions. For example, a callback function passed as an argument to another function is not considered by this rule.

## Options

This rule has a string option:

* `"expression"` (default) requires the use of function expressions instead of function declarations
* `"declaration"` requires the use of function declarations instead of function expressions

This rule has an object option for two exceptions:

* `"allowArrowFunctions"`: `true` (default `false`) allows the use of arrow functions. This option applies only when the string option is set to `"declaration"` (arrow functions are always allowed when the string option is set to `"expression"`, regardless of this option)
* `"overrides"`:
    * `"namedExports": "expression" | "declaration" | "ignore"`: used to override function styles in named exports
        * `"expression"`: like string option
        * `"declaration"`: like string option
        * `"ignore"`: either style is acceptable

### expression

Examples of **incorrect** code for this rule with the default `"expression"` option:

::: incorrect

```js
/*eslint func-style: ["error", "expression"]*/

function foo() {
    // ...
}
```

:::

Examples of **correct** code for this rule with the default `"expression"` option:

::: correct

```js
/*eslint func-style: ["error", "expression"]*/

var foo = function() {
    // ...
};

var foo = () => {};

// allowed as allowArrowFunctions : false is applied only for declaration
```

:::

### declaration

Examples of **incorrect** code for this rule with the `"declaration"` option:

::: incorrect

```js
/*eslint func-style: ["error", "declaration"]*/

var foo = function() {
    // ...
};

var foo = () => {};
```

:::

Examples of **correct** code for this rule with the `"declaration"` option:

::: correct

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

:::

### allowArrowFunctions

Examples of additional **correct** code for this rule with the `"declaration", { "allowArrowFunctions": true }` options:

::: correct

```js
/*eslint func-style: ["error", "declaration", { "allowArrowFunctions": true }]*/

var foo = () => {};
```

:::

### overrides

#### namedExports

##### expression

Examples of **incorrect** code for this rule with the `"declaration"` and `{"overrides": { "namedExports": "expression" }}` option:

::: incorrect

```js
/*eslint func-style: ["error", "declaration", { "overrides": { "namedExports": "expression" } }]*/

export function foo() {
    // ...
}
```

:::

Examples of **correct** code for this rule with the `"declaration"` and `{"overrides": { "namedExports": "expression" }}` option:

::: correct

```js
/*eslint func-style: ["error", "declaration", { "overrides": { "namedExports": "expression" } }]*/

export var foo = function() {
    // ...
};

export var bar = () => {};
```

:::

##### declaration

Examples of **incorrect** code for this rule with the `"expression"` and `{"overrides": { "namedExports": "declaration" }}` option:

::: incorrect

```js
/*eslint func-style: ["error", "expression", { "overrides": { "namedExports": "declaration" } }]*/

export var foo = function() {
    // ...
};

export var bar = () => {};
```

:::

Examples of **correct** code for this rule with the `"expression"` and `{"overrides": { "namedExports": "declaration" }}` option:

::: correct

```js
/*eslint func-style: ["error", "expression", { "overrides": { "namedExports": "declaration" } }]*/

export function foo() {
    // ...
}
```

:::

##### ignore

Examples of **correct** code for this rule with the `{"overrides": { "namedExports": "ignore" }}` option:

::: correct

```js
/*eslint func-style: ["error", "expression", { "overrides": { "namedExports": "ignore" } }]*/

export var foo = function() {
    // ...
};

export var bar = () => {};

export function baz() {
    // ...
}
```

:::

## When Not To Use It

If you want to allow developers to each decide how they want to write functions on their own, then you can disable this rule.
