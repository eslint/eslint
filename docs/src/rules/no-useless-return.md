---
title: no-useless-return
rule_type: suggestion
---



A `return;` statement with nothing after it is redundant, and has no effect on the runtime behavior of a function. This can be confusing, so it's better to disallow these redundant statements.

## Rule Details

This rule aims to report redundant `return` statements.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/* eslint no-useless-return: "error" */

var foo = function() { return; }

var foo = function() {
  doSomething();
  return;
}

var foo = function() {
  if (condition) {
    bar();
    return;
  } else {
    baz();
  }
}

var foo = function() {
  switch (bar) {
    case 1:
      doSomething();
    default:
      doSomethingElse();
      return;
  }
}

```

:::

Examples of **correct** code for this rule:

::: correct

```js
/* eslint no-useless-return: "error" */

var foo = function() { return 5; }

var foo = function() {
  return doSomething();
}

var foo = function() {
  if (condition) {
    bar();
    return;
  } else {
    baz();
  }
  qux();
}

var foo = function() {
  switch (bar) {
    case 1:
      doSomething();
      return;
    default:
      doSomethingElse();
  }
}

var foo = function() {
  for (const foo of bar) {
    return;
  }
}

```

:::

## When Not To Use It

If you don't care about disallowing redundant return statements, you can turn off this rule.
