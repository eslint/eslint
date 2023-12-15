---
title: space-in-parens
rule_type: layout
related_rules:
- array-bracket-spacing
- object-curly-spacing
- computed-property-spacing
---

This rule was **deprecated** in ESLint v8.53.0. Please use the [corresponding rule](https://eslint.style/rules/js/space-in-parens) in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).

Some style guides require or disallow spaces inside of parentheses:

```js
foo( 'bar' );
var x = ( 1 + 2 ) * 3;

foo('bar');
var x = (1 + 2) * 3;
```

## Rule Details

This rule will enforce consistent spacing directly inside of parentheses, by disallowing or requiring one or more spaces to the right of `(` and to the left of `)`.

As long as you do not explicitly disallow empty parentheses using the `"empty"` exception , `()` will be allowed.

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

::: incorrect

```js
/*eslint space-in-parens: ["error", "never"]*/

foo( );

foo( 'bar');
foo('bar' );
foo( 'bar' );

foo( /* bar */ );

var foo = ( 1 + 2 ) * 3;
( function () { return 'bar'; }() );
```

:::

Examples of **correct** code for this rule with the default `"never"` option:

::: correct

```js
/*eslint space-in-parens: ["error", "never"]*/

foo();

foo('bar');

foo(/* bar */);

var foo = (1 + 2) * 3;
(function () { return 'bar'; }());
```

:::

### "always"

Examples of **incorrect** code for this rule with the `"always"` option:

::: incorrect

```js
/*eslint space-in-parens: ["error", "always"]*/

foo( 'bar');
foo('bar' );
foo('bar');

foo(/* bar */);

var foo = (1 + 2) * 3;
(function () { return 'bar'; }());
```

:::

Examples of **correct** code for this rule with the `"always"` option:

::: correct

```js
/*eslint space-in-parens: ["error", "always"]*/

foo();
foo( );

foo( 'bar' );

foo( /* bar */ );

var foo = ( 1 + 2 ) * 3;
( function () { return 'bar'; }() );
```

:::

### Exceptions

An object literal may be used as a third array item to specify exceptions, with the key `"exceptions"` and an array as the value. These exceptions work in the context of the first option. That is, if `"always"` is set to enforce spacing, then any "exception" will *disallow* spacing. Conversely, if `"never"` is set to disallow spacing, then any "exception" will *enforce* spacing.

Note that this rule only enforces spacing within parentheses; it does not check spacing within curly or square brackets, but will enforce or disallow spacing of those brackets if and only if they are adjacent to an opening or closing parenthesis.

The following exceptions are available: `["{}", "[]", "()", "empty"]`.

### Empty Exception

Empty parens exception and behavior:

* `always` allows for both `()` and `( )`
* `never` (default) requires `()`
* `always` excepting `empty` requires `()`
* `never` excepting `empty` requires `( )` (empty parens without a space is here forbidden)

### Examples

Examples of **incorrect** code for this rule with the `"never", { "exceptions": ["{}"] }` option:

::: incorrect

```js
/*eslint space-in-parens: ["error", "never", { "exceptions": ["{}"] }]*/

foo({bar: 'baz'});
foo(1, {bar: 'baz'});
```

:::

Examples of **correct** code for this rule with the `"never", { "exceptions": ["{}"] }` option:

::: correct

```js
/*eslint space-in-parens: ["error", "never", { "exceptions": ["{}"] }]*/

foo( {bar: 'baz'} );
foo(1, {bar: 'baz'} );
```

:::

Examples of **incorrect** code for this rule with the `"always", { "exceptions": ["{}"] }` option:

::: incorrect

```js
/*eslint space-in-parens: ["error", "always", { "exceptions": ["{}"] }]*/

foo( {bar: 'baz'} );
foo( 1, {bar: 'baz'} );
```

:::

Examples of **correct** code for this rule with the `"always", { "exceptions": ["{}"] }` option:

::: correct

```js
/*eslint space-in-parens: ["error", "always", { "exceptions": ["{}"] }]*/

foo({bar: 'baz'});
foo( 1, {bar: 'baz'});
```

:::

Examples of **incorrect** code for this rule with the `"never", { "exceptions": ["[]"] }` option:

::: incorrect

```js
/*eslint space-in-parens: ["error", "never", { "exceptions": ["[]"] }]*/

foo([bar, baz]);
foo([bar, baz], 1);
```

:::

Examples of **correct** code for this rule with the `"never", { "exceptions": ["[]"] }` option:

::: correct

```js
/*eslint space-in-parens: ["error", "never", { "exceptions": ["[]"] }]*/

foo( [bar, baz] );
foo( [bar, baz], 1);
```

:::

Examples of **incorrect** code for this rule with the `"always", { "exceptions": ["[]"] }` option:

::: incorrect

```js
/*eslint space-in-parens: ["error", "always", { "exceptions": ["[]"] }]*/

foo( [bar, baz] );
foo( [bar, baz], 1 );
```

:::

Examples of **correct** code for this rule with the `"always", { "exceptions": ["[]"] }` option:

::: correct

```js
/*eslint space-in-parens: ["error", "always", { "exceptions": ["[]"] }]*/

foo([bar, baz]);
foo([bar, baz], 1 );
```

:::

Examples of **incorrect** code for this rule with the `"never", { "exceptions": ["()"] }]` option:

::: incorrect

```js
/*eslint space-in-parens: ["error", "never", { "exceptions": ["()"] }]*/

foo((1 + 2));
foo((1 + 2), 1);
foo(bar());
```

:::

Examples of **correct** code for this rule with the `"never", { "exceptions": ["()"] }]` option:

::: correct

```js
/*eslint space-in-parens: ["error", "never", { "exceptions": ["()"] }]*/

foo( (1 + 2) );
foo( (1 + 2), 1);
foo(bar() );
```

:::

Examples of **incorrect** code for this rule with the `"always", { "exceptions": ["()"] }]` option:

::: incorrect

```js
/*eslint space-in-parens: ["error", "always", { "exceptions": ["()"] }]*/

foo( ( 1 + 2 ) );
foo( ( 1 + 2 ), 1 );
```

:::

Examples of **correct** code for this rule with the `"always", { "exceptions": ["()"] }]` option:

::: correct

```js
/*eslint space-in-parens: ["error", "always", { "exceptions": ["()"] }]*/

foo(( 1 + 2 ));
foo(( 1 + 2 ), 1 );
```

:::

The `"empty"` exception concerns empty parentheses, and works the same way as the other exceptions, inverting the first option.

Example of **incorrect** code for this rule with the `"never", { "exceptions": ["empty"] }]` option:

::: incorrect

```js
/*eslint space-in-parens: ["error", "never", { "exceptions": ["empty"] }]*/

foo();
```

:::

Example of **correct** code for this rule with the `"never", { "exceptions": ["empty"] }]` option:

::: correct

```js
/*eslint space-in-parens: ["error", "never", { "exceptions": ["empty"] }]*/

foo( );
```

:::

Example of **incorrect** code for this rule with the `"always", { "exceptions": ["empty"] }]` option:

::: incorrect

```js
/*eslint space-in-parens: ["error", "always", { "exceptions": ["empty"] }]*/

foo( );
```

:::

Example of **correct** code for this rule with the `"always", { "exceptions": ["empty"] }]` option:

::: correct

```js
/*eslint space-in-parens: ["error", "always", { "exceptions": ["empty"] }]*/

foo();
```

:::

You can include multiple entries in the `"exceptions"` array.

Examples of **incorrect** code for this rule with the `"always", { "exceptions": ["{}", "[]"] }]` option:

::: incorrect

```js
/*eslint space-in-parens: ["error", "always", { "exceptions": ["{}", "[]"] }]*/

bar( {bar:'baz'} );
baz( 1, [1,2] );
foo( {bar: 'baz'}, [1, 2] );
```

:::

Examples of **correct** code for this rule with the `"always", { "exceptions": ["{}", "[]"] }]` option:

::: correct

```js
/*eslint space-in-parens: ["error", "always", { "exceptions": ["{}", "[]"] }]*/

bar({bar:'baz'});
baz( 1, [1,2]);
foo({bar: 'baz'}, [1, 2]);
```

:::

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing between parentheses.
