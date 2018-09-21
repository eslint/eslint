# disallow ternary operators when simpler alternatives exist (no-unneeded-ternary)

It's a common mistake in JavaScript to use a conditional expression to select between two Boolean values instead of using ! to convert the test to a Boolean.
Here are some examples:

```js
// Bad
var isYes = answer === 1 ? true : false;

// Good
var isYes = answer === 1;


// Bad
var isNo = answer === 1 ? false : true;

// Good
var isNo = answer !== 1;
```

Another common mistake is using a single variable as both the conditional test and the consequent. In such cases, the logical `OR` can be used to provide the same functionality.
Here is an example:

```js
// Bad
foo(bar ? bar : 1);

// Good
foo(bar || 1);
```

## Rule Details

This rule disallow ternary operators when simpler alternatives exist.

Examples of **incorrect** code for this rule:

```js
/*eslint no-unneeded-ternary: "error"*/

var a = x === 2 ? true : false;

var a = x ? true : false;

var a = f(x ? x : 1);
```

Examples of **correct** code for this rule:

```js
/*eslint no-unneeded-ternary: "error"*/

var a = x === 2 ? "Yes" : "No";

var a = x !== false;

var a = x ? "Yes" : "No";

var a = x ? y : x;

var a = x ? x : 1;  // Note that this is only allowed as it on the right hand side of an assignment; this type of ternary is disallowed everywhere else. See defaultAssignment option below for more details.
```

## Options

This rule has an object option:

* `"defaultAssignment": true` (default) allows the conditional expression as a default assignment pattern
* `"defaultAssignment": false` disallows the conditional expression as a default assignment pattern

### defaultAssignment

The defaultAssignment option allows expressions of the form `x ? x : expr` (where `x` is any identifier and `expr` is any expression) as the right hand side of assignments (but nowhere else).

Examples of additional **incorrect** code for this rule with the `{ "defaultAssignment": false }` option:

```js
/*eslint no-unneeded-ternary: ["error", { "defaultAssignment": false }]*/

var a = x ? x : 1;
```

## When Not To Use It

You can turn this rule off if you are not concerned with unnecessary complexity in conditional expressions.

## Related Rules

* [no-ternary](no-ternary.md)
* [no-nested-ternary](no-nested-ternary.md)
