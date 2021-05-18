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

## Options

There are two options for this rule:

* `"never"` (default) enforces zero spaces inside of parentheses
* `"always"` enforces a space inside of parentheses

Depending on your coding conventions, you can choose either option by specifying it in your configuration:

```json
"space-in-parens": ["error", "always"]
```

### "never"

Examples of **incorrect** code for this rule with the default `"never"` option:

```js
/*eslint space-in-parens: ["error", "never"]*/

foo( 'bar');
foo('bar' );
foo( 'bar' );

var foo = ( 1 + 2 ) * 3;
( function () { return 'bar'; }() );
```

Examples of **correct** code for this rule with the default `"never"` option:

```js
/*eslint space-in-parens: ["error", "never"]*/

foo();

foo('bar');

var foo = (1 + 2) * 3;
(function () { return 'bar'; }());
```

### "always"

Examples of **incorrect** code for this rule with the `"always"` option:

```js
/*eslint space-in-parens: ["error", "always"]*/

foo( 'bar');
foo('bar' );
foo('bar');

var foo = (1 + 2) * 3;
(function () { return 'bar'; }());
```

Examples of **correct** code for this rule with the `"always"` option:

```js
/*eslint space-in-parens: ["error", "always"]*/

foo();

foo( 'bar' );

var foo = ( 1 + 2 ) * 3;
( function () { return 'bar'; }() );
```

### Exceptions

An object literal may be used as a third array item to specify exceptions, with the key `"exceptions"` and an array as the value. These exceptions work in the context of the first option. That is, if `"always"` is set to enforce spacing, then any "exception" will *disallow* spacing. Conversely, if `"never"` is set to disallow spacing, then any "exception" will *enforce* spacing.

The following exceptions are available: `["{}", "[]", "()", "empty"]`.

Examples of **incorrect** code for this rule with the `"never", { "exceptions": ["{}"] }` option:

```js
/*eslint space-in-parens: ["error", "never", { "exceptions": ["{}"] }]*/

foo({bar: 'baz'});
foo(1, {bar: 'baz'});
```

Examples of **correct** code for this rule with the `"never", { "exceptions": ["{}"] }` option:

```js
/*eslint space-in-parens: ["error", "never", { "exceptions": ["{}"] }]*/

foo( {bar: 'baz'} );
foo(1, {bar: 'baz'} );
```

Examples of **incorrect** code for this rule with the `"always", { "exceptions": ["{}"] }` option:

```js
/*eslint space-in-parens: ["error", "always", { "exceptions": ["{}"] }]*/

foo( {bar: 'baz'} );
foo( 1, {bar: 'baz'} );
```

Examples of **correct** code for this rule with the `"always", { "exceptions": ["{}"] }` option:

```js
/*eslint space-in-parens: ["error", "always", { "exceptions": ["{}"] }]*/

foo({bar: 'baz'});
foo( 1, {bar: 'baz'});
```

Examples of **incorrect** code for this rule with the `"never", { "exceptions": ["[]"] }` option:

```js
/*eslint space-in-parens: ["error", "never", { "exceptions": ["[]"] }]*/

foo([bar, baz]);
foo([bar, baz], 1);
```

Examples of **correct** code for this rule with the `"never", { "exceptions": ["[]"] }` option:

```js
/*eslint space-in-parens: ["error", "never", { "exceptions": ["[]"] }]*/

foo( [bar, baz] );
foo( [bar, baz], 1);
```

Examples of **incorrect** code for this rule with the `"always", { "exceptions": ["[]"] }` option:

```js
/*eslint space-in-parens: ["error", "always", { "exceptions": ["[]"] }]*/

foo( [bar, baz] );
foo( [bar, baz], 1 );
```

Examples of **correct** code for this rule with the `"always", { "exceptions": ["[]"] }` option:

```js
/*eslint space-in-parens: ["error", "always", { "exceptions": ["[]"] }]*/

foo([bar, baz]);
foo([bar, baz], 1 );
```

Examples of **incorrect** code for this rule with the `"never", { "exceptions": ["()"] }]` option:

```js
/*eslint space-in-parens: ["error", "never", { "exceptions": ["()"] }]*/

foo((1 + 2));
foo((1 + 2), 1);
```

Examples of **correct** code for this rule with the `"never", { "exceptions": ["()"] }]` option:

```js
/*eslint space-in-parens: ["error", "never", { "exceptions": ["()"] }]*/

foo( (1 + 2) );
foo( (1 + 2), 1);
```

Examples of **incorrect** code for this rule with the `"always", { "exceptions": ["()"] }]` option:

```js
/*eslint space-in-parens: ["error", "always", { "exceptions": ["()"] }]*/

foo( ( 1 + 2 ) );
foo( ( 1 + 2 ), 1 );
```

Examples of **correct** code for this rule with the `"always", { "exceptions": ["()"] }]` option:

```js
/*eslint space-in-parens: ["error", "always", { "exceptions": ["()"] }]*/

foo(( 1 + 2 ));
foo(( 1 + 2 ), 1 );
```

The `"empty"` exception concerns empty parentheses, and works the same way as the other exceptions, inverting the first option.

Example of **incorrect** code for this rule with the `"never", { "exceptions": ["empty"] }]` option:

```js
/*eslint space-in-parens: ["error", "never", { "exceptions": ["empty"] }]*/

foo();
```

Example of **correct** code for this rule with the `"never", { "exceptions": ["empty"] }]` option:

```js
/*eslint space-in-parens: ["error", "never", { "exceptions": ["empty"] }]*/

foo( );
```

Example of **incorrect** code for this rule with the `"always", { "exceptions": ["empty"] }]` option:

```js
/*eslint space-in-parens: ["error", "always", { "exceptions": ["empty"] }]*/

foo( );
```

Example of **correct** code for this rule with the `"always", { "exceptions": ["empty"] }]` option:

```js
/*eslint space-in-parens: ["error", "always", { "exceptions": ["empty"] }]*/

foo();
```

You can include multiple entries in the `"exceptions"` array.

Examples of **incorrect** code for this rule with the `"always", { "exceptions": ["{}", "[]"] }]` option:

```js
/*eslint space-in-parens: ["error", "always", { "exceptions": ["{}", "[]"] }]*/

bar( {bar:'baz'} );
baz( 1, [1,2] );
foo( {bar: 'baz'}, [1, 2] );
```

Examples of **correct** code for this rule with the `"always", { "exceptions": ["{}", "[]"] }]` option:

```js
/*eslint space-in-parens: ["error", "always", { "exceptions": ["{}", "[]"] }]*/

bar({bar:'baz'});
baz( 1, [1,2]);
foo({bar: 'baz'}, [1, 2]);
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing between parentheses.

## Related Rules

* [space-in-brackets](space-in-brackets.md) (deprecated)
