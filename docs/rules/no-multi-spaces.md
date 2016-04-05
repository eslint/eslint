# Disallow multiple spaces (no-multi-spaces)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

Multiple spaces in a row that are not used for indentation are typically mistakes. For example:

```js

if(foo  === "bar") {}

```

It's hard to tell, but there are two spaces between `foo` and `===`. Multiple spaces such as this are generally frowned upon in favor of single spaces:

```js

if(foo === "bar") {}

```

## Rule Details

This rule aims to disallow multiple whitespace around logical expressions, conditional expressions, declarations, array elements, object properties, sequences and function parameters.

Examples of **incorrect** code for this rule:

```js
/*eslint no-multi-spaces: "error"*/

var a =  1;

if(foo   === "bar") {}

a <<  b

var arr = [1,  2];

a ?  b: c
```

Examples of **correct** code for this rule:

```js
/*eslint no-multi-spaces: "error"*/

var a = 1;

if(foo === "bar") {}

a << b

var arr = [1, 2];

a ? b: c
```

## Options

To avoid contradictions if some other rules require multiple spaces, this rule has an option to ignore certain node types in the abstract syntax tree (AST) of JavaScript code.

### exceptions

The `exceptions` object expects property names to be AST node types as defined by [ESTree](https://github.com/estree/estree). The easiest way to determine the node types for `exceptions` is to use the [online demo](http://eslint.org/parser).

Only the `Property` node type is ignored by default, because for the [key-spacing](key-spacing.md) rule some alignment options require multiple spaces in properties of object literals.

Examples of **correct** code for the default `"exceptions": { "Property": true }` option:

```js
/*eslint no-multi-spaces: "error"*/
/*eslint key-spacing: ["error", { align: "value" }]*/

var obj = {
    first:  "first",
    second: "second"
};
```

Examples of **incorrect** code for the `"exceptions": { "Property": false }` option:

```js
/*eslint no-multi-spaces: ["error", { exceptions: { "Property": false } }]*/
/*eslint key-spacing: ["error", { align: "value" }]*/

var obj = {
    first:  "first",
    second: "second"
};
```

Examples of **correct** code for the `"exceptions": { "BinaryExpression": true }` option:

```js
/*eslint no-multi-spaces: ["error", { exceptions: { "BinaryExpression": true } }]*/

var a = 1  *  2;
```

Examples of **correct** code for the `"exceptions": { "VariableDeclarator": true }` option:

```js
/*eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }]*/

var someVar      = 'foo';
var someOtherVar = 'barBaz';
```

Examples of **correct** code for the `"exceptions": { "ImportDeclaration": true }` option:

```js
/*eslint no-multi-spaces: ["error", { exceptions: { "ImportDeclaration": true } }]*/

import mod          from 'mod';
import someOtherMod from 'some-other-mod';
```

## When Not To Use It

If you don't want to check and disallow multiple spaces, then you should turn this rule off.

## Related Rules

* [key-spacing](key-spacing.md)
* [space-infix-ops](space-infix-ops.md)
* [space-in-brackets](space-in-brackets.md) (deprecated)
* [space-in-parens](space-in-parens.md)
* [space-after-keywords](space-after-keywords)
* [space-unary-ops](space-unary-ops)
* [space-return-throw-case](space-return-throw-case)
