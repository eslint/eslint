# Disallow Spaces Before Semicolon

A common coding mistake, is placing unnecessary spaces before semicolons in expressions. This rule prevents the use of spaces before a semicolon in expressions.

## Rule Details

The following patterns are considered warnings:

```js
var foo = "bar" ;

var foo = function() {} ;

var foo = function() {
} ;

var foo = 1 + 2 ;
```

The following patterns are not warnings:

```js
;(function(){}());

var foo = "bar";
```

