# Disallow or enforce spaces inside of brackets. (space-in-brackets)

**Replacement notice**: This rule was removed in ESLint v1.0 and replaced by the [object-curly-spacing](object-curly-spacing.md), [computed-property-spacing](computed-property-spacing.md) and [array-bracket-spacing](array-bracket-spacing.md) rules.

While formatting preferences are very personal, a number of style guides require or disallow spaces between brackets:

```js
var obj = { foo: 'bar' };
var arr = [ 'foo', 'bar' ];
foo[ 'bar' ];

var obj = {foo: 'bar'};
var arr = ['foo', 'bar'];
foo['bar'];
```

## Rule Details

This rule aims to maintain consistency around the spacing inside of square brackets, either by disallowing spaces inside of brackets between the brackets and other tokens or enforcing spaces. Brackets that are separated from the adjacent value by a new line are excepted from this rule, as this is a common pattern.  Object literals that are used as the first or last element in an array are also ignored.

### Options

There are two options for this rule:

* `"always"` enforces a space inside of object and array literals
* `"never"` enforces zero spaces inside of object and array literals (default)

Depending on your coding conventions, you can choose either option by specifying it in your configuration:

```json
"space-in-brackets": [2, "always"]
```

#### never

When `"never"` is set, the following patterns are considered problems:

```js
/*eslint-env es6*/

foo[ 'bar' ];
foo['bar' ];

var arr = [ 'foo', 'bar' ];
var arr = ['foo', 'bar' ];
var arr = [ ['foo'], 'bar'];
var arr = [[ 'foo' ], 'bar'];
var arr = ['foo',
  'bar'
];

var obj = { 'foo': 'bar' };
var obj = {'foo': 'bar' };
var obj = { baz: {'foo': 'qux'}, bar};
var obj = {baz: { 'foo': 'qux' }, bar};
```

The following patterns are not considered problems:

```js
// When options are [2, "never"]

foo['bar'];
foo[
  'bar'
];
foo[
  'bar'];

var arr = [];
var arr = ['foo', 'bar', 'baz'];
var arr = [['foo'], 'bar', 'baz'];
var arr = [
  'foo',
  'bar',
  'baz'
];

var arr = [
  'foo',
  'bar'];

var obj = {'foo': 'bar'};

var obj = {'foo': {'bar': 'baz'}, 'qux': 'quxx'};

var obj = {
  'foo': 'bar'
};
var obj = {'foo': 'bar'
};
var obj = {
  'foo':'bar'};

var obj = {};
```

#### always

When `"always"` is used, the following patterns are considered problems:

```js
/*eslint-env es6*/

foo['bar'];
foo['bar' ];
foo[ 'bar'];

var arr = ['foo', 'bar'];
var arr = ['foo', 'bar' ];
var arr = [ ['foo'], 'bar' ];
var arr = ['foo',
  'bar'
];

var arr = [
  'foo',
  'bar'];

var obj = {'foo': 'bar'};
var obj = {'foo': 'bar' };
var obj = { baz: {'foo': 'qux'}, bar};
var obj = {baz: { 'foo': 'qux' }, bar};
var obj = {'foo': 'bar'
};

var obj = {
  'foo':'bar'};
```

The following patterns are not considered problems:

```js
foo[ 'bar' ];
foo[
  'bar'
];

var arr = [];
var arr = [ 'foo', 'bar', 'baz' ];
var arr = [ [ 'foo' ], 'bar', 'baz' ];

var arr = [
  'foo',
  'bar',
  'baz'
];

var obj = {};
var obj = { 'foo': 'bar' };
var obj = { 'foo': { 'bar': 'baz' }, 'qux': 'quxx' };
var obj = {
  'foo': 'bar'
};
```

Note that `"always"` has a special case where `{}` and `[]` are not considered problems.

#### Exceptions

