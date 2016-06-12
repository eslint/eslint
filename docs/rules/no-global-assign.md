# Disallow assignments to readonly global variables (no-global-assign)

If people rewrite embedded global variables, it may cause severe problems.
ESLint has the capability to configure global variables as readonly.

- [Specifying Globals](../user-guide/configuring#specifying-globals)

This rule warns modifying of those readonly global variables.

## Rule Details

Examples of **incorrect** code for this rule:

```js
/*eslint no-global-assign: "error"*/

Object = null
undefined = 1

// if `env: {browser: true}`, ...
window = null
length = 1
top = 1

/*globals a:false*/
a = 1
```

Examples of **correct** code for this rule:

```js
/*eslint no-global-assign: "error"*/

a = 1
var b = 1
b = 2

// if `env: {browser: true}`, ...
onload = function() {}

/*globals c:true*/
c = 1
```

## When Not To Use It

If you don't want to notify modifying of readonly global variables, then it's safe to disable this rule.
