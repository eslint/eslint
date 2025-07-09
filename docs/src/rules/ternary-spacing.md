---
title: ternary-spacing
rule_type: layout
---

Enforces consistent spacing around the `?` and `:` tokens in ternary expressions.

## Rule Details

This rule improves code readability by enforcing **exactly one space** before and after the `?` and `:` operators in ternary expressions.

### Options

This rule does **not** accept any options.

## Examples

Examples of **incorrect** code for this rule:

::: incorrect

```js
/* eslint ternary-spacing: "error" */

// No spaces
const badExample1 = condition?value1:value2;

// Missing space before `?`
const badExample2 = condition? value1 : value2;

// Too many spaces after `:`
const badExample3 = condition ? value1 :  value2;

// Nested ternary with bad spacing
const badExample4 = a?b:c?d:e;

// Line-broken ternary with no space after `?`
const badExample5 = condition
    ?value1
    : value2;

// Line-broken ternary with too many spaces after `:`
const badExample6 = condition
    ? value1
    :  value2;
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/* eslint ternary-spacing: "error" */

const goodExample1 = condition ? value1 : value2;

const goodExample2 = a ? b : c ? d : e;

const goodExample3 = condition
    ? value1
    : value2;
```

:::

## When Not To Use It

You may choose to disable this rule if
- You already use a formatter like Prettier that enforces spacing around ternary operators, or
- You do not prioritize consistent spacing in ternary expressions as part of your style guide.
