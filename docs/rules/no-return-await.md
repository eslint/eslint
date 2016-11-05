# Disallows unnecessary `return await` (no-return-await)

Inside an `async function`, `return await` is useless. Since the return value of an `async function` is always wrapped in `Promise.resolve`, `return await` doesn't actually do anything except add extra time before the overarching Promise resolves or rejects. This pattern is almost certainly due to programmer ignorance of the return semantics of `async function`s.

## Rule Details

This rule aims to prevent a likely common performance hazard due to a lack of understanding of the semantics of `async function`.

The following patterns are considered warnings:

```js
async function foo() {
  return await bar();
}
```

The following patterns are not warnings:

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
```

## When Not To Use It

If you want to use `await` to denote a value that is a thenable, even when it is not necessary; or if you do not want the performance benefit of avoiding `return await`, you can turn off this rule.

## Further Reading

[`async function` on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
