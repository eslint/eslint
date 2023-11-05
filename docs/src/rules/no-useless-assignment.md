---
title: no-useless-assignment
rule_type: suggestion
related_rules:
- no-unused-vars
---


[Wikipedia describes a "dead store"](https://en.wikipedia.org/wiki/Dead_store) as follows:

> In computer programming, a local variable that is assigned a value but is not read by any subsequent instruction is referred to as a **dead store**.

"Dead stores" waste processing and memory, so it is better to remove unnecessary assignments to variables.

Also, if the author intended the variable to be used, there is likely a mistake around the dead store.

## Rule Details

This rule aims to report variable assignments when the value is not used.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/* eslint no-useless-assignment: "error" */

function foo() {
    let v = 'used';
    doSomething(v);
    v = 'unused';
}

function foo() {
    let v = 'used';
    if (condition) {
        v = 'unused';
        return
    }
    doSomething(v);
}

function foo() {
    let v = 'used';
    if (condition) {
        doSomething(v);
    } else {
        v = 'unused';
    }
}

function foo() {
    let v = 'unused';
    if (condition) {
        v = 'used';
        doSomething(v);
        return
    }
}

function foo() {
    let v = 'used';
    if (condition) {
        let v = 'used';
        console.log(v);
        v = 'unused';
    }
    console.log(v);
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/* eslint no-useless-assignment: "error" */

function foo() {
    let v = 'used';
    doSomething(v);
    v = 'used-2';
    doSomething(v);
}

function foo() {
    let v = 'used';
    if (condition) {
        v = 'used-2';
        doSomething(v);
        return
    }
    doSomething(v);
}

function foo() {
    let v = 'used';
    if (condition) {
        doSomething(v);
    } else {
        v = 'used-2';
        doSomething(v);
    }
}

function foo () {
    let v = 'used';
    for (let i = 0; i < 10; i++) {
        doSomething(v);
        v = 'used in next iteration';
    }
}
```

:::

## When Not To Use It

If you don't want to be notified about values that are never read, you can safely disable this rule.