An object literal may be used as a third array item to specify spacing exceptions. These exceptions work in the context of the first option. That is, if `"always"` is set to enforce spacing and an exception is set to `false`, it will disallow spacing for cases matching the exception. Likewise, if `"never"` is set to disallow spacing and an exception is set to `true`, it will enforce spacing for cases matching the exception.

You can add exceptions like so:

In case of `"always"` option, set an exception to `false` to enable it:

```json
"space-in-brackets": [2, "always", {
  "singleValue": false,
  "objectsInArrays": false,
  "arraysInArrays": false,
  "arraysInObjects": false,
  "objectsInObjects": false,
  "propertyName": false
}]
```

In case of `"never"` option, set an exception to `true` to enable it:

```json
"space-in-brackets": [2, "never", {
  "singleValue": true,
  "objectsInArrays": true,
  "arraysInArrays": true,
  "arraysInObjects": true,
  "objectsInObjects": true,
  "propertyName": true
}]
```

The following exceptions are available:

* `singleValue` sets the spacing of a single value inside of square brackets of an array.
* `objectsInArrays` sets the spacings between the curly braces and square brackets of object literals that are the first or last element in an array.
* `arraysInArrays` sets the spacing between the square brackets of array literals that are the first or last element in an array.
* `arraysInObjects` sets the spacing between the square bracket and the curly brace of an array literal that is the last element in an object.
* `objectsInObjects` sets the spacing between the curly brace of an object literal that is the last element in an object and the curly brace of the containing object.
* `propertyName` sets the spacing in square brackets of computed member expressions.

In each of the following examples, the `"always"` option is assumed.

When `"singleValue"` is set to `false`, the following patterns are considered problems:

```js
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
var foo = ['foo'];
var foo = [1];
var foo = [[ 1, 1 ]];
var foo = [{ 'foo': 'bar' }];
```

When `"objectsInArrays"` is set to `false`, the following patterns are considered problems:

```js
var arr = [ { 'foo': 'bar' } ];
var arr = [ {
  'foo': 'bar'
} ]
```

The following patterns are not considered problems:

```js
var arr = [{ 'foo': 'bar' }];
var arr = [{
  'foo': 'bar'
}];
```

When `"arraysInArrays"` is set to `false`, the following patterns are considered problems:

```js
var arr = [ [ 1, 2 ], 2, 3, 4 ];
var arr = [ [ 1, 2 ], 2, [ 3, 4 ] ];
```

The following patterns are not considered problems:

```js
var arr = [[ 1, 2 ], 2, 3, 4 ];
var arr = [[ 1, 2 ], 2, [ 3, 4 ]];
```

When `"arraysInObjects"` is set to `false`, the following patterns are considered problems:

```js
var obj = { "foo": [ 1, 2 ] };
var obj = { "foo": [ "baz", "bar" ] };
```

The following patterns are not considered problems:

```js
var obj = { "foo": [ 1, 2 ]};
var obj = { "foo": [ "baz", "bar" ]};
```

When `"objectsInObjects"` is set to `false`, the following patterns are considered problems:

```js
var obj = { "foo": { "baz": 1, "bar": 2 } };
var obj = { "foo": [ "baz", "bar" ], "qux": { "baz": 1, "bar": 2 } };
```

The following patterns are not considered problems:

```js
var obj = { "foo": { "baz": 1, "bar": 2 }};
var obj = { "foo": [ "baz", "bar" ], "qux": { "baz": 1, "bar": 2 }};
```

When `"propertyName"` is set to `false`, the following patterns are considered problems:

```js
var foo = obj[ 1 ];
var foo = obj[ bar ];
```

The following patterns are not considered problems:

```js
var foo = obj[bar];
var foo = obj[0, 1];
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing between brackets.

## Related Rules

* [array-bracket-spacing](array-bracket-spacing.md)
* [object-curly-spacing](object-curly-spacing.md)
* [space-in-parens](space-in-parens.md)
* [computed-property-spacing](computed-property-spacing.md)
