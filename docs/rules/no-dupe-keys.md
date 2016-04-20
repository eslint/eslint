# disallow duplicate keys in object literals (no-dupe-keys)

Multiple properties with the same key in object literals can cause unexpected behavior in your application.

```js
var foo = {
    bar: "baz",
    bar: "qux"
};
```

## Rule Details

This rule disallows duplicate keys in object literals.

Examples of **incorrect** code for this rule:

```js
/*eslint no-dupe-keys: "error"*/

var foo = {
    bar: "baz",
    bar: "qux"
};

var foo = {
    "bar": "baz",
    bar: "qux"
};

var foo = {
    0x1: "baz",
    1: "qux"
};
```

Examples of **correct** code for this rule:

```js
/*eslint no-dupe-keys: "error"*/

var foo = {
    bar: "baz",
    quxx: "qux"
};
```
