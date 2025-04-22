---
title: no-unused-expressions
rule_type: suggestion
---


An unused expression which has no effect on the state of the program indicates a logic error.

For example, `n + 1;` is not a syntax error, but it might be a typing mistake where a programmer meant an assignment statement `n += 1;` instead. Sometimes, such unused expressions may be eliminated by some build tools in production environment, which possibly breaks application logic.

## Rule Details

This rule aims to eliminate unused expressions which have no effect on the state of the program.

This rule does not apply to function calls or constructor calls with the `new` operator, because they could have *side effects* on the state of the program.

```js
let i = 0;
function increment() { i += 1; }
increment(); // return value is unused, but i changed as a side effect

let nThings = 0;
function Thing() { nThings += 1; }
new Thing(); // constructed object is unused, but nThings changed as a side effect
```

This rule does not apply to directives (which are in the form of literal string expressions such as `"use strict";` at the beginning of a script, module, or function) when using ES5+ environments. In ES3 environments, directives are treated as unused expressions by default, but this behavior can be changed using the `ignoreDirectives` option.

Sequence expressions (those using a comma, such as `a = 1, b = 2`) are always considered unused unless their return value is assigned or used in a condition evaluation, or a function call is made with the sequence expression value.

## Options

This rule, in its default state, does not require any arguments. If you would like to enable one or more of the following you may pass an object with the options set as follows:

* `allowShortCircuit` set to `true` will allow you to use short circuit evaluations in your expressions (Default: `false`).
* `allowTernary` set to `true` will enable you to use ternary operators in your expressions similarly to short circuit evaluations (Default: `false`).
* `allowTaggedTemplates` set to `true` will enable you to use tagged template literals in your expressions (Default: `false`).
* `enforceForJSX` set to `true` will flag unused JSX element expressions (Default: `false`).
* `ignoreDirectives` set to `true` will prevent directives from being reported as unused expressions when linting with `ecmaVersion: 3` (Default: `false`).

These options allow unused expressions *only if all* of the code paths either directly change the state (for example, assignment statement) or could have *side effects* (for example, function call).

Examples of **incorrect** code for the default `{ "allowShortCircuit": false, "allowTernary": false }` options:

::: incorrect

```js
/*eslint no-unused-expressions: "error"*/

0

if(0) 0

{0}

f(0), {}

a && b()

a, b()

c = a, b;

a() && function namedFunctionInExpressionContext () {f();}

(function anIncompleteIIFE () {});

injectGlobal`body{ color: red; }`

```

:::

Examples of **correct** code for the default `{ "allowShortCircuit": false, "allowTernary": false }` options:

::: correct

```js
/*eslint no-unused-expressions: "error"*/

{} // In this context, this is a block statement, not an object literal

{ myLabel: foo() } // In this context, this is a block statement with a label and expression, not an object literal

function namedFunctionDeclaration () {}

(function aGenuineIIFE () {}());

f()

a = 0

new C

delete a.b

void a
```

:::

Note that one or more string expression statements (with or without semi-colons) will only be considered as unused if they are not in the beginning of a script, module, or function (alone and uninterrupted by other statements). Otherwise, they will be treated as part of a "directive prologue", a section potentially usable by JavaScript engines. This includes "strict mode" directives.

Examples of **correct** code for this rule in regard to directives:

::: correct

```js
/*eslint no-unused-expressions: "error"*/

"use strict";
"use asm"
"use stricter";
"use babel"
"any other strings like this in the directive prologue";
"this is still the directive prologue";

function foo() {
    "bar";
}

class Foo {
    someMethod() {
        "use strict";
    }
}
```

:::

Examples of **incorrect** code for this rule in regard to directives:

::: incorrect

```js
/*eslint no-unused-expressions: "error"*/

doSomething();
"use strict"; // this isn't in a directive prologue, because there is a non-directive statement before it

function foo() {
    "bar" + 1;
}

class Foo {
    static {
        "use strict"; // class static blocks do not have directive prologues
    }
}
```

:::

### allowShortCircuit

Examples of **incorrect** code for the `{ "allowShortCircuit": true }` option:

::: incorrect

```js
/*eslint no-unused-expressions: ["error", { "allowShortCircuit": true }]*/

a || b
```

:::

Examples of **correct** code for the `{ "allowShortCircuit": true }` option:

::: correct

```js
/*eslint no-unused-expressions: ["error", { "allowShortCircuit": true }]*/

a && b()
a() || (b = c)
```

:::

### allowTernary

Examples of **incorrect** code for the `{ "allowTernary": true }` option:

::: incorrect

```js
/*eslint no-unused-expressions: ["error", { "allowTernary": true }]*/

a ? b : 0
a ? b : c()
```

:::

