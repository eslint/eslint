# Disallow or enforce spaces inside of brackets. (space-in-brackets)

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

This rule aims to maintain consistency around the spacing inside of square brackets, either by disallowing spaces inside of brackets between the brackets and other tokens or enforcing spaces. Multi-line array and object literals with no values on the same line as the brackets are excepted from this rule as this is a common pattern.

### Options

There are two options for this rule:

* `"always"` enforces a space inside of object and array literals
* `"never"` enforces zero spaces inside of object and array literals (default)

Depending on your coding conventions, you can choose either option by specifying it in your configuration:

```json
"space-in-brackets": [2, "always"]
```

#### never

When `"never"` is set, the following patterns are considered warnings:

```js
foo[ 'bar' ];
foo['bar' ];
foo[
    'bar'
];

var arr = [ 'foo', 'bar' ];
var arr = ['foo', 'bar' ];
var arr = [ ['foo'], 'bar'];
var arr = [[ 'foo' ], 'bar'];
var arr = ['foo',
  'bar'
];

var arr = [
  'foo',
  'bar'];

var obj = { 'foo': 'bar' };
var obj = {'foo': 'bar' };
var obj = { baz: {'foo': 'qux'}, 'bar'};
var obj = {baz: { 'foo': 'qux' }, 'bar'};
var obj = {'foo': 'bar'
};

var obj = {
  'foo':bar'};

```

The following patterns are not warnings:

```js
// When options are [2, "never"]

foo['bar'];

var arr = [];
var arr = ['foo', 'bar', 'baz'];
var arr = [['foo'], 'bar', 'baz'];
var arr = [
  'foo',
  'bar',
  'baz'
];

var obj = {'foo': 'bar'};

var obj = {'foo': {'bar': 'baz'}, 'qux': 'quxx'};

var obj = {
  'foo': 'bar'
};

var obj = {};
```

#### always

When `"always"` is used, the following patterns are considered warnings:

```js
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
var obj = { baz: {'foo': 'qux'}, 'bar'};
var obj = {baz: { 'foo': 'qux' }, 'bar'};
var obj = {'foo': 'bar'
};

var obj = {
  'foo':bar'};

```

The following patterns are not warnings:

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

Note that `"always"` has a special case where `{}` and `[]` are not considered warnings.

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing between brackets.

## Related Rules

* [space-in-parens](space-in-parens.md)
