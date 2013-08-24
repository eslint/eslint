# no bitwise

The use of bitwise operators in JavaScript is very rare and often `&` or `|` is simply a mistyped `&&` or `||`, which will lead to unexpected behavior.

```js
var x = y | z;
```

## Rule Details

This rule is aimed at catching typos that end up as bitwise operators, but are meant to be the much more common `&&`, '||', `<`, `>` operators. As such, it will warn whenever it encounters a bitwise operator:

The following patterns are considered warnings:

```js
var x = y | z;

var x = y & z;

var x = y ^ z;

var x = ~ z;

var x = y << z;

var x = y >> z;

var x = y >>> z;
```

The following patterns are not considered warnings:

```js
var x = y || z;

var x = y && z;

var x = y > z;

var x = y < z;
```
