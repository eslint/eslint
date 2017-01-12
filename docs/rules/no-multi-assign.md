# Disallow Use of Chained Assignment Expressions (no-multi-assign)

Chaining the assignment of variables can lead to unexpected results and be difficult to read.

```js
a = b = c = d;
```

## Rule Details

This rule disallows using multiple assignments within a single statement.

Examples of **incorrect** code for this rule:

```js
/*eslint no-multi-assign: "error"*/

var a = b = c = 5;

var foo = bar = "baz";

var a =
    b =
    c;
```

Examples of **correct** code for this rule:

```js
/*eslint no-multi-assign: "error"*/
var a = 5;
var b = 5;
var c = 5;

var foo = "baz";
var bar = "baz";

var a = c;
var b = c;
```

## Related Rules

* [max-statements-per-line](max-statements-per-line.md)
