# Disallow Case Statement Fallthrough (no-fallthrough)

The `switch` statement in JavaScript is one of the more error-prone constructs of the language thanks in part to the ability to "fall through" from one `case` to the next. For example:

```js
switch(foo) {
    case 1:
        doSomething();

    case 2:
        doSomethingElse();
}
```

In this example, if `foo` is `1`,then execution will flow through both cases, as the first falls through to the second. You can prevent this by using `break`, as in this example:

```js
switch(foo) {
    case 1:
        doSomething();
        break;

    case 2:
        doSomethingElse();
}
```

That works fine when you don't want a fallthrough, but what if the fallthrough is intentional, there is no way to indicate that in the language. It's considered a best practice to always indicate when a fallthrough is intentional using a comment:

```js
switch(foo) {
    case 1:
        doSomething();
        // falls through

    case 2:
        doSomethingElse();
}

switch(foo) {
    case 1:
        doSomething();
        // fall through

    case 2:
        doSomethingElse();
}

switch(foo) {
    case 1:
        doSomething();
        // fallsthrough

    case 2:
        doSomethingElse();
}
```

In this example, there is no confusion as to the expected behavior. It is clear that the first case is meant to fall through to the second case.

## Rule Details

This rule is aimed at eliminating unintentional fallthrough of one case to the other. As such, it flags and fallthrough scenarios that are not marked by a comment.

The following patterns are considered problems:

```js
/*eslint no-fallthrough: 2*/

switch(foo) {
    case 1:            /*error Expected a "break" statement before "case".*/
        doSomething();

    case 2:
        doSomething();
}
```

The following patterns are not considered problems:

```js
/*eslint no-fallthrough: 2*/

switch(foo) {
    case 1:
        doSomething();
        break;

    case 2:
        doSomething();
}

function bar(foo) {
    switch(foo) {
        case 1:
            doSomething();
            return;

        case 2:
            doSomething();
    }
}

switch(foo) {
    case 1:
        doSomething();
        throw new Error("Boo!");

    case 2:
        doSomething();
}

switch(foo) {
    case 1:
    case 2:
        doSomething();
}

switch(foo) {
    case 1:
        doSomething();
        // falls through

    case 2:
        doSomething();
}
```

Note that the last `case` statement in these examples does not cause a warning because there is nothing to fall through into.

## When Not To Use It

If you don't want to enforce that each `case` statement should end with a `throw`, `return`, `break`, or comment, then you can safely turn this rule off.

## Related Rules

* [default-case](default-case.md)
