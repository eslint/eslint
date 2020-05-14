# Disallows unnecessary `return await` (no-return-await)

Using `return await` inside an `async function` keeps the current function in the call stack until the Promise that is being awaited has resolved, at the cost of an extra microtask before resolving the outer Promise. `return await` can also be used in a try/catch statement to catch errors from another function that returns a Promise.

You can avoid the extra microtask by not awaiting the return value, with the trade off of the function no longer being a part of the stack trace if an error is thrown asynchronously from the Promise being returned. This can make debugging more difficult.

## Rule Details

This rule aims to prevent a likely common performance hazard due to a lack of understanding of the semantics of `async function`.

Examples of **incorrect** code for this rule:

```js
async function foo() {
    return await bar();
}
```

Examples of **correct** code for this rule:

```js
async function foo() {
    return bar();
}

async function foo() {
    await bar();
    return;
}

async function foo() {
    const x = await bar();
    return x;
}

async function foo() {
    try {
        return await bar();
    } catch (error) {}
}
```

In the last example the `await` is necessary to be able to catch errors thrown from `bar()`.

## When Not To Use It

There are a few reasons you might want to turn this rule off:

- If you want to use `await` to denote a value that is a thenable
- If you do not want the performance benefit of avoiding `return await`
- If you want the functions to show up in stack traces (useful for debugging purposes)

## Further Reading

[`async function` on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

[`await vs return vs return await` by Jake Archibald](https://jakearchibald.com/2017/await-vs-return-vs-return-await/)
