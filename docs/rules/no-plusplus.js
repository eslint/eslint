# no plusplus

The `no-plusplus` rule flags the use of unary operators, `++` and `--`.

```js
var foo = 0;
foo++;
```

## Rule Details

This rule is aimed at flagging the use of `++` and `--`. Some believe that the use of these unary operators reduces code quality and clarity. There are some programming languages that completely exclude these operators.

The following patterns are considered warnings:

```js
var foo = 0;
foo++;

var bar = 42;
bar--;
```

The following patterns are not considered warnings:

```js
var foo = 0;
foo += 1;

var bar = 42;
bar -= 1;
```
