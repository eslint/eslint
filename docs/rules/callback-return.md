# Enforce Return After Callback (callback-return)

The callback pattern is at the heart of most I/O and event-driven programming
 in JavaScript.

```js
function doSomething(err, callback) {
    if (err) {
        return callback(err);
    }
    callback();
}
```

To prevent calling the callback multiple times it is important to `return` anytime the callback is triggered outside
 of the main function body. Neglecting this technique often leads to issues where you do something more than once.
 For example, in the case of an HTTP request, you may try to send HTTP headers more than once leading node.js to `throw`
 a `Can't render headers after they are sent to the client.` error.

## Rule Details

This rule is aimed at ensuring that callbacks used outside of the main function block are always part-of or immediately
preceding a `return` statement. This rules decides what is a callback based on the name of the function being called.
By default the rule treats `cb`, `callback`, and `next` as callbacks.

The following patterns are considered problems:

```js
/*eslint callback-return: 2*/

function foo() {
    if (err) {
        callback(err); /*error Expected return with your callback function.*/
    }
    callback();
}
```

The following patterns are not considered problems:

```js
/*eslint callback-return: 2*/

function foo() {
    if (err) {
        return callback(err);
    }
    callback();
}
```

### Options

The rule takes a single option, which is an array of possible callback names.

```json
callback-return: [2, ["callback", "cb", "next"]]
```

### Gotchas

There are several cases of bad behavior that this rule will not catch and even a few cases where
the rule will warn even though you are handling your callbacks correctly. Most of these issues arise
in areas where it is difficult to understand the meaning of the code through static analysis.

#### Passing the Callback by Reference

Here is a case where we pass the callback to the `setTimeout` function. Our rule does not detect this pattern, but
it is likely a mistake.

```js
/*eslint callback-return: 2*/

function foo(callback) {
    if (err) {
        setTimeout(callback, 0); // this is bad, but WILL NOT warn
    }
    callback();
}
```

#### Triggering the Callback within a Nested Function

If you are calling the callback from within a nested function or an immediately invoked
function expression, we won't be able to detect that you're calling the callback and so
we won't warn.

```js
/*eslint callback-return: 2*/

function foo(callback) {
    if (err) {
        process.nextTick(function() {
            return callback(); // this is bad, but WILL NOT warn
        });
    }
    callback();
}
```

#### If/Else Statements

Here is a case where you're doing the right thing in making sure to only `callback()` once, but because of the
difficulty in determining what you're doing, this rule does not allow for this pattern.

```js
/*eslint callback-return: 2*/

function foo(callback) {
    if (err) {
        callback(err); // this is fine, but WILL warn /*error Expected return with your callback function.*/
    } else {
        callback();    // this is fine, but WILL warn /*error Expected return with your callback function.*/
    }
}
```

## When Not To Use It

There are some cases where you might want to call a callback function more than once. In those cases this rule
 may lead to incorrect behavior. In those cases you may want to reserve a special name for those callbacks and
 not include that in the list of callbacks that trigger warnings.


## Further Reading

* [The Art Of Node: Callbacks](https://github.com/maxogden/art-of-node#callbacks)
* [Nodejitsu: What are the error conventions?](http://docs.nodejitsu.com/articles/errors/what-are-the-error-conventions)

## Related Rules

* [handle-callback-err](handle-callback-err.md)
