# Operator Assignment Shorthand (operator-assignment)

JavaScript provides shorthand operators that combine variable assignment and some simple mathematical operations. For example, `x = x + 4` can be shortened to `x += 4`. The supported shorthand forms are as follows:

```text
 Shorthand | Separate
-----------|------------
 x += y    | x = x + y
 x -= y    | x = x - y
 x *= y    | x = x * y
 x /= y    | x = x / y
 x %= y    | x = x % y
 x <<= y   | x = x << y
 x >>= y   | x = x >> y
 x >>>= y  | x = x >>> y
 x &= y    | x = x & y
 x ^= y    | x = x ^ y
 x |= y    | x = x | y
```

## Rule Details

This rule enforces use of the shorthand assignment operators by requiring them where possible or prohibiting them entirely. It has two modes: `always` and `never`.

### always

`"operator-assignment": [2, "always"]`

This mode enforces use of operator assignment shorthand where possible.

The following are examples of valid patterns:

```js
/*eslint operator-assignment: [2, "always"]*/

x = y;
x += y;
x = y * z;
x = (x * y) * z;
x[0] /= y;
x[foo()] = x[foo()] % 2;
x = y + x; // `+` is not always commutative (e.g. x = "abc")
```

The following patterns are considered problems and should be replaced by their shorthand equivalents:

```js
/*eslint operator-assignment: [2, "always"]*/

x = x + y;        /*error Assignment can be replaced with operator assignment.*/
x = y * x;        /*error Assignment can be replaced with operator assignment.*/
x[0] = x[0] / y;  /*error Assignment can be replaced with operator assignment.*/
x.y = x.y << z;   /*error Assignment can be replaced with operator assignment.*/
```

### never

`"operator-assignment": [2, "never"]`

This mode warns on any use of operator assignment shorthand.

The following are examples of valid patterns:

```js
/*eslint operator-assignment: [2, "never"]*/

x = x + y;
x.y = x.y / a.b;
```

The following patterns are considered problems and should be written out fully without the shorthand assignments:

```js
/*eslint operator-assignment: [2, "never"]*/

x *= y;               /*error Unexpected operator assignment shorthand.*/
x ^= (y + z) / foo(); /*error Unexpected operator assignment shorthand.*/
```

## When Not To Use It

Use of operator assignment shorthand is a stylistic choice. Leaving this rule turned off would allow developers to choose which style is more readable on a case-by-case basis.
