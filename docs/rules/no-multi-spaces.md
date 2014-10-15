# Disallow multiple spaces (no-multi-spaces)

It's a good practice to add whitespace in expressions to enhance readability of code such as:

```js

if(foo === "bar") {}

```

In cases where more than one whitespace is added, it can lead to ugly and inconsistent looking code such as:

```js

if(foo  === "bar") {}

```

## Rule Details

This rule aims to disallow multiple whitespace around logical expressions, conditional expressions, declarations, array elements, object properties, sequences and function parameters.

The following patterns are considered warnings:

```js
var a =  1;
```

```js
if(foo   === "bar") {}
```

```js
a <<  b
```

```js
var arr = [1,  2];
```

```js
a ?  b: c
```

The following patterns are not warnings:

```js
var a = 1;
```

```js
if(foo === "bar") {}
```

```js
a << b
```

```js
var arr = [1, 2];
```

```js
a ? b: c
```

## When Not To Use It

If you don't want to check and disallow multiple spaces, then you should turn this rule off.

## Related Rules

* [space-infix-ops](space-infix-ops.md)
* [space-in-brackets](space-in-brackets.md)
* [space-in-parens](space-in-parens.md)
* [space-after-keywords](space-after-keywords)
* [space-unary-ops](space-unary-ops)
* [space-return-throw-case](space-return-throw-case)

