# no plusplus

Flags the use of unary operators, `++` and `--`.

```js
var foo = 0;
foo++;
```

## Rule Details

The following patterns are considered warnings:

```js
var foo = 0;
foo++;

var bar = 42;
bar--;
```
