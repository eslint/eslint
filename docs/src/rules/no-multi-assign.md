# no-multi-assign

Disallows use of chained assignment expressions.

Chaining the assignment of variables can lead to unexpected results and be difficult to read.

```js
(function() {
    const foo = bar = 0; // Did you mean `foo = bar == 0`?
    bar = 1;             // This will not fail since `bar` is not constant.
})();
console.log(bar);        // This will output 1 since `bar` is not scoped.
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

class Foo {
    a = b = 10;
}

a = b = "quux";
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

class Foo {
    a = 10;
    b = 10;
}

a = "quux";
b = "quux";
```

## Options

This rule has an object option:

* `"ignoreNonDeclaration"`: When set to `true`, the rule allows chains that don't include initializing a variable in a declaration or initializing a class field. Default is `false`.

### ignoreNonDeclaration

Examples of **correct** code for the `{ "ignoreNonDeclaration": true }` option:

```js
/*eslint no-multi-assign: ["error", { "ignoreNonDeclaration": true }]*/

let a;
let b;
a = b = "baz";

const x = {};
const y = {};
x.one = y.one = 1;
```

Examples of **incorrect** code for the `{ "ignoreNonDeclaration": true }` option:

```js
/*eslint no-multi-assign: ["error", { "ignoreNonDeclaration": true }]*/

let a = b = "baz";

const foo = bar = 1;

class Foo {
    a = b = 10;
}
```

## Related Rules

* [max-statements-per-line](max-statements-per-line.md)
