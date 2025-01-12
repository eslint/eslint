---
title: no-useless-concat
rule_type: suggestion
---


It's unnecessary to concatenate two strings together, such as:

```js
const foo = "a" + "b";
```

This code is likely the result of refactoring where a variable was removed from the concatenation (such as `"a" + b + "b"`). In such a case, the concatenation isn't important and the code can be rewritten as:

```js
const foo = "ab";
```

## Rule Details

This rule aims to flag the concatenation of 2 literals when they could be combined into a single literal. Literals can be strings or template literals.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-useless-concat: "error"*/

const a = `some` + `string`;

// these are the same as "10"
const b = '1' + '0';
const c = '1' + `0`;
const d = `1` + '0';
const e = `1` + `0`;
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-useless-concat: "error"*/

// when a non string is included
const a = a + b;
const b = '1' + a;
const c = 1 + '1';
const d = 1 - 2;
// when the string concatenation is multiline
const e = "foo" +
    "bar";
```

:::

## When Not To Use It

If you don't want to be notified about unnecessary string concatenation, you can safely disable this rule.
