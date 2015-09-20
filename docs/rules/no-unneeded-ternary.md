# Disallow conditional expressions that can be expressed with simpler constructs (no-unneeded-ternary)

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
var isYes = answer !== 1;
```

This rule disallows the use of 'Boolean' literals inside conditional expressions.

Another common mistake is using a single variable as both the conditional test and the consequent. In such cases, the logical `OR` can be used to provide the same functionality.
Here is an example:

```js
// Bad
var foo = bar ? bar : 1;

// Good
var foo = bar || 1;
```

This rule disallows the conditional expression as a default assignment pattern when the `defaultAssignment` option is set to `false`.

## Rule Details

This rule enforces a coding style where it disallows conditional expressions that can be implemented using simpler language constructs. Specifically, this rule disallows the use of Boolean literals inside conditional expressions, and conditional expressions where a single variable is used as both the test and consequent. This rule's default options are `{"defaultAssignment": true }`.

The following patterns are considered problems:

```js
/*eslint no-unneeded-ternary: 2*/

var a = x === 2 ? true : false; /*error Unnecessary use of boolean literals in conditional expression*/

var a = x ? true : false;       /*error Unnecessary use of boolean literals in conditional expression*/
```

The following pattern is considered a warning when `defaultAssignment` is `false`:

```js
var a = x ? x : 1;
```

The following patterns are not considered problems:

```js
/*eslint no-unneeded-ternary: 2*/

var a = x === 2 ? "Yes" : "No";

var a = x !== false;

var a = x ? "Yes" : "No";

var a = x ? y : x;
```

The following pattern is not considered a warning when `defaultAssignment` is `true`:

```js
var a = x ? x : 1;
```

## Related Rules

* [no-ternary](no-ternary.md)
* [no-nested-ternary](no-nested-ternary.md)

## When Not To Use It

You can turn this rule off if you are not concerned with unnecessary complexity in conditional expressions.
