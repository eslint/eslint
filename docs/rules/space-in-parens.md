# Disallow or enforce spaces inside of parentheses (space-in-parens)

Some style guides require or disallow spaces inside of parentheses:

```js
foo( 'bar' );
var x = ( 1 + 2 ) * 3;

foo('bar');
var x = (1 + 2) * 3;
```

## Rule Details

This rule will enforce consistency of spacing directly inside of parentheses, by disallowing or requiring one or more spaces to the right of `(` and to the left of `)`. In either case, `()` will still be allowed.

### Options

There are two options for this rule:

* `"always"` enforces a space inside of parentheses
* `"never"` enforces zero spaces inside of parentheses (default)

Depending on your coding conventions, you can choose either option by specifying it in your configuration:

```json
"space-in-brackets": [2, "always"]
```

#### always

When `"always"` is set, the following patterns are considered warnings:

```js
foo( 'bar');
foo('bar' );
foo('bar');

var foo = (1 + 2) * 3;
(function () { return 'bar'; }());
```

The following patterns are not warnings:

```js
foo();

foo( 'bar' );

var foo = ( 1 + 2 ) * 3;
( function () { return 'bar'; }() );
```

#### never

When `"never"` is used, the following patterns are considered warnings:

```js
foo( 'bar');
foo('bar' );
foo( 'bar' );

var foo = ( 1 + 2 ) * 3;
( function () { return 'bar'; }() );
```

The following patterns are not warnings:

```js
foo();

foo('bar');

var foo = (1 + 2) * 3;
(function () { return 'bar'; }());
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing between parentheses.

## Related Rules

* [space-in-brackets](space-in-brackets.md)
