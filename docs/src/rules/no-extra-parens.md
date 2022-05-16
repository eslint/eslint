---
title: no-extra-parens
layout: doc
edit_link: https://github.com/eslint/eslint/edit/main/docs/src/rules/no-extra-parens.md
rule_type: layout
related_rules:
- arrow-parens
- no-cond-assign
- no-return-assign
further_reading:
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
---

<!--FIXABLE-->

Disallows unnecessary parentheses.

This rule restricts the use of parentheses to only where they are necessary.

## Rule Details

This rule always ignores extra parentheses around the following:

* RegExp literals such as `(/abc/).test(var)` to avoid conflicts with the [wrap-regex](wrap-regex) rule
* immediately-invoked function expressions (also known as IIFEs) such as `var x = (function () {})();` and `var x = (function () {}());` to avoid conflicts with the [wrap-iife](wrap-iife) rule
* arrow function arguments to avoid conflicts with the [arrow-parens](arrow-parens) rule

## Options

This rule has a string option:

* `"all"` (default) disallows unnecessary parentheses around *any* expression
* `"functions"` disallows unnecessary parentheses *only* around function expressions

This rule has an object option for exceptions to the `"all"` option:

* `"conditionalAssign": false` allows extra parentheses around assignments in conditional test expressions
* `"returnAssign": false` allows extra parentheses around assignments in `return` statements
* `"nestedBinaryExpressions": false` allows extra parentheses in nested binary expressions
* `"ignoreJSX": "none|all|multi-line|single-line"` allows extra parentheses around no/all/multi-line/single-line JSX components. Defaults to `none`.
* `"enforceForArrowConditionals": false` allows extra parentheses around ternary expressions which are the body of an arrow function
* `"enforceForSequenceExpressions": false` allows extra parentheses around sequence expressions
* `"enforceForNewInMemberExpressions": false` allows extra parentheses around `new` expressions in member expressions
* `"enforceForFunctionPrototypeMethods": false` allows extra parentheses around immediate `.call` and `.apply` method calls on function expressions and around function expressions in the same context.

### all

Examples of **incorrect** code for this rule with the default `"all"` option:

```js
/* eslint no-extra-parens: "error" */

a = (b * c);

(a * b) + c;

for (a in (b, c));

for (a in (b));

for (a of (b));

typeof (a);

(function(){} ? a() : b());

class A {
    [(x)] = 1;
}

class B {
    x = (y + z);
}
```

Examples of **correct** code for this rule with the default `"all"` option:

```js
/* eslint no-extra-parens: "error" */

(0).toString();

(Object.prototype.toString.call());

({}.toString.call());

(function(){}) ? a() : b();

(/^a$/).test(x);

for (a of (b, c));

for (a of b);

for (a in b, c);

for (a in b);

class A {
    [x] = 1;
}

class B {
    x = y + z;
}
```

### conditionalAssign

Examples of **correct** code for this rule with the `"all"` and `{ "conditionalAssign": false }` options:

```js
/* eslint no-extra-parens: ["error", "all", { "conditionalAssign": false }] */

while ((foo = bar())) {}

if ((foo = bar())) {}

do; while ((foo = bar()))

for (;(a = b););
```

### returnAssign

Examples of **correct** code for this rule with the `"all"` and `{ "returnAssign": false }` options:

```js
/* eslint no-extra-parens: ["error", "all", { "returnAssign": false }] */

function a(b) {
  return (b = 1);
}

function a(b) {
  return b ? (c = d) : (c = e);
}

b => (b = 1);

b => b ? (c = d) : (c = e);
```

### nestedBinaryExpressions

Examples of **correct** code for this rule with the `"all"` and `{ "nestedBinaryExpressions": false }` options:

```js
/* eslint no-extra-parens: ["error", "all", { "nestedBinaryExpressions": false }] */

x = a || (b && c);
x = a + (b * c);
x = (a * b) / c;
```

### ignoreJSX

Examples of **correct** code for this rule with the `all` and `{ "ignoreJSX": "all" }` options:

```js
/* eslint no-extra-parens: ["error", "all", { ignoreJSX: "all" }] */
const Component = (<div />)
const Component = (
    <div
        prop={true}
    />
)
```

Examples of **incorrect** code for this rule with the `all` and `{ "ignoreJSX": "multi-line" }` options:

```js
/* eslint no-extra-parens: ["error", "all", { ignoreJSX: "multi-line" }] */
const Component = (<div />)
const Component = (<div><p /></div>)
```

Examples of **correct** code for this rule with the `all` and `{ "ignoreJSX": "multi-line" }` options:

```js
/* eslint no-extra-parens: ["error", "all", { ignoreJSX: "multi-line" }] */
const Component = (
    <div>
        <p />
    </div>
)
const Component = (
    <div
        prop={true}
    />
)
```

Examples of **incorrect** code for this rule with the `all` and `{ "ignoreJSX": "single-line" }` options:

```js
/* eslint no-extra-parens: ["error", "all", { ignoreJSX: "single-line" }] */
const Component = (
    <div>
        <p />
    </div>
)
const Component = (
    <div
        prop={true}
    />
)
```

Examples of **correct** code for this rule with the `all` and `{ "ignoreJSX": "single-line" }` options:

```js
/* eslint no-extra-parens: ["error", "all", { ignoreJSX: "single-line" }] */
const Component = (<div />)
const Component = (<div><p /></div>)
```

### enforceForArrowConditionals

Examples of **correct** code for this rule with the `"all"` and `{ "enforceForArrowConditionals": false }` options:

```js
/* eslint no-extra-parens: ["error", "all", { "enforceForArrowConditionals": false }] */

const b = a => 1 ? 2 : 3;
const d = c => (1 ? 2 : 3);
```

### enforceForSequenceExpressions

Examples of **correct** code for this rule with the `"all"` and `{ "enforceForSequenceExpressions": false }` options:

```js
/* eslint no-extra-parens: ["error", "all", { "enforceForSequenceExpressions": false }] */

(a, b);

if ((val = foo(), val < 10)) {}

while ((val = foo(), val < 10));
```

### enforceForNewInMemberExpressions

Examples of **correct** code for this rule with the `"all"` and `{ "enforceForNewInMemberExpressions": false }` options:

```js
/* eslint no-extra-parens: ["error", "all", { "enforceForNewInMemberExpressions": false }] */

const foo = (new Bar()).baz;

const quux = (new Bar())[baz];

(new Bar()).doSomething();
```

### enforceForFunctionPrototypeMethods

Examples of **correct** code for this rule with the `"all"` and `{ "enforceForFunctionPrototypeMethods": false }` options:

```js
/* eslint no-extra-parens: ["error", "all", { "enforceForFunctionPrototypeMethods": false }] */

const foo = (function () {}).call();

const bar = (function () {}).apply();

const baz = (function () {}.call());

const quux = (function () {}.apply());
```

### functions

Examples of **incorrect** code for this rule with the `"functions"` option:

```js
/* eslint no-extra-parens: ["error", "functions"] */

((function foo() {}))();

var y = (function () {return 1;});
```

Examples of **correct** code for this rule with the `"functions"` option:

```js
/* eslint no-extra-parens: ["error", "functions"] */

(0).toString();

(Object.prototype.toString.call());

({}.toString.call());

(function(){} ? a() : b());

(/^a$/).test(x);

a = (b * c);

(a * b) + c;

typeof (a);
```
