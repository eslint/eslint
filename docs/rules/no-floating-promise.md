# No Floating Promise (no-floating-promise)

_The `--fix` option on the command line automatically fixes problems reported by this rule._

Promises that are never awaited can cause unexpected behavior because they may be scheduled to execute at an unexpected time.

It's easy to accidentally make this mistake. For example, suppose we have the code

```js
function writeToDb() {
  // synchronously write to DB
}
writeToDb();
```

but the code gets refactored so that writing to the database is asynchronous.

```js
async function writeToDb() {
  // synchronously write to DB
}
writeToDb(); // <- note we have no await here but probably the user intended to await on this!
```

## Rule Details

This rule will fire for any call to an `async` function that both

* not used (not assigned to a variable, not the return type of a function, etc.)
* not awaited on

Examples of **incorrect** code for this rule:

```js
/*eslint no-floating-promise: "error"*/

async function foo() {}
foo();

(async () => 5)();

// note: function is not async but a Promise return type is specified
function foo(): Promise<void> { return Promise.resolve(); };
foo();
```

Examples of **correct** code for this rule:

```js
/*eslint no-floating-promise: "error"*/

async function foo() {}
await foo();

await (async () => 5)();

// note: function is not async but a Promise return type is specified
function foo(): Promise<void> { return Promise.resolve(); };
await foo();
```

You may catch additional errors by combining this rule with `no-unused-expression`.

For example the following will not be considered an error by this plugin, but `no-unused-expression` will complain that `fooResult` is never used.

```js
async function foo() {}
const fooResult = foo();
```

## When Not To Use It

If you often make use of asynchronous functions were you explicitly do not want to await on them.
