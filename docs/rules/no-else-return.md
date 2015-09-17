# Disallow return in else (no-else-return)

If an `if` block contains a `return` statement, the `else` block becomes unnecessary. Its contents can be placed outside of the block.

```js
function foo() {
    if (x) {
        return y;
    } else {
        return z;
    }
}
```

## Rule Details

This rule is aimed at highlighting an unnecessary block of code following an `if` containing a return statement. As such, it will warn when it encounters an `else` following a chain of `if`s, all of them containing a `return` statement.

The following patterns are considered problems:

```js
/*eslint no-else-return: 2*/

function foo() {
    if (x) {
        return y;
    } else {            /*error Unexpected 'else' after 'return'.*/
        return z;
    }
}

function foo() {
    if (x) {
        return y;
    } else if (z) {
        return w;
    } else {            /*error Unexpected 'else' after 'return'.*/
        return t;
    }
}

function foo() {
    if (x) {
        return y;
    } else {            /*error Unexpected 'else' after 'return'.*/
        var t = "foo";
    }

    return t;
}

// Two warnings for nested occurrences
function foo() {
    if (x) {
        if (y) {
            return y;
        } else {        /*error Unexpected 'else' after 'return'.*/
            return x;
        }
    } else {            /*error Unexpected 'else' after 'return'.*/
        return z;
    }
}
```

The follow patterns are not considered problems:

```js
/*eslint no-else-return: 2*/

function foo() {
    if (x) {
        return y;
    }

    return z;
}

function foo() {
    if (x) {
        return y;
    } else if (z) {
        var t = "foo";
    } else {
        return w;
    }
}

function foo() {
    if (x) {
        if (z) {
            return y;
        }
    } else {
        return z;
    }
}
```
