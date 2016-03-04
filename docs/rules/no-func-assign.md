# Disallow Function Assignment (no-func-assign)

JavaScript functions can be written as a FunctionDeclaration `function foo() { ... }` or as a FunctionExpression `var foo = function() { ... };`. While a JavaScript interpreter might tolerate it, overwriting/reassigning a function written as a FunctionDeclaration is often indicative of a mistake or issue.

```js
function foo() {}
foo = bar;
```

## Rule Details

This rule is aimed at flagging probable mistakes and issues in the form of overwriting a function that was written as a FunctionDeclaration. As such it will warn when this issue is encountered.

Examples of **incorrect** code for this rule:

```js
/*eslint no-func-assign: 2*/

function foo() {}
foo = bar;

function foo() {
    foo = bar;
}
```

Examples of **incorrect** code for this rule, unlike the corresponding rule in JSHint:

```js
/*eslint no-func-assign: 2*/

foo = bar;
function foo() {}
```

Examples of **correct** code for this rule:

```js
/*eslint no-func-assign: 2*/

var foo = function () {}
foo = bar;

function foo(foo) { // `foo` is shadowed.
    foo = bar;
}

function foo() {
    var foo = bar;  // `foo` is shadowed.
}
```
