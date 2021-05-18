# enforce a maximum file length (max-lines)

Some people consider large files a code smell. Large files tend to do a lot of things and can make it hard following what's going. While there is not an objective maximum number of lines considered acceptable in a file, most people would agree it should not be in the thousands. Recommendations usually range from 100 to 500 lines.

## Rule Details

This rule enforces a maximum number of lines per file, in order to aid in maintainability and reduce complexity.


## Options

This rule has a number or object option:

* `"max"` (default `300`) enforces a maximum number of lines in a file

* `"skipBlankLines": true` ignore lines made up purely of whitespace.

* `"skipComments": true` ignore lines containing just comments

### code

Examples of **incorrect** code for this rule with a max value of `2`:

```js
/*eslint max-lines: ["error", 2]*/
var a,
    b,
    c;
```

```js
/*eslint max-lines: ["error", 2]*/

var a,
    b,c;
```

```js
/*eslint max-lines: ["error", 2]*/
// a comment
var a,
    b,c;
```

Examples of **correct** code for this rule with a max value of `2`:

```js
/*eslint max-lines: ["error", 2]*/
var a,
    b, c;
```

```js
/*eslint max-lines: ["error", 2]*/

var a, b, c;
```

```js
/*eslint max-lines: ["error", 2]*/
// a comment
var a, b, c;
```

### skipBlankLines

Examples of **incorrect** code for this rule with the `{ "skipBlankLines": true }` option:

```js
/*eslint max-lines: ["error", {"max": 2, "skipBlankLines": true}]*/

var a,
    b,
    c;
```

Examples of **correct** code for this rule with the `{ "skipBlankLines": true }` option:

```js
/*eslint max-lines: ["error", {"max": 2, "skipBlankLines": true}]*/

var a,
    b, c;
```

### skipComments

Examples of **incorrect** code for this rule with the `{ "skipComments": true }` option:

```js
/*eslint max-lines: ["error", {"max": 2, "skipComments": true}]*/
// a comment
var a,
    b,
    c;
```

Examples of **correct** code for this rule with the `{ "skipComments": true }` option:

```js
/*eslint max-lines: ["error", {"max": 2, "skipComments": true}]*/
// a comment
var a,
    b, c;
```

## When Not To Use It

You can turn this rule off if you are not concerned with the number of lines in your files.

## Further reading

* [Software Module size and file size](http://www.mind2b.com/component/content/article/24-software-module-size-and-file-size)

## Related Rules

* [complexity](complexity.md)
* [max-depth](max-depth.md)
* [max-lines-per-function](max-lines-per-function.md)
* [max-nested-callbacks](max-nested-callbacks.md)
* [max-params](max-params.md)
* [max-statements](max-statements.md)

## Compatibility

* **JSCS**: [maximumNumberOfLines](https://jscs-dev.github.io/rule/maximumNumberOfLines)
