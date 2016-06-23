# Require Regex Literals to be Wrapped (wrap-regex)

When a regular expression is used in certain situations, it can end up looking like a division operator. For example:

```js
function a() {
    return /foo/.test("bar");
}
```

## Rule Details

This is used to disambiguate the slash operator and facilitates more readable code.

## Examples

Examples of **incorrect** code for this rule:

```js
/*eslint wrap-regex: "error"*/

function a() {
    return /foo/.test("bar");
}
```

Examples of **correct** code for this rule:

```js
/*eslint wrap-regex: "error"*/

function a() {
    return (/foo/).test("bar");
}
```