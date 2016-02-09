# Disallows multiple blank lines (no-multiple-empty-lines)

Some developers prefer to have multiple blank lines removed, while others feel that it helps improve readability. Whitespace is useful for separating logical sections of code, but excess whitespace takes up more of the screen.


## Rule Details

This rule aims to reduce the scrolling required when reading through your code. It will warn when the maximum amount of empty lines has been exceeded.

## Options

The second argument can be used to configure this rule:

* `max` sets the maximum number of consecutive blank lines.
* `maxEOF` can be used to set a different number for the end of file. The last
  blank lines will then be treated differently. If omitted, the `max` option is
  applied at the end of the file.
* `maxBOF` can be used to set a different number for the beginning of the file.
  If omitted, the 'max' option is applied at the beginning of the file.

For example, this sets the rule as an error (code is 2) with a maximum
tolerated blank lines of 2 (for the whole file):

```json
"no-multiple-empty-lines": [2, {"max": 2}]
```

While this tolerates three consecutive blank lines within the file, but only
one at the end:

```json
"no-multiple-empty-lines": [2, {"max": 3, "maxEOF": 1}]
```

And this tolerates three consecutive blank lines within the file, but none at
the beginning:

```json
"no-multiple-empty-lines": [2, {"max": 3, "maxBOF": 0}]
```


## Examples

The following patterns are considered problems:

```js
/*eslint no-multiple-empty-lines: [2, {max: 1}]*/

var foo = 5;

                  /*error Multiple blank lines not allowed.*/
var bar = 3;

```

```js
/*eslint no-multiple-empty-lines: [2, {max: 2, maxEOF: 1}]*/

var foo = 5;

                  /*error Too many blank lines at the end of file.*/
```

```js
/*eslint no-multiple-empty-lines: [2, {max: 999, maxBOF: 0}]*/
                  /*error Too many blank lines at the beginning of file.*/
var foo = 5;
```

The following patterns are not considered problems:

```js
/*eslint no-multiple-empty-lines: [2, {max: 2}]*/

var foo = 5;

var bar = 3;
```

```js
/*eslint no-multiple-empty-lines: [2, {max: 4}]*/

var foo = 5;




var bar = 3;
```

```js
/*eslint no-multiple-empty-lines: [2, {max: 2}]*/

var foo = 5;
// extra line
```

```js
/*eslint no-multiple-empty-lines: [2, {max: 2, maxBOF: 1}]*/
// extra line
var foo = 5;
// extra line
```

```js
/*eslint no-multiple-empty-lines: [2, {max: 2, maxEOF: 10}]*/

var foo = 5;
// 10 extra lines
```

## When Not To Use It

If you do not care about extra blank lines, turn this off.
