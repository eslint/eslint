# Enforce Quote Style (quotes)

JavaScript allows you to define strings in one of three ways: double quotes, single quotes, and backticks (as of ECMAScript 6). For example:

```js
/*eslint-env es6*/

var double = "double";
var single = 'single';
var backtick = `backtick`;    // ES6 only
```

Each of these lines creates a string and, in some cases, can be used interchangeably. The choice of how to define strings in a codebase is a stylistic one outside of template literals (which allow embedded of expressions to be interpreted).

Many codebases require strings to be defined in a consistent manner.

## Rule Details

This rule is aimed at ensuring consistency of string quotes and as such will report a problem when an inconsistent style is found.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

The rule configuration takes up to two options:

1. The first option is `"double"`, `"single"` or `"backtick"` for double-quotes, single-quotes or backticks respectively. The default is `"double"`.
1. The second option is the `"avoid-escape"` flag. When using `"avoid-escape"`, this rule will not report a problem when a string is using incorrect quotes so long as the string contains a quote that would have to be escaped. For example, if you specify `"double"` and `"avoid-escape"`, the string `'He said, "hi!"'` is not considered a problem because using double quotes for that string would require escaping the double quotes inside of the string. This option is off by default.

Configuration looks like this:

```js
[2, "single", "avoid-escape"]
```

The following patterns are considered problems:

```js
/*eslint quotes: [2, "double"]*/

var single = 'single';                                 /*error Strings must use doublequote.*/
var unescaped = 'a string containing "double" quotes'; /*error Strings must use doublequote.*/
```

```js
/*eslint quotes: [2, "single"]*/

var double = "double";                                 /*error Strings must use singlequote.*/
var unescaped = "a string containing 'single' quotes"; /*error Strings must use singlequote.*/
```

```js
/*eslint quotes: [2, "double", "avoid-escape"]*/

var single = 'single'; /*error Strings must use doublequote.*/
```

```js
/*eslint quotes: [2, "single", "avoid-escape"]*/

var double = "double"; /*error Strings must use singlequote.*/
```

```js
/*eslint quotes: [2, "backtick"]*/

var single = 'single';                             /*error Strings must use backtick.*/
var double = "double";                             /*error Strings must use backtick.*/
var unescaped = 'a string containing `backticks`'; /*error Strings must use backtick.*/
```

```js
/*eslint quotes: [2, "backtick", "avoid-escape"]*/

var single = 'single'; /*error Strings must use backtick.*/
var double = "double"; /*error Strings must use backtick.*/
```

The following patterns are not considered problems:

```js
/*eslint quotes: [2, "double"]*/
/*eslint-env es6*/

var double = "double";
var backtick = `backtick`; // backticks are allowed
```

```js
/*eslint quotes: [2, "single"]*/
/*eslint-env es6*/

var single = 'single';
var backtick = `backtick`; // backticks are allowed
```

```js
/*eslint quotes: [2, "double", "avoid-escape"]*/

var single = 'a string containing "double" quotes';
```

```js
/*eslint quotes: [2, "single", "avoid-escape"]*/

var double = "a string containing 'single' quotes";
```

```js
/*eslint quotes: [2, "backtick"]*/
/*eslint-env es6*/

var backtick = `backtick`;
```

```js
/*eslint quotes: [2, "backtick", "avoid-escape"]*/

var double = "a string containing `backtick` quotes"
```

## When Not To Use It

If you do not need consistency in your string styles, you can safely disable this rule.
