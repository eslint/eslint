# Disallow Redeclaring Variables (no-redeclare)

In JavaScript, it's possible to redeclare the same variable name using `var`. This can lead to confusion as to where the variable is actually declared and initialized.

## Rule Details

This rule is aimed at eliminating variables that have multiple declarations in the same scope.

The following patterns are considered warnings:

```js
var a = 3;
var a = 10; // redeclared
```

The following patterns are considered okay and do not cause warnings:

```js
var a = 3;
...
a = 10;
```

### Options

This rule takes one option, an object, with a property `"builtinGlobals"`.

```json
{
    "no-redeclare": [2, {"builtinGlobals": true}]
}
```

#### builtinGlobals

`false` by default.
If this is `true`, this rule checks with built-in global variables such as `Object`, `Array`, `Number`, ...

When `{"builtinGlobals": true}`, the following patterns are considered warnings:

```js
var Object = 0; // redeclared of the built-in globals.
```

When `{"builtinGlobals": true}` and under `browser` environment, the following patterns are considered warnings:

```js
var top = 0; // redeclared of the built-in globals.
```

* Note: The `browser` environment has many built-in global variables, `top` is one of them.
  Some of built-in global variables cannot be redeclared. It's a trap.

  ```js
  var top = 0;
  var left = 0;
  console.log(top + " " + left); // prints "[object Window] 0"
  console.log(top * left); // prints "NaN"
  ```
