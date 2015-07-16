# Disallow or enforce spaces inside of computed properties. (computed-property-spacing)

While formatting preferences are very personal, a number of style guides require
or disallow spaces between computed properties in the following situations:

```js
// computed properties
var obj = { prop: "value" };
var a = "prop";
var x = obj[a];

// object literal computed properties (EcmaScript 6)
var a = "prop";
var obj = { [a]: "value" };
```

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

When `"never"` is set, the following patterns are considered correct:

```js
obj[foo]
obj['foo']
var x = {[b]: a}
obj[foo[bar]]
```

The following patterns will warn:

```js
obj[foo ]
obj[ 'foo']
var x = {[ b ]: a}
obj[foo[ bar ]]
```

#### always

When `"always"` is used, the following patterns are considered correct:

```js
obj[ foo ]
obj[ 'foo' ]
var x = {[ b ]: a}
obj[ foo[ bar ] ]

```

The following patterns will warn:

```js
obj[foo]
var x = {[b]: a}
obj[ foo]
obj[ foo ]
obj['foo' ]
obj[foo[ bar ]]
var x = {[ b]: a}
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of computed properties.

## Related Rules

* [comma-spacing](comma-spacing.md)
* [space-in-parens](space-in-parens.md)
* [curly-braces-spacing](curly-braces-spacing.md)
* [computed-property-spacing](computed-property-spacing.md)
* [space-in-brackets](space-in-brackets.md) (deprecated)
