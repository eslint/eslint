---
title: require-atomic-updates
rule_type: problem
---


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

This rule aims to report assignments to variables or properties in cases where the assignments may be based on outdated values.

### Variables

This rule reports an assignment to a variable when it detects the following execution flow in a generator or async function:

1. The variable is read.
2. A `yield` or `await` pauses the function.
3. After the function is resumed, a value is assigned to the variable from step 1.

The assignment in step 3 is reported because it may be incorrectly resolved because the value of the variable from step 1 may have changed between steps 2 and 3. In particular, if the variable can be accessed from other execution contexts (for example, if it is not a local variable and therefore other functions can change it), the value of the variable may have changed elsewhere while the function was paused in step 2.

Note that the rule does not report the assignment in step 3 in any of the following cases:

* If the variable is read again between steps 2 and 3.
* If the variable cannot be accessed while the function is paused (for example, if it's a local variable).

Examples of **incorrect** code for this rule:

::: incorrect

```js
/* eslint require-atomic-updates: error */

let result;

async function foo() {
    result += await something;
}

async function bar() {
    result = result + await something;
}

async function baz() {
    result = result + doSomething(await somethingElse);
}

async function qux() {
    if (!result) {
        result = await initialize();
    }
}

function* generator() {
    result += yield;
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/* eslint require-atomic-updates: error */

let result;

async function foobar() {
    result = await something + result;
}

async function baz() {
    const tmp = doSomething(await somethingElse);
    result += tmp;
}

async function qux() {
    if (!result) {
        const tmp = await initialize();
        if (!result) {
            result = tmp;
        }
    }
}

async function quux() {
    let localVariable = 0;
    localVariable += await something;
}

function* generator() {
    result = (yield) + result;
}
```

:::

### Properties

This rule reports an assignment to a property through a variable when it detects the following execution flow in a generator or async function:

1. The variable or object property is read.
2. A `yield` or `await` pauses the function.
3. After the function is resumed, a value is assigned to a property.

This logic is similar to the logic for variables, but stricter because the property in step 3 doesn't have to be the same as the property in step 1. It is assumed that the flow depends on the state of the object as a whole.

Example of **incorrect** code for this rule:

::: incorrect

```js
/* eslint require-atomic-updates: error */

async function foo(obj) {
    if (!obj.done) {
        obj.something = await getSomething();
    }
}
```

:::

Example of **correct** code for this rule:

::: correct

```js
/* eslint require-atomic-updates: error */

async function foo(obj) {
    if (!obj.done) {
        const tmp = await getSomething();
        if (!obj.done) {
            obj.something = tmp;
        }
    }
}
```

:::

## Options

This rule has an object option:

* `"allowProperties"`: When set to `true`, the rule does not report assignments to properties. Default is `false`.

### allowProperties

Example of **correct** code for this rule with the `{ "allowProperties": true }` option:

::: correct

```js
/* eslint require-atomic-updates: ["error", { "allowProperties": true }] */

async function foo(obj) {
    if (!obj.done) {
        obj.something = await getSomething();
    }
}
```

:::

## When Not To Use It

If you don't use async or generator functions, you don't need to enable this rule.
