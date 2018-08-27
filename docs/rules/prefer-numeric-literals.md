# disallow `parseInt()` and `Number.parseInt()` in favor of binary, octal, and hexadecimal literals (prefer-numeric-literals)

The `parseInt()` and `Number.parseInt()` functions can be used to turn binary, octal, and hexadecimal strings into integers. As binary, octal, and hexadecimal literals are supported in ES6, this rule encourages use of those numeric literals instead of `parseInt()` or `Number.parseInt()`.

```js
0b111110111 === 503;
0o767 === 503;
```

## Rule Details

This rule disallows calls to `parseInt()` or `Number.parseInt()` if called with two arguments: a string; and a radix option of 2 (binary), 8 (octal), or 16 (hexadecimal).

Examples of **incorrect** code for this rule:

```js
/*eslint prefer-numeric-literals: "error"*/

parseInt("111110111", 2) === 503;
parseInt("767", 8) === 503;
parseInt("1F7", 16) === 503;
Number.parseInt("111110111", 2) === 503;
Number.parseInt("767", 8) === 503;
Number.parseInt("1F7", 16) === 503;
```

Examples of **correct** code for this rule:

```js
/*eslint prefer-numeric-literals: "error"*/
/*eslint-env es6*/

parseInt(1);
parseInt(1, 3);
Number.parseInt(1);
Number.parseInt(1, 3);

0b111110111 === 503;
0o767 === 503;
0x1F7 === 503;

a[parseInt](1,2);

parseInt(foo);
parseInt(foo, 2);
Number.parseInt(foo);
Number.parseInt(foo, 2);
```

## When Not To Use It

If you want to allow use of `parseInt()` or `Number.parseInt()` for binary, octal, or hexadecimal integers, or if you are not using ES6 (because binary and octal literals are not supported in ES5 and below), you may wish to disable this rule.

## Compatibility

* **JSCS**: [requireNumericLiterals](https://jscs-dev.github.io/rule/requireNumericLiterals)
