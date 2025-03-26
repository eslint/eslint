---
title: no-redeclare
rule_type: suggestion
handled_by_typescript: true
extra_typescript_info: Note that while TypeScript will catch `let` redeclares and `const` redeclares, it will not catch `var` redeclares. Thus, if you use the legacy `var` keyword in your TypeScript codebase, this rule will still provide some value.
related_rules:
- no-shadow
---



In JavaScript, it's possible to redeclare the same variable name using `var`. This can lead to confusion as to where the variable is actually declared and initialized.

## Rule Details

This rule is aimed at eliminating variables that have multiple declarations in the same scope.

Examples of **incorrect** code for this rule:

::: incorrect

```js
/*eslint no-redeclare: "error"*/

var a = 3;
var a = 10;

class C {
    foo() {
        var b = 3;
        var b = 10;
    }

    static {
        var c = 3;
        var c = 10;
    }
}
```

:::

Examples of **correct** code for this rule:

::: correct

```js
/*eslint no-redeclare: "error"*/

var a = 3;
a = 10;

class C {
    foo() {
        var b = 3;
        b = 10;
    }

    static {
        var c = 3;
        c = 10;
    }
}

```

:::

## Options

This rule takes one optional argument, an object with following boolean properties:

- `builtinGlobals`
- `ignoreDeclarationMerge` (TypeScript only)

### builtinGlobals

The `"builtinGlobals"` option will check for redeclaration of built-in globals in global scope. It defaults to `true`.

If set to `true`, this rule also checks redeclaration of built-in globals, such as `Object`, `Array`, `Number`...

Examples of **incorrect** code for the `{ "builtinGlobals": true }` option:

::: incorrect { "sourceType": "script" }

```js
/*eslint no-redeclare: ["error", { "builtinGlobals": true }]*/

var Object = 0;
```

:::

Note that when using `sourceType: "commonjs"` (or `ecmaFeatures.globalReturn`, if using the default parser), the top scope of a program is not actually the global scope, but rather a "module" scope. When this is the case, declaring a variable named after a builtin global is not a redeclaration, but rather a shadowing of the global variable. In that case, the [`no-shadow`](no-shadow) rule with the `"builtinGlobals"` option should be used.

### ignoreDeclarationMerge

Whether to ignore declaration merges between certain TypeScript declaration types. Default: `true`.

The following sets will be ignored when this option is enabled:

- `interface` + `interface` 
- `namespace` + `namespace`
- `class` + `interface` 
- `class` + `namespace` 
- `class` + `interface` + `namespace` 
- `function` + `namespace` 
- `enum` + `namespace` 

Examples of **correct** code for the `{ "ignoreDeclarationMerge": true }` option:

::: correct

```ts
/*eslint no-redeclare: ["error", { "ignoreDeclarationMerge": true }]*/

interface A {
  prop1: 1;
}
interface A {
  prop2: 2;
}

namespace Foo {
  export const a = 1;
}
namespace Foo {
  export const b = 2;
}

class Bar {}
namespace Bar {}

function Baz() {}
namespace Baz {}
```

:::

**Note:** Even with this option set to true, this rule will report if you name a type and a variable the same name. This is intentional. Declaring a variable and a type the same is usually an accident, and it can lead to hard-to-understand code. If you have a rare case where you're intentionally naming a type the same name as a variable, use a disable comment. For example:

```ts
/*eslint no-redeclare: ["error", { "ignoreDeclarationMerge": true }]*/

type something = string;
// eslint-disable-next-line no-redeclare -- intentionally naming the variable the same as the type
const something = 2;
```
