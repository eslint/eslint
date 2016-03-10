# Disallow Unused Expressions (no-unused-expressions)

Unused expressions are those expressions that evaluate to a value but are never used. For example:

```js
n + 1;
```

This is a valid JavaScript expression, but isn't actually used. Even though it's not a syntax error it is clearly a logic error and it has no effect on the code being executed.

## Rule Details

This rule aims to eliminate unused expressions. The value of an expression should always be used, except in the case of expressions that side effect: function calls, assignments, and the `new` operator.

Note that sequence expressions (those using a comma, such as `a = 1, b = 2`) are always considered unused unless their return value is assigned or used in a condition evaluation, or a function call is made with the sequence expression value.

Please also note that this rule does not apply to directives (which are in the form of literal string expressions (e.g., `"use strict";`) at the beginning of a script, module, or function).

## Options

This rule, in its default state, does not require any arguments. If you would like to enable one or more of the following you may pass an object with the options set as follows:

* `allowShortCircuit` set to `true` will allow you to use short circuit evaluations in your expressions (Default: `false`).
* `allowTernary` set to `true` will enable you use ternary operators in your expressions similarly to short circuit evaluations (Default: `false`).

By default the following patterns are considered problems:

```js
/*eslint no-unused-expressions: 2*/

0

if(0) 0

{0}

f(0), {}

a && b()

a, b()

c = a, b;

a() && function namedFunctionInExpressionContext () {f();}

(function anIncompleteIIFE () {});

```

Note that one or more string expression statements (with or without semi-colons) will only be considered as unused if they are not in the beginning of a script, module, or function (alone and uninterrupted by other statements). Otherwise, they will be treated as part of a "directive prologue", a section potentially usable by JavaScript engines. This includes "strict mode" directives.

```js
"use strict";
"use asm"
"use stricter";
"use babel"
"any other strings like this in the prologue";
```

The following patterns are not considered problems by default:

```js
/*eslint no-unused-expressions: 2*/

{} // In this context, this is a block statement, not an object literal

{myLabel: someVar} // In this context, this is a block statement with a label and expression, not an object literal

function namedFunctionDeclaration () {}

(function aGenuineIIFE () {}());

f()

a = 0

new C

delete a.b

void a
```

The following patterns are not considered problems if `allowShortCircuit` is enabled:

```js
/*eslint no-unused-expressions: [2, { allowShortCircuit: true }]*/

a && b()

a() || (b = c)
```

If you enable the `allowTernary` the following patterns will be allowed:

```js
/*eslint no-unused-expressions: [2, { allowTernary: true }]*/

a ? b() : c()

a ? (b = c) : d()
```

Enabling both options will allow a combination of both ternary and short circuit evaluation:

```js
/*eslint no-unused-expressions: [2, { allowShortCircuit: true, allowTernary: true }]*/

a ? b() || (c = d) : e()
```

The above options still will not allow expressions that have code paths without side effects such as the following:

```js
/*eslint no-unused-expressions: [2, { allowShortCircuit: true, allowTernary: true }]*/

a || b

a ? b : 0

a ? b : c()
```
