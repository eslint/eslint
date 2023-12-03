---
title: no-return-await
rule_type: suggestion
further_reading:
- https://v8.dev/blog/fast-async
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
- https://jakearchibald.com/2017/await-vs-return-vs-return-await/
---

This rule was **deprecated** in ESLint v8.46.0 with no replacement. The original intent of this rule no longer applies due to the fact JavaScript now handles native `Promises` differently. It can now be slower to remove `await` rather than keeping it. More technical information can be found in [this V8 blog entry](https://v8.dev/blog/fast-async).

Using `return await` inside an `async function` keeps the current function in the call stack until the Promise that is being awaited has resolved, at the cost of an extra microtask before resolving the outer Promise. `return await` can also be used in a try/catch statement to catch errors from another function that returns a Promise.

You can avoid the extra microtask by not awaiting the return value, with the trade off of the function no longer being a part of the stack trace if an error is thrown asynchronously from the Promise being returned. This can make debugging more difficult.

## Rule Details

This rule aims to prevent a likely common performance hazard due to a lack of understanding of the semantics of `async function`.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-return-await: "error"*/

async function foo() {
    return await bar();
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-return-await: "error"*/

async function foo1() {
    return bar();
}

async function foo2() {
    await bar();
    return;
}

// This is essentially the same as `return await bar();`, but the rule checks only `await` in `return` statements
async function foo3() {
    const x = await bar();
    return x;
}

// In this example the `await` is necessary to be able to catch errors thrown from `bar()`
async function foo4() {
    try {
        return await bar();
    } catch (error) {}
}
```

:::

## When Not To Use It

There are a few reasons you might want to turn this rule off:

* If you want to use `await` to denote a value that is a thenable
* If you do not want the performance benefit of avoiding `return await`
* If you want the functions to show up in stack traces (useful for debugging purposes)
