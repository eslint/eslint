# Disallow async functions which have no `await` expression (require-await)

Asynchronous functions in JavaScript behave differently than other functions in two important ways:

1. The return value is always a `Promise`.
2. You can use the `await` operator inside of them.

The primary reason to use asynchronous functions is typically to use the `await` operator, such as this:

```js
async function fetchData(processDataItem) {
    const response = await fetch(DATA_URL);
    const data = await response.json();

    return data.map(processDataItem);
}
```

Asynchronous functions that don't use `await` might not need to be asynchronous functions and could be the unintentional result of refactoring.


## Rule Details

This rule warns async functions which have no `await` expression.

Examples of **incorrect** code for this rule:

```js
/*eslint require-await: "error"*/

async function foo() {
    doSomething();
}

bar(async () => {
    doSomething();
});
```

Examples of **correct** code for this rule:

```js
/*eslint require-await: "error"*/

async function foo() {
    await doSomething();
}

bar(async () => {
    await doSomething();
});

function foo() {
    doSomething();
}

bar(() => {
    doSomething();
});

// Allow empty functions.
async function noop() {}
```

## When Not To Use It

Asynchronous functions are designed to work with promises such that throwing an error will cause a promise's rejection handler (such as `catch()`) to be called. For example:

```js
async function fail() {
    throw new Error("Failure!");
}

fail().catch(error => {
    console.log(error.message);
});
```

In this case, the `fail()` function throws an error that is intended to be caught by the `catch()` handler assigned later. Converting the `fail()` function into a synchronous function would require the call to `fail()` to be refactored to use a `try-catch` statement instead of a promise.

If you are throwing an error inside of an asynchronous function for this purpose, then you may want to disable this rule.


## Related Rules

* [require-yield](require-yield.md)
