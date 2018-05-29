# require or disallow newline at the end of files (eol-last)

Trailing newlines in non-empty files are a common UNIX idiom. Benefits of
trailing newlines include the ability to concatenate or append to files as well
as output files to the terminal without interfering with shell prompts.

## Rule Details

This rule enforces at least one newline (or absence thereof) at the end
of non-empty files.

Prior to v0.16.0 this rule also enforced that there was only a single line at
the end of the file. If you still want this behavior, consider enabling
[no-multiple-empty-lines](no-multiple-empty-lines.md) with `maxEOF` and/or
[no-trailing-spaces](no-trailing-spaces.md).

Examples of **incorrect** code for this rule:

```js
/*eslint eol-last: ["error", "always"]*/

function doSmth() {
  var foo = 2;
}
```

Examples of **correct** code for this rule:

```js
/*eslint eol-last: ["error", "always"]*/

function doSmth() {
  var foo = 2;
}\n
```

## Options

This rule has a string option:

* `"always"` (default) enforces that files end with a newline (LF)
* `"never"` enforces that files do not end with a newline
* `"unix"` (deprecated) is identical to "always"
* `"windows"` (deprecated) is identical to "always", but will use a CRLF character when autofixing

**Deprecated:** The options `"unix"` and `"windows"` are deprecated. If you need to enforce a specific linebreak style, use this rule in conjunction with `linebreak-style`.
