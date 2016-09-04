# Require or disallow file to end with single newline (eol-last)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

Trailing newlines in non-empty files are a common UNIX idiom. Benefits of
trailing newlines include the ability to concatenate or append to files as well
as output files to the terminal without interfering with shell prompts.

## Rule Details

This rule enforces at least one newline (or absence thereof) at the end
of non-empty files.

Prior to v0.16.0 this rule also enforced that there was only a single line at
the end of the file. If you still want this behaviour, consider enabling
[no-multiple-empty-lines](no-multiple-empty-lines.md) with `maxEOF` and/or
[no-trailing-spaces](no-trailing-spaces.md).

Examples of **incorrect** code for this rule:

```js
/*eslint eol-last: "error"*/

function doSmth() {
  var foo = 2;
}
```

Examples of **correct** code for this rule:

```js
/*eslint eol-last: "error"*/

function doSmth() {
  var foo = 2;
}\n
```

## Options

This rule has a string option:

* `"always"` (default) enforces that files end with a newline
* `"never"` enforces that files do not end with a newline

**Deprecated:** The string options `"windows"` and `"unix"` are deprecated. Please use the `style` property in the object option instead.

This rule has an object option to adjust the behavior of the `"always"` option:

* `"style": "unix"` (default) enforces a line feed (LF) as newline
* `"style": "windows"` enforces a carriage return line feed (CRLF) as newline
