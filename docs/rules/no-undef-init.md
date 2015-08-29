# Disallow Initializing to undefined (no-undef-init)

In JavaScript, a variable that is declared and not initialized to any value automatically gets the value of `undefined`. For example:

```js
var foo;

console.log(foo === undefined);     // true
```

It's therefore unnecessary to initialize a variable to `undefined`, such as:

```js
var foo = undefined;
```

It's considered a best practice to avoid initializing variables to `undefined`.

## Rule Details

This rule aims to eliminate variable declarations that initialize to `undefined`.

The following patterns are considered warnings:

```js
/*eslint no-undef-init: 2*/

var foo = undefined; /*error It's not necessary to initialize 'foo' to undefined.*/
let bar = undefined; /*error It's not necessary to initialize 'bar' to undefined.*/
```

The following patterns are not warnings:

```js
/*eslint no-undef-init: 2*/

var foo;
let bar;
```

## When Not To Use It

If you want to allow initialization of variables with `undefined`, then you can safely turn this rule off.

## Related Rules

* [no-undefined](no-undefined.md)
* [no-void](no-void.md)
