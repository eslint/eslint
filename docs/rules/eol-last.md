# Require files to end with newlines (eol-last)

Trailing newlines in non-empty files are a common UNIX idiom. Benefits of
trailing newlines include the ability to concatenate or append to files as well
as output files to the terminal without interfering with shell prompts. This
rule enforces newlines for all non-empty programs.

Prior to v0.16.0 this rule also enforced that there was only a single line at
the end of the file. If you still want this behaviour, set the `max` option to 1.
Related rules: [no-multiple-empty-lines](no-multiple-empty-lines.md) and
[no-trailing-spaces](no-trailing-spaces.md).

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

### Options

The `eol-last` rule can be tweaked with options (currently only one):

* `type` - Either `unix` (LF) or `windows` (CRLF). When omitted `unix` is assumed.
* `max` - Maximum number of tolerated newlines at the end of file. By default
          any number of newlines is allowed.

### Examples

Require at least one newline:

```json
"eol-last": 2
```

Require one and exactly one newline:

```json
"eol-last": [2, {"max": 1}]
```

Require at least one newline but not more than 4:

```json
"eol-last": [2, {"max": 4}]
```

The following patterns are considered problems:

```js
/*eslint eol-last: 2*/

function doSmth() {
  var foo = 2;
} // missing newline here
```

```js
/*eslint eol-last: [2, {"max": 1}]*/

function doSmth() {
  var foo = 2;
}
// two newlines here
```

The following patterns are not considered problems:

```js
/*eslint eol-last: 2*/

function doSmth() {
  var foo = 2;
}
// spaces here
```

```js
/*eslint eol-last: [2, {"max": 1}]*/

function doSmth() {
  var foo = 2;
}
```
