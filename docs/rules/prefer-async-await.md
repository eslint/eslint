# Prefer `async`/`await` over `.then()` (prefer-async-await)

With the addition of `async`/`await` in ES2017, one can write asynchronous code
in a synchronous-like manner.

## Rule Details

This rule flags `then` calls so they can be converted to use `async`/`await`.

Examples of **incorrect** code for this rule:

```js
/*eslint prefer-async-await: "error"*/

getData()
  .then((data) => console.log(data))
  .catch((error) => console.error(error))
  .finally(() => cleanUp())

dataPromise.then(function(data) { }).then(x).catch()
```

Examples of **correct** code for this rule:

```js
/*eslint prefer-async-await: "error"*/

try {
    let data = await getData();
    console.log(data)
} catch (error) {
    console.error(error)
}
cleanUp();

console.log(await getData())
```

## When Not To Use It

This rule should not be enabled in environments that don't support ES2017.

## Further Reading

To learn more about `async`/`await`, check out the links below:

- [`async function` (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [`await` (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
