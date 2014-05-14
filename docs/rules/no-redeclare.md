# Disallow Redeclaring Variables (no-redeclare)

In JavaScript, it's possible to redeclare the same variable name using `var`. This can lead to confusion as to where the variable is actually declared and initialized.

## Rule Details

This rule is aimed at eliminating variables that have multiple declarations in the same scope.

The following patterns are considered warnings:

```js
var a = 3;
var a = 10;
```

The following patterns are considered okay and do not cause warnings:

```js
var a = 3;
...
a = 10;
```
