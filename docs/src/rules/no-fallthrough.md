---
title: no-fallthrough
rule_type: problem
related_rules:
- default-case
---



The `switch` statement in JavaScript is one of the more error-prone constructs of the language thanks in part to the ability to "fall through" from one `case` to the next. For example:

```js
switch(foo) {
    case 1:
        doSomething();

    case 2:
        doSomethingElse();
}
```

In this example, if `foo` is `1`, then execution will flow through both cases, as the first falls through to the second. You can prevent this by using `break`, as in this example:

```js
switch(foo) {
    case 1:
        doSomething();
        break;

    case 2:
        doSomethingElse();
}
```

That works fine when you don't want a fallthrough, but what if the fallthrough is intentional, there is no way to indicate that in the language. It's considered a best practice to always indicate when a fallthrough is intentional using a comment which matches the `/falls?\s?through/i` regular expression but isn't a directive:

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

switch(foo) {
    case 1: {
        doSomething();
        // falls through
    }

    case 2: {
        doSomethingElse();
    }
}
```

In this example, there is no confusion as to the expected behavior. It is clear that the first case is meant to fall through to the second case.

## Rule Details

This rule is aimed at eliminating unintentional fallthrough of one case to the other. As such, it flags any fallthrough scenarios that are not marked by a comment.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-fallthrough: "error"*/

switch(foo) {
    case 1:
        doSomething();

    case 2:
        doSomething();
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-fallthrough: "error"*/

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
    case 1: case 2:
        doSomething();
}

switch(foo) {
    case 1:
        doSomething();
        // falls through

    case 2:
        doSomething();
}

switch(foo) {
    case 1: {
        doSomething();
        // falls through
    }

    case 2: {
        doSomethingElse();
    }
}
```

:::

Note that the last `case` statement in these examples does not cause a warning because there is nothing to fall through into.

## Options

This rule has an object option:

* Set the `commentPattern` option to a regular expression string to change the test for intentional fallthrough comment. If the fallthrough comment matches a directive, that takes precedence over `commentPattern`.

* Set the `allowEmptyCase` option to `true` to allow empty cases regardless of the layout. By default, this rule does not require a fallthrough comment after an empty `case` only if the empty `case` and the next `case` are on the same line or on consecutive lines.

* Set the `reportUnusedFallthroughComment` option to `true` to prohibit a fallthrough comment from being present if the case cannot fallthrough due to being unreachable. This is mostly intended to help avoid misleading comments occurring as a result of refactoring.

### commentPattern

Examples of **correct** code for the `{ "commentPattern": "break[\\s\\w]*omitted" }` option:

::: correct

```js
/*eslint no-fallthrough: ["error", { "commentPattern": "break[\\s\\w]*omitted" }]*/

switch(foo) {
    case 1:
        doSomething();
        // break omitted

    case 2:
        doSomething();
}

switch(foo) {
    case 1:
        doSomething();
        // caution: break is omitted intentionally

    default:
        doSomething();
}
```

:::

### allowEmptyCase

Examples of **correct** code for the `{ "allowEmptyCase": true }` option:

::: correct

```js
/* eslint no-fallthrough: ["error", { "allowEmptyCase": true }] */

switch(foo){
    case 1:

    case 2: doSomething();
}

switch(foo){
    case 1:
    /*
    Put a message here 
    */
    case 2: doSomething();
}

```

:::

### reportUnusedFallthroughComment

Examples of **incorrect** code for the `{ "reportUnusedFallthroughComment": true }` option:

::: incorrect

```js
/* eslint no-fallthrough: ["error", { "reportUnusedFallthroughComment": true }] */

switch(foo){
    case 1:
        doSomething();
        break;
    // falls through
    case 2: doSomething();
}

function f() {
    switch(foo){
        case 1:
            if (a) {
                throw new Error();
            } else if (b) {
                break;
            } else {
                return;
            }
        // falls through
        case 2:
            break;
    }
}
```

:::

Examples of **correct** code for the `{ "reportUnusedFallthroughComment": true }` option:

::: correct

```js
/* eslint no-fallthrough: ["error", { "reportUnusedFallthroughComment": true }] */

switch(foo){
    case 1:
        doSomething();
        break;
    // just a comment
    case 2: doSomething();
}
```

:::

## When Not To Use It

If you don't want to enforce that each `case` statement should end with a `throw`, `return`, `break`, or comment, then you can safely turn this rule off.
