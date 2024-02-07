---
title: object-curly-spacing
rule_type: layout
related_rules:
- array-bracket-spacing
- comma-spacing
- computed-property-spacing
- space-in-parens
---

This rule was **deprecated** in ESLint v8.53.0. Please use the [corresponding rule](https://eslint.style/rules/js/object-curly-spacing) in [`@stylistic/eslint-plugin-js`](https://eslint.style/packages/js).

While formatting preferences are very personal, a number of style guides require
or disallow spaces between curly braces in the following situations:

```js
// simple object literals
var obj = { foo: "bar" };

// nested object literals
var obj = { foo: { zoo: "bar" } };

// destructuring assignment (EcmaScript 6)
var { x, y } = y;

// import/export declarations (EcmaScript 6)
import { foo } from "bar";
export { foo };
```

## Rule Details

This rule enforces consistent spacing inside braces of object literals, destructuring assignments, and import/export specifiers.

## Options

This rule has two options, a string option and an object option.

String option:

* `"never"` (default) disallows spacing inside of braces
* `"always"` requires spacing inside of braces (except `{}`)

Object option:

* `"arraysInObjects": true` requires spacing inside of braces of objects beginning and/or ending with an array element (applies when the first option is set to `never`)
* `"arraysInObjects": false` disallows spacing inside of braces of objects beginning and/or ending with an array element (applies when the first option is set to `always`)
* `"objectsInObjects": true` requires spacing inside of braces of objects beginning and/or ending with an object element (applies when the first option is set to `never`)
* `"objectsInObjects": false` disallows spacing inside of braces of objects beginning and/or ending with an object element (applies when the first option is set to `always`)

### never

Examples of **incorrect** code for this rule with the default `"never"` option:

::: incorrect

```js
/*eslint object-curly-spacing: ["error", "never"]*/

var obj = { 'foo': 'bar' };
var obj = {'foo': 'bar' };
var obj = { baz: {'foo': 'qux'}, bar};
var obj = {baz: { 'foo': 'qux'}, bar};
var {x } = y;
import { foo } from 'bar';
```

:::

Examples of **correct** code for this rule with the default `"never"` option:

::: correct

```js
/*eslint object-curly-spacing: ["error", "never"]*/

var obj = {'foo': 'bar'};
var obj = {'foo': {'bar': 'baz'}, 'qux': 'quxx'};
var obj = {
  'foo': 'bar'
};
var obj = {'foo': 'bar'
};
var obj = {
  'foo':'bar'};
var obj = {};
var {x} = y;
import {foo} from 'bar';
```

:::

### always

Examples of **incorrect** code for this rule with the `"always"` option:

::: incorrect

```js
/*eslint object-curly-spacing: ["error", "always"]*/

var obj = {'foo': 'bar'};
var obj = {'foo': 'bar' };
var obj = { baz: {'foo': 'qux'}, bar};
var obj = {baz: { 'foo': 'qux' }, bar};
var obj = {'foo': 'bar'
};
var obj = {
  'foo':'bar'};
var {x} = y;
import {foo } from 'bar';
```

:::

Examples of **correct** code for this rule with the `"always"` option:

::: correct

```js
/*eslint object-curly-spacing: ["error", "always"]*/

var obj = {};
var obj = { 'foo': 'bar' };
var obj = { 'foo': { 'bar': 'baz' }, 'qux': 'quxx' };
var obj = {
  'foo': 'bar'
};
var { x } = y;
import { foo } from 'bar';
```

:::

#### arraysInObjects

Examples of additional **correct** code for this rule with the `"never", { "arraysInObjects": true }` options:

::: correct

```js
/*eslint object-curly-spacing: ["error", "never", { "arraysInObjects": true }]*/

var obj = {"foo": [ 1, 2 ] };
var obj = {"foo": [ "baz", "bar" ] };
```

:::

Examples of additional **correct** code for this rule with the `"always", { "arraysInObjects": false }` options:

::: correct

```js
/*eslint object-curly-spacing: ["error", "always", { "arraysInObjects": false }]*/

var obj = { "foo": [ 1, 2 ]};
var obj = { "foo": [ "baz", "bar" ]};
```

:::

#### objectsInObjects

Examples of additional **correct** code for this rule with the `"never", { "objectsInObjects": true }` options:

::: correct

```js
/*eslint object-curly-spacing: ["error", "never", { "objectsInObjects": true }]*/

var obj = {"foo": {"baz": 1, "bar": 2} };
```

:::

Examples of additional **correct** code for this rule with the `"always", { "objectsInObjects": false }` options:

::: correct

```js
/*eslint object-curly-spacing: ["error", "always", { "objectsInObjects": false }]*/

var obj = { "foo": { "baz": 1, "bar": 2 }};
```

:::

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing between curly braces.
