# no-space-before-semi: disallow spaces before semicolons

(removed) This rule was **removed** in ESLint v1.0 and **replaced** by the [semi-spacing](semi-spacing.md) rule.

JavaScript allows for placing unnecessary spaces between an expression and the closing semicolon.

Space issues can also cause code to look inconsistent and harder to read.

```js
var thing = function () {
  var test = 12 ;
}  ;
```

## Rule Details

This rule prevents the use of spaces before a semicolon in expressions.

Examples of **incorrect** code for this rule:

```js
var foo = "bar" ;

var foo = function() {} ;

var foo = function() {
} ;

var foo = 1 + 2 ;
```

Examples of **correct** code for this rule:

```js
;(function(){}());

var foo = "bar";
```

## Related Rules

* [semi](semi.md)
* [no-extra-semi](no-extra-semi.md)
