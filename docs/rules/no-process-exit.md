# Disallow process.exit() (no-process-exit)

The `process.exit()` method in Node.js is used to immediately stop the Node.js process and exit. This is a dangerous operation because it can occur in any method at any point in time, potentially stopping a Node.js application completely when an error occurs. For example:

```js
if (somethingBadHappened) {
    console.error("Something bad happened!");
    process.exit(1);
}
```

This code could appear in any module and will stop the entire application when `somethingBadHappened` is truthy. This doesn't give the application any chance to respond to the error. It's usually better to throw an error and allow the application to handle it appropriately:

```js
if (somethingBadHappened) {
    throw new Error("Something bad happened!");
}
```

By throwing an error in this way, other parts of the application have an opportunity to handle the error rather than stopping the application altogether. If the error bubbles all the way up to the process without being handled, then the process will exit and a non-zero exit code will returned, so the end result is the same.

## Rule Details

This rule aims to prevent the use of `process.exit()` in Node.js JavaScript. As such, it warns whenever `process.exit()` is found in code.

The following patterns are considered problems:

```js
/*eslint no-process-exit: 2*/

process.exit(1); /*error Don't use process.exit(); throw an error instead.*/
process.exit(0); /*error Don't use process.exit(); throw an error instead.*/
```

The following patterns are not considered problems:

```js
/*eslint no-process-exit: 2*/

Process.exit();
var exit = process.exit;
```

## When Not To Use It

There may be a part of a Node.js application that is responsible for determining the correct exit code to return upon exiting. In that case, you should turn this rule off to allow proper handling of the exit code.
