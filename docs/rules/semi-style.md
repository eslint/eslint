# Enforce location of semicolons (semi-style)

Generally, semicolons are at the end of lines. However, in semicolon-less style, semicolons are at the beginning of lines. This rule enforces that semicolons are at the configured location.

## Rule Details

This rule reports line terminators around semicolons.

This rule has an option.

```json
{
    "semi-style": ["error", "last"],
}
```

- `"last"` (Default) ... enforces that semicolons are at the end of statements.
- `"first"` ... enforces that semicolons are at the beginning of statements. Semicolons of `for` loop heads (`for(a;b;c){}`) should be at the end of lines even if you use this option.

Examples of **incorrect** code for this rule with `"last"` option:

```js
/*eslint semi-style: ["error", "last"]*/

foo()
;[1, 2, 3].forEach(bar)

for (
    var i = 0
    ; i < 10
    ; ++i
) {
    foo()
}
```

Examples of **correct** code for this rule with `"last"` option:

```js
/*eslint semi-style: ["error", "last"]*/

foo();
[1, 2, 3].forEach(bar)

for (
    var i = 0;
    i < 10;
    ++i
) {
    foo()
}
```

Examples of **incorrect** code for this rule with `"first"` option:

```js
/*eslint semi-style: ["error", "first"]*/

foo();
[1, 2, 3].forEach(bar)

for (
    var i = 0
    ; i < 10
    ; ++i
) {
    foo()
}
```

Examples of **correct** code for this rule with `"first"` option:

```js
/*eslint semi-style: ["error", "first"]*/

foo()
;[1, 2, 3].forEach(bar)

for (
    var i = 0;
    i < 10;
    ++i
) {
    foo()
}
```

## When Not To Use It

If you don't want to notify the location of semicolons, then it's safe to disable this rule.

## Related rules

- [no-extra-semi](./no-extra-semi.md)
- [semi](./semi.md)
- [semi-spacing](./semi-spacing.md)
