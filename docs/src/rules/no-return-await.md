---
title: no-return-await
rule_type: suggestion
further_reading:
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
- https://v8.dev/blog/fast-async
---

If the value to be returned is a *native* Promise, then there is a performance gain in wrapping or preceding the `Promise` with `await``.

If the value to be returned is **not** a Promise, such as a `Literal` node or `undefined`, then using `await` will incur a performance penalty due to an extra microtask.

Returning `await` is not necessary for a `Promise` to be returned by an `async` function, regardless of the return value.

## Rule Details

This rule aims to detect `Literal` types or `undefined` being awaited which causes a performance penalty.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-return-await: "error"*/

async function foo() {
    return await 'foo';
}

async function asyncNull() {
    return await null;
}

async function foo(writeToLog) {
    return await (writeToLog ? writeLog() : null);
}

async function foo(write) {
    return await (sync ? void deleteSync() : deleteAsync());
}

```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-return-await: "error"*/

async function foo() {
    await otherPromise();
    return 'foo';
}

async function foo() {
    return 'foo';
}

async function foo() {
    return await bar();
}

async function foo() {
    await bar();
    return;
}

// The rule can only check for await in return statements
async function foo() {
  let answer = 42;
  return await answer;
}

// The rule can only check for Literal nodes
async function foo() {
  return await ('foo'.toString());
}

// The rule cannot check `CallExpression` nodes
async function foo() {
  return await Promise.resolve('foo');
}

// This is essentially the same as `return await 42;`, but the rule checks only `await` in `return` statements
async function foo() {
    const x = await 42;
    return x;
}

async function foo(sync) {
    return sync ? void deleteSync() : await deleteAsync();
}

```

:::

## When Not To Use It

* If you are not concerned with the performance penalty of awaited `Literal` nodes or `undefined`.
* If you want to intentionally wait an extra microtask.
* If want to keep a balanced `async` / `await` syntax to ensure a function returns a `Promise`.
* If you have redefined `undefined`.
