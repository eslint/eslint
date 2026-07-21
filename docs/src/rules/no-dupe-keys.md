---
title: no-dupe-keys
rule_type: problem
handled_by_typescript: true
---



Multiple properties with the same key in object literals can cause unexpected behavior in your application.

```js
const foo = {
    bar: "baz",
    bar: "qux"
};
```

## Rule Details

This rule disallows duplicate keys in object literals.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-dupe-keys: "error"*/

const foo = {
    bar: "baz",
    bar: "qux"
};

const bar = {
    "bar": "baz",
    bar: "qux"
};

const baz = {
    0x1: "baz",
    1: "qux"
};
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-dupe-keys: "error"*/

const foo = {
    bar: "baz",
    quxx: "qux"
};

const obj = {
    "__proto__": baz, // defines object's prototype
    ["__proto__"]: qux // defines a property named "__proto__"
};
```

:::

## Options

This rule has no options.
