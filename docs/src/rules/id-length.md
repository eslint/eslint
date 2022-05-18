---
title: id-length
layout: doc
edit_link: https://github.com/eslint/eslint/edit/main/docs/src/rules/id-length.md
rule_type: suggestion
related_rules:
- max-len
- new-cap
- func-names
- camelcase
---

Enforces minimum and maximum identifier lengths.

Very short identifier names like `e`, `x`, `_t` or very long ones like `hashGeneratorResultOutputContainerObject` can make code harder to read and potentially less maintainable. To prevent this, one may enforce a minimum and/or maximum identifier length.

```js
var x = 5; // too short; difficult to understand its purpose without context
```

## Rule Details

This rule enforces a minimum and/or maximum identifier length convention.

## Options

Examples of **incorrect** code for this rule with the default options:

```js
/*eslint id-length: "error"*/     // default is minimum 2-chars ({ "min": 2 })
/*eslint-env es6*/

var x = 5;
obj.e = document.body;
var foo = function (e) { };
try {
    dangerousStuff();
} catch (e) {
    // ignore as many do
}
var myObj = { a: 1 };
(a) => { a * a };
class x { }
class Foo { x() {} }
class Foo { #x() {} }
class Foo { x = 1 }
class Foo { #x = 1 }
function foo(...x) { }
function foo([x]) { }
var [x] = arr;
var { prop: [x]} = {};
function foo({x}) { }
var { x } = {};
var { prop: a} = {};
({ prop: obj.x } = {});
```

Examples of **correct** code for this rule with the default options:

```js
/*eslint id-length: "error"*/     // default is minimum 2-chars ({ "min": 2 })
/*eslint-env es6*/

var num = 5;
function _f() { return 42; }
function _func() { return 42; }
obj.el = document.body;
var foo = function (evt) { /* do stuff */ };
try {
    dangerousStuff();
} catch (error) {
    // ignore as many do
}
var myObj = { apple: 1 };
(num) => { num * num };
function foo(num = 0) { }
class MyClass { }
class Foo { method() {} }
class Foo { #method() {} }
class Foo { field = 1 }
class Foo { #field = 1 }
function foo(...args) { }
function foo([longName]) { }
var { prop } = {};
var { prop: [longName] } = {};
var [longName] = arr;
function foo({ prop }) { }
function foo({ a: prop }) { }
var { prop } = {};
var { a: prop } = {};
({ prop: obj.longName } = {});
var data = { "x": 1 };  // excused because of quotes
data["y"] = 3;  // excused because of calculated property access
```

This rule has an object option:

* `"min"` (default: 2) enforces a minimum identifier length
* `"max"` (default: Infinity) enforces a maximum identifier length
* `"properties": always` (default) enforces identifier length convention for property names
* `"properties": never` ignores identifier length convention for property names
* `"exceptions"` allows an array of specified identifier names
* `"exceptionPatterns"` array of strings representing regular expression patterns, allows identifiers that match any of the patterns.

### min

Examples of **incorrect** code for this rule with the `{ "min": 4 }` option:

```js
/*eslint id-length: ["error", { "min": 4 }]*/
/*eslint-env es6*/

var val = 5;
obj.e = document.body;
function foo (e) { };
try {
    dangerousStuff();
} catch (e) {
    // ignore as many do
}
var myObj = { a: 1 };
(val) => { val * val };
class x { }
class Foo { x() {} }
function foo(...x) { }
var { x } = {};
var { prop: a} = {};
var [x] = arr;
var { prop: [x]} = {};
({ prop: obj.x } = {});
```

Examples of **correct** code for this rule with the `{ "min": 4 }` option:

```js
/*eslint id-length: ["error", { "min": 4 }]*/
/*eslint-env es6*/

var value = 5;
function func() { return 42; }
obj.element = document.body;
var foobar = function (event) { /* do stuff */ };
try {
    dangerousStuff();
} catch (error) {
    // ignore as many do
}
var myObj = { apple: 1 };
(value) => { value * value };
function foobar(value = 0) { }
class MyClass { }
class Foobar { method() {} }
function foobar(...args) { }
var { prop } = {};
var [longName] = foo;
var { a: [prop] } = {};
var { a: longName } = {};
({ prop: obj.name } = {});
var data = { "x": 1 };  // excused because of quotes
data["y"] = 3;  // excused because of calculated property access
```

### max

Examples of **incorrect** code for this rule with the `{ "max": 10 }` option:

```js
/*eslint id-length: ["error", { "max": 10 }]*/
/*eslint-env es6*/

var reallyLongVarName = 5;
function reallyLongFuncName() { return 42; }
obj.reallyLongPropName = document.body;
var foo = function (reallyLongArgName) { /* do stuff */ };
try {
    dangerousStuff();
} catch (reallyLongErrorName) {
    // ignore as many do
}
(reallyLongArgName) => { return !reallyLongArgName; };
var [reallyLongFirstElementName] = arr;
```

Examples of **correct** code for this rule with the `{ "max": 10 }` option:

```js
/*eslint id-length: ["error", { "max": 10 }]*/
/*eslint-env es6*/

var varName = 5;
function funcName() { return 42; }
obj.propName = document.body;
var foo = function (arg) { /* do stuff */ };
try {
    dangerousStuff();
} catch (error) {
    // ignore as many do
}
(arg) => { return !arg; };
var [first] = arr;
```

### properties

Examples of **correct** code for this rule with the `{ "properties": "never" }` option:

```js
/*eslint id-length: ["error", { "properties": "never" }]*/
/*eslint-env es6*/

var myObj = { a: 1 };
({ a: obj.x.y.z } = {});
({ prop: obj.i } = {});
```

### exceptions

Examples of additional **correct** code for this rule with the `{ "exceptions": ["x"] }` option:

```js
/*eslint id-length: ["error", { "exceptions": ["x"] }]*/
/*eslint-env es6*/

var x = 5;
function x() { return 42; }
obj.x = document.body;
var foo = function (x) { /* do stuff */ };
try {
    dangerousStuff();
} catch (x) {
    // ignore as many do
}
(x) => { return x * x; };
var [x] = arr;
const { x } = foo;
const { a: x } = foo;
```

### exceptionPatterns

Examples of additional **correct** code for this rule with the `{ "exceptionPatterns": ["E|S", "[x-z]"] }` option:

```js
/*eslint id-length: ["error", { "exceptionPatterns": ["E|S", "[x-z]"] }]*/
/*eslint-env es6*/

var E = 5;
function S() { return 42; }
obj.x = document.body;
var foo = function (x) { /* do stuff */ };
try {
    dangerousStuff();
} catch (x) {
    // ignore as many do
}
(y) => {return  y * y};
var [E] = arr;
const { y } = foo;
const { a: z } = foo;
```
