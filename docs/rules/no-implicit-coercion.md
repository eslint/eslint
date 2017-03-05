# Disallow the type conversion with shorter notations. (no-implicit-coercion)

In JavaScript, there are a lot of different ways to convert value types.
Some of them might be hard to read and understand.

Such as:

```js
var b = !!foo;
var b = ~foo.indexOf(".");
var n = +foo;
var n = 1 * foo;
var s = "" + foo;
foo += ``;
```

Those can be replaced with the following code:

```js
var b = Boolean(foo);
var b = foo.indexOf(".") !== -1;
var n = Number(foo);
var n = Number(foo);
var s = String(foo);
foo = String(foo);
```

## Rule Details

This rule is aimed to flag shorter notations for the type conversion, then suggest a more self-explanatory notation.

## Options

This rule has three main options and one override option to allow some coercions as required.

* `"boolean"` (`true` by default) - When this is `true`, this rule warns shorter type conversions for `boolean` type.
* `"number"` (`true` by default) - When this is `true`, this rule warns shorter type conversions for `number` type.
* `"string"` (`true` by default) - When this is `true`, this rule warns shorter type conversions for `string` type.
* `"allow"` (`empty` by default) - Each entry in this array can be one of `~`, `!!`, `+` or `*` that are to be allowed.

Note that operator `+` in `allow` list would allow `+foo` (number coercion) as well as `"" + foo` (string coercion).

### boolean

Examples of **incorrect** code for the default `{ "boolean": true }` option:

```js
/*eslint no-implicit-coercion: "error"*/

var b = !!foo;
var b = ~foo.indexOf(".");
// bitwise not is incorrect only with `indexOf`/`lastIndexOf` method calling.
```

Examples of **correct** code for the default `{ "boolean": true }` option:

```js
/*eslint no-implicit-coercion: "error"*/

var b = Boolean(foo);
var b = foo.indexOf(".") !== -1;

var n = ~foo; // This is a just bitwise not.
```

### number

Examples of **incorrect** code for the default `{ "number": true }` option:

```js
/*eslint no-implicit-coercion: "error"*/

var n = +foo;
var n = 1 * foo;
```

Examples of **correct** code for the default `{ "number": true }` option:

```js
/*eslint no-implicit-coercion: "error"*/

var n = Number(foo);
var n = parseFloat(foo);
var n = parseInt(foo, 10);
```

### string

Examples of **incorrect** code for the default `{ "string": true }` option:

```js
/*eslint no-implicit-coercion: "error"*/

var s = "" + foo;
var s = `` + foo;
foo += "";
foo += ``;
```

Examples of **correct** code for the default `{ "string": true }` option:

```js
/*eslint no-implicit-coercion: "error"*/

var s = String(foo);
foo = String(foo);
```

### allow

Using `allow` list, we can override and allow specific operators.

Examples of **correct** code for the sample `{ "allow": ["!!", "~"] }` option:

```js
/*eslint no-implicit-coercion: [2, { "allow": ["!!", "~"] } ]*/

var b = !!foo;
var b = ~foo.indexOf(".");
```

## When Not To Use It

If you don't want to be notified about shorter notations for the type conversion, you can safely disable this rule.
