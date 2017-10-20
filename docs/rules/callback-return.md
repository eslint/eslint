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
 For example, in the case of an HTTP request, you may try to send HTTP headers more than once leading Node.js to `throw`
 a `Can't render headers after they are sent to the client.` error.

## Rule Details

This rule is aimed at ensuring that callbacks used outside of the main function block are always part-of or immediately
preceding a `return` statement. This rule decides what is a callback based on the name of the function being called.

## Options

The rule takes a single option - an array of possible callback names - which may include object methods. The default callback names are `callback`, `cb`, `next`.

### Default callback names

Examples of **incorrect** code for this rule with the default `["callback", "cb", "next"]` option:

```js
/*eslint callback-return: "error"*/

function foo(err, callback) {
    if (err) {
        callback(err);
    }
    callback();
}
```

Examples of **correct** code for this rule with the default `["callback", "cb", "next"]` option:

```js
/*eslint callback-return: "error"*/

function foo(err, callback) {
    if (err) {
        return callback(err);
    }
    callback();
}
```

### Supplied callback names

Examples of **incorrect** code for this rule with the option `["done", "send.error", "send.success"]`:

```js
/*eslint callback-return: ["error", ["done", "send.error", "send.success"]]*/

function foo(err, done) {
    if (err) {
        done(err);
    }
    done();
}

function bar(err, send) {
    if (err) {
        send.error(err);
    }
    send.success();
}
```

Examples of **correct** code for this rule with the option `["done", "send.error", "send.success"]`:

```js
/*eslint callback-return: ["error", ["done", "send.error", "send.success"]]*/

function foo(err, done) {
    if (err) {
        return done(err);
    }
    done();
}

function bar(err, send) {
    if (err) {
        return send.error(err);
    }
    send.success();
}
```

## Known Limitations

Because it is difficult to understand the meaning of a program through static analysis, this rule has limitations:

* *false negatives* when this rule reports correct code, but the program calls the callback more than one time (which is incorrect behavior)
* *false positives* when this rule reports incorrect code, but the program calls the callback only one time (which is correct behavior)

### Passing the callback by reference

The static analysis of this rule does not detect that the program calls the callback if it is an argument of a function (for example,  `setTimeout`).

Example of a *false negative* when this rule reports correct code:

```js
/*eslint callback-return: "error"*/

function foo(err, callback) {
    if (err) {
        setTimeout(callback, 0); // this is bad, but WILL NOT warn
    }
    callback();
}
```

### Triggering the callback within a nested function

The static analysis of this rule does not detect that the program calls the callback from within a nested function or an immediately-invoked function expression (IIFE).

Example of a *false negative* when this rule reports correct code:

```js
/*eslint callback-return: "error"*/

function foo(err, callback) {
    if (err) {
        process.nextTick(function() {
            return callback(); // this is bad, but WILL NOT warn
        });
    }
    callback();
}
```

### If/else statements

The static analysis of this rule does not detect that the program calls the callback only one time in each branch of an `if` statement.

Example of a *false positive* when this rule reports incorrect code:

```js
/*eslint callback-return: "error"*/

function foo(err, callback) {
    if (err) {
        callback(err); // this is fine, but WILL warn
    } else {
        callback();    // this is fine, but WILL warn
    }
}
```

## When Not To Use It

There are some cases where you might want to call a callback function more than once. In those cases this rule
 may lead to incorrect behavior. In those cases you may want to reserve a special name for those callbacks and
 not include that in the list of callbacks that trigger warnings.


## Further Reading

* [The Art Of Node: Callbacks](https://github.com/maxogden/art-of-node#callbacks)
* [Nodejitsu: What are the error conventions?](https://docs.nodejitsu.com/articles/errors/what-are-the-error-conventions/)

## Related Rules

* [handle-callback-err](handle-callback-err.md)
