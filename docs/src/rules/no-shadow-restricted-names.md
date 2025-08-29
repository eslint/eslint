---
title: no-shadow-restricted-names
rule_type: suggestion
related_rules:
- no-shadow
further_reading:
- https://262.ecma-international.org/11.0/#sec-value-properties-of-the-global-object
- https://262.ecma-international.org/11.0/#sec-strict-mode-of-ecmascript
---



ES2020 §18.1 Value Properties of the Global Object (`globalThis`, `NaN`, `Infinity`, `undefined`) as well as strict mode restricted identifiers `eval` and `arguments` are considered to be restricted names in JavaScript. Defining them to mean something else can have unintended consequences and confuse others reading the code. For example, there's nothing preventing you from writing:

```js
const undefined = "foo";
```

Then any code used within the same scope would not get the global `undefined`, but rather the local version with a very different meaning.

## Rule Details

Examples of **incorrect** code for this rule:

::: incorrect { "sourceType": "script" }

```js
/*eslint no-shadow-restricted-names: "error"*/

function NaN(){}

!function(Infinity){};

const undefined = 5;

try {} catch(eval){}
```

:::

::: incorrect

```js
/*eslint no-shadow-restricted-names: "error"*/

import NaN from "foo";

import { undefined } from "bar";

class Infinity {}
```

:::

Examples of **correct** code for this rule:

::: correct { "sourceType": "script" }

```js
/*eslint no-shadow-restricted-names: "error"*/

let Object;

function f(a, b){}

// Exception: `undefined` may be shadowed if the variable is never assigned a value.
let undefined;
```

:::

::: correct

```js
/*eslint no-shadow-restricted-names: "error"*/

import { undefined as undef } from "bar";
```

:::

## Options

This rule has an object option:

* `"reportGlobalThis"`: `true` (default) reports declarations of `globalThis`.

### reportGlobalThis

Examples of **incorrect** code for the default `{ "reportGlobalThis": true }` option:

::: incorrect

```js
/*eslint no-shadow-restricted-names: ["error", { "reportGlobalThis": true }]*/

const globalThis = "foo";
```

:::

::: incorrect

```js
/*eslint no-shadow-restricted-names: ["error", { "reportGlobalThis": true }]*/

function globalThis() {}
```

:::

::: incorrect

```js
/*eslint no-shadow-restricted-names: ["error", { "reportGlobalThis": true }]*/

import { globalThis } from "bar";
```

:::

::: incorrect

```js
/*eslint no-shadow-restricted-names: ["error", { "reportGlobalThis": true }]*/

class globalThis {}
```

:::

Examples of **correct** code for the default `{ "reportGlobalThis": true }` option:

::: correct

```js
/*eslint no-shadow-restricted-names: ["error", { "reportGlobalThis": true }]*/

const foo = globalThis;

function bar() {
    return globalThis;
}

import { globalThis as baz } from "foo";
```

:::

Examples of **correct** code for the `{ "reportGlobalThis": false }` option:

::: correct

```js
/*eslint no-shadow-restricted-names: ["error", { "reportGlobalThis": false }]*/

const globalThis = "foo";
```

:::

::: correct

```js
/*eslint no-shadow-restricted-names: ["error", { "reportGlobalThis": false }]*/

function globalThis() {}
```

:::

::: correct

```js
/*eslint no-shadow-restricted-names: ["error", { "reportGlobalThis": false }]*/

import { globalThis } from "bar";
```

:::

::: correct

```js
/*eslint no-shadow-restricted-names: ["error", { "reportGlobalThis": false }]*/

class globalThis {}
```

:::
