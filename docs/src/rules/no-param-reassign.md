---
title: no-param-reassign
layout: doc
edit_link: https://github.com/eslint/eslint/edit/main/docs/src/rules/no-param-reassign.md
rule_type: suggestion
further_reading:
- https://spin.atomicobject.com/2011/04/10/javascript-don-t-reassign-your-function-arguments/
---

Disallows reassignment of function parameters.

Assignment to variables declared as function parameters can be misleading and lead to confusing behavior, as modifying function parameters will also mutate the `arguments` object. Often, assignment to function parameters is unintended and indicative of a mistake or programmer error.

This rule can be also configured to fail when function parameters are modified. Side effects on parameters can cause counter-intuitive execution flow and make errors difficult to track down.

## Rule Details

This rule aims to prevent unintended behavior caused by modification or reassignment of function parameters.

Examples of **incorrect** code for this rule:

```js
/*eslint no-param-reassign: "error"*/

function foo(bar) {
    bar = 13;
}

function foo(bar) {
    bar++;
}

function foo(bar) {
    for (bar in baz) {}
}

function foo(bar) {
    for (bar of baz) {}
}
```

Examples of **correct** code for this rule:

```js
/*eslint no-param-reassign: "error"*/

function foo(bar) {
    var baz = bar;
}
```

## Options

This rule takes one option, an object, with a boolean property `"props"`, and  arrays `"ignorePropertyModificationsFor"` and `"ignorePropertyModificationsForRegex"`. `"props"` is `false` by default. If `"props"` is set to `true`, this rule warns against the modification of parameter properties unless they're included in `"ignorePropertyModificationsFor"` or `"ignorePropertyModificationsForRegex"`, which is an empty array by default.

### props

Examples of **correct** code for the default `{ "props": false }` option:

```js
/*eslint no-param-reassign: ["error", { "props": false }]*/

function foo(bar) {
    bar.prop = "value";
}

function foo(bar) {
    delete bar.aaa;
}

function foo(bar) {
    bar.aaa++;
}

function foo(bar) {
    for (bar.aaa in baz) {}
}

function foo(bar) {
    for (bar.aaa of baz) {}
}
```

Examples of **incorrect** code for the `{ "props": true }` option:

```js
/*eslint no-param-reassign: ["error", { "props": true }]*/

function foo(bar) {
    bar.prop = "value";
}

function foo(bar) {
    delete bar.aaa;
}

function foo(bar) {
    bar.aaa++;
}

function foo(bar) {
    for (bar.aaa in baz) {}
}

function foo(bar) {
    for (bar.aaa of baz) {}
}
```

Examples of **correct** code for the `{ "props": true }` option with `"ignorePropertyModificationsFor"` set:

```js
/*eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["bar"] }]*/

function foo(bar) {
    bar.prop = "value";
}

function foo(bar) {
    delete bar.aaa;
}

function foo(bar) {
    bar.aaa++;
}

function foo(bar) {
    for (bar.aaa in baz) {}
}

function foo(bar) {
    for (bar.aaa of baz) {}
}
```

Examples of **correct** code for the `{ "props": true }` option with `"ignorePropertyModificationsForRegex"` set:

```js
/*eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsForRegex": ["^bar"] }]*/

function foo(barVar) {
    barVar.prop = "value";
}

function foo(barrito) {
    delete barrito.aaa;
}

function foo(bar_) {
    bar_.aaa++;
}

function foo(barBaz) {
    for (barBaz.aaa in baz) {}
}

function foo(barBaz) {
    for (barBaz.aaa of baz) {}
}
```

## When Not To Use It

If you want to allow assignment to function parameters, then you can safely disable this rule.
