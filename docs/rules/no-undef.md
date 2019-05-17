# Disallow Undeclared Variables (no-undef)

This rule can help you locate potential ReferenceErrors resulting from misspellings of variable and parameter names, or accidental implicit globals (for example, from forgetting the `var` keyword in a `for` loop initializer).

## Rule Details

Any reference to an undeclared variable causes a warning, unless the variable is explicitly mentioned in a `/*global ...*/` comment, or specified in the [`globals` key in the configuration file](https://eslint.org/docs/user-guide/configuring#specifying-globals). A common use case for these is if you intentionally use globals that are defined elsewhere (e.g. in a script sourced from HTML).

Examples of **incorrect** code for this rule:

```js
/*eslint no-undef: "error"*/

var a = someFunction();
b = 10;
```

Examples of **correct** code for this rule with `global` declaration:

```js
/*global someFunction b:true*/
/*eslint no-undef: "error"*/

var a = someFunction();
b = 10;
```

The `b:true` syntax in `/*global */` indicates that assignment to `b` is correct.

Examples of **incorrect** code for this rule with `global` declaration:

```js
/*global b*/
/*eslint no-undef: "error"*/

b = 10;
```

By default, variables declared in `/*global */` are read-only, therefore assignment is incorrect.

## Options

* `typeof` set to true will warn for variables used inside typeof check (Default false).

### typeof

Examples of **correct** code for the default `{ "typeof": false }` option:

```js
/*eslint no-undef: "error"*/

if (typeof UndefinedIdentifier === "undefined") {
    // do something ...
}
```

You can use this option if you want to prevent `typeof` check on a variable which has not been declared.

Examples of **incorrect** code for the `{ "typeof": true }` option:

```js
/*eslint no-undef: ["error", { "typeof": true }] */

if(typeof a === "string"){}
```

Examples of **correct** code for the `{ "typeof": true }` option with `global` declaration:

```js
/*global a*/
/*eslint no-undef: ["error", { "typeof": true }] */

if(typeof a === "string"){}
```

## Environments

For convenience, ESLint provides shortcuts that pre-define global variables exposed by popular libraries and runtime environments. This rule supports these environments, as listed in [Specifying Environments](../user-guide/configuring.md#specifying-environments).  A few examples are given below.

### browser

Examples of **correct** code for this rule with `browser` environment:

```js
/*eslint no-undef: "error"*/
/*eslint-env browser*/

setTimeout(function() {
    alert("Hello");
});
```

### Node.js

Examples of **correct** code for this rule with `node` environment:

```js
/*eslint no-undef: "error"*/
/*eslint-env node*/

var fs = require("fs");
module.exports = function() {
    console.log(fs);
};
```

## When Not To Use It

If explicit declaration of global variables is not to your taste.

## Compatibility

This rule provides compatibility with treatment of global variables in [JSHint](http://jshint.com/) and [JSLint](http://www.jslint.com).
