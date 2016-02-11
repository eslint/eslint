# Require or disallow an newline around variable declarations (one-var-declaration-per-line)

Some developers declare multiple var statements on the same line:

```js
var foo, bar, baz = 0;
```

Others prefer to declare one var per line.

```js
var foo,
    bar,
    baz = 0;
```

This rule enforces a consistent style across the entire project.

## Rule Details

This rule enforces a consistent coding style where newlines are required or disallowed after each var declaration or just when there is a variable initialization. It ignores var declarations inside for loop conditionals.

## Options

This rule takes one option, a string, which can be:

* `"always"` enforces a newline around each variable declaration (default)
* `"initializations"` enforces a newline around a variable initialization

The following patterns are considered problems when set to `"always"`:

```js
/*eslint one-var-declaration-per-line: [2, "always"]*/
/*eslint-env es6*/

var a, b;               /*error Expected variable declaration to be on a new line. */

let a, b = 0;           /*error Expected variable declaration to be on a new line. */

const a = 0, b = 0;     /*error Expected variable declaration to be on a new line. */
```

The following patterns are not considered problems when set to `"always"`:

```js
/*eslint one-var-declaration-per-line: [2, "always"]*/
/*eslint-env es6*/

var a,
    b;

let a,
    b = 0;
```

The following patterns are considered problems when set to `"initializations"`:

```js
/*eslint one-var-declaration-per-line: [2, "initializations"]*/
/*eslint-env es6*/

var a, b, c = 0;        /*error Expected variable declaration to be on a new line. */

let a,
    b = 0, c;           /*error Expected variable declaration to be on a new line. */
```

The following patterns are not considered problems when set to `"initializations"`:

```js
/*eslint one-var-declaration-per-line: [2, "initializations"]*/
/*eslint-env es6*/

var a, b;

let a,
    b;

let a,
    b = 0;
```

## Related Rules

* [one-var](one-var.md)
