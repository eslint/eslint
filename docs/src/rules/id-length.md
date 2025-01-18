---
title: id-length
rule_type: suggestion
related_rules:
- max-len
- new-cap
- func-names
- camelcase
---


Very short identifier names like `e`, `x`, `_t` or very long ones like `hashGeneratorResultOutputContainerObject` can make code harder to read and potentially less maintainable. To prevent this, one may enforce a minimum and/or maximum identifier length.

```js
const x = 5; // too short; difficult to understand its purpose without context
```

## Rule Details

This rule enforces a minimum and/or maximum identifier length convention.

This rule counts [graphemes](https://unicode.org/reports/tr29/#Default_Grapheme_Cluster_Table) instead of using [`String length`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length).

## Options

Examples of **incorrect** code for this rule with the default options:

::: incorrect

```js
/*eslint id-length: "error"*/     // default is minimum 2-chars ({ "min": 2 })

const x = 5;
obj.e = document.body;
const foo = function (e) { };
try {
    dangerousStuff();
} catch (e) {
    // ignore as many do
}
const myObj = { a: 1 };
(a) => { a * a };
class y { }
class Foo { x() {} }
class Bar { #x() {} }
class Baz { x = 1 }
class Qux { #x = 1 }
function bar(...x) { }
function baz([x]) { }
const [z] = arr;
const { prop: [i]} = {};
function qux({x}) { }
const { j } = {};
const { prop: a} = {};
({ prop: obj.x } = {});
```

:::

Examples of **correct** code for this rule with the default options:

::: correct

```js
/*eslint id-length: "error"*/     // default is minimum 2-chars ({ "min": 2 })

const num = 5;
function _f() { return 42; }
function _func() { return 42; }
obj.el = document.body;
const foo = function (evt) { /* do stuff */ };
try {
    dangerousStuff();
} catch (error) {
    // ignore as many do
}
const myObj = { apple: 1 };
(num) => { num * num };
function bar(num = 0) { }
class MyClass { }
class Foo { method() {} }
class Bar { #method() {} }
class Baz { field = 1 }
class Qux { #field = 1 }
function baz(...args) { }
function qux([longName]) { }
const { prop } = {};
const { prop: [name] } = {};
const [longName] = arr;
function foobar({ prop }) { }
function foobaz({ a: prop }) { }
const { a: property } = {};
({ prop: obj.longName } = {});
const data = { "x": 1 };  // excused because of quotes
data["y"] = 3;  // excused because of calculated property access
```

:::

This rule has an object option:

* `"min"` (default: `2`) enforces a minimum identifier length
* `"max"` (default: `Infinity`) enforces a maximum identifier length
* `"properties": always` (default) enforces identifier length convention for property names
* `"properties": never` ignores identifier length convention for property names
* `"exceptions"` allows an array of specified identifier names
* `"exceptionPatterns"` array of strings representing regular expression patterns, allows identifiers that match any of the patterns.

### min

Examples of **incorrect** code for this rule with the `{ "min": 4 }` option:

::: incorrect

```js
/*eslint id-length: ["error", { "min": 4 }]*/

const val = 5;
obj.e = document.body;
function foo (e) { };
try {
    dangerousStuff();
} catch (e) {
    // ignore as many do
}
const myObj = { a: 1 };
(val) => { val * val };
class y { }
class Foo { x() {} }
function bar(...x) { }
const { x } = {};
const { prop: a} = {};
const [i] = arr;
const { prop: [num]} = {};
({ prop: obj.x } = {});
```

:::

Examples of **correct** code for this rule with the `{ "min": 4 }` option:

::: correct

```js
/*eslint id-length: ["error", { "min": 4 }]*/

const value = 5;
function func() { return 42; }
object.element = document.body;
const foobar = function (event) { /* do stuff */ };
try {
    dangerousStuff();
} catch (error) {
    // ignore as many do
}
const myObj = { apple: 1 };
(value) => { value * value };
function foobaz(value = 0) { }
class MyClass { }
class Foobar { method() {} }
function barbaz(...args) { }
const { prop } = {};
const [longName] = foo;
const { a: [name] } = {};
const { a: record } = {};
({ prop: object.name } = {});
const data = { "x": 1 };  // excused because of quotes
data["y"] = 3;  // excused because of calculated property access
```

:::

### max

Examples of **incorrect** code for this rule with the `{ "max": 10 }` option:

::: incorrect

```js
/*eslint id-length: ["error", { "max": 10 }]*/

const reallyLongVarName = 5;
function reallyLongFuncName() { return 42; }
obj.reallyLongPropName = document.body;
const foo = function (reallyLongArgName) { /* do stuff */ };
try {
    dangerousStuff();
} catch (reallyLongErrorName) {
    // ignore as many do
}
(reallyLongArgName) => { return !reallyLongArgName; };
const [reallyLongFirstElementName] = arr;
```

:::

Examples of **correct** code for this rule with the `{ "max": 10 }` option:

::: correct

```js
/*eslint id-length: ["error", { "max": 10 }]*/

const varName = 5;
function funcName() { return 42; }
obj.propName = document.body;
const foo = function (arg) { /* do stuff */ };
try {
    dangerousStuff();
} catch (error) {
    // ignore as many do
}
(arg) => { return !arg; };
const [first] = arr;
```

:::

### properties

Examples of **correct** code for this rule with the `{ "properties": "never" }` option:

::: correct

```js
/*eslint id-length: ["error", { "properties": "never" }]*/

const myObj = { a: 1 };
({ a: obj.x.y.z } = {});
({ prop: obj.i } = {});
```

:::

### exceptions

Examples of additional **correct** code for this rule with the `{ "exceptions": ["x", "y", "z", "ζ"] }` option:

::: correct

```js
/*eslint id-length: ["error", { "exceptions": ["x", "y", "z", "ζ", "i"] }]*/

const x = 5;
function y() { return 42; }
obj.x = document.body;
const foo = function (x) { /* do stuff */ };
try {
    dangerousStuff();
} catch (x) {
    // ignore as many do
}
(x) => { return x * x; };
const [i] = arr;
const { z } = foo;
const { a: ζ } = foo;
```

:::

### exceptionPatterns

Examples of additional **correct** code for this rule with the `{ "exceptionPatterns": ["E|S", "[x-z]"] }` option:

::: correct

```js
/*eslint id-length: ["error", { "exceptionPatterns": ["E|S|X", "[x-z]"] }]*/

const E = 5;
function S() { return 42; }
obj.x = document.body;
const foo = function (x) { /* do stuff */ };
try {
    dangerousStuff();
} catch (x) {
    // ignore as many do
}
(y) => {return  y * y};
const [X] = arr;
const { y } = foo;
const { a: z } = foo;
```

:::
