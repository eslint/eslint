---
title: no-useless-return
layout: doc
edit_link: https://github.com/eslint/eslint/edit/main/docs/src/rules/no-useless-return.md
rule_type: suggestion
---

<!--FIXABLE-->

Disallows redundant return statements.

A `return;` statement with nothing after it is redundant, and has no effect on the runtime behavior of a function. This can be confusing, so it's better to disallow these redundant statements.

## Rule Details

This rule aims to report redundant `return` statements.

Examples of **incorrect** code for this rule:

```js
/* eslint no-useless-return: "error" */

function foo() { return; }

function foo() {
  doSomething();
  return;
}

function foo() {
  if (condition) {
    bar();
    return;
  } else {
    baz();
  }
}

function foo() {
  switch (bar) {
    case 1:
      doSomething();
    default:
      doSomethingElse();
      return;
  }
}

```

Examples of **correct** code for this rule:

```js
/* eslint no-useless-return: "error" */

function foo() { return 5; }

function foo() {
  return doSomething();
}

function foo() {
  if (condition) {
    bar();
    return;
  } else {
    baz();
  }
  qux();
}

function foo() {
  switch (bar) {
    case 1:
      doSomething();
      return;
    default:
      doSomethingElse();
  }
}

function foo() {
  for (const foo of bar) {
    return;
  }
}

```

## When Not To Use It

If you don't care about disallowing redundant return statements, you can turn off this rule.
