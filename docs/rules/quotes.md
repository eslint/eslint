# Enforce Quote Style (quotes)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

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

The rule configuration takes up to two options:

1. The first option is `"double"`, `"single"` or `"backtick"` for double-quotes, single-quotes or backticks respectively. The default is `"double"`.
1. The second option is the `"avoid-escape"` flag. When using `"avoid-escape"`, this rule will not report a problem when a string is using single-quotes or double-quotes so long as the string contains a quote that would have to be escaped otherwise. For example, if you specify `"double"` and `"avoid-escape"`, the string `'He said, "hi!"'` is not considered a problem because using double quotes for that string would require escaping the double quotes inside of the string. This option is off by default.

When using `"single"` or `"double"`, template literals that don't contain a substitution, don't contain a line break and aren't tagged templates, are flagged as problems, even with the `"avoid-escape"` option.


Configuration looks like this:

```js
[2, "single", "avoid-escape"]
```

The following patterns are considered problems:

```js
/*eslint quotes: ["error", "double"]*/

var single = 'single';
var unescaped = 'a string containing "double" quotes';
```

```js
/*eslint quotes: ["error", "single"]*/

var double = "double";
var unescaped = "a string containing 'single' quotes";
```

```js
/*eslint quotes: ["error", "double", "avoid-escape"]*/

var single = 'single';
var single = `single`;
```

```js
/*eslint quotes: ["error", "single", "avoid-escape"]*/

var double = "double";
var double = `double`;
```

```js
/*eslint quotes: ["error", "backtick"]*/

var single = 'single';
var double = "double";
var unescaped = 'a string containing `backticks`';
```

```js
/*eslint quotes: ["error", "backtick", "avoid-escape"]*/

var single = 'single';
var double = "double";
```

The following patterns are not considered problems:

```js
/*eslint quotes: ["error", "double"]*/
/*eslint-env es6*/

var double = "double";
var backtick = `back\ntick`;  // backticks are allowed due to newline
var backtick = tag`backtick`; // backticks are allowed due to tag
```

```js
/*eslint quotes: ["error", "single"]*/
/*eslint-env es6*/

var single = 'single';
var backtick = `back${x}tick`; // backticks are allowed due to substitution
```

```js
/*eslint quotes: ["error", "double", "avoid-escape"]*/

var single = 'a string containing "double" quotes';
```

```js
/*eslint quotes: ["error", "single", "avoid-escape"]*/

var double = "a string containing 'single' quotes";
```

```js
/*eslint quotes: ["error", "backtick"]*/
/*eslint-env es6*/

var backtick = `backtick`;
```

```js
/*eslint quotes: ["error", "backtick", "avoid-escape"]*/

var double = "a string containing `backtick` quotes"
```

## When Not To Use It

If you do not need consistency in your string styles, you can safely disable this rule.
