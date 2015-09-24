# Require Regex Literals to be Wrapped (wrap-regex)

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
/*eslint wrap-regex: 2*/

function a() {
    return /foo/.test("bar"); /*error Wrap the regexp literal in parens to disambiguate the slash.*/
}
```

The following patterns are not considered problems:

```js
/*eslint wrap-regex: 2*/

function a() {
    return (/foo/).test("bar");
}
```
