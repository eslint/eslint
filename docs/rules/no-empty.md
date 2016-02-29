# Disallow Empty Block Statements (no-empty)

Empty block statements, while not technically errors, usually occur due to refactoring that wasn't completed. They can cause confusion when reading code.

## Rule Details

This rule is aimed at eliminating empty block statements. A block will not be considered a warning if it contains a comment line.

Examples of **incorrect** code for this rule:

```js
/*eslint no-empty: 2*/

if (foo) {
}

while (foo) {
}

switch(foo) {
}

try {
    doSomething();
} catch(ex) {

} finally {

}
```

Examples of **correct** code for this rule:

```js
/*eslint no-empty: 2*/

if (foo) {
    // empty
}

while (foo) {
    /* empty */
}

try {
    doSomething();
} catch (ex) {
    // continue regardless of error
}

try {
    doSomething();
} finally {
    /* continue regardless of error */
}
```

Since you must always have at least a `catch` or a `finally` block for any `try`, it is common to have empty block statements when execution should continue regardless of error.

## When Not To Use It

If you intentionally use empty block statements then you can disable this rule.

## Related Rules

* [no-empty-function](./no-empty-function.md)
