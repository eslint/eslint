---
title: for-direction
layout: doc
edit_link: https://github.com/eslint/eslint/edit/main/docs/src/rules/for-direction.md
rule_type: problem
---



## Rule Details

A `for` loop with a stop condition that can never be reached, such as one with a counter that moves in the wrong direction, will run infinitely. While there are occasions when an infinite loop is intended, the convention is to construct such loops as `while` loops. More typically, an infinite for loop is a bug.

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
```

:::

Examples of **correct** code for this rule:

:::correct

```js
/*eslint for-direction: "error"*/
for (var i = 0; i < 10; i++) {
}
```

:::
