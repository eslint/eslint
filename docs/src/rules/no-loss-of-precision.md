---
title: no-loss-of-precision
layout: doc
edit_link: https://github.com/eslint/eslint/edit/main/docs/src/rules/no-loss-of-precision.md
rule_type: problem
---

<!--RECOMMENDED-->

Disallows number literals that lose precision.

This rule would disallow the use of number literals that immediately lose precision at runtime when converted to a JS `Number` due to 64-bit floating-point rounding.

## Rule Details

In JS, `Number`s are stored as double-precision floating-point numbers according to the [IEEE 754 standard](https://en.wikipedia.org/wiki/IEEE_754). Because of this, numbers can only retain accuracy up to a certain amount of digits. If the programmer enters additional digits, those digits will be lost in the conversion to the `Number` type and will result in unexpected behavior.

Examples of **incorrect** code for this rule:

```js
/*eslint no-loss-of-precision: "error"*/

const x = 9007199254740993
const x = 5123000000000000000000000000001
const x = 1230000000000000000000000.0
const x = .1230000000000000000000000
const x = 0X20000000000001
const x = 0X2_000000000_0001;
```

Examples of **correct** code for this rule:

```js
/*eslint no-loss-of-precision: "error"*/

const x = 12345
const x = 123.456
const x = 123e34
const x = 12300000000000000000000000
const x = 0x1FFFFFFFFFFFFF
const x = 9007199254740991
const x = 9007_1992547409_91
```
