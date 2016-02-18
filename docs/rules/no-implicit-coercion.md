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
foo += "";
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

```js
{
    "rules": {
        "no-implicit-coercion": [2, {
            "boolean": true,
            "number": true,
            "string": true,
            "allow": [/* "!!", "~", "*", "+" */]
        }]
    }
}
```

* `"boolean"` (`true` by default) - When this is `true`, this rule warns shorter type conversions for `boolean` type.
* `"number"` (`true` by default) - When this is `true`, this rule warns shorter type conversions for `number` type.
* `"string"` (`true` by default) - When this is `true`, this rule warns shorter type conversions for `string` type.
* `"allow"` (`empty` by default) - Each entry in this array can be one of `~`, `!!`, `+` or `*` that are to be allowed.

Note that operator `+` in `allow` list would allow `+foo` (number coercion) as well as `"" + foo` (string coercion).

### `boolean`

The following patterns are considered problems:

```js
/*eslint no-implicit-coercion: 2*/

var b = !!foo;
var b = ~foo.indexOf(".");
// only with `indexOf`/`lastIndexOf` method calling.

```

The following patterns are not considered problems:

```js
/*eslint no-implicit-coercion: 2*/

var b = Boolean(foo);
var b = foo.indexOf(".") !== -1;

var n = ~foo; // This is a just binary negating.
```

### `number`

The following patterns are considered problems:

```js
/*eslint no-implicit-coercion: 2*/

var n = +foo;
var n = 1 * foo;
```

The following patterns are not considered problems:

```js
/*eslint no-implicit-coercion: 2*/

var b = Number(foo);
var b = parseFloat(foo);
var b = parseInt(foo, 10);
```

### `string`

The following patterns are considered problems:

```js
/*eslint no-implicit-coercion: 2*/

var n = "" + foo;

foo += "";
```

The following patterns are not considered problems:

```js
/*eslint no-implicit-coercion: 2*/

var b = String(foo);
```

### Fine-grained control

Using `allow` list, we can override and allow specific operators.

For example, when the configuration is like this:

```json
{
    "rules": {
        "no-implicit-coercion": [2, {
            "boolean": true,
            "number": true,
            "string": true,
            "allow": ["!!", "~"]
        }]
    }
}
```

The following patterns are not considered problems:

```js
var b = !!foo;
var c = ~foo.indexOf(".");
```

## When Not To Use It

If you don't want to be notified about shorter notations for the type conversion, you can safely disable this rule.
