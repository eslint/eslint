# Disallow or enforce spaces inside of computed properties. (computed-property-spacing)

While formatting preferences are very personal, a number of style guides require
or disallow spaces between computed properties in the following situations:

```js
/*eslint-env es6*/

// computed properties
var obj = { prop: "value" };
var a = "prop";
var x = obj[a];

// object literal computed properties (EcmaScript 6)
var a = "prop";
var obj = { [a]: "value" };
```

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule aims to maintain consistency around the spacing inside of computed properties.

It either requires or disallows spaces between the brackets and the values inside of them.
Brackets that are separated from the adjacent value by a new line are exempt from this rule.

### Options

There are two main options for the rule:

* `"always"` enforces a space inside of computed properties
* `"never"` disallows spaces inside of computed properties (default)

Depending on your coding conventions, you can choose either option by specifying it in your configuration:

```json
"computed-property-spacing": [2, "never"]
```

#### never

When `"never"` is set, the following patterns will give a warning:

```js
/*eslint computed-property-spacing: [2, "never"]*/
/*eslint-env es6*/

obj[foo ]                                                       /*error There should be no space before ']'*/
obj[ 'foo']        /*error There should be no space after '['*/
var x = {[ b ]: a} /*error There should be no space after '['*/ /*error There should be no space before ']'*/
obj[foo[ bar ]]    /*error There should be no space after '['*/ /*error There should be no space before ']'*/
```

The following patterns are considered correct:

```js
/*eslint computed-property-spacing: [2, "never"]*/
/*eslint-env es6*/

obj[foo]
obj['foo']
var x = {[b]: a}
obj[foo[bar]]
```

#### always

When `"always"` is used, the following patterns will give a warning:

```js
/*eslint computed-property-spacing: [2, "always"]*/
/*eslint-env es6*/

obj[foo]          /*error A space is required after '['*/ /*error A space is required before ']'*/
var x = {[b]: a}  /*error A space is required after '['*/ /*error A space is required before ']'*/
obj[ foo]                                                 /*error A space is required before ']'*/
obj[ foo ]
obj['foo' ]       /*error A space is required after '['*/
obj[foo[ bar ]]   /*error A space is required after '['*/ /*error A space is required before ']'*/
var x = {[ b]: a}                                         /*error A space is required before ']'*/
```

The following patterns are considered correct:

```js
/*eslint computed-property-spacing: [2, "always"]*/
/*eslint-env es6*/

obj[ foo ]
obj[ 'foo' ]
var x = {[ b ]: a}
obj[ foo[ bar ] ]

```


## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of computed properties.

## Related Rules

* [comma-spacing](comma-spacing.md)
* [space-in-parens](space-in-parens.md)
* [computed-property-spacing](computed-property-spacing.md)
* [space-in-brackets](space-in-brackets.md) (deprecated)
