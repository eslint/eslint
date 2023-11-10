---
title: no-compare-neg-zero
rule_type: problem
---



## Rule Details

The rule should warn against code that tries to compare against `-0`, since that will not work as intended. That is, code like `x === -0` will pass for both `+0` and `-0`. The author probably intended `Object.is(x, -0)`.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/* eslint no-compare-neg-zero: "error" */

if (x === -0) {
    // doSomething()...
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/* eslint no-compare-neg-zero: "error" */

if (x === 0) {
    // doSomething()...
}
```

:::

::: correct

```js
/* eslint no-compare-neg-zero: "error" */

if (Object.is(x, -0)) {
    // doSomething()...
}
```

:::
