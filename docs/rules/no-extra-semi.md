# disallow unnecessary semicolons (no-extra-semi)

Typing mistakes and misunderstandings about where semicolons are required can lead to semicolons that are unnecessary. While not technically an error, extra semicolons can cause confusion when reading code.

## Rule Details

This rule disallows unnecessary semicolons.

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
