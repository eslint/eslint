# Enforce Quote Style

Enforces coding style that string literals are delimited with single or double quotes.

It takes an option as the second parameter which can be `"double"` or `"single"` for double-quotes or single-quotes respectively. There is no default.

```js
var double = "double";
var single = 'single';
```

## Rule Details

This rule will throw warnings when the wrong type of quote is used

The following patterns are considered warnings:

```js
// When [1, "double"]
var single = 'single';

// When [1, "single"]
var double = "double";
```

The follow patterns are not considered warnings:

```js
// When [1, "double"]
var double = "double";

// When [1, "single"]
var single = 'single';
```
