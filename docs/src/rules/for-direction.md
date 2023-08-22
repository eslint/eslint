---
title: for-direction
rule_type: problem
---

A `for` loop with a stop condition that can never be reached, such as one with a counter that moves in the wrong direction, will run infinitely. While there are occasions when an infinite loop is intended, the convention is to construct such loops as `while` loops. More typically, an infinite for loop is a bug.

## Rule Details

This rule forbids for loops where the counter variable increases or decreases in the wrong direction.

Examples of **incorrect** code for this rule:

:::incorrect

```js
/*eslint for-direction: "error"*/
for (var i = 0; i < 10; i--) {
}

for (var i = 10; i >= 0; i++) {
}

for (var i = 0; i > 10; i++) {
}

const n = -2;
for (let i = 0; i < 10; i += n) {
}
```

:::

Examples of **correct** code for this rule:

:::correct

```js
/*eslint for-direction: "error"*/
for (var i = 0; i < 10; i++) {
}

for (let i = 10; i >= 0; i += this.step) { // direction unknown
}

for (let i = MIN; i <= MAX; i -= 0) { // not increasing or decreasing
}
```

:::
