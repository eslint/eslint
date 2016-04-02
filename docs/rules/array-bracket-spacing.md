# Disallow or enforce spaces inside of brackets. (array-bracket-spacing)

A number of style guides require or disallow spaces between array brackets. This rule
applies to both array literals and destructuring assignment (EcmaScript 6) using arrays.

```js
/*eslint-env es6*/

var arr = [ 'foo', 'bar' ];
var [ x, y ] = z;

var arr = ['foo', 'bar'];
var [x,y] = z;
```

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule aims to maintain consistency around the spacing inside of array brackets, either by disallowing
spaces inside of brackets between the brackets and other tokens or enforcing spaces. Brackets that are
separated from the adjacent value by a new line are excepted from this rule, as this is a common pattern.
  Object literals that are used as the first or last element in an array are also ignored.

## Options

There are two options for this rule:

* `"always"` enforces a space inside of array brackets
* `"never"` enforces no space inside of array brackets (default)

Depending on your coding conventions, you can choose either option by specifying it in your configuration:

```json
"array-bracket-spacing": ["error", "always"]
```

### "never"

When `"never"` is set, the following patterns are considered problems:

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

The following patterns are not considered problems:

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

### "always"

When `"always"` is used, the following patterns are considered problems:

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

The following patterns are not considered problems:

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

Note that `"always"` has a special case where `{}` and `[]` are not considered problems.

### Exceptions

An object literal may be used as a third array item to specify spacing exceptions. These exceptions work in the context of the first option. That is, if `"always"` is set to enforce spacing and an exception is set to `false`, it will disallow spacing for cases matching the exception. Likewise, if `"never"` is set to disallow spacing and an exception is set to `true`, it will enforce spacing for cases matching the exception.

You can add exceptions like so:

In case of `"always"` option, set an exception to `false` to enable it:

```json
"array-bracket-spacing": ["error", "always", {
  "singleValue": false,
  "objectsInArrays": false,
  "arraysInArrays": false
}]
```

In case of `"never"` option, set an exception to `true` to enable it:

```json
"array-bracket-spacing": ["error", "never", {
  "singleValue": true,
  "objectsInArrays": true,
  "arraysInArrays": true
}]
```

The following exceptions are available:

* `singleValue` sets the spacing of a single value inside of square brackets of an array.
* `objectsInArrays` sets the spacings between the curly braces and square brackets of object literals that are the first or last element in an array.
* `arraysInArrays` sets the spacing between the square brackets of array literals that are the first or last element in an array.

In each of the following examples, the `"always"` option is assumed.

When `"singleValue"` is set to `false`, the following patterns are considered problems:

```js
/*eslint array-bracket-spacing: ["error", "always", { singleValue: false }]*/

var foo = [ 'foo' ];
var foo = [ 'foo'];
var foo = ['foo' ];
var foo = [ 1 ];
var foo = [ 1];
var foo = [1 ];
var foo = [ [ 1, 2 ] ];
var foo = [ { 'foo': 'bar' } ];
```

The following patterns are not considered problems:

```js
/*eslint array-bracket-spacing: ["error", "always", { singleValue: false }]*/

var foo = ['foo'];
var foo = [1];
var foo = [[ 1, 1 ]];
var foo = [{ 'foo': 'bar' }];
```

When `"objectsInArrays"` is set to `false`, the following patterns are considered problems:

```js
/*eslint array-bracket-spacing: ["error", "always", { objectsInArrays: false }]*/

var arr = [ { 'foo': 'bar' } ];
var arr = [ {
  'foo': 'bar'
} ]
```

The following patterns are not considered problems:

```js
/*eslint array-bracket-spacing: ["error", "always", { objectsInArrays: false }]*/

var arr = [{ 'foo': 'bar' }];
var arr = [{
  'foo': 'bar'
}];
```

When `"arraysInArrays"` is set to `false`, the following patterns are considered problems:

```js
/*eslint array-bracket-spacing: ["error", "always", { arraysInArrays: false }]*/

var arr = [ [ 1, 2 ], 2, 3, 4 ];
var arr = [ [ 1, 2 ], 2, [ 3, 4 ] ];
```

The following patterns are not considered problems:

```js
/*eslint array-bracket-spacing: ["error", "always", { arraysInArrays: false }]*/

var arr = [[ 1, 2 ], 2, 3, 4 ];
var arr = [[ 1, 2 ], 2, [ 3, 4 ]];
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing between array brackets.

## Related Rules

* [space-in-parens](space-in-parens.md)
* [object-curly-spacing](object-curly-spacing.md)
* [computed-property-spacing](computed-property-spacing.md)
