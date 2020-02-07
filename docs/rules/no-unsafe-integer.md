# disallow unsafe integers (no-unsafe-integer)

Due to IEEE-754 double precision, integers with a value higher or equal to 2^53 cannot properly be represented in JavaScript and are therefore considered unsafe.
Use the [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) object or the `10n` literal instead.

See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger.

## Rule Details

This rule disallows usage of unsafe integer literals. It also checks `parseInt()` and `Number.parseInt()` function calls with unsafe integers.

Examples of **incorrect** code for this rule:

```js
/*eslint no-unsafe-integer: "error"*/

var num1 = 9223372036854775807; // INT64_MAX_NUMBER
var num2 = 0x7FFFFFFFFFFFFFFF; // INT64_MAX_NUMBER in hex
var num3 = 9007199254740992; // MAX_SAFE_INTEGER + 1
foo(9007199254740992);
parseInt("9007199254740992");
parseInt("9007199254740992", 10);

```

Examples of **correct** code for this rule:

```js
/*eslint no-empty: "error"*/

var num1 = 0;
var num2 = 1;
var num3 = 123456789;
var num4 = 9007199254740991; // MAX_SAFE_INTEGER
var num5 = 0x1FFFFFFFFFFFFF; // MAX_SAFE_INTEGER in hex
foo(9007199254740991);
parseInt("9007199254740991");
parseInt("9007199254740991", 10);
parseInt("1234567891011121315", 8); // 342391
```
