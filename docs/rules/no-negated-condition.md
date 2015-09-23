# Disallow use of negated expressions in conditions (no-negated-condition)

Checks against the use of a negated expression in an if condition when the else branch is not empty or in a ternary operator. Negated conditions are more difficult to understand. Code can be made more readable by inverting the condition instead.

For example:

```js
if (!a) {
    doSomething();
}
else {
    doSomethingElse();
}
```

should instead be written as:

```js
if (a) {
    doSomethingElse();
}
else {
    doSomething();
}
```

## Rule Details

The rule is aimed at preventing the use of a negated expression in a condition.

The following patterns are considered warnings:

```js
/*eslint no-negated-condition: 2*/

if (!a) {               /*error Unexpected negated condition.*/
    doSomething();
} else {
    doSomethingElse();
}

if (a != b) {           /*error Unexpected negated condition.*/
    doSomething();
} else {
    doSomethingElse();
}

if (a !== b) {          /*error Unexpected negated condition.*/
    doSomething();
} else {
    doSomethingElse();
}


!a ? b : c              /*error Unexpected negated condition.*/

```

The following patterns are not warnings:


```js
/*eslint no-negated-condition: 2*/

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
