# disallow octal literals (no-octal)

Octal literals are numerals that begin with a leading zero, such as:

```js
var num = 071;      // 57
```

Because the leading zero which identifies an octal literal has been a source of confusion and error in JavaScript code, ECMAScript 5 deprecates the use of octal numeric literals.

## Rule Details

The rule disallows octal literals.

If ESLint parses code in strict mode, the parser (instead of this rule) reports the error.

Examples of **incorrect** code for this rule:

```js
/*eslint no-octal: "error"*/

var num = 071;
var result = 5 + 07;
```

Examples of **correct** code for this rule:

```js
/*eslint no-octal: "error"*/

var num  = "071";
```

## Compatibility

* **JSHint**: W115
