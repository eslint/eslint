---
title: no-dupe-keys
layout: doc
edit_link: https://github.com/eslint/eslint/edit/main/docs/src/rules/no-dupe-keys.md
rule_type: problem
---

<!--RECOMMENDED-->

Disallows duplicate keys in object literals.

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
