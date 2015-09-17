# Disallow Redeclaring Variables (no-redeclare)

In JavaScript, it's possible to redeclare the same variable name using `var`. This can lead to confusion as to where the variable is actually declared and initialized.

## Rule Details

This rule is aimed at eliminating variables that have multiple declarations in the same scope.

The following patterns are considered problems:

```js
/*eslint no-redeclare: 2*/

var a = 3;
var a = 10; /*error "a" is already defined*/
```

The following patterns are not considered problems:

```js
/*eslint no-redeclare: 2*/

var a = 3;
// ...
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

When `{"builtinGlobals": true}`, the following patterns are considered problems:

```js
/*eslint no-redeclare: [2, { "builtinGlobals": true }]*/

var Object = 0; /*error "Object" is already defined*/
```

When `{"builtinGlobals": true}` and under `browser` environment, the following patterns are considered problems:

```js
/*eslint-env browser*/
/*eslint no-redeclare: [2, { "builtinGlobals": true }]*/

var top = 0; /*error "top" is already defined*/
```

* Note: The `browser` environment has many built-in global variables, `top` is one of them.
  Some of built-in global variables cannot be redeclared. It's a trap.

  ```js
  var top = 0;
  var left = 0;
  console.log(top + " " + left); // prints "[object Window] 0"
  console.log(top * left); // prints "NaN"
  ```
