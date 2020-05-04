# Disallow Unused Expressions (no-unused-expressions)

An unused expression which has no effect on the state of the program indicates a logic error.

For example, `n + 1;` is not a syntax error, but it might be a typing mistake where a programmer meant an assignment statement `n += 1;` instead. Sometimes, such unused expressions may be eliminated by some build tools in production environment, which possibly breaks application logic.

## Rule Details

This rule aims to eliminate unused expressions which have no effect on the state of the program.

This rule does not apply to function calls or constructor calls with the `new` operator, because they could have *side effects* on the state of the program.

```js
var i = 0;
function increment() { i += 1; }
increment(); // return value is unused, but i changed as a side effect

var nThings = 0;
function Thing() { nThings += 1; }
new Thing(); // constructed object is unused, but nThings changed as a side effect
```

This rule does not apply to directives (which are in the form of literal string expressions such as `"use strict";` at the beginning of a script, module, or function).

Sequence expressions (those using a comma, such as `a = 1, b = 2`) are always considered unused unless their return value is assigned or used in a condition evaluation, or a function call is made with the sequence expression value.

## Options

This rule, in its default state, does not require any arguments. If you would like to enable one or more of the following you may pass an object with the options set as follows:

* `allowShortCircuit` set to `true` will allow you to use short circuit evaluations in your expressions (Default: `false`).
* `allowTernary` set to `true` will enable you to use ternary operators in your expressions similarly to short circuit evaluations (Default: `false`).
* `allowTaggedTemplates` set to `true` will enable you to use tagged template literals in your expressions (Default: `false`).

These options allow unused expressions *only if all* of the code paths either directly change the state (for example, assignment statement) or could have *side effects* (for example, function call).

Examples of **incorrect** code for the default `{ "allowShortCircuit": false, "allowTernary": false }` options:

```js
/*eslint no-unused-expressions: "error"*/

0

if(0) 0

{0}

f(0), {}

a && b()

a, b()

c = a, b;

a() && function namedFunctionInExpressionContext () {f();}

(function anIncompleteIIFE () {});

injectGlobal`body{ color: red; }`

```

Note that one or more string expression statements (with or without semi-colons) will only be considered as unused if they are not in the beginning of a script, module, or function (alone and uninterrupted by other statements). Otherwise, they will be treated as part of a "directive prologue", a section potentially usable by JavaScript engines. This includes "strict mode" directives.

```js
"use strict";
"use asm"
"use stricter";
"use babel"
"any other strings like this in the prologue";
```

Examples of **correct** code for the default `{ "allowShortCircuit": false, "allowTernary": false }` options:

```js
/*eslint no-unused-expressions: "error"*/

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

### allowShortCircuit

Examples of **incorrect** code for the `{ "allowShortCircuit": true }` option:

```js
/*eslint no-unused-expressions: ["error", { "allowShortCircuit": true }]*/

a || b
```

Examples of **correct** code for the `{ "allowShortCircuit": true }` option:

```js
/*eslint no-unused-expressions: ["error", { "allowShortCircuit": true }]*/

a && b()
a() || (b = c)
```

### allowTernary

Examples of **incorrect** code for the `{ "allowTernary": true }` option:

```js
/*eslint no-unused-expressions: ["error", { "allowTernary": true }]*/

a ? b : 0
a ? b : c()
```

Examples of **correct** code for the `{ "allowTernary": true }` option:

```js
/*eslint no-unused-expressions: ["error", { "allowTernary": true }]*/

a ? b() : c()
a ? (b = c) : d()
```

### allowShortCircuit and allowTernary

Examples of **correct** code for the `{ "allowShortCircuit": true, "allowTernary": true }` options:

```js
/*eslint no-unused-expressions: ["error", { "allowShortCircuit": true, "allowTernary": true }]*/

a ? b() || (c = d) : e()
```

### allowTaggedTemplates

Examples of **incorrect** code for the `{ "allowTaggedTemplates": true }` option:

```js
/*eslint no-unused-expressions: ["error", { "allowTaggedTemplates": true }]*/

`some untagged template string`;
```

Examples of **correct** code for the `{ "allowTaggedTemplates": true }` option:

```js
/*eslint no-unused-expressions: ["error", { "allowTaggedTemplates": true }]*/

tag`some tagged template string`;
```
