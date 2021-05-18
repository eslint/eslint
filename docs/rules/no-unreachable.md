# disallow unreachable code after `return`, `throw`, `continue`, and `break` statements (no-unreachable)

Because the `return`, `throw`, `break`, and `continue` statements unconditionally exit a block of code, any statements after them cannot be executed. Unreachable statements are usually a mistake.

```js
function fn() {
    x = 1;
    return x;
    x = 3; // this will never execute
}
```

## Rule Details

This rule disallows unreachable code after `return`, `throw`, `continue`, and `break` statements.

Examples of **incorrect** code for this rule:

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

Examples of **correct** code for this rule, because of JavaScript function and variable hoisting:

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
