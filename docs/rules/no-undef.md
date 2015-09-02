# Disallow Undeclared Variables (no-undef)

Any reference to an undeclared variable causes a warning, unless the variable is explicitly mentioned in a `/*global ...*/` comment. This rule provides compatibility with [JSHint](http://www.jshint.com)'s and [JSLint](http://www.jslint.com)'s treatment of global variables.

This rule can help you locate potential ReferenceErrors resulting from misspellings of variable and parameter names, or accidental implicit globals (for example, from forgetting the `var` keyword in a `for` loop initializer).

## Rule Details

The following code causes 2 warnings, as the globals `someFunction` and `b` have not been declared.

```js
var a = someFunction();  // 'someFunction' is not defined.
b = 10;                  // 'b' is not defined.
```

In this code, no warnings are generated, since the global variables have been properly declared in a `/*global */` block.

```js
/*global someFunction b:true*/
var a = someFunction();
b = 10;
```

By default, variables declared in `/*global */` are considered read-only. Assignment to a read-only global causes a warning:

```js
/*global b*/
b = 10;                  // 'b' is read only.
```

Use the `variable:true` syntax to indicate that a variable can be assigned to.

```js
/*global b:true*/
b = 10;
```

Explicitly checking an undefined identifier with `typeof` causes no warning.

```js
if (typeof UndefinedIdentifier === "undefined") {
    // do something ...
}
```

## Environments

For convenience, ESLint provides shortcuts that pre-define global variables exposed by popular libraries and runtime environments. This rule supports these environments, as listed in [Specifying Environments](http://eslint.org/docs/user-guide/configuring#specifying-environments).  A few examples are given below.

### browser

Defines common browser globals.

```js
/*eslint-env browser*/

setTimeout(function() {
    alert("Hello");
});
```

### node

Defines globals for Node.js development.

```js
/*eslint-env node*/

var fs = require("fs");
module.exports = function() {
    console.log(fs);
};
```

## When Not To Use It

If explicit declaration of global variables is not to your taste.

## Further Reading

* ['{a}' is not defined](http://jslinterrors.com/a-is-not-defined)
