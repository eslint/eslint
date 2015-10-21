# Disallow ++ and -- (no-plusplus)

The `no-plusplus` rule flags the use of unary operators, `++` and `--`.

```js
var foo = 0;
foo++;
```

The `++` and `--` operators are subject to automatic semicolon insertion. When their use is allowed, introducing whitespace may change semantics of source code. Enabling the rule may prevent this kind of errors.

```js
var i = 10;
var j = 20;

i ++
j
// i = 11, j = 20
```

```js
var i = 10;
var j = 20;

i
++
j
// i = 10, j = 21
```

## Rule Details

This rule is aimed at flagging the use of `++` and `--`. Some believe that the use of these unary operators reduces code quality and clarity. There are some programming languages that completely exclude these operators.

### Options

This rule, in it's default state, does not require any arguments. If you would like to enable one or more of the following you may pass an object with the options set as follows:

* `allowForLoopAfterthoughts` set to `true` will allow you to use the unary operators `++` and `--` in the afterthought (final expression) of a `for` loop.

The following patterns are considered problems:

```js
/*eslint no-plusplus: 2*/

var foo = 0;
foo++;                          /*error Unary operator '++' used.*/

var bar = 42;
bar--;                          /*error Unary operator '--' used.*/

for (i = 0; i < l; i++) {       /*error Unary operator '++' used.*/
    return;
}
```

The following patterns are not considered problems:

```js
/*eslint no-plusplus: 2*/

var foo = 0;
foo += 1;

var bar = 42;
bar -= 1;

for (i = 0; i < l; i += 1) {
    return;
}
```

The following patterns are not considered problems if `allowForLoopAfterthoughts` is set to true:

```js
/*eslint no-plusplus: 2, [{ allowForLoopAfterthoughts: true }]*/

for (i = 0; i < l; i++) {
    return;
}

for (i = 0; i < l; i--) {
    return;
}
```
