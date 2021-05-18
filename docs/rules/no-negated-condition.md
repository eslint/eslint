# disallow negated conditions (no-negated-condition)

Negated conditions are more difficult to understand. Code can be made more readable by inverting the condition instead.

## Rule Details

This rule disallows negated conditions in either of the following:

* `if` statements which have an `else` branch
* ternary expressions

Examples of **incorrect** code for this rule:

```js
/*eslint no-negated-condition: "error"*/

if (!a) {
    doSomething();
} else {
    doSomethingElse();
}

if (a != b) {
    doSomething();
} else {
    doSomethingElse();
}

if (a !== b) {
    doSomething();
} else {
    doSomethingElse();
}

!a ? c : b
```

Examples of **correct** code for this rule:

```js
/*eslint no-negated-condition: "error"*/

if (!a) {
    doSomething();
}

if (!a) {
    doSomething();
} else if (b) {
    doSomething();
}

if (a != b) {
    doSomething();
}

a ? b : c
```
