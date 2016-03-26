# Require === and !== (eqeqeq)

It is considered good practice to use the type-safe equality operators `===` and `!==` instead of their regular counterparts `==` and `!=`.

The reason for this is that `==` and `!=` do type coercion which follows the rather obscure [Abstract Equality Comparison Algorithm](http://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3).
For instance, the following statements are all considered `true`:

* `[] == false`
* `[] == ![]`
* `3 == "03"`

If one of those occurs in an innocent-looking statement such as `a == b` the actual problem is very difficult to spot.

## Rule Details

This rule is aimed at eliminating the type-unsafe equality operators.

Examples of **incorrect** code for this rule:

```js
/*eslint eqeqeq: "error"*/

if (x == 42) { }

if ("" == text) { }

if (obj.getStuff() != undefined) { }
```

## Options

### smart

The `"smart"` option enforces the use of `===` and `!==` except for these cases:

* Comparing two literal values
* Evaluating the value of `typeof`
* Comparing against `null`

Examples of **incorrect** code for the `"smart"` option:

```js
/*eslint eqeqeq: ["error", "smart"]*/

// comparing two variables requires ===
a == b

// only one side is a literal
foo == true
bananas != 1

// comparing to undefined requires ===
value == undefined
```

Examples of **correct** code for the `"smart"` option:

```js
/*eslint eqeqeq: ["error", "smart"]*/

typeof foo == 'undefined'
'hello' != 'world'
0 == 0
true == true
foo == null
```

### allow-null

The `"allow-null"` option will enforce `===` and `!==` in your code with one exception - it permits comparing to `null` to check for `null` or `undefined` in a single expression.

Examples of **incorrect** code for the `"allow-null"` option:

```js
/*eslint eqeqeq: ["error", "allow-null"]*/

bananas != 1
typeof foo == 'undefined'
'hello' != 'world'
0 == 0
foo == undefined
```

Examples of **correct** code for the `"allow-null"` option:

```js
/*eslint eqeqeq: ["error", "allow-null"]*/

foo == null
```

## When Not To Use It

If you don't want to enforce a style for using equality operators, then it's safe to disable this rule.
