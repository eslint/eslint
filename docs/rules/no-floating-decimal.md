# Disallow Floating Decimals (no-floating-decimal)

Float values in JavaScript contain a decimal point, and there is no requirement that the decimal point be preceded or followed by a number. For example, the following are all valid JavaScript numbers:

```js
var num = .5;
var num = 2.;
var num = -.7;
```

Although not a syntax error, this format for numbers can make it difficult to distinguish between true decimal numbers and the dot operator. For this reason, some recommend that you should always include a number before and after a decimal point to make it clear the intent is to create a decimal number.

## Rule Details

This rule is aimed at eliminating floating decimal points and will warn whenever a numeric value has a decimal point but is missing a number either before or after it.

The following patterns are considered problems:

```js
/*eslint no-floating-decimal: 2*/

var num = .5;  /*error A leading decimal point can be confused with a dot.*/
var num = 2.;  /*error A trailing decimal point can be confused with a dot.*/
var num = -.7; /*error A leading decimal point can be confused with a dot.*/
```

The following patterns are not considered problems:

```js
/*eslint no-floating-decimal: 2*/

var num = 0.5;
var num = 2.0;
```

## Compatibility

* **JSHint**: W008

## When Not To Use It

If you aren't concerned about misinterpreting floating decimal point values, then you can safely turn this rule off.

## Further Reading

* [A leading decimal point can be confused with a dot](http://jslinterrors.com/a-leading-decimal-point-can-be-confused-with-a-dot-a/)
