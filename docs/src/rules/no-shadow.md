---
title: no-shadow
rule_type: suggestion
related_rules:
- no-shadow-restricted-names
further_reading:
- https://en.wikipedia.org/wiki/Variable_shadowing
---


Shadowing is the process by which a local variable shares the same name as a variable in its containing scope. For example:

```js
const a = 3;
function b() {
    const a = 10;
}
```

In this case, the variable `a` inside of `b()` is shadowing the variable `a` in the global scope. This can cause confusion while reading the code and it's impossible to access the global variable.

## Rule Details

This rule aims to eliminate shadowed variable declarations.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-shadow: "error"*/

const a = 3;
function b() {
    const a = 10;
}

const c = function () {
    const a = 10;
}

function d(a) {
    a = 10;
}
d(a);

if (true) {
    const a = 5;
}
```

:::

## Options

This rule takes one option, an object, with the following properties:
- `"builtinGlobals"`
- `"hoist"`
- `"allow"`
- `"ignoreOnInitialization"`
- `"ignoreTypeValueShadow"` (TypeScript only)
- `"ignoreFunctionTypeParameterNameValueShadow"` (TypeScript only)

```json
{
    "no-shadow": ["error", { "builtinGlobals": false, "hoist": "functions", "allow": [], "ignoreOnInitialization": false }]
}
```

### builtinGlobals

The `builtinGlobals` option is `false` by default.
If it is `true`, the rule prevents shadowing of built-in global variables: `Object`, `Array`, `Number`, and so on.

Examples of **incorrect** code for the `{ "builtinGlobals": true }` option:

::: incorrect

```js
/*eslint no-shadow: ["error", { "builtinGlobals": true }]*/

function foo() {
    const Object = 0;
}
```

:::

### hoist

The `hoist` option has five settings:

- `functions` (by default) - reports shadowing before the outer functions are defined.
- `all` - reports all shadowing before the outer variables/functions are defined.
- `never` - never report shadowing before the outer variables/functions are defined.
- `types` (TypeScript only) - reports shadowing before the outer types are defined.
- `functions-and-types` (TypeScript only) - reports shadowing before the outer functions and types are defined.

#### hoist: functions

Examples of **incorrect** code for the default `{ "hoist": "functions" }` option:

::: incorrect

```js
/*eslint no-shadow: ["error", { "hoist": "functions" }]*/

if (true) {
    const b = 6;
}

function b() {}
```

:::

Although `const b` in the `if` statement is before the *function* declaration in the outer scope, it is incorrect.

Examples of **correct** code for the default `{ "hoist": "functions" }` option:

::: correct

```js
/*eslint no-shadow: ["error", { "hoist": "functions" }]*/

if (true) {
    const a = 3;
}

const a = 5;
```

:::

Because `const a` in the `if` statement is before the *variable* declaration in the outer scope, it is correct.

#### hoist: all

Examples of **incorrect** code for the `{ "hoist": "all" }` option:

::: incorrect

```js
/*eslint no-shadow: ["error", { "hoist": "all" }]*/

if (true) {
    const a = 3;
    const b = 6;
}

const a = 5;
function b() {}
```

:::

#### hoist: never

Examples of **correct** code for the `{ "hoist": "never" }` option:

::: correct

```js
/*eslint no-shadow: ["error", { "hoist": "never" }]*/

if (true) {
    const a = 3;
    const b = 6;
}

const a = 5;
function b() {}
```

:::

Because `const a` and `const b` in the `if` statement are before the declarations in the outer scope, they are correct.

#### hoist: types

Examples of **incorrect** code for the `{ "hoist": "types" }` option:

::: incorrect

```ts
/*eslint no-shadow: ["error", { "hoist": "types" }]*/

type Bar<Foo> = 1;
type Foo = 1;
```

:::

#### hoist: functions-and-types

Examples of **incorrect** code for the `{ "hoist": "functions-and-types" }` option:

::: incorrect

```ts
/*eslint no-shadow: ["error", { "hoist": "functions-and-types" }]*/

// types
type Bar<Foo> = 1;
type Foo = 1;

