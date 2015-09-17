# Disallow Extra Semicolons (no-extra-semi)

JavaScript will more or less let you put semicolons after any statement without complaining. Typos and misunderstandings about where semicolons are required can lead to extra semicolons that are unnecessary.

**Fixable:** This rule is automatically fixable using the `--fix` flag on the command line.

## Rule Details

This rule is aimed at eliminating extra unnecessary semicolons. While not technically an error, extra semicolons can be a source of confusion when reading code.

The following patterns are considered problems:

```js
/*eslint no-extra-semi: 2*/

var x = 5;;      /*error Unnecessary semicolon.*/

function foo() {
    // code
};               /*error Unnecessary semicolon.*/

```

The following patterns are not considered problems:

```js
/*eslint no-extra-semi: 2*/

var x = 5;

var foo = function() {
    // code
};

```

## When Not To Use It

If you intentionally use extra semicolons then you can disable this rule.

## Related Rules

* [semi](semi.md)
* [no-space-before-semi](no-space-before-semi.md)
