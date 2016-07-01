# Require Spaces Around Infix Operators (space-infix-ops)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

While formatting preferences are very personal, a number of style guides require spaces around operators, such as:

```js
var sum = 1 + 2;
```

The proponents of these extra spaces believe it make the code easier to read and can more easily highlight potential errors, such as:

```js
var sum = i+++2; // `i++ +2` or `i + ++2` or `i++ + 2`?
```

While this is valid JavaScript syntax, it is hard to determine what the author intended.

## Rule Details

This rule ensures there are spaces around infix operators to improve code readability and highlight potential errors.

## Options

This rule accepts a single options argument with the following defaults:

```json
"space-infix-ops": [ "error", { "int32Hint": false } ]
```

Setting the `int32Hint` option to `true` enables use of the patern `a|0` without space, a common pattern used to force a number to a signed 32-bit integer.

## Examples

### defaults

Examples of **incorrect** code for this rule when using default settings:

```js
/*eslint space-infix-ops: "error"*/
/*eslint-env es6*/

a+b

a+ b

a +b

a?b:c

let x = y|0

const a={b:1};

var {a=0}=bar;

function foo(a=0) { }
```

Examples of **correct** code for this rule when using default settings:

```js
/*eslint space-infix-ops: "error"*/
/*eslint-env es6*/

a + b

a       + b

a ? b : c

let x = y | 0

const a = {b:1};

var {a = 0} = bar;

function foo(a = 0) { }
```

### int32Hint

Examples of **correct** code for this rule with the `{ "int32Hint": true }` option:

```js
var x = y|0;
```