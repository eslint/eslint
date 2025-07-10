---
title: init-declarations
rule_type: suggestion
related_rules:
- no-unassigned-vars
---


In JavaScript, variables can be assigned during declaration, or at any point afterwards using an assignment statement. For example, in the following code, `foo` is initialized during declaration, while `bar` is initialized later.

```js
let foo = 1;
let bar;

if (foo) {
    bar = 1;
} else {
    bar = 2;
}
```

## Rule Details

This rule is aimed at enforcing or eliminating variable initializations during declaration. For example, in the following code, `foo` is initialized during declaration, while `bar` is not.

```js
let foo = 1;
let bar;

bar = 2;
```

This rule aims to bring consistency to variable initializations and declarations.

## Options

The rule takes two options:

1. A string which must be either `"always"` (the default), to enforce initialization at declaration, or `"never"` to disallow initialization during declaration. This rule applies to `var`, `let`, `const`, `using`, and `await using` variables, however `"never"` is ignored for `const`, `using`, and `await using` variables, as not initializing these variables would generate a parse error.
2. An object that further controls the behavior of this rule. Currently, the only available parameter is `ignoreForLoopInit`, which indicates if initialization at declaration is allowed in `for` loops when `"never"` is set, since it is a very typical use case.

You can configure the rule as follows:

Variables must be initialized at declaration (default)

```json
{
    "init-declarations": ["error", "always"],
}
```

Variables must not be initialized at declaration

```json
{
    "init-declarations": ["error", "never"]
}
```

Variables must not be initialized at declaration, except in for loops, where it is allowed

```json
{
    "init-declarations": ["error", "never", { "ignoreForLoopInit": true }]
}
```

### always

Examples of **incorrect** code for the default `"always"` option:

::: incorrect

```js
/*eslint init-declarations: ["error", "always"]*/

function foo() {
    var bar;
    let baz;
}
```

:::

Examples of **correct** code for the default `"always"` option:

::: correct

```js
/*eslint init-declarations: ["error", "always"]*/

function foo() {
    var bar = 1;
    let baz = 2;
    const qux = 3;
	using quux = getSomething();
}

async function foobar() {
	await using quux = getSomething();
}
```

:::

### never

Examples of **incorrect** code for the `"never"` option:

::: incorrect

```js
/*eslint init-declarations: ["error", "never"]*/

function foo() {
    var bar = 1;
    let baz = 2;

    for (let i = 0; i < 1; i++) {}
}
```

:::

Examples of **correct** code for the `"never"` option:

::: correct

```js
/*eslint init-declarations: ["error", "never"]*/

function foo() {
    var bar;
    let baz;
    const buzz = 1;
	using quux = getSomething();
}

async function foobar() {
	await using quux = getSomething();
}
```

:::

The `"never"` option ignores `const`, `using`, and `await using` variable initializations.

### ignoreForLoopInit

Examples of **correct** code for the `"never", { "ignoreForLoopInit": true }` options:

::: correct

```js
/*eslint init-declarations: ["error", "never", { "ignoreForLoopInit": true }]*/
for (let i = 0; i < 1; i++) {}
```

:::

This rule additionally supports TypeScript type syntax.

Examples of **incorrect** TypeScript code for this rule:

::: incorrect

```ts
/* eslint init-declarations: ["error", "never"] */

let arr: string[] = ['arr', 'ar'];

const class1 = class NAME {
	constructor() {
	  var name1: string = 'hello';
	}
};

namespace myLib {
	let numberOfGreetings: number = 2;
}

```

:::

::: incorrect

```ts
/* eslint init-declarations: ["error", "always"] */

namespace myLib {
	let numberOfGreetings: number;
}

namespace myLib1 {
	const foo: number;
	namespace myLib2 {
	  let bar: string;
	  namespace myLib3 {
		let baz: object;
	  }
	}
}

```

:::

Examples of **correct** TypeScript code for this rule:

::: correct

```ts
/* eslint init-declarations: ["error", "never"] */

declare const foo: number;

declare namespace myLib {
	let numberOfGreetings: number;
}

interface GreetingSettings {
	greeting: string;
	duration?: number;
	color?: string;
}
```

:::

::: correct

```ts
/* eslint init-declarations: ["error", "always"] */

declare const foo: number;

declare namespace myLib {
	let numberOfGreetings: number;
}

interface GreetingSettings {
	greeting: string;
	duration?: number;
	color?: string;
}

```

:::


## When Not To Use It

When you are indifferent as to how your variables are initialized.
