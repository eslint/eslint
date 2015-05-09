# No try-catch-finally Statements (no-try-catch)

`try`, `catch` and `finally` can be a source of bugs in asynchronous code. An explanation of this problem can be found in the 'Background' section of [this article on error handling in NodeJS][error-handling-in-nodejs]. This rule bans the use of try-catch-finally.

## Rule Details

This rule is aimed at eliminating `try-catch-finally` statements.

The following patterns are considered warnings:

```js
try {
    // ...
} catch(e) {
    // ...
} finally {
    // ...
}
```

## When Not To Use It

If you are consuming code that may throws errors, such as `JSON.stringify` or `JSON.parse`, you may want to disable this rule. It is recommended to wrap such async unsafe code inside a file or module that attempts to safely handle thrown errors. An example of a library that safely handles thrown errors would be [raynos/safe-json-parse][safe-json-parse]

## Further Reading

* [Error Handling in Node.JS][error-handling-in-nodejs]

[safe-json-parse]: https://github.com/Raynos/safe-json-parse
[error-handling-in-nodejs]: https://www.joyent.com/developers/node/design/errors
