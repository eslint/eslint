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

Examples of **incorrect** code for this rule:

```js
/*eslint no-undef-init: "error"*/
/*eslint-env es6*/

var foo = undefined;
let bar = undefined;
```

Examples of **correct** code for this rule:

```js
/*eslint no-undef-init: "error"*/
/*eslint-env es6*/

var foo;
let bar;
const baz = undefined;
```

## When Not To Use It

There is one situation where initializing to `undefined` behaves differently than omitting the initialization, and that's when a `var` declaration occurs inside of a loop. For example:

Example of **incorrect** code for this rule:

```js
for (i = 0; i < 10; i++) {
    var x = undefined;
    console.log(x);
    x = i;
}
```

In this case, the `var x` is hoisted out of the loop, effectively creating:

```js
var x;

for (i = 0; i < 10; i++) {
    x = undefined;
    console.log(x);
    x = i;
}
```

If you were to remove the initialization, then the behavior of the loop changes:

```js
for (i = 0; i < 10; i++) {
    var x;
    console.log(x);
    x = i;
}
```

This code is equivalent to:

```js
var x;

for (i = 0; i < 10; i++) {
    console.log(x);
    x = i;
}
```

This produces a different outcome than defining `var x = undefined` in the loop, as `x` is no longer reset to `undefined` each time through the loop.

If you're using such an initialization inside of a loop, then you should disable this rule.

Example of **correct** code for this rule, because it is disabled on a specific line:

```js
/*eslint no-undef-init: "error"*/

for (i = 0; i < 10; i++) {
    var x = undefined; // eslint-disable-line no-undef-init
    console.log(x);
    x = i;
}
```

## Related Rules

* [no-undefined](no-undefined.md)
* [no-void](no-void.md)
