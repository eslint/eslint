# Disallow Empty Block Statements (no-empty)

Empty block statements usually occur due to refactoring that wasn't completed, such as:

```js
if (foo) {
}
```

Empty block statements such as this are usually an indicator of an error, or at the very least, an indicator that some refactoring is likely needed.

## Rule Details

This rule is aimed at eliminating empty block statements. While not technically an error, empty block statements can be a source of confusion when reading code.
A block will not be considered a warning if it contains a comment line.

The following patterns are considered problems:

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

The following patterns are not considered problems:

```js
/*eslint no-empty: 2*/

if (foo) {
    // empty
}

while (foo) {
    // test
}

try {
    doSomething();
} catch (ex) {
    // Do nothing
}

try {
    doSomething();
} finally {
    // Do nothing
}
```

Since you must always have at least a `catch` or a `finally` block for any `try`, it is common to have empty block statements when execution should continue regardless of error.

## When Not To Use It

If you intentionally use empty block statements then you can disable this rule.

## Related Rules

* [no-empty-function](./no-empty-function.md)
