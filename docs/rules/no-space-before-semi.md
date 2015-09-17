# Disallow Spaces Before Semicolon (no-space-before-semi)

**Replacement notice**: This rule was removed in ESLint v1.0 and replaced by the [semi-spacing](semi-spacing.md) rule.

JavaScript allows for placing unnecessary spaces between an expression and the closing semicolon.

Space issues can also cause code to look inconsistent and harder to read.

```js
var thing = function () {
  var test = 12 ;
}  ;
```

## Rule Details

This rule prevents the use of spaces before a semicolon in expressions.

The following patterns are considered problems:

```js
var foo = "bar" ;

var foo = function() {} ;

var foo = function() {
} ;

var foo = 1 + 2 ;
```

The following patterns are not considered problems:

```js
;(function(){}());

var foo = "bar";
```

## Related Rules

* [semi](semi.md)
* [no-extra-semi](no-extra-semi.md)
