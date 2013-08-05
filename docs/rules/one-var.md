# one var

JavaScript has function scope, not block scope and all variable declarations are hoisted to the top of the function. Therefore, some people believe that all variables in a function scope should be declared in a single variable declaration at the top of the function and not in multiple declarations throughout the function.

```js
function foo() {
    var bar;
    var baz;
}
```

## Rule Details

This rule is aimed at preventing a possible misunderstanding about scoping of variables and to enforce a single variable declaration convention. As such, it will warn when it encounters more than one variable declaration statement in a function scope.

The following patterns are considered warnings:

```js
function foo() {
    var bar;
    var baz;
}

function foo() {
    var bar;

    if (baz) {
        var qux = true;
    }
}
```

The following patterns are not considered warnings:

```js
function foo() {
    var bar,
        baz;
}

function foo() {
    var bar,
        qux;

    if (baz) {
        qux = true;
    }
}
```

## Further Reading

[JSLint Errors - Combine this with the previous 'var' statement](http://jslinterrors.com/combine-this-with-the-previous-var-statement/)
