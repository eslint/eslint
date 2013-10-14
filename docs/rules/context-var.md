# context var

The `context-var` rule allows you to throw warnings when variables are used outside of their context binding. This emulates C-style block scope.

```js
function doSomething() {
    if (true) {
        var build = true;
    }

    console.log(build);
}
```

## Rule Details

This rule aims to reduce the usage of variables outside of their binding context and emulate traditional block scope from other languages. This is to help newcomers to the language avoid difficult bugs with variable hoisting.

The following patterns are considered warnings:

```js
function doSomething() {
    if (true) {
        var build = true;
    }

    console.log(build);
}
```

```js
function doAnother() {
    try {
        var build = 1;
    } catch (e) {
        var f = build;
    }
}
```

The following patterns are not warnings:

```js
function doSomething() {
    var build;

    if (true) {
        build = true;
    }

    console.log(build);
}
```

