---
title: no-nested-ternary
rule_type: suggestion
related_rules:
- no-ternary
- no-unneeded-ternary
---


Nesting ternary expressions can make code more difficult to understand.

```js
var foo = bar ? baz : qux === quxx ? bing : bam;
```

## Rule Details

The `no-nested-ternary` rule disallows nested ternary expressions.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-nested-ternary: "error"*/

var thing = foo ? bar : baz === qux ? quxx : foobar;

foo ? baz === qux ? quxx() : foobar() : bar();
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-nested-ternary: "error"*/

var thing = foo ? bar : foobar;

var thing;

if (foo) {
  thing = bar;
} else if (baz === qux) {
  thing = quxx;
} else {
  thing = foobar;
}
```

:::
