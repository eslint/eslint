---
title: no-unassigned-vars
rule_type: problem
related_rules:
- prefer-const
- init-declarations
---


This rule flags `let` or `var` declarations that are never assigned a value but are still read or used in the code. Since these variables will always be `undefined`, their usage is likely a programming mistake.

For example, if you check the value of a `status` variable, but it was never given a value, it will always be `undefined`:

```js
let status;

// ...forgot to assign a value to status...

if (status === 'ready') {
  console.log('Ready!');
}
```

## Rule Details

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-unassigned-vars: "error"*/

let status;
if (status === 'ready') {
  console.log('Ready!');
}

let user;
greet(user);

function test() {
  let error;
  return error || "Unknown error";
}

let options;
const { debug } = options || {};

let flag;
while (!flag) {
  // Do something...
}

let config;
function init() {
  return config?.enabled;
}
```

:::

In TypeScript:

::: incorrect

```ts
let value: number | undefined;
console.log(value);
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-unassigned-vars: "error"*/

let message = "hello";
console.log(message);

let user;
user = getUser();
console.log(user.name);

let count;
count = 1;
count++;

// Variable is unused (should be reported by `no-unused-vars` only)
let temp;

let error;
if (somethingWentWrong) {
  error = "Something went wrong";
}
console.log(error);

let item;
for (item of items) {
  process(item);
}

let config;
function setup() {
  config = { debug: true };
}
setup();
console.log(config);

let one = undefined;
if (one === two) {
  // Noop
}
```

:::

In TypeScript:

::: correct

```ts
declare let value: number | undefined;
console.log(value);
```

:::

