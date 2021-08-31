# enforce consistent linebreak style (linebreak-style)

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

## Using this rule with version control systems

Version control systems sometimes have special behavior for linebreaks. To make it easy for developers to contribute to your codebase from different platforms, you may want to configure your VCS to handle linebreaks appropriately.

For example, the default behavior of [git](https://git-scm.com/) on Windows systems is to convert LF linebreaks to CRLF when checking out files, but to store the linebreaks as LF when committing a change. This will cause the `linebreak-style` rule to report errors if configured with the `"unix"` setting, because the files that ESLint sees will have CRLF linebreaks. If you use git, you may want to add a line to your [`.gitattributes` file](https://git-scm.com/docs/gitattributes) to prevent git from converting linebreaks in `.js` files:

```
*.js text eol=lf
```

## When Not To Use It

If you aren't concerned about having different line endings within your code, then you can safely turn this rule off.

## Compatibility

* **JSCS**: [validateLineBreaks](https://jscs-dev.github.io/rule/validateLineBreaks)