// functions
if (true) {
  const b = 6;
}

function b() {}
```

:::

### allow

The `allow` option is an array of identifier names for which shadowing is allowed. For example, `"resolve"`, `"reject"`, `"done"`, `"cb"`.

Examples of **correct** code for the `{ "allow": ["done"] }` option:

::: correct

```js
/*eslint no-shadow: ["error", { "allow": ["done"] }]*/

import async from 'async';

function foo(done) {
  async.map([1, 2], function (e, done) {
    done(null, e * 2)
  }, done);
}

foo(function (err, result) {
  console.log({ err, result });
});
```

:::

### ignoreOnInitialization

The `ignoreOnInitialization` option is `false` by default. If it is `true`, it prevents reporting shadowing of variables in their initializers when the shadowed variable is presumably still uninitialized.

The shadowed variable must be on the left side. The shadowing variable must be on the right side and declared in a callback function or in an IIFE.

Examples of **incorrect** code for the `{ "ignoreOnInitialization": "true" }` option:

::: incorrect

```js
/*eslint no-shadow: ["error", { "ignoreOnInitialization": true }]*/

const x = x => x;
```

:::

Because the shadowing variable `x` will shadow the already initialized shadowed variable `x`.

Examples of **correct** code for the `{ "ignoreOnInitialization": true }` option:

::: correct

```js
/*eslint no-shadow: ["error", { "ignoreOnInitialization": true }]*/

const x = foo(x => x)

const y = (y => y)()
```

:::

The rationale for callback functions is the assumption that they will be called during the initialization, so that at the time when the shadowing variable will be used, the shadowed variable has not yet been initialized.

### ignoreTypeValueShadow

Whether to ignore types named the same as a variable. Default: `true`.

This is generally safe because you cannot use variables in type locations without a typeof operator, so there's little risk of confusion.

Examples of **correct** code with `{ "ignoreTypeValueShadow": true }`:

::: correct

```ts
/*eslint no-shadow: ["error", { "ignoreTypeValueShadow": true }]*/

type Foo = number;
interface Bar {
  prop: number;
}

function f() {
  const Foo = 1;
  const Bar = 'test';
}
```

:::

**Note:** Shadowing specifically refers to two identical identifiers that are in different, nested scopes. This is different from redeclaration, which is when two identical identifiers are in the same scope. Redeclaration is covered by the [`no-redeclare`](/rules/no-redeclare) rule instead.


### ignoreFunctionTypeParameterNameValueShadow

Whether to ignore function parameters named the same as a variable. Default: `true`.

Each of a function type's arguments creates a value variable within the scope of the function type. This is done so that you can reference the type later using the typeof operator:

```ts
type Func = (test: string) => typeof test;

declare const fn: Func;
const result = fn('str'); // typeof result === string
```

This means that function type arguments shadow value variable names in parent scopes:

```ts
let test = 1;
type TestType = typeof test; // === number
type Func = (test: string) => typeof test; // this "test" references the argument, not the variable

declare const fn: Func;
const result = fn('str'); // typeof result === string
```

If you do not use the `typeof` operator in a function type return type position, you can safely turn this option on.

Examples of **correct** code with `{ "ignoreFunctionTypeParameterNameValueShadow": true }`:

::: correct

```ts
/*eslint no-shadow: ["error", { "ignoreFunctionTypeParameterNameValueShadow": true }]*/

const test = 1;
type Func = (test: string) => typeof test;
```

:::

### Why does the rule report on enum members that share the same name as a variable in a parent scope?

This isn't a bug — the rule is working exactly as intended! The report is correct because of a lesser-known aspect of enums: enum members introduce a variable within the enum's own scope, allowing them to be referenced without needing a qualifier.

Here's a simple example to explain:

```ts
const A = 2;
enum Test {
  A = 1,
  B = A,
}

console.log(Test.B); // what should be logged?
```

At first glance, you might think it should log `2`, because the outer variable A's value is `2`. However, it actually logs `1`, the value of `Test.A`. This happens because inside the enum `B = A` is treated as `B = Test.A`. Due to this behavior, the enum member has shadowed the outer variable declaration.
