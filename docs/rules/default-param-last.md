# enforce default parameters to be last (default-param-last)

Putting default parameter at last allows function calls to omit optional tail arguments.

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
