---
title: no-ternary
rule_type: suggestion
related_rules:
- no-nested-ternary
- no-unneeded-ternary
---


The ternary operator is used to conditionally assign a value to a variable. Some believe that the use of ternary operators leads to unclear code.

```js
const foo = isBar ? baz : qux;
```

## Rule Details

This rule disallows ternary operators.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-ternary: "error"*/

const foo = isBar ? baz : qux;

function quux() {
  return foo ? bar() : baz();
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-ternary: "error"*/

let foo;

if (isBar) {
    foo = baz;
} else {
    foo = qux;
}

function quux() {
    if (foo) {
        return bar();
    } else {
        return baz();
    }
}
```

:::

## Options

This rule has no options.
