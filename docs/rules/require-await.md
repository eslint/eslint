# Disallow async functions which have no `await` expression (require-await)

Async functions which have no `await` expression may be the unintentional result of refactoring.

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

If you don't want to notify async functions which have no `await` expression, then it's safe to disable this rule.

## Related Rules

* [require-yield](require-yield.md)
