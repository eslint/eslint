---
title: no-unmodified-loop-condition
rule_type: problem
---


Variables in a loop condition often are modified in the loop.
If not, it's possibly a mistake.

```js
while (node) {
    doSomething(node);
}
```

```js
while (node) {
    doSomething(node);
    node = node.parent;
}
```

## Rule Details

This rule finds references which are inside of loop conditions, then checks the
variables of those references are modified in the loop.

By default, if a reference is inside of a binary expression or a ternary expression, this rule checks
the result of the expression instead. The `checkConditionalExpressions` option stops the rule from
grouping references solely because they belong to the same ternary expression.
If a reference is inside of a dynamic expression (e.g. `CallExpression`,
`YieldExpression`, ...), this rule ignores it.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-unmodified-loop-condition: "error"*/

let node = something;

while (node) {
    doSomething(node);
}
node = other;

for (let j = 0; j < 5;) {
    doSomething(j);
}

while (node !== root) {
    doSomething(node);
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-unmodified-loop-condition: "error"*/

while (node) {
    doSomething(node);
    node = node.parent;
}

for (let j = 0; j < items.length; ++j) {
    doSomething(items[j]);
}

// OK, the result of this binary expression is changed in this loop.
while (node !== root) {
    doSomething(node);
    node = node.parent;
}

// OK, the result of this ternary expression is changed in this loop.
while (node ? A : B) {
    doSomething(node);
    node = node.parent;
}

// A property might be a getter which has side effect...
// Or "doSomething" can modify "obj.foo".
while (obj.foo) {
    doSomething(obj);
}

// A function call can return various values.
while (check(obj)) {
    doSomething(obj);
}
```

:::

## Options

This rule has an object option:

* `checkConditionalExpressions`: When `true`, a ternary expression does not form a group when the rule determines whether its references are modified. This does not change how binary expressions are handled. The default is `false`, which checks the result of the entire ternary expression.

Examples of **incorrect** code for this rule with the `{ checkConditionalExpressions: true }` option:

::: incorrect

```js
/* eslint no-unmodified-loop-condition: ["error", { checkConditionalExpressions: true }] */

let chunk = getInitialChunk();
let done = false;

while (chunk ? !done : false) {
    chunk = nextOrNull();
}
```

:::

## When Not To Use It

If you don't want to notified about references inside of loop conditions, then it's safe to disable this rule.
