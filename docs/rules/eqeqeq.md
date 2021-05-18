# Require === and !== (eqeqeq)

It is considered good practice to use the type-safe equality operators `===` and `!==` instead of their regular counterparts `==` and `!=`.

The reason for this is that `==` and `!=` do type coercion which follows the rather obscure [Abstract Equality Comparison Algorithm](https://www.ecma-international.org/ecma-262/5.1/#sec-11.9.3).
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

The `--fix` option on the command line automatically fixes some problems reported by this rule. A problem is only fixed if one of the operands is a `typeof` expression, or if both operands are literals with the same type.

## Options

### always

The `"always"` option (default) enforces the use of `===` and `!==` in every situation (except when you opt-in to more specific handling of `null` [see below]).

Examples of **incorrect** code for the `"always"` option:

```js
/*eslint eqeqeq: ["error", "always"]*/

a == b
foo == true
bananas != 1
value == undefined
typeof foo == 'undefined'
'hello' != 'world'
0 == 0
true == true
foo == null

```

Examples of **correct** code for the `"always"` option:

```js
/*eslint eqeqeq: ["error", "always"]*/

a === b
foo === true
bananas !== 1
value === undefined
typeof foo === 'undefined'
'hello' !== 'world'
0 === 0
true === true
foo === null

```

This rule optionally takes a second argument, which should be an object with the following supported properties:

* `"null"`: Customize how this rule treats `null` literals. Possible values:
    * `always` (default) - Always use === or !==.
    * `never` - Never use === or !== with `null`.
    * `ignore` - Do not apply this rule to `null`.

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

**Deprecated:** Instead of using this option use "always" and pass a "null" option property with value "ignore". This will tell ESLint to always enforce strict equality except when comparing with the `null` literal.

```js
["error", "always", {"null": "ignore"}]
```

## When Not To Use It

If you don't want to enforce a style for using equality operators, then it's safe to disable this rule.
