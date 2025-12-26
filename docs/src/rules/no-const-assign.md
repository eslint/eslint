---
title: no-const-assign
rule_type: problem
handled_by_typescript: true
---



Constant bindings cannot be modified. An attempt to modify a constant binding will raise a runtime error.

## Rule Details

This rule is aimed to flag modifying variables that are declared using `const`, `using`, or `await using` keywords.

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

::: incorrect

```js
/*eslint no-const-assign: "error"*/

if (foo) {
	using a = getSomething();
	a = somethingElse;
}

if (bar) {
	await using a = getSomething();
	a = somethingElse;
}
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

if (foo) {
	using a = getSomething();
	a.execute();
}

if (bar) {
	await using a = getSomething();
	a.execute();
}
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

## Options

This rule has no options.

## When Not To Use It

If you don't want to be notified about modifying variables that are declared using `const`, `using`, and `await using` keywords, you can safely disable this rule.
