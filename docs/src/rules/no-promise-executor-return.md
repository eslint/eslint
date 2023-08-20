---
title: no-promise-executor-return
rule_type: problem
related_rules:
- no-async-promise-executor
further_reading:
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
---


The `new Promise` constructor accepts a single argument, called an *executor*.

```js
const myPromise = new Promise(function executor(resolve, reject) {
    readFile('foo.txt', function(err, result) {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
    });
});
```

The executor function usually initiates some asynchronous operation. Once it is finished, the executor should call `resolve` with the result, or `reject` if an error occurred.

The return value of the executor is ignored. Returning a value from an executor function is a possible error because the returned value cannot be used and it doesn't affect the promise in any way.

## Rule Details

This rule disallows returning values from Promise executor functions.

Only `return` without a value is allowed, as it's a control flow statement.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-promise-executor-return: "error"*/

new Promise((resolve, reject) => {
    if (someCondition) {
        return defaultResult;
    }
    getSomething((err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
    });
});

new Promise((resolve, reject) => getSomething((err, data) => {
    if (err) {
        reject(err);
    } else {
        resolve(data);
    }
}));

new Promise(() => {
    return 1;
});

new Promise(r => r(1));
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-promise-executor-return: "error"*/

// Turn return inline into two lines
new Promise((resolve, reject) => {
    if (someCondition) {
        resolve(defaultResult);
        return;
    }
    getSomething((err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
    });
});

// Add curly braces
new Promise((resolve, reject) => {
    getSomething((err, data) => {
        if (err) {
            reject(err);
        } else {
            resolve(data);
        }
    });
});

new Promise(r => { r(1) });
// or just use Promise.resolve
Promise.resolve(1);
```

:::

## Options

This rule takes one option, an object, with the following properties:

* `allowVoid`: If set to `true` (`false` by default), this rule will allow returning void values.

### allowVoid

Examples of **correct** code for this rule with the `{ "allowVoid": true }` option:

::: correct

```js
/*eslint no-promise-executor-return: ["error", { allowVoid: true }]*/

new Promise((resolve, reject) => {
    if (someCondition) {
        return void resolve(defaultResult);
    }
    getSomething((err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
    });
});

new Promise((resolve, reject) => void getSomething((err, data) => {
    if (err) {
        reject(err);
    } else {
        resolve(data);
    }
}));

new Promise(r => void r(1));
```

:::
