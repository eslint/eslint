---
title: for-direction
rule_type: problem
---

A `for` loop with a stop condition that can never be reached, such as one with a counter that moves in the wrong direction, will run infinitely. While there are occasions when an infinite loop is intended, the convention is to construct such loops as `while` loops. More typically, an infinite `for` loop is a bug.

## Rule Details

This rule forbids `for` loops where the counter variable changes in such a way that the stop condition will never be met. For example, if the counter variable is increasing (i.e. `i++`) and the stop condition tests that the counter is greater than zero (`i >= 0`), then the loop will never exit.

> **Note:** This rule only checks the **direction** of the counter relative to the stop condition.  

Examples of **incorrect** code for this rule:

:::incorrect

```js
/*eslint for-direction: "error"*/
for (let i = 0; i < 10; i--) {
    // Counter decreases but stop condition is i < 10; loop will never exit
}

for (let i = 10; i >= 0; i++) {
    // Counter increases but stop condition is i >= 0; loop will never exit
}

for (let i = 0; i > 10; i++) { 
    // Counter increases but stop condition i > 10 is false initially
}

for (let i = 0; 10 > i; i--) { // with counter "i" on the right
    // Counter decreases but stop condition 10 > i; loop will never exit
}

const n = -2;
for (let i = 0; i < 10; i += n) {
    // Counter decreases by n but stop condition i < 10; loop will never exit
}
:::

Examples of **correct** code for this rule:

:::correct

```js
/*eslint for-direction: "error"*/
for (let i = 0; i < 10; i++) {
    // Counter increases correctly; stop condition will be met
}

for (let i = 0; 10 > i; i++) { // with counter "i" on the right
    // Counter increases correctly; stop condition will be met
}

for (let i = 10; i >= 0; i += this.step) {
    // Step may vary; counter moves in correct direction relative to stop condition
}

for (let i = MIN; i <= MAX; i -= 0) {
    // Counter does not change, but stop condition is not violated
}

for (let i = 0; i < 0; i++) {
} // The loop condition is false initially; this rule does not detect dead code
:::

## Options

This rule has no options.
