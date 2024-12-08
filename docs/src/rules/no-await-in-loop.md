---
title: no-await-in-loop
rule_type: problem
---


Performing an operation on each element of an iterable is a common task. However, performing an
`await` as part of each operation may indicate that the program is not taking full advantage of
the parallelization benefits of `async`/`await`.

Often, the code can be refactored to create all the promises at once, then get access to the
results using `Promise.all()` (or one of the other [promise concurrency methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#promise_concurrency)). Otherwise, each successive operation will not start until the
previous one has completed.

Concretely, the following function could be refactored as shown:

```js
async function foo(things) {
  const results = [];
  for (const thing of things) {
    // Bad: each loop iteration is delayed until the entire asynchronous operation completes
    results.push(await doAsyncWork(thing));
  }
  return results;
}
```

```js
async function foo(things) {
  const promises = [];
  for (const thing of things) {
    // Good: all asynchronous operations are immediately started.
    promises.push(doAsyncWork(thing));
  }
  // Now that all the asynchronous operations are running, here we wait until they all complete.
  const results = await Promise.all(promises);
  return results;
}
```

This can be beneficial for subtle error-handling reasons as well. Given an array of promises that might reject,
sequential awaiting puts the program at risk of unhandled promise rejections. The exact behavior of unhandled
rejections depends on the environment running your code, but they are generally considered harmful regardless.
In Node.js, for example, [unhandled rejections cause a program to terminate](https://nodejs.org/api/cli.html#--unhandled-rejectionsmode) unless configured otherwise.

```js
async function foo() {
    const arrayOfPromises = somethingThatCreatesAnArrayOfPromises();
    for (const promise of arrayOfPromises) {
        // Bad: if any of the promises reject, an exception is thrown, and
        // subsequent loop iterations will not run. Therefore, rejections later
        // in the array will become unhandled rejections that cannot be caught
        // by a caller.
        const value = await promise;
        console.log(value);
    }
}
```

```js
async function foo() {
    const arrayOfPromises = somethingThatCreatesAnArrayOfPromises();
    // Good: Any rejections will cause a single exception to be thrown here,
    // which may be caught and handled by the caller.
    const arrayOfValues = await Promise.all(arrayOfPromises);
    for (const value of arrayOfValues) {
        console.log(value);
    }
}
```

## Rule Details

This rule disallows the use of `await` within loop bodies.

## Examples

Examples of **correct** code for this rule:

:::correct

```js
/*eslint no-await-in-loop: "error"*/

async function foo(things) {
  const promises = [];
  for (const thing of things) {
    // Good: all asynchronous operations are immediately started.
    promises.push(doAsyncWork(thing));
  }
  // Now that all the asynchronous operations are running, here we wait until they all complete.
  const results = await Promise.all(promises);
  return results;
}
```

:::

Examples of **incorrect** code for this rule:

:::incorrect

```js
/*eslint no-await-in-loop: "error"*/

async function foo(things) {
  const results = [];
  for (const thing of things) {
    // Bad: each loop iteration is delayed until the entire asynchronous operation completes
    results.push(await doAsyncWork(thing));
  }
  return results;
}
```

:::

## When Not To Use It

In many cases the iterations of a loop are not actually independent of each other, and awaiting in
the loop is correct. As a few examples:

* The output of one iteration might be used as the input to another.

    ```js
    async function loopIterationsDependOnEachOther() {
        let previousResult = null;
        for (let i = 0; i < 10; i++) {
            const result = await doSomething(i, previousResult);
            if (someCondition(result, previousResult)) {
                break;
            } else {
                previousResult = result;
            }
        }
    }
    ```

* Loops may be used to retry asynchronous operations that were unsuccessful.

    ```js
    async function retryUpTo10Times() {
        for (let i = 0; i < 10; i++) {
            const wasSuccessful = await tryToDoSomething();
            if (wasSuccessful)
                return 'succeeded!';
            // wait to try again.
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        return 'failed!';
    }
    ```

* Loops may be used to prevent your code from sending an excessive amount of requests in parallel.

    ```js
    async function makeUpdatesToRateLimitedApi(thingsToUpdate) {
        // we'll exceed our rate limit if we make all the network calls in parallel.
        for (const thing of thingsToUpdate) {
            await updateThingWithRateLimitedApi(thing);
        }
    }
    ```

In such cases it makes sense to use `await` within a
loop and it is recommended to disable the rule via a standard ESLint disable comment.
