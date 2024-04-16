---
title: no-constant-condition
rule_type: problem
related_rules:
- no-constant-binary-expression
---



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

::: incorrect

```js
/*eslint no-constant-condition: "error"*/

if (false) {
    doSomethingUnfinished();
}

if (void x) {
    doSomethingUnfinished();
}

if (x &&= false) {
    doSomethingNever();
}

if (class {}) {
    doSomethingAlways();
}

if (new Boolean(x)) {
    doSomethingAlways();
}

if (Boolean(1)) {
    doSomethingAlways();
}

if (undefined) {
    doSomethingUnfinished();
}

if (x ||= true) {
    doSomethingAlways();
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

if(input === "hello" || "bye"){
  output(input);
}
```

:::

Examples of **correct** code for this rule:

::: correct

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

if(input === "hello" || input === "bye"){
  output(input);
}
```

:::

## Options

### checkLoops

This is a string option having following values:

* `"all"` - Disallow constant expressions in all loops.
* `"allExceptWhileTrue"` (default) - Disallow constant expressions in all loops except `while` loops with expression `true`.
* `"none"` - Allow constant expressions in loops.

Or instead you can set the `checkLoops` value to booleans where `true` is same as `"all"` and `false` is same as `"none"`.

Examples of **incorrect** code for when `checkLoops` is `"all"` or `true`:

::: incorrect

```js
/*eslint no-constant-condition: ["error", { "checkLoops": "all" }]*/

while (true) {
    doSomething();
};

for (;true;) {
    doSomething();
};
```

:::

::: incorrect

```js
/*eslint no-constant-condition: ["error", { "checkLoops": true }]*/

while (true) {
    doSomething();
};

do {
    doSomething();
} while (true)
```

:::

Examples of **correct** code for when `checkLoops` is `"all"` or `true`:

::: correct

```js
/*eslint no-constant-condition: ["error", { "checkLoops": "all" }]*/

while (a === b) {
    doSomething();
};
```

:::

::: correct

```js
/*eslint no-constant-condition: ["error", { "checkLoops": true }]*/

for (let x = 0; x <= 10; x++) {
    doSomething();
};
```

:::

Example of **correct** code for when `checkLoops` is `"allExceptWhileTrue"`:

::: correct

```js
/*eslint no-constant-condition: "error"*/

while (true) {
    doSomething();
};
```

:::

Examples of **correct** code for when `checkLoops` is `"none"` or `false`:

::: correct

```js
/*eslint no-constant-condition: ["error", { "checkLoops": "none" }]*/

while (true) {
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

:::

::: correct

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
```

:::
