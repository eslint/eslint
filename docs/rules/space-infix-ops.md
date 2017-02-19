# require spacing around infix operators (space-infix-ops)

While formatting preferences are very personal, a number of style guides require spaces around operators, such as:

```js
var sum = 1 + 2;
```

The proponents of these extra spaces believe it make the code easier to read and can more easily highlight potential errors, such as:

```js
var sum = i+++2;
```

While this is valid JavaScript syntax, it is hard to determine what the author intended.

## Rule Details

This rule is aimed at ensuring there are spaces around infix operators.

## Options

This rule accepts a single options argument with the following defaults:

```json
"space-infix-ops": ["error", {"int32Hint": false}]
```

To avoid contradictions if other rules or conventions require different spacing, this rule has an `exceptions` option to ignore certain node types in the abstract syntax tree (AST) of JavaScript code.

### `int32Hint`

Set the `int32Hint` option to `true` (default is `false`) to allow write `a|0` without space.

```js
var foo = bar|0; // `foo` is forced to be signed 32 bit integer
```

Examples of **incorrect** code for this rule:

```js
/*eslint space-infix-ops: "error"*/
/*eslint-env es6*/

a+b

a+ b

a +b

a?b:c

const a={b:1};

var {a=0}=bar;

function foo(a=0) { }
```

Examples of **correct** code for this rule:

```js
/*eslint space-infix-ops: "error"*/
/*eslint-env es6*/

a + b

a       + b

a ? b : c

const a = {b:1};

var {a = 0} = bar;

function foo(a = 0) { }
```

### exceptions

The `exceptions` object expects property names to be AST node types as defined by [ESTree](https://github.com/estree/estree). The easiest way to determine the node types for `exceptions` is to use the [online demo](http://eslint.org/parser).

Possible node types are AssignmentPattern, AssignmentExpression, BinaryExpression, LogicalExpression, ConditionalExpression, VariableDeclarator.

The `exceptions` object expects property values to be one of "always", "never", "ignore":
"always" - enforce spaces around infix operators of the given node type
"never" - enforce lack of spaces around infix operators of the given node type
"ignore" - do not enforce spacing around infix operators of the given node type

Examples of **correct** code for the `"exceptions": { "AssignmentPattern": "never" }` option:

```js
/*eslint space-infix-ops: ["error", { exceptions: { "AssignmentPattern": "never" } }]*/
/*eslint-env es6*/

var foo = (a=0) => a / 2;
```

Examples of **correct** code for the `"exceptions": { "BinaryExpression": "never" }` option:

```js
/*eslint space-infix-ops: ["error", { exceptions: { "BinaryExpression": "never" } }]*/
/*eslint-env es6*/

var foo = (a = 0) => a/2;
```

Examples of **correct** code for the `"exceptions": { "VariableDeclarator": "never" }` option:

```js
/*eslint space-infix-ops: ["error", { exceptions: { "VariableDeclarator": "never" } }]*/
/*eslint-env es6*/

var foo=(a = 0) => a / 2;
```

Examples of **correct** code for the `"exceptions": { "AssignmentPattern": "always" }` option:

```js
/*eslint space-infix-ops: ["error", { exceptions: { "AssignmentPattern": "always" } }]*/
/*eslint-env es6*/

var foo = (a = 0) => a / 2;
```

Examples of **correct** code for the `"exceptions": { "BinaryExpression": "always" }` option:

```js
/*eslint space-infix-ops: ["error", { exceptions: { "BinaryExpression": "always" } }]*/
/*eslint-env es6*/

var foo = (a = 0) => a / 2;
```

Examples of **correct** code for the `"exceptions": { "VariableDeclarator": "always" }` option:

```js
/*eslint space-infix-ops: ["error", { exceptions: { "VariableDeclarator": "always" } }]*/
/*eslint-env es6*/

var foo = (a = 0) => a / 2;
```

Examples of **correct** code for the `"exceptions": { "AssignmentPattern": "ignore" }` option:

```js
/*eslint space-infix-ops: ["error", { exceptions: { "AssignmentPattern": "ignore" } }]*/
/*eslint-env es6*/

var foo = (a= 0) => a / 2;
```

Examples of **correct** code for the `"exceptions": { "BinaryExpression": "ignore" }` option:

```js
/*eslint space-infix-ops: ["error", { exceptions: { "BinaryExpression": "ignore" } }]*/
/*eslint-env es6*/

var foo = (a = 0) => a /2;
```

Examples of **correct** code for the `"exceptions": { "VariableDeclarator": "ignore" }` option:

```js
/*eslint space-infix-ops: ["error", { exceptions: { "VariableDeclarator": "ignore" } }]*/
/*eslint-env es6*/

var foo= (a = 0) => a / 2;
```
