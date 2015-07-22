# Disallow `if` as the Only Statement in an `else` Block (no-lonely-if)

If an `if` statement is the only statement in the `else` block of a parent `if` statement, it is often clearer to combine the two to using `else if` form.

```js
if (...) {
    ...
} else {
    if (...) {
        ...
    }
}
```

should be rewritten as

```js
if (...) {
    ...
} else if (...) {
    ...
}
```

## Rule Details

This rule warns when an `if` statement's `else` block contains only another `if` statement.

The following patterns are considered warnings:

```js
if (condition) {
    // ...
} else {
    if (anotherCondition) {
        // ...
    }
}
```

The following patterns are not considered warnings:

```js
if (condition) {
    // ...
} else if (anotherCondition) {
    // ...
}

if (condition) {
    // ...
} else {
    if (anotherCondition) {
        // ...
    }
    doSomething();
}
```

## When Not To Use It

Disable this rule if the code is clearer without requiring the `else if` form.
