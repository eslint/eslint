# Require === and !==

It is considered good practice to use the type-safe equality operators `===` and `!==` instead of their regular counterparts `==` and `!=`.

The reason for this is that `==` and `!=` do type coercion which follows the rather obscure [Abstract Equality Comparison Algorithm](http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3).
For instance, the following statements are all considered `true`:
 - `[] == false`
 - `[] == ![]`
 - `3 == "03"`

If one of those occurs in an innocent-looking statement such as `a == b` the actual problem is very difficult to spot.

## Rule Details

This rule is aimed at eliminating the type-unsafe equality operators.

The following patterns are considered warnings:

```js
if (x == 42) { ... }

if ("" == text) { ... }

if (obj.getStuff() != undefined) { ... }
```

## options

- `"smart"`

This option will enforce `===` and `!==` in your code unless you're comparing between literals or you're doing a `typeof` comparison. For those types of comparisons using strict equality is unnecessary. It also permits comparing to `null` to check for `null` or `undefined` in a single expression.

The following patterns are considered okay and do not cause warnings:

```js
typeof foo == 'undefined'
'hello' != 'world'
0 == 0
true == true
foo == null
```

The following patterns are considered warnings with "smart:

```js
a == b
foo == true
bananas != 1
```

## When Not To Use It

There really is no good reason to disable this rule.

