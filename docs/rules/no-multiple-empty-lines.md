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

### max

In the following example, the `error` is the severity of the rule, and the
`max` property is the maximum number of empty lines (2 in this example).

```json
"no-multiple-empty-lines": ["error", {"max": 2}]
```

The following patterns are considered problems:

```js
/*eslint no-multiple-empty-lines: ["error", {max: 2}]*/


var foo = 5;



var bar = 3;


```

The following patterns are not considered problems:

```js
/*eslint no-multiple-empty-lines: ["error", {max: 2}]*/


var foo = 5;


var bar = 3;


```

### maxEOF

```json
"no-multiple-empty-lines": ["error", {"max": 2, "maxEOF": 1}]
```

The following patterns are considered problems:

```js
/*eslint no-multiple-empty-lines: ["error", {max: 2, maxEOF: 1}]*/


var foo = 5;


var bar = 3;


```

The following patterns are not considered problems:

```js
/*eslint no-multiple-empty-lines: ["error", {max: 2, maxEOF: 1}]*/


var foo = 5;


var bar = 3;

```

### maxBOF

```json
"no-multiple-empty-lines": ["error", {"max": 2, "maxBOF": 0}]
```

The following patterns are considered problems:

```js
/*eslint no-multiple-empty-lines: ["error", {max: 2, maxBOF: 0}]*/


var foo = 5;


var bar = 3;


```

The following patterns are not considered problems:

```js
/*eslint no-multiple-empty-lines: ["error", {max: 2, maxBOF: 0}]*/
var foo = 5;


var bar = 3;


```

## When Not To Use It

If you do not care about extra blank lines, turn this off.
