# Disallow Spaces in Regular Expressions (no-regex-spaces)

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

This rule aims to eliminate errors due to multiple spaces inside of a regular expression. As such, it warns whenever more than one space in a row is found inside of a regular expression literal.

The following patterns are considered problems:

```js
/*eslint no-regex-spaces: 2*/

var re = /foo   bar/; /*error Spaces are hard to count. Use {3}.*/
```

The following patterns are not considered problems:

```js
/*eslint no-regex-spaces: 2*/

var re = /foo {3}bar/;

var re = new RegExp("foo   bar");
```

## When Not To Use It

If you want to allow multiple spaces in a regular expression, then you can safely turn this rule off.

## Further Reading

* [Spaces are hard to count](http://jslinterrors.com/spaces-are-hard-to-count-use-a/)

## Related Rules

* [no-div-regex](no-div-regex.md)
* [no-control-regex](no-control-regex.md)
