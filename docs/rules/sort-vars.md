# Variable Sorting

When declaring multiple variables within the same block, it's a good idea to sort variable names alphabetically to be able to find nessesary variable easier at the later time.

## Rule Details

This rule checks all variable declaration blocks and verifies that all variables are sorted alphabetically.

The following patterns are considered warnings:

```js
var b, a;
```

The following patterns are considered okay and do not cause warnings:

```js
var a, b, c, d;
var _a = 10;
var _b = 20;
```

Alphabetical list is maintained starting from the first variable and exluding any that are considered warnings. So the following code will produce two warnings:

```js
var c, d, a, b;
```

But this one, will only produce one:

```js
var c, d, a, e;
```