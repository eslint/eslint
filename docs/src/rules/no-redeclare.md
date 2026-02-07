---
title: no-redeclare
rule_type: suggestion
handled_by_typescript: partial
extra_typescript_info: This rule is TypeScript-aware and handles declaration merging patterns. TypeScript catches `let` and `const` redeclares, but not `var` redeclares. This rule still provides value for `var` redeclarations in TypeScript codebases.
related_rules:
- no-shadow
---



In JavaScript, it's possible to redeclare the same variable name using `var`. This can lead to confusion as to where the variable is actually declared and initialized.

This rule is TypeScript-aware and allows valid TypeScript declaration merging patterns, such as interface merging, namespace merging, and class/function augmentation with namespaces. It does not report collisions between value-space and type-space declarations, as these are valid in TypeScript.

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

This rule takes one optional argument, an object with a boolean property `"builtinGlobals"`. It defaults to `true`.
If set to `true`, this rule also checks redeclaration of built-in globals, such as `Object`, `Array`, `Number`...

### builtinGlobals

The `"builtinGlobals"` option will check for redeclaration of built-in globals in global scope.

Examples of **incorrect** code for the `{ "builtinGlobals": true }` option:

::: incorrect { "sourceType": "script" }

```js
/*eslint no-redeclare: ["error", { "builtinGlobals": true }]*/

var Object = 0;
```

:::

Note that when using `sourceType: "commonjs"` (or `ecmaFeatures.globalReturn`, if using the default parser), the top scope of a program is not actually the global scope, but rather a "module" scope. When this is the case, declaring a variable named after a builtin global is not a redeclaration, but rather a shadowing of the global variable. In that case, the [`no-shadow`](no-shadow) rule with the `"builtinGlobals"` option should be used.
