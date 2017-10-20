# Enforce Callback Error Handling (handle-callback-err)

In Node.js, a common pattern for dealing with asynchronous behavior is called the callback pattern.
This pattern expects an `Error` object or `null` as the first argument of the callback.
Forgetting to handle these errors can lead to some really strange behavior in your application.

```js
function loadData (err, data) {
    doSomething(); // forgot to handle error
}
```

## Rule Details

This rule expects that when you're using the callback pattern in Node.js you'll handle the error.

## Options

The rule takes a single string option: the name of the error parameter. The default is `"err"`.

Examples of **incorrect** code for this rule with the default `"err"` parameter name:

```js
/*eslint handle-callback-err: "error"*/

function loadData (err, data) {
    doSomething();
}

```

Examples of **correct** code for this rule with the default `"err"` parameter name:

```js
/*eslint handle-callback-err: "error"*/

function loadData (err, data) {
    if (err) {
        console.log(err.stack);
    }
    doSomething();
}

function generateError (err) {
    if (err) {}
}
```

Examples of **correct** code for this rule with a sample `"error"` parameter name:

```js
/*eslint handle-callback-err: ["error", "error"]*/

function loadData (error, data) {
    if (error) {
       console.log(error.stack);
    }
    doSomething();
}
```

### regular expression

Sometimes (especially in big projects) the name of the error variable is not consistent across the project,
so you need a more flexible configuration to ensure that the rule reports all unhandled errors.

If the configured name of the error variable begins with a `^` it is considered to be a regexp pattern.

* If the option is `"^(err|error|anySpecificError)$"`, the rule reports unhandled errors where the parameter name can be `err`, `error` or `anySpecificError`.
* If the option is `"^.+Error$"`, the rule reports unhandled errors where the parameter name ends with `Error` (for example, `connectionError` or `validationError` will match).
* If the option is `"^.*(e|E)rr"`, the rule reports unhandled errors where the parameter name matches any string that contains `err` or `Err` (for example, `err`, `error`, `anyError`, `some_err` will match).

## When Not To Use It

There are cases where it may be safe for your application to ignore errors, however only ignore errors if you are
confident that some other form of monitoring will help you catch the problem.

## Further Reading

* [The Art Of Node: Callbacks](https://github.com/maxogden/art-of-node#callbacks)
* [Nodejitsu: What are the error conventions?](https://docs.nodejitsu.com/articles/errors/what-are-the-error-conventions/)
