# No unused variables

Variables that are only declared and not used anywhere in the code are unnecessary complicating code base.


## Rule Details

This error occurs when a variable is declared but never used

The following patterns are considered warnings:

```js
var x = 10;
```
```js
var x = 10; x = 5;
```

The following patterns are not considered warnings:

```js
var x = 10;
alert(x);
};
