---
title: space-infix-ops
rule_type: layout
---

This rule was **deprecated** in ESLint v8.53.0. Please use the [corresponding rule](https://eslint.style/rules/js/space-infix-ops) in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).

While formatting preferences are very personal, a number of style guides require spaces around operators, such as:

```js
var sum = 1 + 2;
```

Proponents of this rule believe that it makes code easier to read and can more easily highlight potential errors, such as:

```js
var sum = i+++2;
```

While this is valid JavaScript syntax, it is hard to determine what the author intended.

## Rule Details

This rule is aimed at ensuring there are spaces around infix operators.

## Options

This rule accepts a single options argument with the following defaults:

```json
"space-infix-ops": ["error", { "int32Hint": false }]
```

### `int32Hint`

Set the `int32Hint` option to `true` (default is `false`) to allow write `a|0` without space.

```js
var foo = bar|0; // `foo` is forced to be signed 32 bit integer
```

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint space-infix-ops: "error"*/

a+b

a+ b

a +b

a?b:c

const a={b:1};

var {b=0}=bar;

function foo(a=0) { }
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint space-infix-ops: "error"*/

a + b

a       + b

a ? b : c

const a = {b:1};

var {b = 0} = bar;

function foo(a = 0) { }
```

:::

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing around infix operators.
