# no redeclare

Re-declaring variables can lead to confusion and decrease readability of your code. 

## Rule Details

This rule is aimed at eliminating variables that have multiple declarations in the same scope.

The following patterns are considered warnings:

```js
var a = 3;
...
var a = 10;
```

The following patterns are considered okay and do not cause warnings:

```js
var a = 3;
...
a = 10;
```
