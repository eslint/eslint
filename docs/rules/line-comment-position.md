# enforce position of line comments (line-comment-position)

Line comments can be positioned above or beside code. This rule helps teams maintain a consistent style.

```js
// above comment
var foo = "bar";  // beside comment
```

## Rule Details

This rule enforces consistent position of line comments. Block comments are not affected by this rule. By default, this rule ignores comments starting with the following words: `eslint`, `jshint`, `jslint`, `istanbul`, `global`, `exported`, `jscs`, `falls through`.


## Options

This rule takes one argument, which can be a string or an object. The string settings are the same as those of the `position` property (explained below). The object option has the following properties:

### position

The `position` option has two settings:

* `above` (default) enforces line comments only above code, in its own line.
* `beside` enforces line comments only at the end of code lines.

#### position: above

Examples of **correct** code for the `{ "position": "above" }` option:

```js
/*eslint line-comment-position: ["error", { "position": "above" }]*/
// valid comment
1 + 1;
```


Examples of **incorrect** code for the `{ "position": "above" }` option:

```js
/*eslint line-comment-position: ["error", { "position": "above" }]*/
1 + 1; // invalid comment
```

#### position: beside

Examples of **correct** code for the `{ "position": "beside" }` option:

```js
/*eslint line-comment-position: ["error", { "position": "beside" }]*/
1 + 1; // valid comment
```


Examples of **incorrect** code for the `{ "position": "beside" }` option:

```js
/*eslint line-comment-position: ["error", { "position": "beside" }]*/
// invalid comment
1 + 1;
```

### ignorePattern

By default this rule ignores comments starting with the following words: `eslint`, `jshint`, `jslint`, `istanbul`, `global`, `exported`, `jscs`, `falls through`. An alternative regular expression can be provided.

Examples of **correct** code for the `ignorePattern` option:

```js
/*eslint line-comment-position: ["error", { "ignorePattern": "pragma" }]*/
1 + 1; // pragma valid comment
```

Examples of **incorrect** code for the `ignorePattern` option:

```js
/*eslint line-comment-position: ["error", { "ignorePattern": "pragma" }]*/
1 + 1; // invalid comment
```

### applyDefaultIgnorePatterns

Default ignore patterns are applied even when `ignorePattern` is provided. If you want to omit default patterns, set this option to `false`.

Examples of **correct** code for the `{ "applyDefaultIgnorePatterns": false }` option:

```js
/*eslint line-comment-position: ["error", { "ignorePattern": "pragma", "applyDefaultIgnorePatterns": false }]*/
1 + 1; // pragma valid comment
```

Examples of **incorrect** code for the `{ "applyDefaultIgnorePatterns": false }` option:

```js
/*eslint line-comment-position: ["error", { "ignorePattern": "pragma", "applyDefaultIgnorePatterns": false }]*/
1 + 1; // falls through
```

**Deprecated:** the object property `applyDefaultPatterns` is deprecated. Please use the property `applyDefaultIgnorePatterns` instead.

## When Not To Use It

If you aren't concerned about having different line comment styles, then you can turn off this rule.

## Compatibility

**JSCS**: [validateCommentPosition](https://jscs-dev.github.io/rule/validateCommentPosition)
