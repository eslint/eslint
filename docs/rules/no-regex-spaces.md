# disallow multiple spaces in regular expression literals (no-regex-spaces)

Regular expressions can be very complex and difficult to understand, which is why it's important to keep them as simple as possible in order to avoid mistakes. One of the more error-prone things you can do with a regular expression is to use more than one space, such as:

```js
var re = /foo   bar/;
```

In this regular expression, it's very hard to tell how many spaces are intended to be matched. It's better to use only one space and then specify how many spaces are expected, such as:

```js
var re = /foo {3}bar/;
```

Now it is very clear that three spaces are expected to be matched.

## Rule Details

This rule disallows multiple spaces in regular expression literals.

Examples of **incorrect** code for this rule:

```js
/*eslint no-regex-spaces: "error"*/

var re = /foo   bar/;
var re = new RegExp("foo   bar");
```

Examples of **correct** code for this rule:

```js
/*eslint no-regex-spaces: "error"*/

var re = /foo {3}bar/;
var re = new RegExp("foo {3}bar");
```

## When Not To Use It

If you want to allow multiple spaces in a regular expression, then you can safely turn this rule off.

## Related Rules

* [no-div-regex](no-div-regex.md)
* [no-control-regex](no-control-regex.md)
