# No Extra Semicolons

JavaScript will more or less let you put semicolons after any statement without complaining. Typos and misunderstandings about where semicolons are required can lead to extra semicolons that are unnecessary.


## Rule Details

This rule is aimed at eliminating extra unnecessary semicolons. While not technically an error, extra semicolons can be a source of confusion when reading code.

The following patterns are considered warnings:

```js
var x = 5;;

function foo() {
    // code
};

```

The following patterns are not considered warnings:

```js
var x = 5;

var foo = function() {
    // code
};

## When Not To Use It

If you intentionally use extra semicolons then you can disable this rule.

