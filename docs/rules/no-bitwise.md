# Disallow Bitwise Operators (no-bitwise)

The use of bitwise operators in JavaScript is very rare and often `&` or `|` is simply a mistyped `&&` or `||`, which will lead to unexpected behavior.

```js
var x = y | z;
```

## Rule Details

This rule is aimed at catching typos that end up as bitwise operators, but are meant to be the much more common `&&`, '||', `<`, `>` operators. As such, it will warn whenever it encounters a bitwise operator:

The following patterns are considered problems:

```js
/*eslint no-bitwise: "error"*/

var x = y | z;

var x = y & z;

var x = y ^ z;

var x = ~ z;

var x = y << z;

var x = y >> z;

var x = y >>> z;

x |= y;

x &= y;

x ^= y;

x <<= y;

x >>= y;

x >>>= y;
```

The following patterns are not considered problems:

```js
/*eslint no-bitwise: "error"*/

var x = y || z;

var x = y && z;

var x = y > z;

var x = y < z;

x += y;
```

## Options

This rule supports the following options:

`allow`: The list of bitwise operators to be used as exceptions to the rule. For example:

```js
/*eslint no-bitwise: ["error", { allow: ["~"] }] */

~[1,2,3].indexOf(1) === -1;
```

`int32Hint`: Allows the use of bitwise OR in `|0` pattern for type casting:

```js
/*eslint no-bitwise: ["error", { int32Hint: true }] */

var b = a|0;
```
