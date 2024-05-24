---
title: no-unreachable
rule_type: problem
handled_by_typescript: true
extra_typescript_info: >-
    TypeScript must be configured with
    [`allowUnreachableCode: false`](https://www.typescriptlang.org/tsconfig#allowUnreachableCode)
    for it to consider unreachable code an error.
---



Because the `return`, `throw`, `break`, and `continue` statements unconditionally exit a block of code, any statements after them cannot be executed. Unreachable statements are usually a mistake.

```js
function fn() {
    x = 1;
    return x;
    x = 3; // this will never execute
}
```

Another kind of mistake is defining instance fields in a subclass whose constructor doesn't call `super()`. Instance fields of a subclass are only added to the instance after `super()`. If there are no `super()` calls, their definitions are never applied and therefore are unreachable code.

```js
class C extends B {
    #x; // this will never be added to instances

    constructor() {
        return {};
    }
}
```

## Rule Details

This rule disallows unreachable code after `return`, `throw`, `continue`, and `break` statements. This rule also flags definitions of instance fields in subclasses whose constructors don't have `super()` calls.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-unreachable: "error"*/

function foo() {
    return true;
    console.log("done");
}

function bar() {
    throw new Error("Oops!");
    console.log("done");
}

while(value) {
    break;
    console.log("done");
}

throw new Error("Oops!");
console.log("done");

function baz() {
    if (Math.random() < 0.5) {
        return;
    } else {
        throw new Error();
    }
    console.log("done");
}

for (;;) {}
console.log("done");
```

:::

Examples of **correct** code for this rule, because of JavaScript function and variable hoisting:

::: correct

```js
/*eslint no-unreachable: "error"*/

function foo() {
    return bar();
    function bar() {
        return 1;
    }
}

function bar() {
    return x;
    var x;
}

switch (foo) {
    case 1:
        break;
        var x;
}
```

:::

Examples of additional **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-unreachable: "error"*/

class C extends B {
    #x; // unreachable
    #y = 1; // unreachable
    a; // unreachable
    b = 1; // unreachable

    constructor() {
        return {};
    }
}
```

:::

Examples of additional **correct** code for this rule:

::: correct

```js
/*eslint no-unreachable: "error"*/

class D extends B {
    #x;
    #y = 1;
    a;
    b = 1;

    constructor() {
        super();
    }
}

class E extends B {
    #x;
    #y = 1;
    a;
    b = 1;

    // implicit constructor always calls `super()`
}

class F extends B {
    static #x;
    static #y = 1;
    static a;
    static b = 1;

    constructor() {
        return {};
    }
}
```

:::
