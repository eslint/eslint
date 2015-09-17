# Require Consistent Returns (consistent-return)

One of the confusing aspects of JavaScript is that any function may or may not return a value at any point in time. When a function exits without any `return` statement executing, the function returns `undefined`. Similarly, calling `return` without specifying any value will cause the function to return `undefined`. Only when `return` is called with a value is there a change in the function's return value.

Unlike statically-typed languages that will catch when a function doesn't return the type of data expected, JavaScript has no such checks, meaning that it's easy to make mistakes such as this:

```js
function doSomething(condition) {

    if (condition) {
        return true;
    } else {
        return;
    }
}
```

Here, one branch of the function returns `true`, a Boolean value, while the other exits without specifying any value (and so returns `undefined`). This may be an indicator of a coding error, especially if this pattern is found in larger functions.

## Rule Details

This rule is aimed at ensuring all `return` statements either specify a value or don't specify a value.

The following patterns are considered problems:

```js
/*eslint consistent-return: 2*/

function doSomething(condition) {

    if (condition) {
        return true;
    } else {
        return;      /*error Expected a return value.*/
    }
}

function doSomething(condition) {

    if (condition) {
        return;
    } else {
        return true; /*error Expected no return value.*/
    }
}
```

The following patterns are not considered problems:

```js
/*eslint consistent-return: 2*/

function doSomething(condition) {

    if (condition) {
        return true;
    } else {
        return false;
    }
}
```

## When Not To Use It

If you want to allow functions to have different `return` behavior depending on code branching, then it is safe to disable this rule.
