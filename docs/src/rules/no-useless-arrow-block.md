---
title: no-useless-arrow-block
rule_type: suggestion
---



Arrow functions with a block body containing only a single return statement or a single expression statement can be simplified by removing the braces and, in the case of a return statement, the return keyword. This simplification can improve code readability.

## Rule Details

This rule aims to report and fix arrow functions that can have their block body simplified.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/* eslint no-useless-arrow-block: "error" */

const foo = () => { return 5; };

const bar = (x) => { return x * 2; };

const baz = () => { console.log('Hello'); };

const qux = (a, b) => {
  return a + b;
};

```

:::

Examples of **correct** code for this rule:

::: correct

```js
/* eslint no-useless-arrow-block: "error" */

const foo = () => 5;

const bar = (x) => x * 2;

const baz = () => console.log('Hello');

const qux = (a, b) => a + b;

const complex = () => {
  doSomething();
  return result;
};

const multiLine = () => (
  veryLongExpression +
  thatNeedsToBeWrapped
);

class MyClass {
  static myMethod = () => {
    this.doSomething();
  };
}

```

:::

## When Not To Use It

If you prefer consistency in all arrow function bodies using blocks, you can disable this rule. Also, if you use arrow functions with a single statement that you prefer to keep in block form for potential future expansion, you might want to disable this rule.
