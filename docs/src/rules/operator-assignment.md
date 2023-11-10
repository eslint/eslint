---
title: operator-assignment
rule_type: suggestion
---



JavaScript provides shorthand operators that combine variable assignment and some simple mathematical operations. For example, `x = x + 4` can be shortened to `x += 4`. The supported shorthand forms are as follows:

```text
 Shorthand | Separate
-----------|------------
 x += y    | x = x + y
 x -= y    | x = x - y
 x *= y    | x = x * y
 x /= y    | x = x / y
 x %= y    | x = x % y
 x **= y   | x = x ** y
 x <<= y   | x = x << y
 x >>= y   | x = x >> y
 x >>>= y  | x = x >>> y
 x &= y    | x = x & y
 x ^= y    | x = x ^ y
 x |= y    | x = x | y
```

## Rule Details

This rule requires or disallows assignment operator shorthand where possible.

The rule applies to the operators listed in the above table. It does not report the logical assignment operators `&&=`, `||=`, and `??=` because their short-circuiting behavior is different from the other assignment operators.

## Options

This rule has a single string option:

* `"always"` (default)  requires assignment operator shorthand where possible
* `"never"` disallows assignment operator shorthand

### always

Examples of **incorrect** code for this rule with the default `"always"` option:

::: incorrect

```js
/*eslint operator-assignment: ["error", "always"]*/

x = x + y;
x = y * x;
x[0] = x[0] / y;
x.y = x.y << z;
```

:::

Examples of **correct** code for this rule with the default `"always"` option:

::: correct

```js
/*eslint operator-assignment: ["error", "always"]*/

x = y;
x += y;
x = y * z;
x = (x * y) * z;
x[0] /= y;
x[foo()] = x[foo()] % 2;
x = y + x; // `+` is not always commutative (e.g. x = "abc")
```

:::

### never

Examples of **incorrect** code for this rule with the `"never"` option:

::: incorrect

```js
/*eslint operator-assignment: ["error", "never"]*/

x *= y;
x ^= (y + z) / foo();
```

:::

Examples of **correct** code for this rule with the `"never"` option:

::: correct

```js
/*eslint operator-assignment: ["error", "never"]*/

x = x + y;
x.y = x.y / a.b;
```

:::

## When Not To Use It

Use of operator assignment shorthand is a stylistic choice. Leaving this rule turned off would allow developers to choose which style is more readable on a case-by-case basis.
