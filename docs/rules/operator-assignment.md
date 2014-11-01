# Operator Assignment Shorthand (operator-assignment)

JavaScript provides shorthand operators that combine variable assignment and some simple mathematical operations. For example, `x = x + 4` can be shortened to `x += 4`. The supported shorthand forms are as follows:

Shorthand|Separate
---------|--------
`x += y`|`x = x + y`
`x -= y`|`x = x - y`
`x *= y`|`x = x * y`
`x /= y`|`x = x / y`
`x %= y`|`x = x % y`
`x <<= y`|`x = x << y`
`x >>= y`|`x = x >> y`
`x >>>= y`|`x = x >>> y`
`x &= y`|`x = x & y`
`x ^= y`|`x = x ^ y`
`x |= y`|`x = x | y`

## Rule Details

This rule enforces use of the shorthand assignment operators by requiring them where possible or prohibiting them entirely. It has two modes: `always` and `never`.

### always

`"operator-assignment": [2, "always"]`

This mode enforces use of operator assignment shorthand where possible.

The following are examples of valid patterns:

```js
x = y;
x += y;
x = y * z;
x = (x * y) * z;
x[0] /= y;
x[foo()] = x[foo()] % 2;
```

The following patterns are considered warnings and should be replaced by their shorthand equivalents:

```js
x = x + y;
x = y * x;
x[0] = x[0] / y;
x.y = x.y << z;
```

### never

`"operator-assignment": [2, "never"]`

This mode warns on any use of operator assignment shorthand.

The following are examples of valid patterns:

```js
x = x + y;
x.y = x.y / a.b;
```

The following patterns are considered warnings and should be written out fully without the shorthand assignments:

```js
x *= y;
x ^= (y + z) / foo();
```

## When Not To Use It

Use of operator assignment shorthand is a stylistic choice. Leaving this rule turned off would allow developers to choose which style is more readable on a case-by-case basis.
