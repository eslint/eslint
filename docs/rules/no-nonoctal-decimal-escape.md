# Disallow `\8` and `\9` escape sequences in string literals (no-nonoctal-decimal-escape)

Although not being specified in the language until ECMAScript 2021, `\8` and `\9` escape sequences in string literals were allowed in most JavaScript engines, and treated as "useless" escapes:

```js
"\8" === "8"; // true
"\9" === "9"; // true
```

Since ECMAScript 2021, these escape sequences are specified as [non-octal decimal escape sequences](https://tc39.es/ecma262/#prod-annexB-NonOctalDecimalEscapeSequence), retaining the same behavior.

Nevertheless, the ECMAScript specification treats `\8` and `\9` in string literals as a legacy feature. This syntax is optional if the ECMAScript host is not a web browser. Browsers still have to support it, but only in non-strict mode.

Regardless of your targeted environment, these escape sequences shouldn't be used when writing new code.

## Rule Details

This rule disallows `\8` and `\9` escape sequences in string literals.

Examples of **incorrect** code for this rule:

```js
/*eslint no-nonoctal-decimal-escape: "error"*/

"\8";

"\9";

var foo = "w\8less";

var bar = "December 1\9";

var baz = "Don't use \8 and \9 escapes.";

var quux = "\0\8";
```

Examples of **correct** code for this rule:

```js
/*eslint no-nonoctal-decimal-escape: "error"*/

"8";

"9";

var foo = "w8less";

var bar = "December 19";

var baz = "Don't use \\8 and \\9 escapes.";

var quux = "\0\u0038";
```

## Further Reading

* [NonOctalDecimalEscapeSequence](https://tc39.es/ecma262/#prod-annexB-NonOctalDecimalEscapeSequence) in ECMAScript specification

## Related Rules

* [no-octal-escape](no-octal-escape.md)
