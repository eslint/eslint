---
title: array-bracket-spacing
rule_type: layout
related_rules:
- space-in-parens
- object-curly-spacing
- computed-property-spacing
---

This rule was **deprecated** in ESLint v8.53.0. Please use the corresponding rule in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).

A number of style guides require or disallow spaces between array brackets and other tokens. This rule
applies to both array literals and destructuring assignments (ECMAScript 6).

```js
/*eslint-env es6*/

var arr = [ 'foo', 'bar' ];
var [ x, y ] = z;

var arr = ['foo', 'bar'];
var [x,y] = z;
```

## Rule Details

This rule enforces consistent spacing inside array brackets.

## Options

This rule has a string option:

* `"never"` (default) disallows spaces inside array brackets
* `"always"` requires one or more spaces or newlines inside array brackets

This rule has an object option for exceptions to the `"never"` option:

* `"singleValue": true` requires one or more spaces or newlines inside brackets of array literals that contain a single element
* `"objectsInArrays": true` requires one or more spaces or newlines between brackets of array literals and braces of their object literal elements `[ {` or `} ]`
* `"arraysInArrays": true` requires one or more spaces or newlines between brackets of array literals and brackets of their array literal elements `[ [` or `] ]`

This rule has an object option for exceptions to the `"always"` option:

* `"singleValue": false` disallows spaces inside brackets of array literals that contain a single element
* `"objectsInArrays": false` disallows spaces between brackets of array literals and braces of their object literal elements `[{` or `}]`
* `"arraysInArrays": false` disallows spaces between brackets of array literals and brackets of their array literal elements `[[` or `]]`

This rule has built-in exceptions:

* `"never"` (and also the exceptions to the `"always"` option) allows newlines inside array brackets, because this is a common pattern
* `"always"` does not require spaces or newlines in empty array literals `[]`

### never

Examples of **incorrect** code for this rule with the default `"never"` option:

:::incorrect

```js
/*eslint array-bracket-spacing: ["error", "never"]*/
/*eslint-env es6*/

var arr = [ 'foo', 'bar' ];
var arr = ['foo', 'bar' ];
var arr = [ ['foo'], 'bar'];
var arr = [[ 'foo' ], 'bar'];
var arr = [ 'foo',
  'bar'
];
var [ x, y ] = z;
var [ x,y ] = z;
var [ x, ...y ] = z;
var [ ,,x, ] = z;
```

:::

Examples of **correct** code for this rule with the default `"never"` option:

:::correct

```js
/*eslint array-bracket-spacing: ["error", "never"]*/
/*eslint-env es6*/

var arr = [];
var arr = ['foo', 'bar', 'baz'];
var arr = [['foo'], 'bar', 'baz'];
var arr = [
  'foo',
  'bar',
  'baz'
];
var arr = ['foo',
  'bar'
];
var arr = [
  'foo',
  'bar'];

var [x, y] = z;
var [x,y] = z;
var [x, ...y] = z;
var [,,x,] = z;
```

:::

### always

Examples of **incorrect** code for this rule with the `"always"` option:

:::incorrect

```js
/*eslint array-bracket-spacing: ["error", "always"]*/
/*eslint-env es6*/

var arr = ['foo', 'bar'];
var arr = ['foo', 'bar' ];
var arr = [ ['foo'], 'bar' ];
var arr = ['foo',
  'bar'
];
var arr = [
  'foo',
  'bar'];

var [x, y] = z;
var [x,y] = z;
var [x, ...y] = z;
var [,,x,] = z;
```

:::

Examples of **correct** code for this rule with the `"always"` option:

:::correct

```js
/*eslint array-bracket-spacing: ["error", "always"]*/
/*eslint-env es6*/

var arr = [];
var arr = [ 'foo', 'bar', 'baz' ];
var arr = [ [ 'foo' ], 'bar', 'baz' ];
var arr = [ 'foo',
  'bar'
];
var arr = [
  'foo',
  'bar' ];
var arr = [
  'foo',
  'bar',
  'baz'
];

var [ x, y ] = z;
var [ x,y ] = z;
var [ x, ...y ] = z;
var [ ,,x, ] = z;
```

:::

### singleValue

Examples of **incorrect** code for this rule with the `"always", { "singleValue": false }` options:

:::incorrect

```js
/*eslint array-bracket-spacing: ["error", "always", { "singleValue": false }]*/

var foo = [ 'foo' ];
var foo = [ 'foo'];
var foo = ['foo' ];
var foo = [ 1 ];
var foo = [ 1];
var foo = [1 ];
var foo = [ [ 1, 2 ] ];
var foo = [ { 'foo': 'bar' } ];
```

:::

Examples of **correct** code for this rule with the `"always", { "singleValue": false }` options:

:::correct

```js
/*eslint array-bracket-spacing: ["error", "always", { "singleValue": false }]*/

var foo = ['foo'];
var foo = [1];
var foo = [[ 1, 1 ]];
var foo = [{ 'foo': 'bar' }];
```

:::

### objectsInArrays

Examples of **incorrect** code for this rule with the `"always", { "objectsInArrays": false }` options:

:::incorrect

```js
/*eslint array-bracket-spacing: ["error", "always", { "objectsInArrays": false }]*/

var arr = [ { 'foo': 'bar' } ];
var arr = [ {
  'foo': 'bar'
} ]
```

:::

Examples of **correct** code for this rule with the `"always", { "objectsInArrays": false }` options:

:::correct

```js
/*eslint array-bracket-spacing: ["error", "always", { "objectsInArrays": false }]*/

var arr = [{ 'foo': 'bar' }];
var arr = [{
  'foo': 'bar'
}];
```

:::

### arraysInArrays

Examples of **incorrect** code for this rule with the `"always", { "arraysInArrays": false }` options:

:::incorrect

```js
/*eslint array-bracket-spacing: ["error", "always", { "arraysInArrays": false }]*/

var arr = [ [ 1, 2 ], 2, 3, 4 ];
var arr = [ [ 1, 2 ], 2, [ 3, 4 ] ];
```

:::

Examples of **correct** code for this rule with the `"always", { "arraysInArrays": false }` options:

:::correct

```js
/*eslint array-bracket-spacing: ["error", "always", { "arraysInArrays": false }]*/

var arr = [[ 1, 2 ], 2, 3, 4 ];
var arr = [[ 1, 2 ], 2, [ 3, 4 ]];
```

:::

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing between array brackets.
