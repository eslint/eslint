# Enforce Callback Error Handling (handle-callback-err)

In node, a common pattern for dealing with asynchronous behavior is called the callback pattern.
This pattern expects an `Error` object or `null` as the first argument of the callback.
Forgetting to handle these errors can lead to some really strange behavior in your application.

```js
function loadData (err, data) {
    doSomething(); // forgot to handle error
}
```

## Rule Details

This rule expects that when you're using the callback pattern in node you'll handle the error and
requires that you specify the name of your error object. The name of the argument will default to `err`.

The following are considered problems:

```js
/*eslint handle-callback-err: 2*/

function loadData (err, data) { /*error Expected error to be handled.*/
    doSomething();
}

```

The following are not considered problems:

```js
/*eslint handle-callback-err: 2*/

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

You can also customize the name of the error object:

```js
/*eslint handle-callback-err: [2, "error"]*/

function loadData (error, data) {
    if (error) {
       console.log(error.stack);
    }
}
```

### Advanced configuration

Sometimes (especially in big projects) the name of the error variable is not consistent across the project,
so you need a more flexible configuration to ensure all unhandled error getting recognized by this rule.

If the configured name of the error variable begins with a `^` it is considered to be a regexp pattern.

Examples for valid configurations:

1. Rule configured to warn if an unhandled error is detected where the name of the error variable can be `err`, `error` or `anySpecificError`.

    ```json
    // ...
    "handle-callback-err": [2, "^(err|error|anySpecificError)$" ]
    // ...
    ```

2. Rule configured to warn if an unhandled error is detected where the name of the error variable ends with `Error` (e. g. `connectionError` or `validationError` will match).

    ```json
    // ...
    "handle-callback-err": [2, "^.+Error$" ]
    // ...
    ```

3. Rule configured to warn if an unhandled error is detected where the name of the error variable matches any string that contains `err` or `Err` (e. g. `err`, `error`, `anyError`, `some_err` will match).

    ```json
    // ...
    "handle-callback-err": [2, "^.*(e|E)rr" ]
    // ...
    ```

## When Not To Use This Rule

There are cases where it may be safe for your application to ignore errors, however only ignore errors if you are
confident that some other form of monitoring will help you catch the problem.

## Further Reading

* [The Art Of Node: Callbacks](https://github.com/maxogden/art-of-node#callbacks)
* [Nodejitsu: What are the error conventions?](http://docs.nodejitsu.com/articles/errors/what-are-the-error-conventions)
