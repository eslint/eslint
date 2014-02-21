# Ensures Callback Error Handling

In node, a common pattern for dealing with asynchronous behavior is called the callback pattern.
This pattern expects as the first argument of the callback an `Error` object, which may be `null`.
Forgetting to handle these errors can lead to some really strange behavior in your application.

```js
function loadData (err, data) {
    doSomething(); // forgot to handle error
}
```

## Rule Details

This rule expects that when you're using the callback pattern in node you'll handle the error and
requires that you specify the name of your error object. The name of the argument will default to `err`.

**The following are considered warnings:**

```js
function loadData (err, data) {
    doSomething(); // forgot to handle error
}

```

**The following are not considered warnings:**

```js
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

**You can also customize the name of the error object:**

```js
// missing-err: [2, "error"]
function loadData (error, data) {
    if (error) {
       console.log(error.stack);
    }
}
```

## When Not To Use This Rule

There are cases where it may be safe for your application to ignore errors, however only ignore errors if you are
confident that some other form of monitoring will help you catch the problem.

## Further Reading

- [The Art Of Node: Callbacks](https://github.com/maxogden/art-of-node#callbacks)
- [Nodejitsu: What are the error conventions?](http://docs.nodejitsu.com/articles/errors/what-are-the-error-conventions)
- [Node Tuts: The Callback Pattern](http://nodetuts.com/02-callback-pattern.html)