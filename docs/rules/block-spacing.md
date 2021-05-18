# Disallow or enforce spaces inside of blocks after opening block and before closing block (block-spacing)

## Rule Details

This rule enforces consistent spacing inside an open block token and the next token on the same line. This rule also enforces consistent spacing inside a close block token and previous token on the same line.

## Options

This rule has a string option:

* `"always"` (default) requires one or more spaces
* `"never"` disallows spaces

### always

Examples of **incorrect** code for this rule with the default `"always"` option:

```js
/*eslint block-spacing: "error"*/

function foo() {return true;}
if (foo) { bar = 0;}
function baz() {let i = 0;
    return i;
}
```

Examples of **correct** code for this rule with the default `"always"` option:

```js
/*eslint block-spacing: "error"*/

function foo() { return true; }
if (foo) { bar = 0; }
```

### never

Examples of **incorrect** code for this rule with the `"never"` option:

```js
/*eslint block-spacing: ["error", "never"]*/

function foo() { return true; }
if (foo) { bar = 0;}
```

Examples of **correct** code for this rule with the `"never"` option:

```js
/*eslint block-spacing: ["error", "never"]*/

function foo() {return true;}
if (foo) {bar = 0;}
```

## When Not To Use It

If you don't want to be notified about spacing style inside of blocks, you can safely disable this rule.
