---
title: no-return-await
rule_type: suggestion
further_reading:
- https://v8.dev/blog/fast-async
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
- https://jakearchibald.com/2017/await-vs-return-vs-return-await/
---

It is NOT recommended to use the `no-return-await` rule anymore because:

* `return await` on a promise will not result in an extra microtask.
* `return await` yields a better stack trace for debugging.

Historical context: When promises were first introduced, calling `return await` introduced an additional microtask, one for the `await` and one for the return value of the async function. Each extra microtask delays the computation of a result and so this rule was added to help avoid this performance trap. Later, [ECMA-262 changed the way](https://github.com/tc39/ecma262/pull/1250) `return await` worked so it would create a single microtask, which means this rule is no longer necessary.

## Rule Details

This rule warns on any usage of `return await` except in `try` blocks.

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

You should not use this rule. There is no reason to avoid `return await`.
