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

This rule is aimed at detecting unreachable code. It produces an error when a statements in a block exist after a `return`, `throw`, `break`, or `continue` statement. The rule checks inside the program root, block statements, and switch cases.

The following are considered warnings:

```js
function foo() {
	return true;
	console.log("done");
}

function bar() {
	throws new Error("Oops!");
	console.log("done");
}

while(value) {
	break;
	console.log("done");
}

throw new Error("Oops!");
console.log("done");
```

The following patterns are not considered warnings (due to JavaScript function and variable hoisting):

```js
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
