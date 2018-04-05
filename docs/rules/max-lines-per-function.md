# enforce a maximum function length (max-lines-per-function)

Some people consider large functions a code smell. Large functions tend to do a lot of things and can make it hard following what's going on. While there is not an objective maximum number of lines considered acceptable in a function, most people would agree it should not be above 200. Google's JS style guide (by proxy of their C++ style guide), recommends 40 lines or fewer per function. The Linux Kernel's style guide recommends 48 lines or fewer.

## Rule Details

This rule enforces a maximum number of lines per function, in order to aid in maintainability and reduce complexity. This rule does not count any top-level function code.


## Options

This rule has a number or object option:

* `"max"` (default `200`) enforces a maximum number of lines in a function

* `"skipBlankLines": true` ignore lines made up purely of whitespace.

* `"skipComments": true` ignore lines containing just comments

### code

Examples of **incorrect** code for this rule with a max value of `2`:

```js
/*eslint max-lines-per-function: ["error", 2]*/
function foo() {
    var x = 0;
}
```

```js
/*eslint max-lines-per-function: ["error", 2]*/
function foo() {
    // a comment
    var x = 0;
}
```

```js
/*eslint max-lines-per-function: ["error", 2]*/
function foo() {
    // a comment followed by a blank line

    var x = 0;
}
```

Examples of **correct** code for this rule with a max value of `2`:

```js
/*eslint max-lines-per-function: ["error", 3]*/
function foo() {
    var x = 0;
}
```

```js
/*eslint max-lines-per-function: ["error", 3]*/
function foo() {
    // a comment
    var x = 0;
}
```

```js
/*eslint max-lines-per-function: ["error", 3]*/
function foo() {
    // a comment followed by a blank line

    var x = 0;
}
```

### skipBlankLines

Examples of **incorrect** code for this rule with the `{ "skipBlankLines": true }` option:

```js
/*eslint max-lines-per-function: ["error", {"max": 2, "skipBlankLines": true}]*/
function foo() {

    var x = 0;
}
```

Examples of **correct** code for this rule with the `{ "skipBlankLines": true }` option:

```js
/*eslint max-lines-per-function: ["error", {"max": 3, "skipBlankLines": true}]*/
function foo() {

    var x = 0;
}
```

### skipComments

Examples of **incorrect** code for this rule with the `{ "skipComments": true }` option:

```js
/*eslint max-lines-per-function: ["error", {"max": 2, "skipComments": true}]*/
function foo() {
    // a comment
    var x = 0;
}
```

Examples of **correct** code for this rule with the `{ "skipComments": true }` option:

```js
/*eslint max-lines-per-function: ["error", {"max": 3, "skipComments": true}]*/
function foo() {
    // a comment
    var x = 0;
}
```

## When Not To Use It

You can turn this rule off if you are not concerned with the number of lines in your functions.

## Related Rules

* [complexity](complexity.md)
* [max-depth](max-depth.md)
* [max-lines](max-lines.md)
* [max-nested-callbacks](max-nested-callbacks.md)
* [max-params](max-params.md)
* [max-statements](max-statements.md)
* [max-statements-per-line](max-statements-per-line.md)
