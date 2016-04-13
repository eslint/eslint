# Require file to end with single newline (eol-last)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

Trailing newlines in non-empty files are a common UNIX idiom. Benefits of
trailing newlines include the ability to concatenate or append to files as well
as output files to the terminal without interfering with shell prompts.

## Rule Details

This rule requires at least one newline at the end of non-empty files.

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
}

```

## Options

This rule has a string option:

* `"unix"` (default) enforces line feed (LF) as newline
* `"windows"` enforces carriage return line feed (CRLF) as newline
