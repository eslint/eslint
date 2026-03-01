---
title: radix
rule_type: suggestion
further_reading:
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
- https://davidwalsh.name/parseint-radix
---



When using the `parseInt()` function it is common to omit the second argument, the radix, and let the function try to determine from the first argument what type of number it is. By default, `parseInt()` will autodetect decimal and hexadecimal (via `0x` prefix). Prior to ECMAScript 5, `parseInt()` also autodetected octal literals, which caused problems because many developers assumed a leading `0` would be ignored.

This confusion led to the suggestion that you always use the radix parameter to `parseInt()` to eliminate unintended consequences. So instead of doing this:

```js
const num = parseInt("071");      // 57
```

Do this:

```js
const num = parseInt("071", 10);  // 71
```

ECMAScript 5 changed the behavior of `parseInt()` so that it no longer autodetects octal literals and instead treats them as decimal literals. However, the differences between hexadecimal and decimal interpretation of the first parameter causes many developers to continue using the radix parameter to ensure the string is interpreted in the intended way.

## Rule Details

This rule is aimed at preventing the unintended conversion of a string to a number of a different base than intended.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint radix: "error"*/

const num = parseInt("071");

const num1 = parseInt(someValue);

const num2 = parseInt("071", "abc");

const num3 = parseInt("071", 37);

const num4 = parseInt();
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint radix: "error"*/

const num = parseInt("071", 10);

const num1 = parseInt("071", 8);

const num2 = parseFloat(someValue);
```

:::

## Options

**Deprecated:** String options `"always"` and `"as-needed"` are deprecated. Setting either of these options doesn't change the behavior of this rule, which now always enforces providing a radix, as it was the case when the `"always"` option was specified. Since the default radix depends on the first argument of `parseInt()`, this rule assumes that the second argument (the radix) is always needed.

## When Not To Use It

If you want to use the default behavior of the `parseInt()` function when the radix argument is not specified, you can turn this rule off.
