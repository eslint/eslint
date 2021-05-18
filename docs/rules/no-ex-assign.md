# disallow reassigning exceptions in `catch` clauses (no-ex-assign)

If a `catch` clause in a `try` statement accidentally (or purposely) assigns another value to the exception parameter, it impossible to refer to the error from that point on.
Since there is no `arguments` object to offer alternative access to this data, assignment of the parameter is absolutely destructive.

## Rule Details

This rule disallows reassigning exceptions in `catch` clauses.

Examples of **incorrect** code for this rule:

```js
/*eslint no-ex-assign: "error"*/

try {
    // code
} catch (e) {
    e = 10;
}
```

Examples of **correct** code for this rule:

```js
/*eslint no-ex-assign: "error"*/

try {
    // code
} catch (e) {
    var foo = 10;
}
```

## Further Reading

* [The "catch" with try...catch](https://bocoup.com/blog/the-catch-with-try-catch) by Ben Alman explains how the exception identifier can leak into the outer scope in IE 6-8
