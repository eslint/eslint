# Enforce Function Style (func-style)

There are two ways of defining functions in JavaScript: function declarations and function expressions. Declarations have the `function` keyword first, followed by a name, followed by its arguments and the function body, such as:

```js
function doSomething() {
    // ...
}
```

Equivalent function expressions begin with the `var` keyword, followed by a name, and then the function itself, such as:

```js
var doSomething = function() {
    // ...
};
```

The primary difference between function declarations and function expressions is that declarations are *hoisted* to the top of the scope in which they are defined, which allows you to write code that uses the function before the declaration. For example:

```js
doSomething();

function doSomething() {
    // ...
}
```

Although this code might seem like an error, it actually works fine because JavaScript engines hoist the function declarations to the top of the scope. That means this code is treated as if the declaration came before the invocation.

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

This error is aimed at enforcing a particular type of function style throughout a JavaScript file, either declarations or expressions. You can specify which you prefer in the configuration.

The following patterns are considered problems:

```js
/*eslint func-style: [2, "declaration"]*/

var foo = function() {  /*error Expected a function declaration.*/
    // ...
};
```

```js
/*eslint func-style: [2, "expression"]*/

function foo() {  /*error Expected a function expression.*/
    // ...
}
```

```js
/*eslint func-style: [2, "declaration"]*/

var foo = () => {};  /*error Expected a function declaration.*/
```

The following patterns are not considered problems:

```js
/*eslint func-style: [2, "declaration"]*/

function foo() {
    // ...
}

// Methods (functions assigned to objects) are not checked by this rule
SomeObject.foo = function() {
    // ...
};
```

```js
/*eslint func-style: [2, "expression"]*/

var foo = function() {
    // ...
};
```

```js
/*eslint func-style: [2, "declaration", { "allowArrowFunctions": true }]*/

var foo = () => {};
```


### Options

```json
"func-style": [2, "declaration"]
```

This reports an error if any function expressions are used where function declarations are expected. You can specify to use expressions instead:

```json
"func-style": [2, "expression"]
```

This configuration reports an error when function declarations are used instead of function expressions.

```json
"func-style": [2, "expression", { "allowArrowFunctions": true }]
```

This configuration works as expression setting works but does not check for arrow functions.

## When Not To Use It

If you want to allow developers to each decide how they want to write functions on their own, then you can disable this rule.

## Further Reading

* [JavaScript Scoping and Hoisting](http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html)
