---
title: no-new-nonconstructor
layout: doc
rule_type: problem
related_rules:
- no-new-symbol
further_reading:
- https://tc39.es/ecma262/#sec-symbol-object
- https://tc39.es/ecma262/#sec-bigint-object
---



Certain functions are not intended to be used with the `new` operator, but to be called as a function.

```js
var foo = new Symbol("foo");
```

```js
var bar = new BigInt(9007199254740991)
```

These throw a `TypeError` exception.

## Rule Details

This rule is aimed at preventing the accidental calling of certain functions with the `new` operator. These functions are:

* `Symbol`
* `BigInt`

## Examples

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-new-nonconstructor: "error"*/
/*eslint-env es2022*/

var foo = new Symbol('foo');
var bar = new BigInt(9007199254740991);
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-new-symbol: "error"*/
/*eslint-env es2022*/

var foo = Symbol('foo');
var bar = new BigInt(9007199254740991);

// Ignores shadowed Symbol.
function baz(Symbol) {
    const qux = new Symbol("baz");
}
function quux(BigInt) {
    const corge = new BigInt(9007199254740991);
}

```

:::

## When Not To Use It

This rule should not be used in ES3/5 environments.
