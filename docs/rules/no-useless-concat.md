# Disallow unnecessary concatenation of strings (no-useless-concat)

It's unnecessary to concatenate two strings together, such as:

```js
var foo = "a" + "b";
```

This code is likely the result of refactoring where a variable was removed from the concatenation (such as `"a" + b + "b"`). In such a case, the concatenation isn't important and the code can be rewritten as:

```js
var foo = "ab";
```

## Rule Details

This rule aims to flag the concatenation of 2 literals when they could be combined into a single literal. Literals can be strings or template literals.

Examples of **incorrect** code for this rule:

```js
/*eslint no-useless-concat: "error"*/
/*eslint-env es6*/

var a = `some` + `string`;

// these are the same as "10"
var a = '1' + '0';
var a = '1' + `0`;
var a = `1` + '0';
var a = `1` + `0`;
```

Examples of **correct** code for this rule:

```js
/*eslint no-useless-concat: "error"*/

// when a non string is included
var c = a + b;
var c = '1' + a;
var a = 1 + '1';
var c = 1 - 2;
// when the string concatenation is multiline
var c = "foo" +
    "bar";
```

## When Not To Use It

If you don't want to be notified about unnecessary string concatenation, you can safely disable this rule.
