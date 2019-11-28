# Disallow Use of Chained Assignment Expressions (no-multi-assign)

Chaining the assignment of variables can lead to unexpected results and be difficult to read.

```js
(function() {
    const foo = bar = 0; // do you mean `foo = bar == 0`?
    bar = 1;             // will not fail, not constant
})();
console.log(bar);        // will not fail, not scoped, output 1
```

## Rule Details

This rule disallows using multiple assignments within a single statement.

Examples of **incorrect** code for this rule:

```js
/*eslint no-multi-assign: "error"*/

var a = b = c = 5;

const foo = bar = "baz";

let a =
    b =
    c;
```

Examples of **correct** code for this rule:

```js
/*eslint no-multi-assign: "error"*/
var a = 5;
var b = 5;
var c = 5;

const foo = "baz";
const bar = "baz";

let a = c;
let b = c;
```

## Related Rules

* [max-statements-per-line](max-statements-per-line.md)
