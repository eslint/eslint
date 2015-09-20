# Disallow Octal Literals (no-octal)

Octal literals are numerals that begin with a leading zero, such as:

```js
var num = 071;      // 57
```

The leading zero to identify an octal literal has been a source of confusion and error in JavaScript. ECMAScript 5 deprecates the use of octal numeric literals in JavaScript and octal literals cause syntax errors in strict mode.

It's therefore recommended to avoid using octal literals in JavaScript code.

## Rule Details

The rule is aimed at preventing the use of a deprecated JavaScript feature, the use of octal literals. As such it will warn whenever an octal literal is found.

The following patterns are considered problems:

```js
/*eslint no-octal: 2*/

var num = 071;       /*error Octal literals should not be used.*/
var result = 5 + 07; /*error Octal literals should not be used.*/
```

The following patterns are not considered problems:

```js
/*eslint no-octal: 2*/

var num  = "071";
```

## Compatibility

* **JSHint**: W115

## Further Reading

* [Octal literals not allowed in strict mode](http://jslinterrors.com/octal-literals-are-not-allowed-in-strict-mode)
