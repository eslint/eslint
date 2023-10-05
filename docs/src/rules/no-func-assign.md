---
title: no-func-assign
rule_type: problem
handled_by_typescript: true
---



JavaScript functions can be written as a FunctionDeclaration `function foo() { ... }` or as a FunctionExpression `var foo = function() { ... };`. While a JavaScript interpreter might tolerate it, overwriting/reassigning a function written as a FunctionDeclaration is often indicative of a mistake or issue.

```js
function foo() {}
foo = bar;
```

## Rule Details

This rule disallows reassigning `function` declarations.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-func-assign: "error"*/

function foo() {}
foo = bar;

function baz() {
    baz = bar;
}

var a = function hello() {
  hello = 123;
};
```

:::

Examples of **incorrect** code for this rule, unlike the corresponding rule in JSHint:

::: incorrect

```js
/*eslint no-func-assign: "error"*/

foo = bar;
function foo() {}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-func-assign: "error"*/

var foo = function () {}
foo = bar;

function baz(baz) { // `baz` is shadowed.
    baz = bar;
}

function qux() {
    var qux = bar;  // `qux` is shadowed.
}
```

:::
