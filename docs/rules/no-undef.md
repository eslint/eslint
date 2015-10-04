# Disallow Undeclared Variables (no-undef)

Any reference to an undeclared variable causes a warning, unless the variable is explicitly mentioned in a `/*global ...*/` comment. This rule provides compatibility with [JSHint](http://www.jshint.com)'s and [JSLint](http://www.jslint.com)'s treatment of global variables.

This rule can help you locate potential ReferenceErrors resulting from misspellings of variable and parameter names, or accidental implicit globals (for example, from forgetting the `var` keyword in a `for` loop initializer).

## Rule Details

### Options

* `typeof` set to true will warn for variables used inside typeof check (Default false).

The following code causes 2 warnings, as the globals `someFunction` and `b` have not been declared.

```js
/*eslint no-undef: 2*/

var a = someFunction();  /*error "someFunction" is not defined.*/
b = 10;                  /*error "b" is not defined.*/
```

In this code, no warnings are generated, since the global variables have been properly declared in a `/*global */` block.

```js
/*global someFunction b:true*/
/*eslint no-undef: 2*/

var a = someFunction();
b = 10;
```

By default, variables declared in `/*global */` are considered read-only. Assignment to a read-only global causes a warning:

```js
/*global b*/
/*eslint no-undef: 2*/


b = 10;                  /*error "b" is read only.*/
```

Use the `variable:true` syntax to indicate that a variable can be assigned to.

```js
/*global b:true*/
/*eslint no-undef: 2*/

b = 10;
```

Explicitly checking an undefined identifier with `typeof` causes no warning.

```js
/*eslint no-undef: 2*/

if (typeof UndefinedIdentifier === "undefined") {
    // do something ...
}
```

#### typeof

You can use this option if you want to prevent `typeof` check on a variable which has not been declared.

The following patterns are considered problems with option `typeof` set:

```js
/* eslint no-undef: [2, { typeof: true }] */

if(typeof a === "string"){}      /* error "a" is not defined. */
```

The following patterns are not considered problems with option `typeof` set:

```js
/* eslint no-undef: [2, { typeof: true }] */
/*global a*/

if(typeof a === "string"){}
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
