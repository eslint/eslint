# Require Regex Literals to be Wrapped (wrap-regex)

When a regular expression is used in certain situation, it can end up looking like a division operator. For example:

```js
function a() {
    return /foo/.test("bar");
}
```

## Rule Details

This is used to disambiguate the slash operator and facilitates in more readable code.

The following patterns are considered warnings:

```js
function a() {
    return /foo/.test("bar");
}
```

The following patterns adhere to this rule:

```js
function a() {
    return (/foo/).test("bar");
}
```
