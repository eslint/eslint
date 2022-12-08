---
title: no-unreachable-loop
rule_type: problem
related_rules:
- no-unreachable
- no-constant-condition
- no-unmodified-loop-condition
- for-direction
---


A loop that can never reach the second iteration is a possible error in the code.

```js
for (let i = 0; i < arr.length; i++) {
    if (arr[i].name === myName) {
        doSomething(arr[i]);
        // break was supposed to be here
    }
    break;
}
```

In rare cases where only one iteration (or at most one iteration) is intended behavior, the code should be refactored to use `if` conditionals instead of `while`, `do-while` and `for` loops. It's considered a best practice to avoid using loop constructs for such cases.

## Rule Details

This rule aims to detect and disallow loops that can have at most one iteration, by performing static code path analysis on loop bodies.

In particular, this rule will disallow a loop with a body that exits the loop in all code paths. If all code paths in the loop's body will end with either a `break`, `return` or a `throw` statement, the second iteration of such loop is certainly unreachable, regardless of the loop's condition.

This rule checks `while`, `do-while`, `for`, `for-in` and `for-of` loops. You can optionally disable checks for each of these constructs.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-unreachable-loop: "error"*/

while (foo) {
    doSomething(foo);
    foo = foo.parent;
    break;
}

function verifyList(head) {
    let item = head;
    do {
        if (verify(item)) {
            return true;
        } else {
            return false;
        }
    } while (item);
}

function findSomething(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (isSomething(arr[i])) {
            return arr[i];
        } else {
            throw new Error("Doesn't exist.");
        }
    }
}

for (key in obj) {
    if (key.startsWith("_")) {
        break;
    }
    firstKey = key;
    firstValue = obj[key];
    break;
}

for (foo of bar) {
    if (foo.id === id) {
        doSomething(foo);
    }
    break;
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-unreachable-loop: "error"*/

while (foo) {
    doSomething(foo);
    foo = foo.parent;
}

function verifyList(head) {
    let item = head;
    do {
        if (verify(item)) {
            item = item.next;
        } else {
            return false;
        }
    } while (item);

    return true;
}

function findSomething(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (isSomething(arr[i])) {
            return arr[i];
        }
    }
    throw new Error("Doesn't exist.");
}

for (key in obj) {
    if (key.startsWith("_")) {
        continue;
    }
    firstKey = key;
    firstValue = obj[key];
    break;
}

for (foo of bar) {
    if (foo.id === id) {
        doSomething(foo);
        break;
    }
}
```

:::

Please note that this rule is not designed to check loop conditions, and will not warn in cases such as the following examples.

Examples of additional **correct** code for this rule:

::: correct

```js
/*eslint no-unreachable-loop: "error"*/

do {
    doSomething();
} while (false)

for (let i = 0; i < 1; i++) {
    doSomething(i);
}

for (const a of [1]) {
    doSomething(a);
}
```

:::

## Options

This rule has an object option, with one option:

* `"ignore"` - an optional array of loop types that will be ignored by this rule.

### ignore

You can specify up to 5 different elements in the `"ignore"` array:

* `"WhileStatement"` - to ignore all `while` loops.
* `"DoWhileStatement"` - to ignore all `do-while` loops.
* `"ForStatement"` - to ignore all `for` loops (does not apply to `for-in` and `for-of` loops).
* `"ForInStatement"` - to ignore all `for-in` loops.
* `"ForOfStatement"` - to ignore all `for-of` loops.

Examples of **correct** code for this rule with the `"ignore"` option:

::: correct

```js
/*eslint no-unreachable-loop: ["error", { "ignore": ["ForInStatement", "ForOfStatement"] }]*/

for (var key in obj) {
  hasEnumerableProperties = true;
  break;
}

for (const a of b) break;
```

:::

## Known Limitations

Static code path analysis, in general, does not evaluate conditions. Due to this fact, this rule might miss reporting cases such as the following:

```js
for (let i = 0; i < 10; i++) {
    doSomething(i);
    if (true) {
        break;
    }
}
```
