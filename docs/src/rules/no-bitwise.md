---
title: no-bitwise
rule_type: suggestion
---


The use of bitwise operators in JavaScript is very rare and often `&` or `|` is simply a mistyped `&&` or `||`, which will lead to unexpected behavior.

```js
const x = y | z;
```

## Rule Details

This rule disallows bitwise operators.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-bitwise: "error"*/

let x = y | z;

const x1 = y & z;

const x2 = y ^ z;

const x3 = ~ z;

const x4 = y << z;

const x5 = y >> z;

const x6 = y >>> z;

x |= y;

x &= y;

x ^= y;

x <<= y;

x >>= y;

x >>>= y;
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-bitwise: "error"*/

let x = y || z;

const x1 = y && z;

const x2 = y > z;

const x3 = y < z;

x += y;
```

:::

## Options

This rule has an object option:

* `"allow"`: Allows a list of bitwise operators to be used as exceptions.
* `"int32Hint"`: Allows the use of bitwise OR in `|0` pattern for type casting.

### allow

Examples of **correct** code for this rule with the `{ "allow": ["~"] }` option:

::: correct

```js
/*eslint no-bitwise: ["error", { "allow": ["~"] }] */

~[1,2,3].indexOf(1) === -1;
```

:::

### int32Hint

Examples of **correct** code for this rule with the `{ "int32Hint": true }` option:

::: correct

```js
/*eslint no-bitwise: ["error", { "int32Hint": true }] */

const b = a|0;
```

:::
