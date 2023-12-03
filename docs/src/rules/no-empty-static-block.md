---
title: no-empty-static-block
layout: doc
rule_type: suggestion
related_rules:
- no-empty
- no-empty-function
further_reading:
- https://github.com/tc39/proposal-class-static-block
---

Empty static blocks, while not technically errors, usually occur due to refactoring that wasn't completed. They can cause confusion when reading code.

## Rule Details

This rule disallows empty static blocks. This rule ignores static blocks which contain a comment.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-empty-static-block: "error"*/

class Foo {
    static {}
}
```

:::

Examples of **correct** code for this rule:

:::correct

```js
/*eslint no-empty-static-block: "error"*/

class Foo {
    static {
        bar();
    }
}

class Bar {
    static {
        // comment
    }
}
```

:::

## When Not To Use It

This rule should not be used in environments prior to ES2022.
