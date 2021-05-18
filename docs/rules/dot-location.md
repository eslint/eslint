# Enforce newline before and after dot (dot-location)

JavaScript allows you to place newlines before or after a dot in a member expression.

Consistency in placing a newline before or after the dot can greatly increase readability.

```js
var a = universe.
        galaxy;

var b = universe
       .galaxy;
```

## Rule Details

This rule aims to enforce newline consistency in member expressions. This rule prevents the use of mixed newlines around the dot in a member expression.

## Options

The rule takes one option, a string:

* If it is `"object"` (default), the dot in a member expression should be on the same line as the object portion.
* If it is `"property"`, the dot in a member expression should be on the same line as the property portion.

### object

The default `"object"` option requires the dot to be on the same line as the object.

Examples of **incorrect** code for the default `"object"` option:

```js
/*eslint dot-location: ["error", "object"]*/

var foo = object
.property;
```

Examples of **correct** code for the default `"object"` option:

```js
/*eslint dot-location: ["error", "object"]*/

var foo = object.
property;
var bar = object.property;
```

### property

The `"property"` option requires the dot to be on the same line as the property.

Examples of **incorrect** code for the `"property"` option:

```js
/*eslint dot-location: ["error", "property"]*/

var foo = object.
property;
```

Examples of **correct** code for the `"property"` option:

```js
/*eslint dot-location: ["error", "property"]*/

var foo = object
.property;
var bar = object.property;
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of newlines before or after dots in member expressions.

## Related Rules

* [newline-after-var](newline-after-var.md)
* [dot-notation](dot-notation.md)
