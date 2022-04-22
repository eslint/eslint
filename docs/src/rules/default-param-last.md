---
title: default-param-last
layout: doc
edit_link: https://github.com/eslint/eslint/edit/main/docs/src/rules/default-param-last.md
rule_type: suggestion
---

Enforces default parameters to be last.

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

```js
/* eslint default-param-last: ["error"] */

function f(a = 0, b) {}

function f(a, b = 0, c) {}
```

Examples of **correct** code for this rule:

```js
/* eslint default-param-last: ["error"] */

function f(a, b = 0) {}
```
