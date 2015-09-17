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

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

The following patterns are considered problems:

```js
/* eslint eqeqeq: 2 */

if (x == 42) { }                     /*error Expected '===' and instead saw '=='.*/

if ("" == text) { }                  /*error Expected '===' and instead saw '=='.*/

if (obj.getStuff() != undefined) { } /*error Expected '!==' and instead saw '!='.*/
```

### Options

* `"smart"`

This option enforces the use of `===` and `!==` except for these cases:

* Comparing two literal values
* Evaluating the value of `typeof`
* Comparing against `null`

You can specify this option using the following configuration:

```json
"eqeqeq": [2, "smart"]
```

The following patterns are not considered problems:

```js
/* eslint eqeqeq: [2, "smart"] */

typeof foo == 'undefined'
'hello' != 'world'
0 == 0
true == true
foo == null
```

The following patterns are considered problems with "smart":

```js
/* eslint eqeqeq: [2, "smart"] */

// comparing two variables requires ===
a == b              /*error Expected '===' and instead saw '=='.*/

// only one side is a literal
foo == true         /*error Expected '===' and instead saw '=='.*/
bananas != 1        /*error Expected '!==' and instead saw '!='.*/

// comparing to undefined requires ===
value == undefined  /*error Expected '===' and instead saw '=='.*/
```

* `"allow-null"`

This option will enforce `===` and `!==` in your code with one exception - it permits comparing to `null` to check for `null` or `undefined` in a single expression.

You can specify this option using the following configuration:

```json
"eqeqeq": [2, "allow-null"]
```

The following patterns are not considered problems:

```js
/* eslint eqeqeq: [2, "allow-null"] */

foo == null
```

The following patterns are considered problems with "allow-null":

```js
/* eslint eqeqeq: [2, "allow-null"] */

bananas != 1              /*error Expected '!==' and instead saw '!='.*/
typeof foo == 'undefined' /*error Expected '===' and instead saw '=='.*/
'hello' != 'world'        /*error Expected '!==' and instead saw '!='.*/
0 == 0                    /*error Expected '===' and instead saw '=='.*/
foo == undefined          /*error Expected '===' and instead saw '=='.*/
```

## When Not To Use It

If you don't want to enforce a style for using equality operators, then it's safe to disable this rule.
