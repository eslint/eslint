# no var leak

Variables declared without the `var` keyword are implicity given global scope. A common mistake is to accidentally declare an implicit global variable or to override a variable in an outer scope by improperly declaring variables in multiple inline assignments.

```js
var x = y = "example";
```

## Rule Details

This rule is aimed at preventing unexpected behavior that could arise from leaking variables into outer scopes by improperly declaring variables in multiple inline assignments. As such, it will warn when it encounters an assignment expression as the initial value of a variable declaration.

The following patterns are considered warnings:

```js
var x = y = "example";

var x = y = z;
```

The following patterns are not considered warnings:

```js
x = y = z;

x = y = {
    key: "example"
};

var w = x >= y;
```
