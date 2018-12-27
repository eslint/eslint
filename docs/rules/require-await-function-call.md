# Require using `await` with calls to specified functions. (require-await-function-call)

Some functions are asynchronous and we want to wait for their code to finish executing before continuing on. The modern `async` / `await` syntax can help us achieve this.

## Rule Details

This lint rule requires that specified functions be called with the `async` keyword. The benefits of this include:

* Ensure code runs in the right (deterministic) order
* Promote cleaner code by reducing unwieldy promise chain usage
* Enforce a consistent way of calling/chaining asynchronous functions

Code sample:

```js
// Lint rule configuration: ['error', { functions: ['asyncFunc1', 'asyncFunc2'] }]

function doSomethingInvalid() {
  // Invalid because specified functions are missing `await`.
  return asyncFunc1().then(() => {
    return asyncFunc2();
  });
}

async function doSomethingValid() {
  await asyncFunc1();
  await asyncFunc2();
}
```

Here's a code sample demonstrating how it can be especially useful to enforce using the `async` keyword with asynchronous test action / wait helpers to make tests more deterministic and potentially reduce flakiness.

```js
// Lint rule configuration: ['error', { functions: ['click'] }]

test('clicking the button sends the action', function(assert) {
  click('.my-button'); // Invalid usage.
  assert.ok(this.myAction.calledOnce);
});

test('clicking the button sends the action', function(assert) {
  click('.my-button').then(() => {
    assert.ok(this.myAction.calledOnce);
  }); // Invalid usage.
});

test('clicking the button sends the action', async function(assert) {
  await click('.my-button'); // Valid usage.
  assert.ok(this.myAction.calledOnce);
});
```

## Options

This rule accepts a single argument:

* Set the required `functions` option to an array of the function names that must be called with `await`.

## When Not To Use It

You should avoid enabling this rule if:

* Your JavaScript/browser environment does not support `async` functions (an ES8/ES2017 feature)
* You have no asynchronous functions
* You prefer to use promise chains instead of the `async` keyword

## Related Rules

* [no-await-in-loop](no-await-in-loop.md)
* [no-return-await](no-return-await.md)
* [require-atomic-updates](require-atomic-updates.md)
* [require-await](require-await.md)

## Resources

* See the [documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) for async functions
