---
title: no-new-func
rule_type: suggestion
---


It's possible to create functions in JavaScript from strings at runtime using the `Function` constructor, such as:

```js
var x = new Function("a", "b", "return a + b");
var x = Function("a", "b", "return a + b");
var x = Function.call(null, "a", "b", "return a + b");
var x = Function.apply(null, ["a", "b", "return a + b"]);
var x = Function.bind(null, "a", "b", "return a + b")();
```

This is considered by many to be a bad practice due to the difficulty in debugging and reading these types of functions. In addition, Content-Security-Policy (CSP) directives may disallow the use of eval() and similar methods for creating code from strings.

## Rule Details

This error is raised to highlight the use of a bad practice. By passing a string to the Function constructor, you are requiring the engine to parse that string much in the way it has to when you call the `eval` function.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-new-func: "error"*/

var x = new Function("a", "b", "return a + b");
var x = Function("a", "b", "return a + b");
var x = Function.call(null, "a", "b", "return a + b");
var x = Function.apply(null, ["a", "b", "return a + b"]);
var x = Function.bind(null, "a", "b", "return a + b")();
var f = Function.bind(null, "a", "b", "return a + b"); // assuming that the result of Function.bind(...) will be eventually called.
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-new-func: "error"*/

var x = function (a, b) {
    return a + b;
};
```

:::

## When Not To Use It

In more advanced cases where you really need to use the `Function` constructor.
