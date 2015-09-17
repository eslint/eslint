# Disallow Synchronous Methods (no-sync)

In Node.js, most I/O is done through asynchronous methods. However, there are often synchronous versions of the asynchronous methods. For example, `fs.exists()` and `fs.existsSync()`. In some contexts, using synchronous operations is okay (if, as with ESLint, you are writing a command line utility). However, in other contexts the use of synchronous operations is considered a bad practice that should be avoided. For example, if you are running a high-travel web server on Node.js, you should consider carefully if you want to allow any synchronous operations that could lock up the server.

## Rule Details

This rule is aimed at preventing synchronous methods from being called in Node.js. It looks specifically for the method suffix "`Sync`" (as is the convention with Node.js operations).

The following patterns are considered problems:

```js
/*eslint no-sync: 2*/

fs.existsSync(somePath);                             /*error Unexpected sync method: 'existsSync'.*/

var contents = fs.readFileSync(somePath).toString(); /*error Unexpected sync method: 'readFileSync'.*/
```

The following patterns are not considered problems:

```js
/*eslint no-sync: 2*/

obj.sync();

async(function() {
    // ...
});
```

## When Not To Use It

If you want to allow synchronous operations in your script.
