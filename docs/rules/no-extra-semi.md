# Disallow Extra Semicolons (no-extra-semi)

(fixable) The `--fix` option on the [command line](../user-guide/command-line-interface#fix) automatically fixes problems reported by this rule.

JavaScript will more or less let you put semicolons after any statement without complaining. Typos and misunderstandings about where semicolons are required can lead to extra semicolons that are unnecessary.

## Rule Details

This rule is aimed at eliminating extra unnecessary semicolons. While not technically an error, extra semicolons can be a source of confusion when reading code.

Examples of **incorrect** code for this rule:

```js
/*eslint no-extra-semi: "error"*/

var x = 5;;

function foo() {
    // code
};

```

Examples of **correct** code for this rule:

```js
/*eslint no-extra-semi: "error"*/

var x = 5;

var foo = function() {
    // code
};

```

## When Not To Use It

If you intentionally use extra semicolons then you can disable this rule.

## Related Rules

* [semi](semi.md)
* [semi-spacing](semi-spacing.md)
