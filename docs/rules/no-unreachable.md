# Disallow Unreachable Code (no-unreachable)

A number of statements unconditionally exit a block of code. Any statements after that will not be executed and may be an error. The presence of unreachable code is usually a sign of a coding error.

```js
function fn() {
    x = 1;
    return x;
    x = 3; // this will never execute
}
```

## Rule Details

This rule is aimed at detecting unreachable code. It produces an error when a statements exist after a `return`, `throw`, `break`, or `continue` statement.

The following are considered problems:

```js
/*eslint no-unreachable: 2*/

function foo() {
    return true;
    console.log("done");      /*error Unreachable code.*/
}

function bar() {
    throw new Error("Oops!");
    console.log("done");      /*error Unreachable code.*/
}

while(value) {
    break;
    console.log("done");      /*error Unreachable code.*/
}

throw new Error("Oops!");
console.log("done");          /*error Unreachable code.*/

function baz() {
    if (Math.random() < 0.5) {
        return;
    } else {
        throw new Error();
    }
    console.log("done");      /*error Unreachable code.*/
}

for (;;) {}
console.log("done");          /*error Unreachable code.*/
```

The following patterns are not considered problems (due to JavaScript function and variable hoisting):

```js
/*eslint no-unreachable: 2*/

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
