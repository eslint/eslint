# disallow variable declarations from shadowing variables declared in the outer scope (no-shadow)

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

```js
/*eslint no-shadow: "error"*/
/*eslint-env es6*/

var a = 3;
function b() {
    var a = 10;
}

var b = function () {
    var a = 10;
}

function b(a) {
    a = 10;
}
b(a);

if (true) {
    let a = 5;
}
```

## Options

This rule takes one option, an object, with properties `"builtinGlobals"`, `"hoist"` and `"allow"`.

```json
{
    "no-shadow": ["error", { "builtinGlobals": false, "hoist": "functions", "allow": [] }]
}
```

### builtinGlobals

The `builtinGlobals` option is `false` by default.
If it is `true`, the rule prevents shadowing of built-in global variables: `Object`, `Array`, `Number`, and so on.

Examples of **incorrect** code for the `{ "builtinGlobals": true }` option:

```js
/*eslint no-shadow: ["error", { "builtinGlobals": true }]*/

function foo() {
    var Object = 0;
}
```

### hoist

The `hoist` option has three settings:

* `functions` (by default) - reports shadowing before the outer functions are defined.
* `all` - reports all shadowing before the outer variables/functions are defined.
* `never` - never report shadowing before the outer variables/functions are defined.

#### hoist: functions

Examples of **incorrect** code for the default `{ "hoist": "functions" }` option:

```js
/*eslint no-shadow: ["error", { "hoist": "functions" }]*/
/*eslint-env es6*/

if (true) {
    let b = 6;
}

function b() {}
```

Although `let b` in the `if` statement is before the *function* declaration in the outer scope, it is incorrect.

Examples of **correct** code for the default `{ "hoist": "functions" }` option:

```js
/*eslint no-shadow: ["error", { "hoist": "functions" }]*/
/*eslint-env es6*/

if (true) {
    let a = 3;
}

let a = 5;
```

Because `let a` in the `if` statement is before the *variable* declaration in the outer scope, it is correct.

#### hoist: all

Examples of **incorrect** code for the `{ "hoist": "all" }` option:

```js
/*eslint no-shadow: ["error", { "hoist": "all" }]*/
/*eslint-env es6*/

if (true) {
    let a = 3;
    let b = 6;
}

let a = 5;
function b() {}
```

#### hoist: never

Examples of **correct** code for the `{ "hoist": "never" }` option:

```js
/*eslint no-shadow: ["error", { "hoist": "never" }]*/
/*eslint-env es6*/

if (true) {
    let a = 3;
    let b = 6;
}

let a = 5;
function b() {}
```

Because `let a` and `let b` in the `if` statement are before the declarations in the outer scope, they are correct.

### allow

The `allow` option is an array of identifier names for which shadowing is allowed. For example, `"resolve"`, `"reject"`, `"done"`, `"cb"`.

Examples of **correct** code for the `{ "allow": ["done"] }` option:

```js
/*eslint no-shadow: ["error", { "allow": ["done"] }]*/
/*eslint-env es6*/

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

## Further Reading

* [Variable Shadowing](https://en.wikipedia.org/wiki/Variable_shadowing)

## Related Rules

* [no-shadow-restricted-names](no-shadow-restricted-names.md)
