# no shadow

## Rule Details

This error is raised to highlight a declaration of variable when the variable with the same name is already declared in the upper scope. Reusing variable names in the inner scope can lead to confusion and decrease readability of the code. When the inner scope variable is declared with the same name as the variable in the outer scope, it's also impossible to access outer variable.

The following patterns are considered warnings:

```js

var a = 3;
function b() {
    var a = 10;
}
```

The following patterns are considered okay and do not cause warnings:

```js
var a = 3;
function b(a) {
    a = 10;
}
b(a);
```

## Further Reading

* [Don't make functions within a loop](http://jslinterrors.com/dont-make-functions-within-a-loop/)
