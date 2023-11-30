---
title: no-useless-assignment
rule_type: suggestion
related_rules:
- no-unused-vars
further_reading:
- https://en.wikipedia.org/wiki/Dead_store
- https://rules.sonarsource.com/javascript/RSPEC-1854/
- https://cwe.mitre.org/data/definitions/563.html
- https://wiki.sei.cmu.edu/confluence/display/c/MSC13-C.+Detect+and+remove+unused+values
- https://wiki.sei.cmu.edu/confluence/display/java/MSC56-J.+Detect+and+remove+superfluous+code+and+values
---


[Wikipedia describes a "dead store"](https://en.wikipedia.org/wiki/Dead_store) as follows:

> In computer programming, a local variable that is assigned a value but is not read by any subsequent instruction is referred to as a **dead store**.

"Dead stores" waste processing and memory, so it is better to remove unnecessary assignments to variables.

Also, if the author intended the variable to be used, there is likely a mistake around the dead store.
For example,

* you should have used a stored value but forgot to do so.
* you made a mistake in the name of the variable to be stored.

```js
let id = "x1234";    // this is a "dead store" - this value ("x1234") is never read

id = generateId();

doSomethingWith(id);
```

## Rule Details

This rule aims to report variable assignments when the value is not used.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/* eslint no-useless-assignment: "error" */

function fn1() {
    let v = 'used';
    doSomething(v);
    v = 'unused';
}

function fn2() {
    let v = 'used';
    if (condition) {
        v = 'unused';
        return
    }
    doSomething(v);
}

function fn3() {
    let v = 'used';
    if (condition) {
        doSomething(v);
    } else {
        v = 'unused';
    }
}

function fn4() {
    let v = 'unused';
    if (condition) {
        v = 'used';
        doSomething(v);
        return
    }
}

function fn5() {
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

function fn1() {
    let v = 'used';
    doSomething(v);
    v = 'used-2';
    doSomething(v);
}

function fn2() {
    let v = 'used';
    if (condition) {
        v = 'used-2';
        doSomething(v);
        return
    }
    doSomething(v);
}

function fn3() {
    let v = 'used';
    if (condition) {
        doSomething(v);
    } else {
        v = 'used-2';
        doSomething(v);
    }
}

function fn4() {
    let v = 'used';
    for (let i = 0; i < 10; i++) {
        doSomething(v);
        v = 'used in next iteration';
    }
}
```

:::

This rule will not report variables that are never read.
Because it's clearly an unused variable. If you want it reported, please enable the [no-unused-vars](./no-unused-vars) rule.

::: correct

```js
/* eslint no-useless-assignment: "error" */

function fn() {
    let v = 'unused';
    v = 'unused-2'
    doSomething();
}
```

:::

## When Not To Use It

If you don't want to be notified about values that are never read, you can safely disable this rule.
