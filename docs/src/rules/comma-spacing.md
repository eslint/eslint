---
title: comma-spacing
rule_type: layout
related_rules:
- array-bracket-spacing
- comma-style
- object-curly-spacing
- space-in-brackets
- space-in-parens
- space-infix-ops
- space-after-keywords
- space-unary-ops
- space-return-throw-case
further_reading:
- https://www.crockford.com/code.html
- https://dojotoolkit.org/reference-guide/1.9/developer/styleguide.html
---



Spacing around commas improves readability of a list of items. Although most of the style guidelines for languages prescribe adding a space after a comma and not before it, it is subjective to the preferences of a project.

```js
var foo = 1, bar = 2;
var foo = 1 ,bar = 2;
```

## Rule Details

This rule enforces consistent spacing before and after commas in variable declarations, array literals, object literals, function parameters, and sequences.

This rule does not apply in either of the following cases:

* between two commas
* between opening bracket `[` and comma, to avoid conflicts with the [`array-bracket-spacing`](array-bracket-spacing) rule
* between comma and closing bracket `]`, to avoid conflicts with the [`array-bracket-spacing`](array-bracket-spacing) rule
* between comma and closing brace `}`, to avoid conflicts with the [`object-curly-spacing`](object-curly-spacing) rule
* between comma and closing parentheses `)`, to avoid conflicts with the [`space-in-parens`](space-in-parens) rule

## Options

This rule has an object option:

* `"before": false` (default) disallows spaces before commas
* `"before": true` requires one or more spaces before commas
* `"after": true` (default) requires one or more spaces after commas
* `"after": false` disallows spaces after commas

### after

Examples of **incorrect** code for this rule with the default `{ "before": false, "after": true }` options:

:::incorrect

```js
/*eslint comma-spacing: ["error", { "before": false, "after": true }]*/

var foo = 1 ,bar = 2;
var arr = [1 , 2];
var obj = {"foo": "bar" ,"baz": "qur"};
foo(a ,b);
new Foo(a ,b);
function baz(a ,b){}
a ,b
```

:::

Examples of **correct** code for this rule with the default `{ "before": false, "after": true }` options:

:::correct

```js
/*eslint comma-spacing: ["error", { "before": false, "after": true }]*/

var foo = 1, bar = 2
    , baz = 3;
var arr = [1, 2];
var arr = [1,, 3]
var obj = {"foo": "bar", "baz": "qur"};
foo(a, b);
new Foo(a, b);
function qur(a, b){}
a, b
```

:::

Additional examples of **correct** code for this rule with the default `{ "before": false, "after": true }` options:

:::correct

```js
/*eslint comma-spacing: ["error", { "before": false, "after": true }]*/

// this rule does not enforce spacing between two commas
var arr = [
    ,,
    , ,
];

// this rule does not enforce spacing after `[` and before `]`
var arr = [,];
var arr = [ , ];
var arr = [a, b,];
[,] = arr;
[ , ] = arr;
[a, b,] = arr;

// this rule does not enforce spacing before `}`
var obj = {x, y,};
var {z, q,} = obj;
import {foo, bar,} from "mod";

// this rule does not enforce spacing before `)`
foo(a, b,)
```

:::

### before

Examples of **incorrect** code for this rule with the `{ "before": true, "after": false }` options:

:::incorrect

```js
/*eslint comma-spacing: ["error", { "before": true, "after": false }]*/

var foo = 1, bar = 2;
var arr = [1 , 2];
var obj = {"foo": "bar", "baz": "qur"};
new Foo(a,b);
function baz(a,b){}
a, b
```

:::

Examples of **correct** code for this rule with the `{ "before": true, "after": false }` options:

:::correct

```js
/*eslint comma-spacing: ["error", { "before": true, "after": false }]*/

var foo = 1 ,bar = 2 ,
    baz = true;
var arr = [1 ,2];
var arr = [1 ,,3]
var obj = {"foo": "bar" ,"baz": "qur"};
foo(a ,b);
new Foo(a ,b);
function qur(a ,b){}
a ,b
```

:::

## When Not To Use It

If your project will not be following a consistent comma-spacing pattern, turn this rule off.
