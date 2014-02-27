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

This rule aims to maintain consistency around the spacing inside of square brackets, either by disallowing spaces inside of brackets between the brackets and other tokens or enforcing spaces. Multi-line Array and Object literals with no values on the same line as the brackets are excepted from this rule as this is a common pattern.

The following patterns are considered warnings:

```js
// When options are [2, "never"]

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

// When options are [2, "always"]

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
// When options are [2, "never"]

foo['bar'];

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

// When options are [2, "always"]

foo[ 'bar' ];

foo[
  'bar' 
];

var arr = [ 'foo', 'bar', 'baz' ];

var arr = [ [ 'foo' ], 'bar', 'baz' ];

var arr = [
  'foo', 
  'bar', 
  'baz'
];

var obj = { 'foo': 'bar' };

var obj = { 'foo': { 'bar': 'baz' }, 'qux': 'quxx' };

var obj = {
  'foo': 'bar'
};
```

### Options

The rule takes one option, a string which must be either "always" or "never". The default is "never".

```js
"space-in-brackets": [2, "never"]
```

Setting the option to "always" means that there must always be a space between brackets and tokens inside of brackets.

Setting the option to "never" means that there must never be a space between brackets at the tokens inside of brackets. An exception is made for multi-line Array and Object literals where no values appear on the same line as brackets.

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing between brackets.
