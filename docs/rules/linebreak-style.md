# enforce consistent linebreak style (linebreak-style)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

When developing with a lot of people all having different editors, VCS applications and operating systems it may occur that
different line endings are written by either of the mentioned (might especially happen when using the windows and mac versions of SourceTree together).

The linebreaks (new lines) used in windows operating system are usually _carriage returns_ (CR) followed by a _line feed_ (LF) making it a _carriage return line feed_ (CRLF)
whereas Linux and Unix use a simple _line feed_ (LF). The corresponding _control sequences_ are `"\n"` (for LF) and `"\r\n"` for (CRLF).

Many versioning systems (like git and subversion) can automatically ensure the correct ending. However to cover all contingencies, you can activate this rule.

## Rule Details

This rule enforces consistent line endings independent of operating system, VCS, or editor used across your codebase.

### Options

This rule has a string option:

* `"unix"` (default) enforces the usage of Unix line endings: `\n` for LF.
* `"windows"` enforces the usage of Windows line endings: `\r\n` for CRLF.


### unix

Examples of **incorrect** code for this rule with the default `"unix"` option:

```js
/*eslint linebreak-style: ["error", "unix"]*/

var a = 'a'; // \r\n

```

Examples of **correct** code for this rule with the default `"unix"` option:

```js
/*eslint linebreak-style: ["error", "unix"]*/

var a = 'a', // \n
    b = 'b'; // \n
// \n
function foo(params) { // \n
    // do stuff \n
}// \n
```

### windows

Examples of **incorrect** code for this rule with the `"windows"` option:

```js
/*eslint linebreak-style: ["error", "windows"]*/

var a = 'a'; // \n
```

Examples of **correct** code for this rule with the `"windows"` option:

```js
/*eslint linebreak-style: ["error", "windows"]*/

var a = 'a', // \r\n
    b = 'b'; // \r\n
// \r\n
function foo(params) { // \r\n
    // do stuff \r\n
} // \r\n
```

## When Not To Use It

If you aren't concerned about having different line endings within you code, then you can safely turn this rule off.

## Compatibility

* **JSCS**: `validateLineBreaks`
