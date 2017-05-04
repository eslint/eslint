# Enforce location of semicolons (semi-style)

Generally, semicolons are at the end of statements. However, in semicolon-less style, semicolons are at the head of statements. This rule enforces that semicolons are at the configured location.

## Rule Details

This rule reports line terminators around semicolons.

Examples of **incorrect** code for this rule with `"last"` option:

```js
/*eslint semi-style: ["error", "last"]*/

var a = 0
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

var a = 0
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

var a = 0
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

Examples of **correct** code for this rule with `"first"` option:

```js
/*eslint semi-style: ["error", "first"]*/

var a = 0
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

## Options

```json
{
    "semi-style": ["error", "last"],
    // OR
    "semi-style": ["error", {"statements": "last",  "forLoopHead": "last"}]
}
```

If the option is a string, it means both `statements` and `forLoopHead` are set the same value.

- `"last"` (Default) ... enforces that semicolons are at the end of statements.
- `"first"` ... enforces that semicolons are at the head of statements.
- `statements` ... configuration of statements.
- `forLoopHead` ... configuration of `for(;;){}`.

## When Not To Use It

If you don't want to notify the location of semicolons, then it's safe to disable this rule.
