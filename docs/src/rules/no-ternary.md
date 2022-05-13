---
title: no-ternary
layout: doc
edit_link: https://github.com/eslint/eslint/edit/main/docs/src/rules/no-ternary.md
rule_type: suggestion
related_rules:
- no-nested-ternary
- no-unneeded-ternary
---

Disallows ternary operators.

The ternary operator is used to conditionally assign a value to a variable. Some believe that the use of ternary operators leads to unclear code.

```js
var foo = isBar ? baz : qux;
```

## Rule Details

This rule disallows ternary operators.

Examples of **incorrect** code for this rule:

```js
/*eslint no-ternary: "error"*/

var foo = isBar ? baz : qux;

function quux() {
  return foo ? bar() : baz();
}
```

Examples of **correct** code for this rule:

```js
/*eslint no-ternary: "error"*/

var foo;

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
