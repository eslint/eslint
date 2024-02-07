---
title: default-param-last
rule_type: suggestion
---

Putting default parameter at last allows function calls to omit optional tail arguments.

```js
// Correct: optional argument can be omitted
function createUser(id, isAdmin = false) {}
createUser("tabby")

// Incorrect: optional argument can **not** be omitted
function createUser(isAdmin = false, id) {}
createUser(undefined, "tabby")
```

## Rule Details

This rule enforces default parameters to be the last of parameters.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/* eslint default-param-last: ["error"] */

function f(a = 0, b) {}

function g(a, b = 0, c) {}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/* eslint default-param-last: ["error"] */

function f(a, b = 0) {}
```

:::
