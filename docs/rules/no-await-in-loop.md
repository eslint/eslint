# Disallow `await` inside of loops (no-await-in-loop)

Performing an operation on each element of an iterable is a common task. However, performing an
`await` as part of each operation is an indication that the program is not taking full advantage of
the parallelization benefits of `async`/`await`.

Usually, the code should be refactored to create all the promises at once, then get access to the
results using `Promise.all()`. Otherwise, each successive operation will not start until the
previous one has completed.

Concretely, the following function should be refactored as shown:

```js
async function foo(things) {
  const results = [];
  for (const thing of things) {
    // Bad: each loop iteration is delayed until the entire asynchronous operation completes
    results.push(await bar(thing));
  }
  return baz(results);
}
```

```js
async function foo(things) {
  const results = [];
  for (const thing of things) {
    // Good: all asynchronous operations are immediately started.
    results.push(bar(thing));
  }
  // Now that all the asynchronous operations are running, here we wait until they all complete.
  return baz(await Promise.all(results));
}
```

If it is desired that each successive operation only starts after the previous one has completed,
`for await...of` can be used, combined with an async generator.

## Rule Details

This rule disallows the use of `await` within loop bodies.

## Examples

Examples of **correct** code for this rule when the iterations of the loop are independent:

```js
/*eslint no-await-in-loop: "error"*/

async function foo(things) {
  const results = [];
  for (const thing of things) {
    // Good: all asynchronous operations are immediately started.
    results.push(bar(thing));
  }
  // Now that all the asynchronous operations are running, here we wait until they all complete.
  return baz(await Promise.all(results));
}
```

Examples of **correct** code for this rule when the iterations of the loop need to be executed in sequence
(requires ES2018/ES9, see [Further Reading](#further-reading) below):

```js
/*eslint no-await-in-loop: "error"*/

// create an async generator, which yields a promise for each `thing`.
async function* resultGenerator(things) {
    for (const thing of things) {
        yield bar(thing);
    }
}

async function foo(things) {
    const results = [];
    for await (const result of resultGenerator(things)) {
        results.push(result);
    }
    return baz(results);
}
```

Examples of **incorrect** code for this rule:

```js
/*eslint no-await-in-loop: "error"*/

async function foo(things) {
  const results = [];
  for (const thing of things) {
    // Bad: each loop iteration is delayed until the entire asynchronous operation completes
    results.push(await bar(thing));
  }
  return baz(results);
}
```

## When Not To Use It

In many cases the iterations of a loop are not actually independent of each-other. For example, the
output of one iteration might be used as the input to another. Or, loops may be used to retry
asynchronous operations that were unsuccessful. Or, loops may be used to prevent your code from sending
an excessive amount of requests in parallel. In such cases, if the `for await...of` approach is unavailable,
it makes sense to use `await` within a loop and it is recommended to disable the rule via a standard ESLint disable comment.

## Further Reading

* [MDN: for await...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)
