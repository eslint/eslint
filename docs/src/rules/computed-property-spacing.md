---
title: computed-property-spacing
rule_type: layout
related_rules:
- array-bracket-spacing
- comma-spacing
- space-in-parens
---

This rule was **deprecated** in ESLint v8.53.0. Please use the corresponding rule in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).

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

var obj = { prop: "value" };
var a = "prop";
var { [a]: x } = obj; // computed property key in object destructuring pattern (ECMAScript 6)
```

## Rule Details

This rule enforces consistent spacing inside computed property brackets.

It either requires or disallows spaces between the brackets and the values inside of them.
This rule does not apply to brackets that are separated from the adjacent value by a newline.

## Options

This rule has two options, a string option and an object option.

String option:

* `"never"` (default) disallows spaces inside computed property brackets
* `"always"` requires one or more spaces inside computed property brackets

Object option:

* `"enforceForClassMembers": true` (default) additionally applies this rule to class members.

### never

Examples of **incorrect** code for this rule with the default `"never"` option:

::: incorrect

```js
/*eslint computed-property-spacing: ["error", "never"]*/
/*eslint-env es6*/

obj[foo ]
obj[ 'foo']
var x = {[ b ]: a}
obj[foo[ bar ]]

const { [ a ]: someProp } = obj;
({ [ b ]: anotherProp } = anotherObj);
```

:::

Examples of **correct** code for this rule with the default `"never"` option:

::: correct

```js
/*eslint computed-property-spacing: ["error", "never"]*/
/*eslint-env es6*/

obj[foo]
obj['foo']
var x = {[b]: a}
obj[foo[bar]]

const { [a]: someProp } = obj;
({ [b]: anotherProp } = anotherObj);
```

:::

### always

Examples of **incorrect** code for this rule with the `"always"` option:

::: incorrect

```js
/*eslint computed-property-spacing: ["error", "always"]*/
/*eslint-env es6*/

obj[foo]
var x = {[b]: a}
obj[ foo]
obj['foo' ]
obj[foo[ bar ]]
var x = {[ b]: a}
const { [a]: someProp } = obj;
({ [b ]: anotherProp } = anotherObj);
```

:::

Examples of **correct** code for this rule with the `"always"` option:

::: correct

```js
/*eslint computed-property-spacing: ["error", "always"]*/
/*eslint-env es6*/

obj[ foo ]
obj[ 'foo' ]
var x = {[ b ]: a}
obj[ foo[ bar ] ]
const { [ a ]: someProp } = obj;
({ [ b ]: anotherProp } = anotherObj);
```

:::

#### enforceForClassMembers

With `enforceForClassMembers` set to `true` (default), the rule also disallows/enforces spaces inside of computed keys of class methods, getters and setters.

Examples of **incorrect** code for this rule with `"never"` and `{ "enforceForClassMembers": true }` (default):

::: incorrect

```js
/*eslint computed-property-spacing: ["error", "never", { "enforceForClassMembers": true }]*/
/*eslint-env es6*/

class Foo {
  [a ]() {}
  get [b ]() {}
  set [b ](value) {}
}

const Bar = class {
  [ a](){}
  static [ b]() {}
  static get [ c ]() {}
  static set [ c ](value) {}
}
```

:::

Examples of **correct** code for this rule with `"never"` and `{ "enforceForClassMembers": true }` (default):

::: correct

```js
/*eslint computed-property-spacing: ["error", "never", { "enforceForClassMembers": true }]*/
/*eslint-env es6*/

class Foo {
  [a]() {}
  get [b]() {}
  set [b](value) {}
}

const Bar = class {
  [a](){}
  static [b]() {}
  static get [c]() {}
  static set [c](value) {}
}
```

:::

Examples of **correct** code for this rule with `"never"` and `{ "enforceForClassMembers": false }`:

::: correct

```js
/*eslint computed-property-spacing: ["error", "never", { "enforceForClassMembers": false }]*/
/*eslint-env es6*/

class Foo {
  [a ]() {}
  get [b ]() {}
  set [b ](value) {}
}

const Bar = class {
  [ a](){}
  static [ b]() {}
  static get [ c ]() {}
  static set [ c ](value) {}
}
```

:::

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of computed properties.
