# disallow `parseInt()` in favor of binary, octal, and hexadecimal literals (prefer-numeric-literals)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

The `parseInt()` function can be used to turn binary, octal, and hexadecimal strings into integers. As binary, octal, and hexadecimal literals are supported in ES6, this rule encourages use of those numeric literals instead of `parseInt()`.

```js
0b111110111 === 503;
0o767 === 503;
```

## Rule Details

This rule disallows `parseInt()` if it is called with two arguments: a string and a radix option of 2 (binary), 8 (octal), or 16 (hexadecimal).

Examples of **incorrect** code for this rule:

```js
/*eslint prefer-numeric-literals: "error"*/

parseInt("111110111", 2) === 503;
parseInt("767", 8) === 503;
parseInt("1F7", 16) === 255;
```

Examples of **correct** code for this rule:

```js
/*eslint prefer-numeric-literals: "error"*/
/*eslint-env es6*/

parseInt(1);
parseInt(1, 3);

0b111110111 === 503;
0o767 === 503;
0x1F7 === 503;

a[parseInt](1,2);

parseInt(foo);
parseInt(foo, 2);
```

## When Not To Use It

If you want to allow use of `parseInt()` for binary, octal, or hexadecimal integers. If you are not using ES6 (because binary and octal literals are not supported in ES5 and below).

## Compatibility

* **JSCS**: [requireNumericLiterals](http://jscs.info/rule/requireNumericLiterals)
