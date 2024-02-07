---
title: newline-before-return
rule_type: layout
related_rules:
- newline-after-var
---



This rule was **deprecated** in ESLint v4.0.0 and replaced by the [padding-line-between-statements](padding-line-between-statements) rule.

There is no hard and fast rule about whether empty lines should precede `return` statements in JavaScript. However, clearly delineating where a function is returning can greatly increase the readability and clarity of the code. For example:

```js
function foo(bar) {
  var baz = 'baz';
  if (!bar) {
    bar = baz;
    return bar;
  }
  return bar;
}
```

Adding newlines visibly separates the return statements from the previous lines, making it clear where the function exits and what value it returns:

```js
function foo(bar) {
  var baz = 'baz';

  if (!bar) {
    bar = baz;

    return bar;
  }

  return bar;
}
```

## Rule Details

This rule requires an empty line before `return` statements to increase code clarity, except when the `return` is alone inside a statement group (such as an if statement). In the latter case, the `return` statement does not need to be delineated by virtue of it being alone. Comments are ignored and do not count as empty lines.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint newline-before-return: "error"*/

function foo1(bar) {
    if (!bar) {
        return;
    }
    return bar;
}

function foo2(bar) {
    if (!bar) {
        return;
    }
    /* multi-line
    comment */
    return bar;
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint newline-before-return: "error"*/

function foo1() {
    return;
}

function foo2() {

    return;
}

function foo3(bar) {
    if (!bar) return;
}

function foo4(bar) {
    if (!bar) { return };
}

function foo5(bar) {
    if (!bar) {
        return;
    }
}

function foo6(bar) {
    if (!bar) {
        return;
    }

    return bar;
}

function foo7(bar) {
    if (!bar) {

        return;
    }
}

function foo8() {

    // comment
    return;
}
```

:::

## When Not To Use It

You can safely disable this rule if you do not have any strict conventions about whitespace before `return` statements.
