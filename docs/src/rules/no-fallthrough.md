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

That works fine when you don't want a fallthrough, but when the fallthrough is intentional, there is no way to indicate that in the language. It's considered a best practice to always indicate when a fallthrough is intentional using a comment which matches the `/falls?\s?through/i` regular expression but isn't a directive:

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

In this example, there is no confusion as to the expected behavior. It is clear that the first case is meant to fallthrough to the second case.

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

Note that the last `case` statement in these examples does not cause a warning because there is nothing to fallthrough into. (However, there is an option to change this behavior; see below.)

## Options

This rule has an object option:

* Set the `commentPattern` option to a regular expression string to change the test for intentional fallthrough comment. If the fallthrough comment matches a directive, that takes precedence over `commentPattern`.

* Set the `allowEmptyCase` option to `true` to allow empty cases regardless of the layout. By default, this rule does not require a fallthrough comment after an empty `case` only if the empty `case` and the next `case` are on the same line or on consecutive lines.

* Set the `checkFinalCase` option to `true` to disallow fallthrough for the final case in the switch statement. By default, this rule does not bother checking the final case statement, because there is nothing that it could ever fallthrough to. With that said, it can still be desirable to enforce a `break` statement for the final case. Doing this makes switch arms look more consistent, makes switch arms more resilient to reoganization, and reduces Git noise when a new switch case is added at the bottom. (This is similar to the benefits provided by trailing commas.)

    * Note that this option will still apply even if the final case is a `default` case, and this is intentional. Assuming that `default` cases are always at the bottom of a switch statement (using the [`default-case-last`](default-case-last) rule), `default` cases are distinct from other case statements in that they would not ever need to be reorganized or have something added underneath. So, the reasons for wanting a `break` statement in a `default` case are less intuitive. First, having "empty" `default` cases are sometimes required in order to satisfy the [`default-case`](default-case) rule or the [`@typescript-eslint/switch-exhaustiveness-check`](https://typescript-eslint.io/rules/switch-exhaustiveness-check/) rule. In these cases, a `break` statement is useful to order to avoid triggering the [`no-empty`](no-empty) rule and to avoid the appearance of the arm being unfinished. Thus, since `break` statements might be desired for otherwise-empty `default` cases, it can make sense to enforce them in every `default` case across a codebase for consistency.

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

switch(foo) {
    case 1:

    case 2: doSomething();
}

switch(foo) {
    case 1:
    /*
    Put a message here 
    */
    case 2: doSomething();
}

```

:::

### checkFinalCase

Examples of **correct** code for the `{ "checkFinalCase": true }` option:

::: correct

```js
/* eslint no-fallthrough: ["error", { "checkFinalCase": true }] */

switch(foo) {
    case 1: {
        doSomething1();
        break;
    }

    case 2: {
        doSomething2();
        break;
    }
}

switch(foo) {
    case 1: {
        doSomething1();
        break;
    }

    case 2: {
        doSomething2();
        break;
    }

    default: {
        break;
    }
}

```

:::

## When Not To Use It

If you don't want to enforce that each `case` statement should end with a `throw`, `return`, `break`, or comment, then you can safely turn this rule off.
