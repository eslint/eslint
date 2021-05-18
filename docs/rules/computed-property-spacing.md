# Disallow or enforce spaces inside of computed properties (computed-property-spacing)

While formatting preferences are very personal, a number of style guides require
or disallow spaces between computed properties in the following situations:

```js
/*eslint-env es6*/

var obj = { prop: "value" };
var a = "prop";
var x = obj[a]; // computed property in object member expression

var a = "prop";
var obj = {
  [a]: "value" // computed property key in object literal (ECMAScript 6)
};
```

## Rule Details

This rule enforces consistent spacing inside computed property brackets.

It either requires or disallows spaces between the brackets and the values inside of them.
This rule does not apply to brackets that are separated from the adjacent value by a newline.

## Options

This rule has a string option:

* `"never"` (default) disallows spaces inside computed property brackets
* `"always"` requires one or more spaces inside computed property brackets

### never

Examples of **incorrect** code for this rule with the default `"never"` option:

```js
/*eslint computed-property-spacing: ["error", "never"]*/
/*eslint-env es6*/

obj[foo ]
obj[ 'foo']
var x = {[ b ]: a}
obj[foo[ bar ]]
```

Examples of **correct** code for this rule with the default `"never"` option:

```js
/*eslint computed-property-spacing: ["error", "never"]*/
/*eslint-env es6*/

obj[foo]
obj['foo']
var x = {[b]: a}
obj[foo[bar]]
```

### always

Examples of **incorrect** code for this rule with the `"always"` option:

```js
/*eslint computed-property-spacing: ["error", "always"]*/
/*eslint-env es6*/

obj[foo]
var x = {[b]: a}
obj[ foo]
obj['foo' ]
obj[foo[ bar ]]
var x = {[ b]: a}
```

Examples of **correct** code for this rule with the `"always"` option:

```js
/*eslint computed-property-spacing: ["error", "always"]*/
/*eslint-env es6*/

obj[ foo ]
obj[ 'foo' ]
var x = {[ b ]: a}
obj[ foo[ bar ] ]
```


## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of computed properties.

## Related Rules

* [array-bracket-spacing](array-bracket-spacing.md)
* [comma-spacing](comma-spacing.md)
* [space-in-parens](space-in-parens.md)
