# Disallow Redeclaring Variables (no-redeclare)

In JavaScript, it's possible to redeclare the same variable name using `var`. This can lead to confusion as to where the variable is actually declared and initialized.

## Rule Details

This rule is aimed at eliminating variables that have multiple declarations in the same scope.

Examples of **incorrect** code for this rule:

```js
/*eslint no-redeclare: 2*/

var a = 3;
var a = 10;
```

Examples of **correct** code for this rule:

```js
/*eslint no-redeclare: 2*/

var a = 3;
// ...
a = 10;
```

## Options

This rule takes one option, an object, with a property `"builtinGlobals"`. `false` by default.
If this is `true`, this rule checks with built-in global variables such as `Object`, `Array`, `Number`, ...

### builtinGlobals

Examples of **incorrect** code for the `{ "builtinGlobals": true }` option:

```js
/*eslint no-redeclare: [2, { "builtinGlobals": true }]*/

var Object = 0;
```

Examples of **incorrect** code for the `{ "builtinGlobals": true }` option and the `browser` environment:

```js
/*eslint no-redeclare: [2, { "builtinGlobals": true }]*/
/*eslint-env browser*/

var top = 0;
```

The `browser` environment has many built-in global variables (for example, `top`). Some of built-in global variables cannot be redeclared.
