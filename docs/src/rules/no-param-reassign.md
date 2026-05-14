---
title: no-param-reassign
rule_type: suggestion
further_reading:
- https://spin.atomicobject.com/2011/04/10/javascript-don-t-reassign-your-function-arguments/
---


Assignment to variables declared as function parameters can be misleading and lead to confusing behavior, as modifying function parameters will also mutate the `arguments` object when not in `strict` mode (see [When Not To Use It](#when-not-to-use-it) below). Often, assignment to function parameters is unintended and indicative of a mistake or programmer error.

This rule can be also configured to fail when function parameters are modified. Side effects on parameters can cause counter-intuitive execution flow and make errors difficult to track down.

## Rule Details

This rule aims to prevent unintended behavior caused by modification or reassignment of function parameters.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-param-reassign: "error"*/

const foo = function(bar) {
    bar = 13;
}

const foo1 = function(bar) {
    bar++;
}

const foo2 = function(bar) {
    for (bar in baz) {}
}

const foo3 = function(bar) {
    for (bar of baz) {}
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-param-reassign: "error"*/

const foo = function(bar) {
    const baz = bar;
}
```

:::

## Options

This rule takes one option, an object, with a boolean property `"props"`, and  arrays `"ignorePropertyModificationsFor"` and `"ignorePropertyModificationsForRegex"`. `"props"` is `false` by default. If `"props"` is set to `true`, this rule warns against the modification of parameter properties unless they're included in `"ignorePropertyModificationsFor"` or `"ignorePropertyModificationsForRegex"`, which is an empty array by default.

### props

Examples of **correct** code for the default `{ "props": false }` option:

::: correct

```js
/*eslint no-param-reassign: ["error", { "props": false }]*/

const foo = function(bar) {
    bar.prop = "value";
}

const foo1 = function(bar) {
    delete bar.aaa;
}

const foo2 = function(bar) {
    bar.aaa++;
}

const foo3 = function(bar) {
    for (bar.aaa in baz) {}
}

const foo4 = function(bar) {
    for (bar.aaa of baz) {}
}
```

:::

Examples of **incorrect** code for the `{ "props": true }` option:

::: incorrect

```js
/*eslint no-param-reassign: ["error", { "props": true }]*/

const foo = function(bar) {
    bar.prop = "value";
}

const foo1 = function(bar) {
    delete bar.aaa;
}

const foo2 = function(bar) {
    bar.aaa++;
}

const foo3 = function(bar) {
    for (bar.aaa in baz) {}
}

const foo4 = function(bar) {
    for (bar.aaa of baz) {}
}
```

:::

Examples of **correct** code for the `{ "props": true }` option with `"ignorePropertyModificationsFor"` set:

::: correct

```js
/*eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["bar"] }]*/

const foo = function(bar) {
    bar.prop = "value";
}

const foo1 = function(bar) {
    delete bar.aaa;
}

const foo2 = function(bar) {
    bar.aaa++;
}

const foo3 = function(bar) {
    for (bar.aaa in baz) {}
}

const foo4 = function(bar) {
    for (bar.aaa of baz) {}
}
```

:::

Examples of **correct** code for the `{ "props": true }` option with `"ignorePropertyModificationsForRegex"` set:

::: correct

```js
/*eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsForRegex": ["^bar"] }]*/

const foo = function(barVar) {
    barVar.prop = "value";
}

const foo1 = function(barrito) {
    delete barrito.aaa;
}

const foo2 = function(bar_) {
    bar_.aaa++;
}

const foo3 = function(barBaz) {
    for (barBaz.aaa in baz) {}
}

const foo4 = function(barBaz) {
    for (barBaz.aaa of baz) {}
}
```

:::

## When Not To Use It

If you want to allow assignment to function parameters, then you can safely disable this rule.

`strict` mode code doesn't sync indices of the arguments object with each parameter binding. Therefore, this rule is not necessary to protect against arguments object mutation in ESM modules or other `strict` mode functions.
