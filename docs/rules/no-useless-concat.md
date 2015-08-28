# Disallow unncessary concatenation of strings (no-useless-concat)

It is unncessary to concatenate two strings together when they are on the same line since they could be combined into a single string ("a" + "b" -> "ab").

## Rule Details

This rule aims to flag the concenation of 2 literals when they could be combined into a single literal. Literals can be strings, numbers, or template literals.

The following patterns are considered warnings:

```js

// these are the same as "10"
var a = `some` + `string`;
var a = '1' + '0';
var a = '1' + `0`;
var a = `1` + '0';
var a = `1` + `0`;
var a = 1 + '0';
var a = '1' + 0;

```

The following patterns are not warnings:

```js

// a and b are identifiers
var c = a + b;
// a is an identifier
var c= '1' + a;
// addition/subtraction
var a = 1 + 1;
var c = 1 - 2;
// exception for multiline string concatenation
var c = "foo" +
    "bar";

```

## When Not To Use It

If you don't want to be notified about unnecessary string concatenation, you can safely disable this rule.
