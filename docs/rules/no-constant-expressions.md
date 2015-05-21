# Disallow use of constant boolean expressions (no-constant-boolean-expressions)

Dynamically calculating a boolean constant is likely to be an error.

```js
var success = a === a;
```

This pattern is most likely an error.

## Rule Details

The rule is aimed at preventing the use of a constant boolean expression.

## Examples

The following patterns are considered okay and do not cause warnings:

```js
var r = a === 3;
var r = a === true && b === a;
```

The following patterns are considered warnings:

```js
var r = a && !a;
var r = a === b && a === c && b !== c;
```
