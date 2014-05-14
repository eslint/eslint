# Disallow Shadowing (no-shadow)

Shadowing is the process by which a local variable shares the same name as a variable in its containing scope. For example:

```js
var a = 3;
function b() {
    var a = 10;
}
```

In this case, the variable `a` inside of `b()` is shadowing the variable `a` in the global scope. This can cause confusion while reading the code and it's impossible to access the global variable.

## Rule Details

This rule aims to eliminate shadowed variable declarations.

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

* [Variable Shadowing](http://en.wikipedia.org/wiki/Variable_shadowing)