Examples of **correct** code for the `{ "allowTernary": true }` option:

::: correct

```js
/*eslint no-unused-expressions: ["error", { "allowTernary": true }]*/

a ? b() : c()
a ? (b = c) : d()
```

:::

### allowShortCircuit and allowTernary

Examples of **correct** code for the `{ "allowShortCircuit": true, "allowTernary": true }` options:

::: correct

```js
/*eslint no-unused-expressions: ["error", { "allowShortCircuit": true, "allowTernary": true }]*/

a ? b() || (c = d) : e()
```

:::

### allowTaggedTemplates

Examples of **incorrect** code for the `{ "allowTaggedTemplates": true }` option:

::: incorrect

```js
/*eslint no-unused-expressions: ["error", { "allowTaggedTemplates": true }]*/

`some untagged template string`;
```

:::

Examples of **correct** code for the `{ "allowTaggedTemplates": true }` option:

::: correct

```js
/*eslint no-unused-expressions: ["error", { "allowTaggedTemplates": true }]*/

tag`some tagged template string`;
```

:::

### enforceForJSX

JSX is most-commonly used in the React ecosystem, where it is compiled to `React.createElement` expressions. Though free from side-effects, these calls are not automatically flagged by the `no-unused-expression` rule. If you're using React, or any other side-effect-free JSX pragma, this option can be enabled to flag these expressions.

Examples of **incorrect** code for the `{ "enforceForJSX": true }` option:

::: incorrect { "parserOptions": { "ecmaFeatures": { "jsx": true } } }

```jsx
/*eslint no-unused-expressions: ["error", { "enforceForJSX": true }]*/

<MyComponent />;

<></>;
```

:::

Examples of **correct** code for the `{ "enforceForJSX": true }` option:

::: correct { "parserOptions": { "ecmaFeatures": { "jsx": true } } }

```jsx
/*eslint no-unused-expressions: ["error", { "enforceForJSX": true }]*/

const myComponentPartial = <MyComponent />;

const myFragment = <></>;
```

:::

### ignoreDirectives

When set to `false` (default), this rule reports directives (like `"use strict"`) as unused expressions when linting with `ecmaVersion: 3`. This default behavior exists because ES3 environments do not formally support directives, meaning such strings are effectively unused expressions in that specific context.

Set this option to `true` to prevent directives from being reported as unused, even when `ecmaVersion: 3` is specified. This option is primarily useful for projects that need to maintain a single codebase containing directives while supporting both older ES3 environments and modern (ES5+) environments.

**Note:** In ES5+ environments, directives are always ignored regardless of this setting.

Examples of **incorrect** code for the `{ "ignoreDirectives": false }` option and `ecmaVersion: 3`:

::: incorrect { "ecmaVersion": 3, "sourceType": "script" }

```js
/*eslint no-unused-expressions: ["error", { "ignoreDirectives": false }]*/

"use strict";
"use asm"
"use stricter";
"use babel"
"any other strings like this in the directive prologue";
"this is still the directive prologue";

function foo() {
    "bar";
}
```

:::

Examples of **correct** code for the `{ "ignoreDirectives": true }` option and `ecmaVersion: 3`:

::: correct { "ecmaVersion": 3, "sourceType": "script" }

```js
/*eslint no-unused-expressions: ["error", { "ignoreDirectives": true }]*/

"use strict";
"use asm"
"use stricter";
"use babel"
"any other strings like this in the directive prologue";
"this is still the directive prologue";

function foo() {
    "bar";
}
```

:::

### TypeScript Support

This rule supports TypeScript-specific expressions and follows these guidelines:

1. Directives (like `'use strict'`) are allowed in module and namespace declarations
2. Type-related expressions are treated as unused if their wrapped value expressions are unused:
   * Type assertions (`x as number`, `<number>x`)
   * Non-null assertions (`x!`)
   * Type instantiations (`Set<number>`)

**Note**: Although type expressions never have runtime side effects (e.g., `x!` is equivalent to `x` at runtime), they can be used to assert types for testing purposes.

Examples of **correct** code for this rule when using TypeScript:

::: correct

```ts
/* eslint no-unused-expressions: "error" */

// Type expressions wrapping function calls are allowed
function getSet() {
    return Set;
}
getSet()<number>;
getSet() as Set<unknown>;
getSet()!;

// Directives in modules and namespaces
module Foo {
    'use strict';
    'hello world';
}

namespace Bar {
    'use strict';
    export class Baz {}
}
```

:::

Examples of **incorrect** code for this rule when using TypeScript:

::: incorrect

```ts
/* eslint no-unused-expressions: "error" */

// Standalone type expressions
Set<number>;
1 as number;
window!;

// Expressions inside namespaces
namespace Bar {
    123;
}
```

:::
