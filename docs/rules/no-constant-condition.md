# disallow constant expressions in conditions (no-constant-condition)

A constant expression (for example, a literal) as a test condition might be a typo or development trigger for a specific behavior. For example, the following code looks as if it is not ready for production.

```js
if (false) {
    doSomethingUnfinished();
}
```

## Rule Details

This rule disallows constant expressions in the test condition of:

* `if`, `for`, `while`, or `do...while` statement
* `?:` ternary expression

Examples of **incorrect** code for this rule:

```js
/*eslint no-constant-condition: "error"*/

if (false) {
    doSomethingUnfinished();
}

if (void x) {
    doSomethingUnfinished();
}

for (;-2;) {
    doSomethingForever();
}

while (typeof x) {
    doSomethingForever();
}

do {
    doSomethingForever();
} while (x = -1);

var result = 0 ? a : b;
```

Examples of **correct** code for this rule:

```js
/*eslint no-constant-condition: "error"*/

if (x === 0) {
    doSomething();
}

for (;;) {
    doSomethingForever();
}

while (typeof x === "undefined") {
    doSomething();
}

do {
    doSomething();
} while (x);

var result = x !== 0 ? a : b;
```

## Options

### checkLoops

Set to `true` by default. Setting this option to `false` allows constant expressions in loops.

Examples of **correct** code for when `checkLoops` is `false`:

```js
/*eslint no-constant-condition: ["error", { "checkLoops": false }]*/

while (true) {
    doSomething();
    if (condition()) {
        break;
    }
};

for (;true;) {
    doSomething();
    if (condition()) {
        break;
    }
};

do {
    doSomething();
    if (condition()) {
        break;
    }
} while (true)
```
