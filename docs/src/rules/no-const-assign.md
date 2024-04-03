---
title: no-const-assign
rule_type: problem
handled_by_typescript: true
---



We cannot modify variables that are declared using `const` keyword.
It will raise a runtime error.

Under non ES2015 environment, it might be ignored merely.

## Rule Details

This rule is aimed to flag modifying variables that are declared using `const` keyword.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-const-assign: "error"*/

const a = 0;
a = 1;
```

:::

::: incorrect

```js
/*eslint no-const-assign: "error"*/

const a = 0;
a += 1;
```

:::

::: incorrect

```js
/*eslint no-const-assign: "error"*/

const a = 0;
++a;
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-const-assign: "error"*/

const a = 0;
console.log(a);
```

:::

::: correct

```js
/*eslint no-const-assign: "error"*/

for (const a in [1, 2, 3]) { // `a` is re-defined (not modified) on each loop step.
    console.log(a);
}
```

:::

::: correct

```js
/*eslint no-const-assign: "error"*/

for (const a of [1, 2, 3]) { // `a` is re-defined (not modified) on each loop step.
    console.log(a);
}
```

:::

## When Not To Use It

If you don't want to be notified about modifying variables that are declared using `const` keyword, you can safely disable this rule.
