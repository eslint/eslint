---
title: sort-vars
rule_type: suggestion
related_rules:
- sort-keys
- sort-imports
---



When declaring multiple variables within the same block, some developers prefer to sort variable names alphabetically to be able to find necessary variable easier at the later time. Others feel that it adds complexity and becomes burden to maintain.

## Rule Details

This rule checks all variable declaration blocks and verifies that all variables are sorted alphabetically.
The default configuration of the rule is case-sensitive.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint sort-vars: "error"*/

let b, a;

let c, D, e;

let f, F;
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint sort-vars: "error"*/

let a, b, c, d;

let _a = 10;
let _b = 20;

let E, e;

let G, f, h;
```

:::

Alphabetical list is maintained starting from the first variable and excluding any that are considered problems. So the following code will produce two problems:

```js
/*eslint sort-vars: "error"*/

let c, d, a, b;
```

But this one, will only produce one:

```js
/*eslint sort-vars: "error"*/

let c, d, a, e;
```

## Options

This rule has an object option:

* `"ignoreCase": true` (default `false`) ignores the case-sensitivity of the variables order

### ignoreCase

Examples of **correct** code for this rule with the `{ "ignoreCase": true }` option:

::: correct

```js
/*eslint sort-vars: ["error", { "ignoreCase": true }]*/

let a, A;

let c, D, e;
```

:::

## When Not To Use It

This rule is a formatting preference and not following it won't negatively affect the quality of your code. If you alphabetizing variables isn't a part of your coding standards, then you can leave this rule off.
