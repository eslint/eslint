---
title: no-unassigned-vars
rule_type: problem
related_rules:
- init-declarations
- no-unused-vars
- prefer-const
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
/*eslint no-unassigned-vars: "error"*/

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
/*eslint no-unassigned-vars: "error"*/

declare let value: number | undefined;
console.log(value);

declare module "my-module" {
  let value: string;
  export = value;
}
```

:::

## Options

This rule has no options.

## When Not To Use It

You can disable this rule if your code intentionally uses variables that are declared and used, but are never assigned a value. This might be the case in:

- Legacy codebases where uninitialized variables are used as placeholders.
- Certain TypeScript use cases where variables are declared with a type and intentionally left unassigned (though using `declare` is preferred).
