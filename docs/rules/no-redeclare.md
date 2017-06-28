# disallow variable redeclaration (no-redeclare)

In JavaScript, it's possible to redeclare the same variable name using `var`. This can lead to confusion as to where the variable is actually declared and initialized.

## Rule Details

This rule is aimed at eliminating variables that have multiple declarations in the same scope.

Examples of **incorrect** code for this rule:

```js
/*eslint no-redeclare: "error"*/

var a = 3;
var a = 10;
```

Examples of **correct** code for this rule:

```js
/*eslint no-redeclare: "error"*/

var a = 3;
// ...
a = 10;
```

## Options

This rule takes one optional argument, an object with a boolean property `"builtinGlobals"`. It defaults to `false`.
If set to `true`, this rule also checks redeclaration of built-in globals, such as `Object`, `Array`, `Number`...

### builtinGlobals

The `"builtinGlobals"` option will check for redeclaration of built-in globals in global scope.

Examples of **incorrect** code for the `{ "builtinGlobals": true }` option:

```js
/*eslint no-redeclare: ["error", { "builtinGlobals": true }]*/

var Object = 0;
```

Examples of **incorrect** code for the `{ "builtinGlobals": true }` option and the `browser` environment:

```js
/*eslint no-redeclare: ["error", { "builtinGlobals": true }]*/
/*eslint-env browser*/

var top = 0;
```

The `browser` environment has many built-in global variables (for example, `top`). Some of built-in global variables cannot be redeclared.

Note that when using the `node` or `commonjs` environments (or `ecmaFeatures.globalReturn`, if using the default parser), the top scope of a program is not actually the global scope, but rather a "module" scope. When this is the case, declaring a variable named after a builtin global is not a redeclaration, but rather a shadowing of the global variable. In that case, the [`no-shadow`](no-shadow.md) rule with the `"builtinGlobals"` option should be used.

## Related Rules

* [no-shadow](no-shadow.md)
