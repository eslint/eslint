---
title: no-useless-assignment
rule_type: suggestion
related_rules:
- no-unused-vars
---



If the variable is not used after assignment is needless and most likely indicates that there is some behavior that the author wanted but didn't correctly do.

## Rule Details

This rule aims to report variables that are not used after assignment.

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

If you don't want to be notified about unnecessary arguments, you can safely turn this rule off.
