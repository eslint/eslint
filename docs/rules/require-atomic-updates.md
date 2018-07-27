# Disallow assignments that can lead to race conditions due to usage of `await` or `yield` (require-atomic-updates)

When writing asynchronous code, it is possible to create subtle race condition bugs. Consider the following example:

```js
let totalLength = 0;

async function addLengthOfSinglePage(pageNum) {
  totalLength += await getPageLength(pageNum);
}

Promise.all([addLengthOfSinglePage(1), addLengthOfSinglePage(2)]).then(() => {
  console.log('The combined length of both pages is', totalLength);
});
```

This code looks like it will sum the results of calling `getPageLength(1)` and `getPageLength(2)`, but in reality the final value of `totalLength` will only be the length of one of the two pages. The bug is in the statement `totalLength += await getPageLength(pageNum);`. This statement first reads an initial value of `totalLength`, then calls `getPageLength(pageNum)` and waits for that Promise to fulfill. Finally, it sets the value of `totalLength` to the sum of `await getPageLength(pageNum)` and the *initial* value of `totalLength`. If the `totalLength` variable is updated in a separate function call during the time that the `getPageLength(pageNum)` Promise is pending, that update will be lost because the new value is overwritten without being read.

One way to fix this issue would be to ensure that `totalLength` is read at the same time as it's updated, like this:

```js
async function addLengthOfSinglePage(pageNum) {
  const lengthOfThisPage = await getPageLength(pageNum);

  totalLength += lengthOfThisPage;
}
```

Another solution would be to avoid using a mutable variable reference at all:

```js
Promise.all([getPageLength(1), getPageLength(2)]).then(pageLengths => {
  const totalLength = pageLengths.reduce((accumulator, length) => accumulator + length, 0);

  console.log('The combined length of both pages is', totalLength);
});
```

## Rule Details

This rule aims to report assignments to variables or properties where all of the following are true:

* A variable or property is reassigned to a new value which is based on its old value.
* A `yield` or `await` expression interrupts the assignment after the old value is read, and before the new value is set.
* The rule cannot easily verify that the assignment is safe (e.g. if an assigned variable is local and would not be readable from anywhere else while the function is paused).

Examples of **incorrect** code for this rule:

```js
/* eslint require-atomic-updates: error */

let result;
async function foo() {
  result += await somethingElse;

  result = result + await somethingElse;

  result = result + doSomething(await somethingElse);
}

function* bar() {
  result += yield;

  result = result + (yield somethingElse);

  result = result + doSomething(yield somethingElse);
}
```

Examples of **correct** code for this rule:

```js
/* eslint require-atomic-updates: error */

let result;
async function foo() {
  result = await somethingElse + result;

  let tmp = await somethingElse;
  result += tmp;

  let localVariable = 0;
  localVariable += await somethingElse;
}

function* bar() {
  result += yield;

  result = (yield somethingElse) + result;

  result = doSomething(yield somethingElse, result);
}
```

## When Not To Use It

If you don't use async or generator functions, you don't need to enable this rule.
