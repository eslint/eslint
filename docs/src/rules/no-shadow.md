---
title: no-shadow
rule_type: suggestion
related_rules:
- no-shadow-restricted-names
further_reading:
- https://en.wikipedia.org/wiki/Variable_shadowing
---


Shadowing is the process by which a local variable shares the same name as a variable in its containing scope. For example:

```js
var a = 3;
function b() {
    var a = 10;
}
```

In this case, the variable `a` inside of `b()` is shadowing the variable `a` in the global scope. This can cause confusion while reading the code and it's impossible to access the global variable.

## Rule Details

This rule aims to eliminate shadowed variable declarations.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-shadow: "error"*/

var a = 3;
function b() {
    var a = 10;
}

var c = function () {
    var a = 10;
}

function d(a) {
    a = 10;
}
d(a);

if (true) {
    let a = 5;
}
```

:::

## Options

This rule takes one option, an object, with properties `"builtinGlobals"`, `"hoist"`, `"allow"` and `"ignoreOnInitialization"`.

```json
{
    "no-shadow": ["error", { "builtinGlobals": false, "hoist": "functions", "allow": [], "ignoreOnInitialization": false }]
}
```

### builtinGlobals

The `builtinGlobals` option is `false` by default.
If it is `true`, the rule prevents shadowing of built-in global variables: `Object`, `Array`, `Number`, and so on.

Examples of **incorrect** code for the `{ "builtinGlobals": true }` option:

::: incorrect

```js
/*eslint no-shadow: ["error", { "builtinGlobals": true }]*/

function foo() {
    var Object = 0;
}
```

:::

### hoist

The `hoist` option has three settings:

* `functions` (by default) - reports shadowing before the outer functions are defined.
* `all` - reports all shadowing before the outer variables/functions are defined.
* `never` - never report shadowing before the outer variables/functions are defined.

#### hoist: functions

Examples of **incorrect** code for the default `{ "hoist": "functions" }` option:

::: incorrect

```js
/*eslint no-shadow: ["error", { "hoist": "functions" }]*/

if (true) {
    let b = 6;
}

function b() {}
```

:::

Although `let b` in the `if` statement is before the *function* declaration in the outer scope, it is incorrect.

Examples of **correct** code for the default `{ "hoist": "functions" }` option:

::: correct

```js
/*eslint no-shadow: ["error", { "hoist": "functions" }]*/

if (true) {
    let a = 3;
}

let a = 5;
```

:::

Because `let a` in the `if` statement is before the *variable* declaration in the outer scope, it is correct.

#### hoist: all

Examples of **incorrect** code for the `{ "hoist": "all" }` option:

::: incorrect

```js
/*eslint no-shadow: ["error", { "hoist": "all" }]*/

if (true) {
    let a = 3;
    let b = 6;
}

let a = 5;
function b() {}
```

:::

#### hoist: never

Examples of **correct** code for the `{ "hoist": "never" }` option:

::: correct

```js
/*eslint no-shadow: ["error", { "hoist": "never" }]*/

if (true) {
    let a = 3;
    let b = 6;
}

let a = 5;
function b() {}
```

:::

Because `let a` and `let b` in the `if` statement are before the declarations in the outer scope, they are correct.

### allow

The `allow` option is an array of identifier names for which shadowing is allowed. For example, `"resolve"`, `"reject"`, `"done"`, `"cb"`.

Examples of **correct** code for the `{ "allow": ["done"] }` option:

::: correct

```js
/*eslint no-shadow: ["error", { "allow": ["done"] }]*/

import async from 'async';

function foo(done) {
  async.map([1, 2], function (e, done) {
    done(null, e * 2)
  }, done);
}

foo(function (err, result) {
  console.log({ err, result });
});
```

:::

### ignoreOnInitialization

The `ignoreOnInitialization` option is `false` by default. If it is `true`, it prevents reporting shadowing of variables in their initializers when the shadowed variable is presumably still uninitialized.

The shadowed variable must be on the left side. The shadowing variable must be on the right side and declared in a callback function or in an IIFE.

Examples of **incorrect** code for the `{ "ignoreOnInitialization": "true" }` option:

::: incorrect

```js
/*eslint no-shadow: ["error", { "ignoreOnInitialization": true }]*/

var x = x => x;
```

:::

Because the shadowing variable `x` will shadow the already initialized shadowed variable `x`.

Examples of **correct** code for the `{ "ignoreOnInitialization": true }` option:

::: correct

```js
/*eslint no-shadow: ["error", { "ignoreOnInitialization": true }]*/

var x = foo(x => x)

var y = (y => y)()
```

:::

The rationale for callback functions is the assumption that they will be called during the initialization, so that at the time when the shadowing variable will be used, the shadowed variable has not yet been initialized.
