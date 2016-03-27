# Disallow or enforce spaces inside of single line blocks. (block-spacing)

This rule is for spacing style within single line blocks.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule is aimed to flag usage of spacing inside of blocks.

## Options

This rule has a option, its value is `"always"` or `"never"`.

- `"always"` (by default) enforces one or more spaces.
- `"never"` disallows space(s).

### "always"

```json
{
  "block-spacing": ["error", "always"]
}
```

The following patterns are considered problems:

```js
/*eslint block-spacing: "error"*/
function foo() {return true;}
if (foo) { bar = 0;}
```

The following patterns are not considered problems:

```js
/*eslint block-spacing: "error"*/

function foo() { return true; }
if (foo) { bar = 0; }
```

### "never"

```json
{
  "block-spacing": ["error", "never"]
}
```

The following patterns are considered problems:

```js
/*eslint block-spacing: ["error", "never"]*/

function foo() { return true; }
if (foo) { bar = 0;}
```

The following patterns are not considered problems:

```js
/*eslint block-spacing: ["error", "never"]*/

function foo() {return true;}
if (foo) {bar = 0;}
```

## When Not To Use It

If you don't want to be notified about spacing style inside of blocks, you can safely disable this rule.
