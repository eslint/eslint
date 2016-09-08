# Require Regex Literals to be Wrapped (wrap-regex)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

When a regular expression is used in certain situations, it can end up looking like a division operator. For example:

```js
function a() {
    return /foo/.test("bar");
}
```

## Rule Details

This is used to disambiguate the slash operator and facilitates more readable code.

The following patterns are considered problems:

```js
/*eslint wrap-regex: "error"*/

function a() {
    return /foo/.test("bar");
}
```

The following patterns are not considered problems:

```js
/*eslint wrap-regex: "error"*/

function a() {
    return (/foo/).test("bar");
}
```
