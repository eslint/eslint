---
title: no-unsafe-optional-chaining
rule_type: problem
---



The optional chaining (`?.`) expression can short-circuit with a return value of `undefined`. Therefore, treating an evaluated optional chaining expression as a function, object, number, etc., can cause TypeError or unexpected results. For example:

```js
var obj = undefined;

1 in obj?.foo;  // TypeError
with (obj?.foo);  // TypeError
for (bar of obj?.foo);  // TypeError
bar instanceof obj?.foo;  // TypeError
const { bar } = obj?.foo;  // TypeError
```

Also, parentheses limit the scope of short-circuiting in chains. For example:

```js
var obj = undefined;

(obj?.foo)(); // TypeError
(obj?.foo).bar; // TypeError
```

## Rule Details

This rule aims to detect some cases where the use of optional chaining doesn't prevent runtime errors. In particular, it flags optional chaining expressions in positions where short-circuiting to `undefined` causes throwing a TypeError afterward.

Examples of **incorrect** code for this rule:

::: incorrect { "sourceType": "script" }

```js
/*eslint no-unsafe-optional-chaining: "error"*/

(obj?.foo)();

(obj?.foo).bar;

(foo?.()).bar;

(foo?.()).bar();

(obj?.foo ?? obj?.bar)();

(foo || obj?.foo)();

(obj?.foo && foo)();

(foo ? obj?.foo : bar)();

(foo, obj?.bar).baz;

(obj?.foo)`template`;

new (obj?.foo)();

[...obj?.foo];

bar(...obj?.foo);

1 in obj?.foo;

bar instanceof obj?.foo;

for (bar of obj?.foo);

const { bar } = obj?.foo;

[{ bar } = obj?.foo] = [];

with (obj?.foo);

class A extends obj?.foo {}

var a = class A extends obj?.foo {};

async function foo () {
    const { bar } = await obj?.foo;
   (await obj?.foo)();
   (await obj?.foo).bar;
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-unsafe-optional-chaining: "error"*/

(obj?.foo)?.();

obj?.foo();

(obj?.foo ?? bar)();

obj?.foo.bar;

obj.foo?.bar;

foo?.()?.bar;

(obj?.foo ?? bar)`template`;

new (obj?.foo ?? bar)();

var baz = {...obj?.foo};

const { bar } = obj?.foo || baz;

async function foo () {
  const { bar } = await obj?.foo || baz;
   (await obj?.foo)?.();
   (await obj?.foo)?.bar;
}
```

:::

## Options

This rule has an object option:

* `disallowArithmeticOperators`: Disallow arithmetic operations on optional chaining expressions (Default `false`). If this is `true`, this rule warns arithmetic operations on optional chaining expressions, which possibly result in `NaN`.

### disallowArithmeticOperators

With this option set to `true` the rule is enforced for:

* Unary operators: `-`, `+`
* Arithmetic operators: `+`, `-`, `/`, `*`, `%`, `**`
* Assignment operators: `+=`, `-=`, `/=`, `*=`, `%=`, `**=`

Examples of additional **incorrect** code for this rule with the `{ "disallowArithmeticOperators": true }` option:

::: incorrect

```js
/*eslint no-unsafe-optional-chaining: ["error", { "disallowArithmeticOperators": true }]*/

+obj?.foo;
-obj?.foo;

obj?.foo + bar;
obj?.foo - bar;
obj?.foo / bar;
obj?.foo * bar;
obj?.foo % bar;
obj?.foo ** bar;

baz += obj?.foo;
baz -= obj?.foo;
baz /= obj?.foo;
baz *= obj?.foo;
baz %= obj?.foo;
baz **= obj?.foo;

async function foo () {
  +await obj?.foo;
  await obj?.foo + bar;
  baz += await obj?.foo;
}
```

:::
